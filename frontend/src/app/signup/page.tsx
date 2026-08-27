"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { Role, AuthUser } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  Users, Stethoscope, Building2, Mail, Lock, Eye, EyeOff, ArrowRight,
  Shield, User, Phone, Siren, Loader2, Activity
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

export default function SignupPage() {
  const router = useRouter();
  const { login, language, setLanguage, t } = useStore();
  const [selectedRole, setSelectedRole] = useState<Role>(Role.PATIENT);

  // Common Fields
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Role-Specific Optional Fields
  const [specialty, setSpecialty] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      toast.error(language === "hi" ? "कृपया अपना पूरा नाम दर्ज करें" : "Please enter your full name");
      return;
    }
    if (!phone.trim()) {
      toast.error(language === "hi" ? "कृपया अपना मोबाइल नंबर दर्ज करें" : "Please enter your phone number");
      return;
    }
    if (!password.trim() || password.length < 4) {
      toast.error(language === "hi" ? "पासवर्ड कम से कम 4 अक्षरों का होना चाहिए" : "Password must be at least 4 characters");
      return;
    }

    setLoading(true);

    try {
      const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${API}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fullName.trim(),
          phone: phone.trim(),
          email: email.trim() || undefined,
          password: password.trim(),
          role: selectedRole,
          specialty: selectedRole === Role.DOCTOR ? (specialty.trim() || "General Medicine") : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Signup failed. Please try again.");
        setLoading(false);
        return;
      }

      // Log in with DB authenticated user
      const user: AuthUser = {
        id: data.user.userId,
        name: data.user.name,
        role: data.user.role as Role,
        phone: data.user.phone,
        email: data.user.email || `${data.user.phone}@sehatsaathi.in`,
        patientId: data.user.patientId,
        doctorId: data.user.doctorId,
        staffId: data.user.staffId,
        specialty: selectedRole === Role.DOCTOR ? (specialty.trim() || "General Medicine") : undefined,
      };

      login(user, data.token);
      toast.success(
        language === "hi" 
          ? `सेहत साथी में आपका स्वागत है, ${fullName}! कृपया अपना प्रोफ़ाइल पूरा करें।` 
          : `Welcome to Sehat Saathi, ${fullName}! Let's complete your profile.`
      );
      router.push("/profile?onboarding=true");
    } catch (err) {
      console.error("Signup network error:", err);
      // Fallback in-memory
      login({
        id: `user-${Date.now()}`,
        name: fullName.trim(),
        email: email.trim() || `${phone.trim()}@sehatsaathi.in`,
        role: selectedRole,
        phone: phone.trim(),
        specialty: selectedRole === Role.DOCTOR ? (specialty.trim() || "General Medicine") : undefined,
      });
      router.push("/profile?onboarding=true");
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { value: Role.PATIENT, label: t("patientRole"), icon: Users },
    { value: Role.DOCTOR, label: t("doctorRole"), icon: Stethoscope },
    { value: Role.HOSPITAL_STAFF, label: t("staffRole"), icon: Building2 },
  ] as const;

  return (
    <div className="min-h-screen bg-[#f8f8fa] flex font-sans relative">

      {/* Top Floating Action Bar (Emergency SOS + Language Switcher) */}
      <div className="absolute top-5 right-5 sm:top-6 sm:right-6 z-30 flex items-center gap-3">
        {/* Pinned 108 Emergency SOS Button */}
        <Link href="/emergency">
          <Button
            type="button"
            className="h-9 sm:h-10 px-3.5 sm:px-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-md shadow-red-600/25 gap-2 transition-all hover:scale-105 border border-red-500 btn-press"
          >
            <Siren className="w-4 h-4 animate-pulse text-white" />
            <span>{language === "hi" ? "आपातकालीन 108" : "Emergency 108"}</span>
          </Button>
        </Link>

        {/* Language Switcher */}
        <div className="flex items-center bg-white/90 backdrop-blur-md p-1 rounded-2xl border border-slate-200 shadow-sm">
          <button
            type="button"
            onClick={() => setLanguage("en")}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
              language === "en"
                ? "bg-[#1e3a5f] text-white shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            English
          </button>
          <button
            type="button"
            onClick={() => setLanguage("hi")}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
              language === "hi"
                ? "bg-[#0d9488] text-white shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            हिंदी
          </button>
        </div>
      </div>

      {/* ── Left Panel: Healthcare Visual with Image & Dark/Teal Overlay ── */}
      <div className="hidden lg:flex lg:w-[50%] flex-col justify-between p-12 xl:p-16 relative overflow-hidden animate-in fade-in duration-700">

        {/* High-quality healthcare registration background image */}
        <Image
          src="/patient-bg.jpg"
          alt="Healthcare registration"
          fill
          priority
          className="object-cover object-center scale-105 transition-transform duration-1000 ease-out"
        />

        {/* Healthcare Dark & Deep Teal Transparent Protective Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/95 via-teal-950/85 to-slate-900/75 backdrop-blur-[2px]" />

        {/* Subtle Decorative Ambient Glows */}
        <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-teal-500/20 rounded-full blur-3xl pointer-events-none -translate-y-1/4 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/15 rounded-full blur-3xl pointer-events-none translate-y-1/4 -translate-x-1/4" />

        {/* Top: Logo with White Text Contrast */}
        <div className="relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl overflow-hidden bg-white/95 backdrop-blur-sm shadow-md border border-white/20 p-1.5 flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="Sehat Saathi"
                width={44}
                height={44}
                className="object-contain"
                priority
              />
            </div>
            <div>
              <h1 className="text-[22px] font-bold tracking-tight text-white">
                {t("brandName")}
              </h1>
              <p className="text-[11px] font-bold text-teal-300 tracking-wide">
                {t("tagline")}
              </p>
            </div>
          </div>
        </div>

        {/* Middle: Headline + Subtext + 4 Feature Badges */}
        <div className="relative z-10 space-y-6 max-w-lg">
          <h2 className="text-[34px] xl:text-[40px] font-extrabold text-white leading-[1.15] tracking-tight">
            {language === "hi" ? "राष्ट्रीय स्वास्थ्य नेटवर्क से जुड़ें" : "Join India's Digital Health Network"}
          </h2>
          <p className="text-[15px] xl:text-[16px] text-slate-200 leading-relaxed max-w-md">
            {language === "hi" 
              ? "एकीकृत स्वास्थ्य आईडी, 108 आपातकालीन नेटवर्क और 15 सरकारी अस्पतालों से लाइव बेड ट्रैकिंग।" 
              : "Integrated clinical triage, 108 emergency ambulance dispatch, and live bed telemetry across 15 government hospitals."}
          </p>

          {/* 4 Feature Badges in 2x2 Grid (Glassmorphic) */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 bg-slate-900/60 backdrop-blur-md rounded-2xl border border-white/15 space-y-1">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-teal-400 shrink-0" />
                <p className="text-xs font-bold text-white">ABDM &amp; ABHA</p>
              </div>
              <p className="text-[10px] text-slate-300">256-bit encrypted health records</p>
            </div>

            <div className="p-3.5 bg-slate-900/60 backdrop-blur-md rounded-2xl border border-white/15 space-y-1">
              <div className="flex items-center gap-2">
                <Siren className="w-4 h-4 text-red-400 shrink-0" />
                <p className="text-xs font-bold text-white">108 Emergency</p>
              </div>
              <p className="text-[10px] text-slate-300">Live GPS ambulance dispatch</p>
            </div>

            <div className="p-3.5 bg-slate-900/60 backdrop-blur-md rounded-2xl border border-white/15 space-y-1">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-sky-400 shrink-0" />
                <p className="text-xs font-bold text-white">AI Clinical Triage</p>
              </div>
              <p className="text-[10px] text-slate-300">Automated risk assessment</p>
            </div>

            <div className="p-3.5 bg-slate-900/60 backdrop-blur-md rounded-2xl border border-white/15 space-y-1">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <p className="text-xs font-bold text-white">15 Gov Hospitals</p>
              </div>
              <p className="text-[10px] text-slate-300">Live ICU &amp; ward telemetry</p>
            </div>
          </div>
        </div>

        {/* Bottom: Trust line */}
        <div className="relative z-10 flex items-center gap-2.5 text-[12px] text-slate-300 font-medium">
          <Shield className="w-4 h-4 text-teal-400" />
          <span>{t("trustBadgeText")}</span>
        </div>
      </div>

      {/* ── Right Panel: Create Account Form ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-12 bg-white lg:border-l border-[#eef0f4] animate-in fade-in slide-in-from-bottom-3 duration-500 overflow-y-auto">
        <div className="w-full max-w-[440px] space-y-6 my-auto">

          {/* Mobile-only logo */}
          <div className="flex items-center gap-3 lg:hidden">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#f8f8fa] border border-slate-100 p-1 flex items-center justify-center">
              <Image src="/logo.png" alt="Sehat Saathi" width={36} height={36} className="object-contain" priority />
            </div>
            <span className="text-lg font-bold text-[#1a1f36] tracking-tight">
              {t("brandName")}
            </span>
          </div>

          {/* Heading */}
          <div className="space-y-1">
            <h2 className="text-[26px] sm:text-[28px] font-black text-[#1a1f36] tracking-tight">
              Create your account
            </h2>
            <p className="text-[13px] sm:text-[14px] text-[#64748b] font-medium">
              Select your role to get started with national healthcare records.
            </p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            
            {/* Role Selector */}
            <div className="space-y-2">
              <Label className="text-[12px] font-bold text-[#475569] uppercase tracking-wider">
                {t("iAmA")}
              </Label>
              <div className="grid grid-cols-3 gap-2.5">
                {roles.map(({ value, label, icon: Icon }) => {
                  const isActive = selectedRole === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setSelectedRole(value)}
                      className={`
                        relative flex flex-col items-center gap-1.5 py-3 px-2 rounded-2xl
                        border transition-all duration-200 cursor-pointer btn-press
                        ${isActive
                          ? "border-[#1e3a5f] bg-[#1e3a5f] text-white shadow-md shadow-[#1e3a5f]/15"
                          : "border-[#e2e8f0] bg-white text-[#64748b] hover:border-[#cbd5e1] hover:bg-[#f8fafc]"
                        }
                      `}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-[#94a3b8]"}`} />
                      <span className={`text-[12px] font-bold ${isActive ? "text-white" : "text-[#475569]"}`}>
                        {label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Full Name */}
            <div className="space-y-1.5">
              <Label className="text-[13px] font-bold text-[#475569]">
                Full Name <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-[#94a3b8]" />
                <Input
                  type="text"
                  placeholder="e.g. Ramesh Kumar"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="pl-11 h-11 rounded-xl border-[#e2e8f0] bg-[#f8f8fa] text-[14px] text-[#1a1f36] placeholder:text-[#94a3b8] focus-visible:ring-2 focus-visible:ring-[#1e3a5f]/20 focus-visible:border-[#1e3a5f] font-medium"
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <Label className="text-[13px] font-bold text-[#475569]">
                Mobile Number <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-[#94a3b8]" />
                <Input
                  type="tel"
                  placeholder="e.g. 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="pl-11 h-11 rounded-xl border-[#e2e8f0] bg-[#f8f8fa] text-[14px] text-[#1a1f36] placeholder:text-[#94a3b8] focus-visible:ring-2 focus-visible:ring-[#1e3a5f]/20 focus-visible:border-[#1e3a5f] font-medium"
                  required
                />
              </div>
            </div>

            {/* Email (Optional) */}
            <div className="space-y-1.5">
              <Label className="text-[13px] font-bold text-[#475569]">
                Email Address (Optional)
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-[#94a3b8]" />
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-11 h-11 rounded-xl border-[#e2e8f0] bg-[#f8f8fa] text-[14px] text-[#1a1f36] placeholder:text-[#94a3b8] focus-visible:ring-2 focus-visible:ring-[#1e3a5f]/20 focus-visible:border-[#1e3a5f] font-medium"
                />
              </div>
            </div>

            {/* Doctor Specialty (if doctor) */}
            {selectedRole === Role.DOCTOR && (
              <div className="space-y-1.5 animate-in fade-in duration-200">
                <Label className="text-[13px] font-bold text-[#475569]">
                  Medical Specialty
                </Label>
                <Input
                  type="text"
                  placeholder="e.g. Cardiology, General Medicine"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="h-11 rounded-xl border-[#e2e8f0] bg-[#f8f8fa] text-[14px] text-[#1a1f36] placeholder:text-[#94a3b8] font-medium"
                />
              </div>
            )}

            {/* Password */}
            <div className="space-y-1.5">
              <Label className="text-[13px] font-bold text-[#475569]">
                Password <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-[#94a3b8]" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-11 pr-11 h-11 rounded-xl border-[#e2e8f0] bg-[#f8f8fa] text-[14px] text-[#1a1f36] placeholder:text-[#94a3b8] focus-visible:ring-2 focus-visible:ring-[#1e3a5f]/20 focus-visible:border-[#1e3a5f]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#64748b] transition-colors"
                >
                  {showPassword ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-[#1e3a5f] hover:bg-[#162d4a] text-white font-bold text-[14px] shadow-sm hover:shadow-md transition-all gap-2 mt-3 btn-press"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </Button>

            {/* Login Link */}
            <p className="text-center text-[13px] text-[#64748b] font-medium pt-1">
              Already have an account?{" "}
              <Link href="/login" className="font-bold text-[#0d9488] hover:text-[#0f766e] transition-colors">
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
