"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { Role, AuthUser } from "@/lib/types";
import { apiPost } from "@/lib/api";
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
  Shield,
  Siren,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const { login, language, setLanguage, t } = useStore();
  const [selectedRole, setSelectedRole] = useState<Role>(Role.PATIENT);
  const [emailOrMobile, setEmailOrMobile] = useState("9876500001");
  const [password, setPassword] = useState("Demo@1234");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    if (role === Role.DOCTOR) {
      setEmailOrMobile("9876500002");
      setPassword("Demo@1234");
    } else if (role === Role.HOSPITAL_STAFF) {
      setEmailOrMobile("9876500003");
      setPassword("Demo@1234");
    } else {
      setEmailOrMobile("9876500001");
      setPassword("Demo@1234");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await apiPost<{
        token: string;
        user: {
          userId: string;
          name: string;
          role: string;
          phone: string;
          email?: string;
          patientId?: string;
          doctorId?: string;
          staffId?: string;
          facilityId?: string;
          specialty?: string;
        };
      }>("/api/auth/login", {
        emailOrMobile: emailOrMobile.trim(),
        password,
        role: selectedRole,
      });

      const user: AuthUser = {
        id: data.user.userId,
        name: data.user.name,
        role: data.user.role as Role,
        phone: data.user.phone,
        email: data.user.email || `${data.user.phone}@sehatsaathi.in`,
        patientId: data.user.patientId,
        doctorId: data.user.doctorId,
        staffId: data.user.staffId,
        facilityId: data.user.facilityId,
        specialty: data.user.role === Role.DOCTOR ? (data.user.specialty || "General Physician") : undefined,
      };

      login(user, data.token);
      toast.success(language === "hi" ? `स्वागत है, ${user.name}!` : `Welcome, ${user.name}!`);
      router.push("/");
    } catch (err: unknown) {
      if (process.env.NODE_ENV !== "production") console.error("Login failed:", err);
      toast.error(err instanceof Error ? err.message : "Unable to log in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { value: Role.PATIENT, label: language === "hi" ? "मरीज़" : "Patient", icon: Users, demo: "Aarav" },
    { value: Role.DOCTOR, label: language === "hi" ? "डॉक्टर" : "Doctor", icon: Stethoscope, demo: "Dr. Priya" },
    { value: Role.HOSPITAL_STAFF, label: language === "hi" ? "स्टाफ़" : "Staff", icon: Building2, demo: "Neha" },
  ] as const;

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 overflow-x-hidden font-sans">
      
      {/* ── 1. Full-screen Healthcare Background Image ── */}
      <div className="fixed inset-0 -z-20 overflow-hidden pointer-events-none">
        <Image
          src="/backgrounds/auth-login.jpg"
          alt="Healthcare consultation"
          fill
          priority
          className="object-cover object-center scale-105 transition-transform duration-1000 ease-out"
        />
        {/* Ambient Dark & Teal Atmospheric Protective Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/75 via-teal-950/70 to-slate-950/85 backdrop-blur-[4px]" />
      </div>

      {/* ── 2. Ambient Lighting Flares ── */}
      <div className="fixed top-1/4 left-1/4 w-[500px] h-[500px] bg-teal-500/20 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" />
      <div className="fixed bottom-1/4 right-1/4 w-[450px] h-[450px] bg-emerald-500/15 rounded-full blur-3xl pointer-events-none -z-10" />

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
            <p className="text-[10px] font-bold text-teal-300 tracking-wider uppercase">
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
                  ? "bg-teal-600 text-white shadow-sm"
                  : "text-white/80 hover:text-white"
              }`}
            >
              हिं
            </button>
          </div>
        </div>
      </header>

      {/* ── 4. Centered Glass Card (420-460px Desktop) ── */}
      <main className="w-full max-w-[460px] my-auto pt-16 pb-6 relative z-20 auth-card-enter">
        <div className="glass-card-auth p-6 sm:p-8 rounded-[32px] border border-white/60 shadow-2xl relative overflow-hidden backdrop-blur-2xl bg-white/90">
          
          {/* Subtle Top Inner Highlight */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-teal-500 via-emerald-400 to-teal-600" />

          {/* Header & Logo */}
          <div className="text-center space-y-2 mb-6">
            <div className="inline-flex p-2.5 rounded-2xl bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-100/80 shadow-xs mb-1">
              <Image src="/logo.png" alt="Sehat Saathi" width={48} height={48} className="object-contain" priority />
            </div>
            
            <h1 className="text-2xl sm:text-[26px] font-black text-slate-900 tracking-tight">
              {language === "hi" ? "साइन इन करें" : "Sign In"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-xs mx-auto">
              {language === "hi"
                ? "सेहत साथी राष्ट्रीय स्वास्थ्य पोर्टल में आपका स्वागत है"
                : "Welcome back to Sehat Saathi healthcare portal"}
            </p>
          </div>

          {/* Role Selector — 3D Interactive Cards */}
          <div className="space-y-2 mb-5">
            <div className="flex items-center justify-between">
              <Label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                {t("iAmA") || "Select Your Role"}
              </Label>
              <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-100">
                Demo Ready
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {roles.map(({ value, label, icon: Icon, demo }) => {
                const isActive = selectedRole === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => handleRoleSelect(value)}
                    className={`relative flex flex-col items-center justify-center p-3 rounded-2xl border transition-all duration-200 cursor-pointer ${
                      isActive
                        ? "bg-gradient-to-b from-teal-700 to-teal-800 text-white border-teal-600 shadow-[0_4px_0_0_#0f5b55,0_8px_16px_-2px_rgba(15,118,110,0.35)] -translate-y-0.5"
                        : "bg-white/70 hover:bg-white text-slate-600 border-slate-200/90 shadow-2xs hover:shadow-xs hover:-translate-y-0.5"
                    }`}
                  >
                    <Icon className={`w-5 h-5 mb-1.5 transition-transform ${isActive ? "text-white scale-110" : "text-slate-400"}`} />
                    <span className="text-xs font-bold leading-none">{label}</span>
                    <span className={`text-[9px] mt-1 font-medium ${isActive ? "text-teal-200" : "text-slate-400"}`}>
                      {demo}
                    </span>
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
          <form onSubmit={handleLogin} className="space-y-4">
            
            {/* Email / Mobile */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700">
                {t("emailOrMobile") || "Phone Number or Email"}
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <Input
                  type="text"
                  placeholder={language === "hi" ? "मोबाइल नंबर (उदा. 9876500001)" : "Phone number (e.g. 9876500001)"}
                  value={emailOrMobile}
                  onChange={(e) => setEmailOrMobile(e.target.value)}
                  className="pl-10 h-11 rounded-xl border-slate-200/90 bg-white/80 text-xs sm:text-sm font-semibold focus-visible:ring-teal-500 shadow-2xs"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-bold text-slate-700">
                  {t("password") || "Password"}
                </Label>
                <span className="text-[11px] font-semibold text-teal-700 hover:text-teal-800 cursor-pointer">
                  {language === "hi" ? "पासवर्ड भूल गए?" : "Forgot password?"}
                </span>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder={language === "hi" ? "पासवर्ड (उदा. Demo@1234)" : "Enter password (Demo@1234)"}
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
                    <span>{language === "hi" ? "साइन इन करें" : "SIGN IN"}</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Social Divider */}
          <div className="relative my-5 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <span className="relative bg-white/90 px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              {language === "hi" ? "या अन्य विकल्प" : "or continue with"}
            </span>
          </div>

          {/* Google & Apple 3D Mock Buttons */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => toast.info("Google Sign-In is configured for demo with phone accounts")}
              className="btn-3d-glass h-10 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Google</span>
            </button>

            <button
              type="button"
              onClick={() => toast.info("Apple Sign-In is configured for demo with phone accounts")}
              className="btn-3d-glass h-10 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4 fill-current text-slate-800" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.85c.66-.8 1.11-1.92.99-3.04-1 .04-2.22.67-2.93 1.5-.63.73-1.18 1.89-1.03 2.99 1.12.09 2.31-.65 2.97-1.45z" />
              </svg>
              <span>Apple</span>
            </button>
          </div>

          {/* Footer Link */}
          <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs font-medium text-slate-500">
            <span>{t("noAccount") || "Don't have an account?"}</span>{" "}
            <Link href="/signup" className="font-extrabold text-teal-700 hover:text-teal-800 hover:underline">
              {t("createOne") || "Sign up"}
            </Link>
          </div>

          {/* Quick Demo Credentials Reminder */}
          <div className="mt-4 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5 font-medium">
              <Shield className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              Password for all demo accounts:
            </span>
            <span className="font-mono font-bold text-slate-800 bg-white px-1.5 py-0.5 rounded border border-slate-200">
              Demo@1234
            </span>
          </div>

        </div>
      </main>

    </div>
  );
}