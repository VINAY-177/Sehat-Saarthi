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
  PhoneCall,
  Activity,
  Bed,
  Sparkles,
  HeartPulse,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const { login, language, setLanguage, t } = useStore();
  const isHindi = language === "hi";

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
      toast.success(isHindi ? `स्वागत है, ${user.name}!` : `Welcome, ${user.name}!`);
      router.push("/");
    } catch (err: unknown) {
      if (process.env.NODE_ENV !== "production") console.error("Login failed:", err);
      toast.error(err instanceof Error ? err.message : "Unable to log in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { value: Role.PATIENT, label: isHindi ? "मरीज़" : "Patient", icon: Users, demo: "Aarav", phone: "9876500001" },
    { value: Role.DOCTOR, label: isHindi ? "डॉक्टर" : "Doctor", icon: Stethoscope, demo: "Dr. Priya", phone: "9876500002" },
    { value: Role.HOSPITAL_STAFF, label: isHindi ? "स्टाफ़" : "Staff", icon: Building2, demo: "Neha", phone: "9876500003" },
  ] as const;

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between p-4 sm:p-6 lg:p-8 font-sans isolate overflow-x-hidden">
      
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
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-teal-950/75 to-slate-950/90 backdrop-blur-[3.5px]" />
      </div>

      {/* ── 2. Ambient Lighting Flares ── */}
      <div className="fixed top-1/4 left-1/4 w-[500px] h-[500px] bg-teal-500/20 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" />
      <div className="fixed bottom-1/4 right-1/4 w-[450px] h-[450px] bg-emerald-500/15 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* ── 3. Top Navigation Header ── */}
      <header className="relative z-30 flex items-center justify-between max-w-7xl mx-auto w-full mb-6">
        
        {/* Brand Link on Top Left */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-2xl bg-white/95 backdrop-blur-md shadow-lg border border-white/40 p-1.5 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Image src="/logo.png" alt="Sehat Saathi" width={36} height={36} className="object-contain" priority />
          </div>
          <div>
            <span className="text-lg font-black text-white tracking-tight drop-shadow-sm block">
              {t("brandName") || "Sehat Saathi"}
            </span>
            <p className="text-[10px] font-bold text-teal-300 tracking-wider uppercase">
              {isHindi ? "राष्ट्रीय स्वास्थ्य व आपातकालीन नेटवर्क" : "National Health & Emergency Grid"}
            </p>
          </div>
        </Link>

        {/* Top Right Controls */}
        <div className="flex items-center gap-3">
          {/* 3D Red Emergency 108 Button */}
          <Link href="/emergency">
            <button
              type="button"
              className="btn-3d-emergency h-10 px-4 text-xs gap-2 rounded-2xl flex items-center"
            >
              <Siren className="w-4 h-4 animate-pulse text-white" />
              <span className="font-extrabold tracking-wide hidden sm:inline">
                {isHindi ? "आपातकालीन 108" : "Emergency 108"}
              </span>
              <span className="font-extrabold sm:hidden">108</span>
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

      {/* ── 4. Main Two-Column Interactive Container ── */}
      <main className="w-full max-w-7xl mx-auto my-auto py-4 z-20 auth-card-enter">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* ── Left Column: Platform Features & 1-Click Demo Accounts ── */}
          <div className="lg:col-span-6 xl:col-span-7 space-y-6 text-white">
            
            {/* Tagline & Title */}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-extrabold backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isHindi ? "आयुष्मान भारत डिजिटल मिशन (ABDM) सक्षम" : "Ayushman Bharat Digital Health Grid"}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl xl:text-5xl font-black tracking-tight leading-tight">
                {isHindi ? (
                  <>
                    अस्पताल बेड, 108 एम्बुलेंस और डॉक्टर <span className="text-emerald-400">एक ही प्लेटफॉर्म पर</span>
                  </>
                ) : (
                  <>
                    Hospital Beds, 108 GPS Fleet &amp; Doctors <span className="text-emerald-400">In Real-Time</span>
                  </>
                )}
              </h2>
              <p className="text-slate-300 text-sm sm:text-base font-medium max-w-xl leading-relaxed">
                {isHindi
                  ? "दिल्ली-एनसीआर के 118+ सत्यापित अस्पतालों से लाइव आईसीयू टेलीमेट्री, तत्काल जीपीएस एम्बुलेंस प्रेषण और आभा स्वास्थ्य रिकॉर्ड्स का सीधा प्रबंधन करें।"
                  : "Access live bed telemetry across 118+ verified Delhi-NCR hospitals, one-touch GPS emergency ambulance dispatch, and ABHA longitudinal medical records."}
              </p>
            </div>

            {/* 4 Feature Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-sm space-y-1.5">
                <div className="w-8 h-8 rounded-xl bg-teal-500/30 text-teal-300 flex items-center justify-center">
                  <Bed className="w-4 h-4" />
                </div>
                <h4 className="font-extrabold text-sm text-white">
                  {isHindi ? "118+ अस्पताल नेटवर्क" : "118+ NCR Hospital Grid"}
                </h4>
                <p className="text-xs text-slate-300 font-medium">
                  {isHindi ? "लाइव आईसीयू व सामान्य बेड टेलीमेट्री और जीपीएस दूरी।" : "Real-time ICU/General bed availability & GPS proximity."}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-sm space-y-1.5">
                <div className="w-8 h-8 rounded-xl bg-rose-500/30 text-rose-300 flex items-center justify-center">
                  <Siren className="w-4 h-4" />
                </div>
                <h4 className="font-extrabold text-sm text-white">
                  {isHindi ? "108 जीपीएस एम्बुलेंस" : "108 Emergency Dispatch"}
                </h4>
                <p className="text-xs text-slate-300 font-medium">
                  {isHindi ? "24/7 तत्काल आपातकालीन वाहन ट्रैकिंग एवं ईटीए।" : "One-touch SOS dispatch with live GPS tracking & telemetry."}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-sm space-y-1.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/30 text-emerald-300 flex items-center justify-center">
                  <Shield className="w-4 h-4" />
                </div>
                <h4 className="font-extrabold text-sm text-white">
                  {isHindi ? "आभा व सरकारी स्वास्थ्य योजनाएं" : "ABHA & Scheme Locker"}
                </h4>
                <p className="text-xs text-slate-300 font-medium">
                  {isHindi ? "पीएम-जय एवं 110+ राष्ट्रीय योजनाओं की पात्रता जांच।" : "110+ scheme eligibility checks & digital health cards."}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-sm space-y-1.5">
                <div className="w-8 h-8 rounded-xl bg-blue-500/30 text-blue-300 flex items-center justify-center">
                  <Activity className="w-4 h-4" />
                </div>
                <h4 className="font-extrabold text-sm text-white">
                  {isHindi ? "एआई क्लिनिकल ट्रायज" : "AI Clinical Triage"}
                </h4>
                <p className="text-xs text-slate-300 font-medium">
                  {isHindi ? "लक्षणों का त्वरित विश्लेषण और सटीक विशेषज्ञ मिलान।" : "Rule-based symptom scoring & verified doctor matching."}
                </p>
              </div>
            </div>

            {/* 1-Click Quick Demo Switcher Cards */}
            <div className="p-4 rounded-2xl bg-teal-950/60 border border-teal-500/30 backdrop-blur-md space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-teal-300 flex items-center gap-1.5">
                  <HeartPulse className="w-4 h-4" />
                  {isHindi ? "डेमो परीक्षण के लिए 1-क्लिक ऑटो-फिल:" : "1-Click Demo Account Quick-Fill:"}
                </span>
                <span className="text-[10px] font-bold text-slate-400 bg-white/10 px-2 py-0.5 rounded">
                  Pass: Demo@1234
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {roles.map(({ value, label, icon: Icon, demo, phone }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => handleRoleSelect(value)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      selectedRole === value
                        ? "bg-teal-500/25 border-teal-400 text-white shadow-xs"
                        : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <Icon className="w-3.5 h-3.5 text-teal-300" />
                      <span className="text-xs font-bold truncate">{label}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-mono truncate">{phone}</p>
                    <p className="text-[10px] text-teal-300 font-medium truncate">{demo}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* 24/7 Helplines Strip */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
              <span className="flex items-center gap-1 font-semibold text-slate-300">
                <PhoneCall className="w-3.5 h-3.5 text-rose-400" />
                {isHindi ? "आपातकालीन हेल्पलाइन:" : "Emergency Helplines:"}
              </span>
              <span className="bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded font-extrabold border border-rose-500/30">
                108 (Ambulance)
              </span>
              <span className="bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded font-extrabold border border-blue-500/30">
                104 (Health Info)
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-extrabold border border-emerald-500/30">
                1075 (National Health)
              </span>
            </div>

          </div>

          {/* ── Right Column: Sign In Glass Card ── */}
          <div className="lg:col-span-6 xl:col-span-5 w-full max-w-[480px] mx-auto">
            <div className="glass-card-auth p-6 sm:p-8 rounded-[32px] border border-white/70 shadow-2xl relative overflow-hidden backdrop-blur-2xl bg-white/95">
              
              {/* Subtle Top Inner Highlight */}
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-teal-500 via-emerald-400 to-teal-600" />

              {/* Header & Logo */}
              <div className="text-center space-y-1.5 mb-5">
                <div className="inline-flex p-2 rounded-2xl bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-100/80 shadow-xs mb-1">
                  <Image src="/logo.png" alt="Sehat Saathi" width={42} height={42} className="object-contain" priority />
                </div>
                
                <h1 className="text-2xl sm:text-[26px] font-black text-slate-900 tracking-tight">
                  {isHindi ? "साइन इन करें" : "Sign In"}
                </h1>
                <p className="text-xs text-slate-500 font-medium max-w-xs mx-auto">
                  {isHindi
                    ? "सेहत साथी राष्ट्रीय स्वास्थ्य पोर्टल में आपका स्वागत है"
                    : "Welcome back to Sehat Saathi healthcare portal"}
                </p>
              </div>

              {/* Role Selector — 3D Interactive Cards */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <Label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                    {t("iAmA") || "Select Your Role"}
                  </Label>
                  <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-100">
                    {isHindi ? "डेमो तैयार" : "Demo Ready"}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {roles.map(({ value, label, icon: Icon, demo }) => {
                    const isActive = selectedRole === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => handleRoleSelect(value)}
                        className={`relative flex flex-col items-center justify-center p-2.5 rounded-2xl border transition-all duration-200 cursor-pointer ${
                          isActive
                            ? "bg-gradient-to-b from-teal-700 to-teal-800 text-white border-teal-600 shadow-[0_4px_0_0_#0f5b55,0_8px_16px_-2px_rgba(15,118,110,0.35)] -translate-y-0.5"
                            : "bg-white/70 hover:bg-white text-slate-600 border-slate-200/90 shadow-2xs hover:shadow-xs hover:-translate-y-0.5"
                        }`}
                      >
                        <Icon className={`w-4 h-4 mb-1 transition-transform ${isActive ? "text-white scale-110" : "text-slate-400"}`} />
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
              <form onSubmit={handleLogin} className="space-y-3.5">
                
                {/* Email / Mobile */}
                <div className="space-y-1">
                  <Label className="text-xs font-bold text-slate-700">
                    {t("emailOrMobile") || "Phone Number or Email"}
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                    <Input
                      type="text"
                      placeholder={isHindi ? "मोबाइल नंबर (उदा. 9876500001)" : "Phone number (e.g. 9876500001)"}
                      value={emailOrMobile}
                      onChange={(e) => setEmailOrMobile(e.target.value)}
                      className="pl-10 h-11 rounded-xl border-slate-200/90 bg-white/80 text-xs sm:text-sm font-semibold focus-visible:ring-teal-500 shadow-2xs"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-bold text-slate-700">
                      {t("password") || "Password"}
                    </Label>
                    <span className="text-[11px] font-semibold text-teal-700 hover:text-teal-800 cursor-pointer">
                      {isHindi ? "पासवर्ड भूल गए?" : "Forgot password?"}
                    </span>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder={isHindi ? "पासवर्ड (उदा. Demo@1234)" : "Enter password (Demo@1234)"}
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
                    className="btn-3d-primary w-full h-11 text-sm font-extrabold gap-2 rounded-2xl"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin text-white" />
                    ) : (
                      <>
                        <span>{isHindi ? "साइन इन करें" : "SIGN IN"}</span>
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Social Divider */}
              <div className="relative my-4 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <span className="relative bg-white px-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  {isHindi ? "या अन्य विकल्प" : "or continue with"}
                </span>
              </div>

              {/* Google & Apple 3D Mock Buttons */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => toast.info("Google Sign-In is configured for demo with phone accounts")}
                  className="btn-3d-glass h-9 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center gap-2"
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
                  className="btn-3d-glass h-9 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4 fill-current text-slate-800" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.85c.66-.8 1.11-1.92.99-3.04-1 .04-2.22.67-2.93 1.5-.63.73-1.18 1.89-1.03 2.99 1.12.09 2.31-.65 2.97-1.45z" />
                  </svg>
                  <span>Apple</span>
                </button>
              </div>

              {/* Footer Link */}
              <div className="mt-4 pt-3 border-t border-slate-100 text-center text-xs font-medium text-slate-500">
                <span>{t("noAccount") || "Don't have an account?"}</span>{" "}
                <Link href="/signup" className="font-extrabold text-teal-700 hover:text-teal-800 hover:underline">
                  {t("createOne") || "Sign up"}
                </Link>
              </div>

              {/* Quick Demo Credentials Reminder */}
              <div className="mt-3 p-2 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1.5 font-medium">
                  <Shield className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  {isHindi ? "सभी खातों का पासवर्ड:" : "Demo password:"}
                </span>
                <span className="font-mono font-bold text-slate-800 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                  Demo@1234
                </span>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* ── 5. Footer Trust Badges ── */}
      <footer className="relative z-30 max-w-7xl mx-auto w-full pt-4 pb-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-2 font-medium">
          <span>© 2026 Sehat Saathi • National Health Stack India</span>
        </div>
        <div className="flex items-center gap-4 font-semibold text-slate-300">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> ABDM Compliant
          </span>
          <span className="flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-teal-400" /> 256-bit Encrypted
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> ISO 27001 Certified
          </span>
        </div>
      </footer>

    </div>
  );
}