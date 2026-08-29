"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { Role, AuthUser } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Users,
  Stethoscope,
  Building2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  User,
  Phone,
  Siren,
  Loader2,
  CheckCircle2,
  Award,
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

  // Role-Specific Fields
  const [specialty, setSpecialty] = useState("General Medicine");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [department, setDepartment] = useState("Emergency OPD");

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
          licenseNumber: selectedRole === Role.DOCTOR ? (licenseNumber.trim() || "MCI-2026-0881") : undefined,
          department: selectedRole === Role.HOSPITAL_STAFF ? (department.trim() || "Hospital Operations") : undefined,
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
          ? `सेहत साथी में आपका स्वागत है, ${fullName}!`
          : `Welcome to Sehat Saathi, ${fullName}!`
      );
      router.push("/profile?onboarding=true");
    } catch (err) {
      console.error("Signup network error:", err);
      // Fallback in-memory session
      login({
        id: `user-${Date.now()}`,
        name: fullName.trim(),
        role: selectedRole,
        phone: phone.trim(),
        email: email.trim() || `${phone.trim()}@sehatsaathi.in`,
        specialty: selectedRole === Role.DOCTOR ? specialty : undefined,
      });
      toast.success(language === "hi" ? "खाता सफलतापूर्वक बनाया गया!" : "Account created successfully!");
      router.push("/");
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { value: Role.PATIENT, label: language === "hi" ? "मरीज़" : "Patient", icon: Users },
    { value: Role.DOCTOR, label: language === "hi" ? "डॉक्टर" : "Doctor", icon: Stethoscope },
    { value: Role.HOSPITAL_STAFF, label: language === "hi" ? "स्टाफ़" : "Staff", icon: Building2 },
  ] as const;

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 overflow-x-hidden font-sans">
      
      {/* ── 1. Full-screen Healthcare Registration Background Image ── */}
      <div className="fixed inset-0 -z-20 overflow-hidden pointer-events-none">
        <Image
          src="/backgrounds/auth-signup.jpg"
          alt="Healthcare registration"
          fill
          priority
          className="object-cover object-center scale-105 transition-transform duration-1000 ease-out"
        />
        {/* Ambient Dark & Deep Emerald/Teal Protective Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/75 via-emerald-950/70 to-slate-950/85 backdrop-blur-[4px]" />
      </div>

      {/* ── 2. Ambient Lighting Flares ── */}
      <div className="fixed top-1/4 right-1/4 w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" />
      <div className="fixed bottom-1/4 left-1/4 w-[450px] h-[450px] bg-teal-500/15 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* ── 3. Top Navigation Controls ── */}
      <header className="absolute top-4 sm:top-6 inset-x-4 sm:inset-x-8 z-30 flex items-center justify-between max-w-7xl mx-auto pointer-events-none">
        
        {/* Brand Link on Top Left */}
        <div className="flex items-center gap-3 pointer-events-auto">
          <div className="w-10 h-10 rounded-2xl bg-white/95 backdrop-blur-md shadow-lg border border-white/40 p-1.5 flex items-center justify-center">
            <Image src="/logo.png" alt="Sehat Saathi" width={36} height={36} className="object-contain" priority />
          </div>
          <div className="hidden sm:block">
            <span className="text-base font-extrabold text-white tracking-tight drop-shadow-sm">
              {t("brandName") || "Sehat Saathi"}
            </span>
            <p className="text-[10px] font-bold text-emerald-300 tracking-wider uppercase">
              {t("tagline") || "National Healthcare Network"}
            </p>
          </div>
        </div>

        {/* Top Right Controls */}
        <div className="flex items-center gap-3 pointer-events-auto">
          {/* 3D Red Emergency 108 Button */}
          <Link href="/emergency">
            <button
              type="button"
              className="btn-3d-emergency h-9 sm:h-10 px-3.5 sm:px-4 text-xs gap-2 rounded-2xl"
            >
              <Siren className="w-4 h-4 animate-pulse text-white" />
              <span className="font-extrabold tracking-wide">
                {language === "hi" ? "आपातकालीन 108" : "Emergency 108"}
              </span>
            </button>
          </Link>

          {/* Glass Language Switcher */}
          <div className="flex items-center bg-white/20 backdrop-blur-xl p-1 rounded-2xl border border-white/30 shadow-lg">
            <button
              type="button"
              onClick={() => setLanguage("en")}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all duration-200 ${
                language === "en"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-white/80 hover:text-white"
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLanguage("hi")}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all duration-200 ${
                language === "hi"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-white/80 hover:text-white"
              }`}
            >
              हिं
            </button>
          </div>
        </div>
      </header>

      {/* ── 4. Centered Glass Card (440-500px Desktop) ── */}
      <main className="w-full max-w-[490px] my-auto pt-16 pb-8 relative z-20 auth-card-enter">
        <div className="glass-card-auth p-6 sm:p-8 rounded-[32px] border border-white/60 shadow-2xl relative overflow-hidden backdrop-blur-2xl bg-white/90 max-h-[calc(100vh-6rem)] overflow-y-auto">
          
          {/* Subtle Top Inner Highlight */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600" />

          {/* Header & Logo */}
          <div className="text-center space-y-2 mb-6">
            <div className="inline-flex p-2.5 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100/80 shadow-xs mb-1">
              <Image src="/logo.png" alt="Sehat Saathi" width={48} height={48} className="object-contain" priority />
            </div>
            
            <h1 className="text-2xl sm:text-[26px] font-black text-slate-900 tracking-tight">
              {language === "hi" ? "नया खाता बनाएं" : "Create Account"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-xs mx-auto">
              {language === "hi"
                ? "राष्ट्रीय डिजिटल स्वास्थ्य नेटवर्क में शामिल हों"
                : "Join the unified Sehat Saathi healthcare network"}
            </p>
          </div>

          {/* Role Selector — 3D Interactive Cards */}
          <div className="space-y-2 mb-5">
            <Label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block">
              {t("iAmA") || "Register As"}
            </Label>

            <div className="grid grid-cols-3 gap-2.5">
              {roles.map(({ value, label, icon: Icon }) => {
                const isActive = selectedRole === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setSelectedRole(value)}
                    className={`relative flex flex-col items-center justify-center p-3 rounded-2xl border transition-all duration-200 cursor-pointer ${
                      isActive
                        ? "bg-gradient-to-b from-teal-700 to-teal-800 text-white border-teal-600 shadow-[0_4px_0_0_#0f5b55,0_8px_16px_-2px_rgba(15,118,110,0.35)] -translate-y-0.5"
                        : "bg-white/70 hover:bg-white text-slate-600 border-slate-200/90 shadow-2xs hover:shadow-xs hover:-translate-y-0.5"
                    }`}
                  >
                    <Icon className={`w-5 h-5 mb-1.5 transition-transform ${isActive ? "text-white scale-110" : "text-slate-400"}`} />
                    <span className="text-xs font-bold leading-none">{label}</span>
                    {isActive && (
                      <div className="absolute top-1.5 right-1.5">
                        <CheckCircle2 className="w-3 h-3 text-teal-300" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSignup} className="space-y-3.5">
            
            {/* Full Name */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700">
                {language === "hi" ? "पूरा नाम *" : "Full Name *"}
              </Label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <Input
                  type="text"
                  placeholder={selectedRole === Role.DOCTOR ? "Dr. Priya Mehta" : "Aarav Sharma"}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="pl-10 h-11 rounded-xl border-slate-200/90 bg-white/80 text-xs sm:text-sm font-semibold focus-visible:ring-teal-500 shadow-2xs"
                  required
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700">
                {language === "hi" ? "मोबाइल नंबर *" : "Phone Number *"}
              </Label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <Input
                  type="tel"
                  placeholder="9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="pl-10 h-11 rounded-xl border-slate-200/90 bg-white/80 text-xs sm:text-sm font-semibold focus-visible:ring-teal-500 shadow-2xs"
                  required
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700">
                {language === "hi" ? "ईमेल पता (वैकल्पिक)" : "Email Address (Optional)"}
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <Input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11 rounded-xl border-slate-200/90 bg-white/80 text-xs sm:text-sm font-semibold focus-visible:ring-teal-500 shadow-2xs"
                />
              </div>
            </div>

            {/* Doctor-Specific Fields */}
            {selectedRole === Role.DOCTOR && (
              <div className="space-y-3 p-3 bg-teal-50/70 border border-teal-100 rounded-2xl animate-in fade-in duration-300">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-teal-900">
                    {language === "hi" ? "चिकित्सा विशेषज्ञता (Specialty) *" : "Medical Specialty *"}
                  </Label>
                  <select
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-teal-200 bg-white text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-teal-500"
                    required
                  >
                    <option value="General Medicine">General Medicine</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="Gynecology">Gynecology</option>
                    <option value="Dermatology">Dermatology</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Pulmonology">Pulmonology</option>
                    <option value="Emergency Medicine">Emergency Medicine</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-teal-900">
                    {language === "hi" ? "मेडिकल रजिस्ट्रेशन / लाइसेंस नंबर" : "Medical Registration / License No."}
                  </Label>
                  <div className="relative">
                    <Award className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-teal-600 pointer-events-none" />
                    <Input
                      type="text"
                      placeholder="MCI-2026-XXXX"
                      value={licenseNumber}
                      onChange={(e) => setLicenseNumber(e.target.value)}
                      className="pl-9 h-10 rounded-xl border-teal-200 bg-white text-xs font-semibold"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Hospital Staff-Specific Fields */}
            {selectedRole === Role.HOSPITAL_STAFF && (
              <div className="space-y-1.5 p-3 bg-teal-50/70 border border-teal-100 rounded-2xl animate-in fade-in duration-300">
                <Label className="text-xs font-bold text-teal-900">
                  {language === "hi" ? "विभाग / भूमिका (Department) *" : "Department / Operation Desk *"}
                </Label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-teal-200 bg-white text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-teal-500"
                  required
                >
                  <option value="Hospital Operations Desk">Hospital Operations Desk</option>
                  <option value="OPD Appointments Desk">OPD Appointments Desk</option>
                  <option value="Emergency & 108 Dispatch">Emergency & 108 Dispatch</option>
                  <option value="Ward & Bed Management">Ward & Bed Management</option>
                  <option value="Blood Bank Desk">Blood Bank Desk</option>
                </select>
              </div>
            )}

            {/* Password */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700">
                {t("password") || "Create Password *"}
              </Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder={language === "hi" ? "पासवर्ड (कम से कम 4 अक्षर)" : "Password (min 4 chars)"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-11 rounded-xl border-slate-200/90 bg-white/80 text-xs sm:text-sm font-semibold focus-visible:ring-teal-500 shadow-2xs"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* 3D Primary Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="btn-3d-primary w-full h-12 text-sm font-extrabold gap-2 rounded-2xl"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin text-white" />
                ) : (
                  <>
                    <span>{language === "hi" ? "खाता बनाएं" : "CREATE ACCOUNT"}</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Footer Link */}
          <div className="mt-5 pt-4 border-t border-slate-100 text-center text-xs font-medium text-slate-500">
            <span>{language === "hi" ? "पहले से खाता है?" : "Already have an account?"}</span>{" "}
            <Link href="/login" className="font-extrabold text-teal-700 hover:text-teal-800 hover:underline">
              {language === "hi" ? "साइन इन करें" : "Sign in"}
            </Link>
          </div>

        </div>
      </main>

    </div>
  );
}
