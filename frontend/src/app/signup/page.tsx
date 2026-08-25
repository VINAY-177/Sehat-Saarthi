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
  Shield, User, Phone, Siren, Loader2
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
      toast.success(language === "hi" ? `सेहत साथी में आपका स्वागत है, ${fullName}!` : `Welcome to Sehat Saathi, ${fullName}!`);
      router.push("/");
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
      router.push("/");
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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 lg:p-8 font-sans relative">
      
      {/* Top Floating Action Bar (Emergency SOS + Language Switcher) */}
      <div className="absolute top-5 right-5 sm:top-6 sm:right-6 z-30 flex items-center gap-3">
        {/* Pinned 108 Emergency SOS Button */}
        <Link href="/emergency">
          <Button
            type="button"
            className="h-9 sm:h-10 px-3.5 sm:px-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-md shadow-red-600/25 gap-2 transition-all hover:scale-105 border border-red-500"
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
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
              language === "hi"
                ? "bg-[#0d9488] text-white shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            हिंदी
          </button>
        </div>
      </div>

      <div className="w-full max-w-[500px] my-10 animate-in fade-in zoom-in-95 duration-300">
        
        {/* Header Branding */}
        <div className="text-center mb-8">
          <Link href="/login" className="inline-flex items-center gap-3 group mb-3">
            <div className="w-12 h-12 rounded-2xl overflow-hidden bg-white shadow-sm border border-slate-200/80 p-1 flex items-center justify-center">
              <Image src="/logo.png" alt="Sehat Saathi" width={40} height={40} className="object-contain" priority />
            </div>
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              {t("brandName")}
            </span>
          </Link>
          <p className="text-sm font-semibold text-slate-500">
            {t("tagline")}
          </p>
        </div>

        {/* Card Form */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-md">
          
          <div className="mb-6">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Create your account
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Select your role to get started with national healthcare records.
            </p>
          </div>

          <form onSubmit={handleSignup} className="space-y-5">
            
            {/* Role Selector */}
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                {t("iAmA")}
              </Label>
              <div className="grid grid-cols-3 gap-2">
                {roles.map(({ value, label, icon: Icon }) => {
                  const isActive = selectedRole === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setSelectedRole(value)}
                      className={`
                        flex flex-col items-center gap-1.5 py-3 px-2 rounded-2xl
                        border transition-all duration-200 cursor-pointer
                        ${isActive
                          ? "border-[#1e3a5f] bg-[#1e3a5f] text-white shadow-sm"
                          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                        }
                      `}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                      <span className={`text-xs font-bold ${isActive ? "text-white" : "text-slate-700"}`}>
                        {label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Full Name */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700">
                Full Name <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="e.g. Ramesh Kumar"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="pl-10 h-11 rounded-xl bg-slate-50/50 border-slate-200 text-sm font-medium"
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700">
                Mobile Number <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="tel"
                  placeholder="e.g. 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="pl-10 h-11 rounded-xl bg-slate-50/50 border-slate-200 text-sm font-medium"
                  required
                />
              </div>
            </div>

            {/* Email (Optional) */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700">
                Email Address (Optional)
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11 rounded-xl bg-slate-50/50 border-slate-200 text-sm font-medium"
                />
              </div>
            </div>

            {/* Doctor Specialty (if doctor) */}
            {selectedRole === Role.DOCTOR && (
              <div className="space-y-1.5 animate-in fade-in duration-200">
                <Label className="text-xs font-bold text-slate-700">
                  Medical Specialty
                </Label>
                <Input
                  type="text"
                  placeholder="e.g. Cardiology, General Medicine"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="h-11 rounded-xl bg-slate-50/50 border-slate-200 text-sm font-medium"
                />
              </div>
            )}

            {/* Password */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700">
                Password <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-11 rounded-xl bg-slate-50/50 border-slate-200 text-sm font-medium"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-[#1e3a5f] hover:bg-[#162d4a] text-white font-bold text-sm shadow-sm hover:shadow-md transition-all gap-2 mt-2"
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
            <p className="text-center text-xs text-slate-500 font-medium pt-2">
              Already have an account?{" "}
              <Link href="/login" className="font-bold text-teal-700 hover:underline">
                Sign In
              </Link>
            </p>
          </form>
        </div>

        {/* Trust line */}
        <div className="flex items-center justify-center gap-2 text-xs text-slate-400 font-medium mt-6">
          <Shield className="w-4 h-4" />
          <span>{t("trustBadgeText")}</span>
        </div>
      </div>
    </div>
  );
}
