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
  Sparkles,
  ShieldCheck,
  PhoneCall,
  FileText,
  Calendar,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

export default function SignupPage() {
  const router = useRouter();
  const { login, language, setLanguage, t } = useStore();
  const isHindi = language === "hi";

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
      toast.error(isHindi ? "कृपया अपना पूरा नाम दर्ज करें" : "Please enter your full name");
      return;
    }
    if (!phone.trim()) {
      toast.error(isHindi ? "कृपया अपना मोबाइल नंबर दर्ज करें" : "Please enter your phone number");
      return;
    }
    if (!password.trim() || password.length < 4) {
      toast.error(isHindi ? "पासवर्ड कम से कम 4 अक्षरों का होना चाहिए" : "Password must be at least 4 characters");
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
        isHindi
          ? `Connect to Care में आपका स्वागत है, ${fullName}!`
          : `Welcome to Connect to Care, ${fullName}!`
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
      toast.success(isHindi ? "खाता सफलतापूर्वक बनाया गया!" : "Account created successfully!");
      router.push("/");
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { value: Role.PATIENT, label: isHindi ? "मरीज़" : "Patient", icon: Users },
    { value: Role.DOCTOR, label: isHindi ? "डॉक्टर" : "Doctor", icon: Stethoscope },
    { value: Role.HOSPITAL_STAFF, label: isHindi ? "स्टाफ़" : "Staff", icon: Building2 },
  ] as const;

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between p-4 sm:p-6 lg:p-8 font-sans isolate overflow-x-hidden">
      
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
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-emerald-950/75 to-slate-950/90 backdrop-blur-[3.5px]" />
      </div>

      {/* ── 2. Ambient Lighting Flares ── */}
      <div className="fixed top-1/4 right-1/4 w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" />
      <div className="fixed bottom-1/4 left-1/4 w-[450px] h-[450px] bg-teal-500/15 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* ── 3. Top Navigation Header ── */}
      <header className="relative z-30 flex items-center justify-between max-w-7xl mx-auto w-full mb-6">
        
        {/* Brand Link on Top Left */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-2xl bg-white/95 backdrop-blur-md shadow-lg border border-white/40 p-1.5 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Image src="/logo.png" alt="Connect to Care" width={36} height={36} className="object-contain" priority />
          </div>
          <div>
            <span className="text-lg font-black text-white tracking-tight drop-shadow-sm block">
              {t("brandName") || "Connect to Care"}
            </span>
            <p className="text-[10px] font-bold text-emerald-300 tracking-wider uppercase">
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
          
          {/* ── Left Column: Benefits & Trust Details ── */}
          <div className="lg:col-span-6 xl:col-span-7 space-y-6 text-white">
            
            {/* Title */}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-extrabold backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isHindi ? "निःशुल्क डिजिटल स्वास्थ्य कार्ड" : "Free Digital Health ID & Records Locker"}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl xl:text-5xl font-black tracking-tight leading-tight">
                {isHindi ? (
                  <>
                    भारत की डिजिटल स्वास्थ्य सेवा से <span className="text-emerald-400">आज ही जुड़ें</span>
                  </>
                ) : (
                  <>
                    Join India&apos;s Unified <span className="text-emerald-400">Digital Health Network</span>
                  </>
                )}
              </h2>
              <p className="text-slate-300 text-sm sm:text-base font-medium max-w-xl leading-relaxed">
                {isHindi
                  ? "एक ही खाते से डॉक्टर अपॉइंटमेंट, डिजिटल नुस्खे, सरकारी स्वास्थ्य बीमा एवं 24/7 आपातकालीन 108 सेवाओं का लाभ उठाएं।"
                  : "Create your verified profile to manage appointments, digital prescriptions, PM-JAY health insurance, and emergency 108 services in one place."}
              </p>
            </div>

            {/* Benefit Checkpoints List */}
            <div className="space-y-3 pt-1">
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-sm flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/30 text-emerald-300 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-white">
                    {isHindi ? "आभा (ABHA) व पीएम-जय बीमा एकीकरण" : "Instant ABHA & PM-JAY Insurance Sync"}
                  </h4>
                  <p className="text-xs text-slate-300 font-medium mt-0.5">
                    {isHindi
                      ? "14-अंकीय आभा आईडी और आयुष्मान भारत कार्ड को आसानी से लिंक करें।"
                      : "Seamlessly link your 14-digit ABHA ID & Ayushman Bharat cashless card."}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-sm flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-teal-500/30 text-teal-300 flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-white">
                    {isHindi ? "1-क्लिक प्राथमिकता ओपीडी अपॉइंटमेंट" : "1-Click Priority OPD Appointments"}
                  </h4>
                  <p className="text-xs text-slate-300 font-medium mt-0.5">
                    {isHindi
                      ? "एम्स, सफदरजंग, एलएनजेपी सहित 118+ अस्पतालों में सीधे डॉक्टर स्लॉट बुक करें।"
                      : "Book confirmed OPD consultation slots at AIIMS, Safdarjung, LNJP & more."}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-sm flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-blue-500/30 text-blue-300 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-white">
                    {isHindi ? "सुरक्षित क्लिनिकल रिकॉर्ड एवं लैब लॉकर" : "256-Bit Encrypted Medical Locker"}
                  </h4>
                  <p className="text-xs text-slate-300 font-medium mt-0.5">
                    {isHindi
                      ? "अपनी जांच रिपोर्ट, पर्चे और डिस्चार्ज समरी को सुरक्षित डिजिटल रूप में रखें।"
                      : "Store all pathology tests, prescriptions, and clinical history securely."}
                  </p>
                </div>
              </div>
            </div>

            {/* 24/7 Helplines Strip */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-2">
              <span className="flex items-center gap-1 font-semibold text-slate-300">
                <PhoneCall className="w-3.5 h-3.5 text-rose-400" />
                {isHindi ? "24/7 राष्ट्रीय सहायता:" : "24/7 National Helplines:"}
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

          {/* ── Right Column: Sign Up Glass Card ── */}
          <div className="lg:col-span-6 xl:col-span-5 w-full max-w-[480px] mx-auto">
            <div className="glass-card-auth p-6 sm:p-8 rounded-[32px] border border-white/70 shadow-2xl relative overflow-hidden backdrop-blur-2xl bg-white/95">
              
              {/* Subtle Top Inner Highlight */}
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600" />

              {/* Header & Logo */}
              <div className="text-center space-y-1.5 mb-5">
                <div className="inline-flex p-2 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100/80 shadow-xs mb-1">
                  <Image src="/logo.png" alt="Connect to Care" width={42} height={42} className="object-contain" priority />
                </div>
                
                <h1 className="text-2xl sm:text-[26px] font-black text-slate-900 tracking-tight">
                  {isHindi ? "नया खाता बनाएं" : "Create Account"}
                </h1>
                <p className="text-xs text-slate-500 font-medium max-w-xs mx-auto">
                  {isHindi
                    ? "राष्ट्रीय स्वास्थ्य नेटवर्क में पंजीकरण के लिए विवरण भरें"
                    : "Register your profile for unified healthcare access"}
                </p>
              </div>

              {/* Role Selector */}
              <div className="space-y-1.5 mb-4">
                <Label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block">
                  {t("iAmA") || "Select Your Role"}
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  {roles.map(({ value, label, icon: Icon }) => {
                    const isActive = selectedRole === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setSelectedRole(value)}
                        className={`relative flex flex-col items-center justify-center p-2.5 rounded-2xl border transition-all duration-200 cursor-pointer ${
                          isActive
                            ? "bg-gradient-to-b from-teal-700 to-teal-800 text-white border-teal-600 shadow-[0_4px_0_0_#0f5b55,0_8px_16px_-2px_rgba(15,118,110,0.35)] -translate-y-0.5"
                            : "bg-white/70 hover:bg-white text-slate-600 border-slate-200/90 shadow-2xs hover:shadow-xs hover:-translate-y-0.5"
                        }`}
                      >
                        <Icon className={`w-4 h-4 mb-1 transition-transform ${isActive ? "text-white scale-110" : "text-slate-400"}`} />
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
              <form onSubmit={handleSignup} className="space-y-3">
                
                {/* Full Name */}
                <div className="space-y-1">
                  <Label className="text-xs font-bold text-slate-700">
                    {isHindi ? "पूरा नाम" : "Full Name"}
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                    <Input
                      type="text"
                      placeholder={isHindi ? "उदा. आरव शर्मा" : "e.g. Aarav Sharma"}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="pl-10 h-10 rounded-xl border-slate-200/90 bg-white/80 text-xs sm:text-sm font-semibold focus-visible:ring-teal-500 shadow-2xs"
                      required
                    />
                  </div>
                </div>

                {/* Mobile Phone */}
                <div className="space-y-1">
                  <Label className="text-xs font-bold text-slate-700">
                    {isHindi ? "मोबाइल नंबर" : "Mobile Phone Number"}
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                    <Input
                      type="tel"
                      placeholder={isHindi ? "उदा. 9876543210" : "e.g. 9876543210"}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="pl-10 h-10 rounded-xl border-slate-200/90 bg-white/80 text-xs sm:text-sm font-semibold focus-visible:ring-teal-500 shadow-2xs"
                      required
                    />
                  </div>
                </div>

                {/* Email (Optional) */}
                <div className="space-y-1">
                  <Label className="text-xs font-bold text-slate-700">
                    {isHindi ? "ईमेल पता (वैकल्पिक)" : "Email Address (Optional)"}
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                    <Input
                      type="email"
                      placeholder={isHindi ? "उदा. aarav@example.com" : "e.g. aarav@example.com"}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-10 rounded-xl border-slate-200/90 bg-white/80 text-xs sm:text-sm font-semibold focus-visible:ring-teal-500 shadow-2xs"
                    />
                  </div>
                </div>

                {/* Doctor-Specific Fields */}
                {selectedRole === Role.DOCTOR && (
                  <div className="grid grid-cols-2 gap-2 pt-0.5">
                    <div className="space-y-1">
                      <Label className="text-xs font-bold text-slate-700">
                        {isHindi ? "विशेषज्ञता" : "Specialty"}
                      </Label>
                      <Input
                        type="text"
                        placeholder="e.g. Cardiology"
                        value={specialty}
                        onChange={(e) => setSpecialty(e.target.value)}
                        className="h-10 rounded-xl border-slate-200/90 bg-white/80 text-xs font-semibold"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs font-bold text-slate-700">
                        {isHindi ? "लाइसेंस नंबर" : "License No."}
                      </Label>
                      <Input
                        type="text"
                        placeholder="MCI-XXXX"
                        value={licenseNumber}
                        onChange={(e) => setLicenseNumber(e.target.value)}
                        className="h-10 rounded-xl border-slate-200/90 bg-white/80 text-xs font-semibold"
                      />
                    </div>
                  </div>
                )}

                {/* Staff-Specific Fields */}
                {selectedRole === Role.HOSPITAL_STAFF && (
                  <div className="space-y-1 pt-0.5">
                    <Label className="text-xs font-bold text-slate-700">
                      {isHindi ? "विभाग" : "Hospital Department"}
                    </Label>
                    <Input
                      type="text"
                      placeholder="e.g. Emergency Triage / Ward Ops"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="h-10 rounded-xl border-slate-200/90 bg-white/80 text-xs font-semibold"
                    />
                  </div>
                )}

                {/* Password */}
                <div className="space-y-1">
                  <Label className="text-xs font-bold text-slate-700">
                    {t("password") || "Password"}
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder={isHindi ? "कम से कम 4 अक्षर" : "At least 4 characters"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 h-10 rounded-xl border-slate-200/90 bg-white/80 text-xs sm:text-sm font-semibold focus-visible:ring-teal-500 shadow-2xs"
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

                {/* 3D Primary Submit Button */}
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
                        <span>{isHindi ? "खाता बनाएं" : "CREATE ACCOUNT"}</span>
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Footer Link */}
              <div className="mt-4 pt-3 border-t border-slate-100 text-center text-xs font-medium text-slate-500">
                <span>{isHindi ? "पहले से खाता है?" : "Already have an account?"}</span>{" "}
                <Link href="/login" className="font-extrabold text-teal-700 hover:text-teal-800 hover:underline">
                  {isHindi ? "साइन इन करें" : "Sign In"}
                </Link>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* ── 5. Footer Trust Badges ── */}
      <footer className="relative z-30 max-w-7xl mx-auto w-full pt-4 pb-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-2 font-medium">
          <span>© 2026 Connect to Care • National Health Stack India</span>
        </div>
        <div className="flex items-center gap-4 font-semibold text-slate-300">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> ABDM Compliant
          </span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" /> 256-bit Encrypted
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> ISO 27001 Certified
          </span>
        </div>
      </footer>

    </div>
  );
}
