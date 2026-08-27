"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { Role, AuthUser } from "@/lib/types";
import { apiPost } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Users, Stethoscope, Building2, Mail, Lock, Eye, EyeOff, ArrowRight, Shield, Siren, Loader2 } from "lucide-react";
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
    { value: Role.PATIENT, label: t("patientRole"), icon: Users },
    { value: Role.DOCTOR, label: t("doctorRole"), icon: Stethoscope },
    { value: Role.HOSPITAL_STAFF, label: t("staffRole"), icon: Building2 },
  ] as const;

  return (
    <div className="min-h-screen bg-[#f8f8fa] flex font-sans relative">
      <div className="absolute top-5 right-5 sm:top-6 sm:right-6 z-30 flex items-center gap-3">
        <Link href="/emergency"><Button type="button" className="h-9 sm:h-10 px-3.5 sm:px-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-md shadow-red-600/25 gap-2 transition-all hover:scale-105 border border-red-500"><Siren className="w-4 h-4 animate-pulse text-white" /><span>{language === "hi" ? "आपातकालीन 108" : "Emergency 108"}</span></Button></Link>
        <div className="flex items-center bg-white/90 backdrop-blur-md p-1 rounded-2xl border border-slate-200 shadow-sm">
          <button type="button" onClick={() => setLanguage("en")} className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${language === "en" ? "bg-[#1e3a5f] text-white shadow-xs" : "text-slate-500 hover:text-slate-800"}`}>English</button>
          <button type="button" onClick={() => setLanguage("hi")} className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${language === "hi" ? "bg-[#0d9488] text-white shadow-xs" : "text-slate-500 hover:text-slate-800"}`}>हिंदी</button>
        </div>
      </div>
      <div className="hidden lg:flex lg:w-[52%] flex-col justify-between p-12 xl:p-16 relative overflow-hidden animate-in fade-in duration-700">
        <Image src="/login-bg.jpg" alt="Healthcare consultation" fill priority className="object-cover object-center scale-105 transition-transform duration-1000 ease-out" />
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/95 via-teal-950/85 to-slate-900/75 backdrop-blur-[2px]" />
        <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-teal-500/20 rounded-full blur-3xl pointer-events-none -translate-y-1/4 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/15 rounded-full blur-3xl pointer-events-none translate-y-1/4 -translate-x-1/4" />
        <div className="relative z-10"><div className="flex items-center gap-3.5"><div className="w-12 h-12 rounded-2xl overflow-hidden bg-white/95 backdrop-blur-sm shadow-md border border-white/20 p-1.5 flex items-center justify-center"><Image src="/logo.png" alt="Sehat Saathi" width={44} height={44} className="object-contain" priority /></div><div><h1 className="text-[22px] font-bold tracking-tight text-white">{t("brandName")}</h1><p className="text-[11px] font-bold text-teal-300 tracking-wide">{t("tagline")}</p></div></div></div>
        <div className="relative z-10 space-y-6 max-w-lg"><h2 className="text-[36px] xl:text-[42px] font-extrabold text-white leading-[1.15] tracking-tight">{t("heroHeadline")} <span className="text-teal-300">{t("heroHeadlineAccent")}</span></h2><p className="text-[15px] xl:text-[16px] text-slate-200 leading-relaxed max-w-md">{t("heroSubtext")}</p><div className="p-4 bg-slate-900/60 backdrop-blur-md rounded-2xl border border-white/15 shadow-lg space-y-2.5"><div className="flex items-center gap-2 text-xs font-bold text-teal-300"><Shield className="w-4 h-4 text-teal-400" /><span>SIH Interconnected Demo Credentials (Select role):</span></div><div className="text-[11px] text-slate-200 grid grid-cols-3 gap-2"><div className="bg-white/10 p-2 rounded-xl border border-white/10"><p className="font-bold text-white">Dr. Priya</p><p className="font-mono text-[10px] text-teal-200">9876500002</p></div><div className="bg-white/10 p-2 rounded-xl border border-white/10"><p className="font-bold text-white">Neha (Staff)</p><p className="font-mono text-[10px] text-teal-200">9876500003</p></div><div className="bg-white/10 p-2 rounded-xl border border-white/10"><p className="font-bold text-white">Aarav (Patient)</p><p className="font-mono text-[10px] text-teal-200">9876500001</p></div></div><p className="text-[10px] text-slate-400 font-medium text-center">Password: <span className="font-mono font-bold text-white">Demo@1234</span></p></div></div>
        <div className="relative z-10 flex items-center gap-2.5 text-[12px] text-slate-300 font-medium"><Shield className="w-4 h-4 text-teal-400" /><span>{t("trustBadgeText")}</span></div>
      </div>
      <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-12 bg-white lg:border-l border-[#eef0f4] animate-in fade-in slide-in-from-bottom-3 duration-500"><div className="w-full max-w-[420px] space-y-8">
        <div className="flex items-center gap-3 lg:hidden"><div className="w-10 h-10 rounded-xl overflow-hidden bg-[#f8f8fa] border border-slate-100 p-1 flex items-center justify-center"><Image src="/logo.png" alt="Sehat Saathi" width={36} height={36} className="object-contain" priority /></div><span className="text-lg font-bold text-[#1a1f36] tracking-tight">{t("brandName")}</span></div>
        <div className="space-y-2"><h2 className="text-[26px] sm:text-[28px] font-black text-[#1a1f36] tracking-tight">{t("signInTitle")}</h2><p className="text-[14px] sm:text-[15px] text-[#64748b] font-medium">{t("signInSub")}</p></div>
        <form onSubmit={handleLogin} className="space-y-6"><div className="space-y-2.5"><Label className="text-[12px] font-bold text-[#475569] uppercase tracking-wider">{t("iAmA")}</Label><div className="grid grid-cols-3 gap-2.5">{roles.map(({ value, label, icon: Icon }) => { const isActive = selectedRole === value; return <button key={value} type="button" onClick={() => handleRoleSelect(value)} className={`relative flex flex-col items-center gap-2 py-3 px-2 rounded-2xl border transition-all duration-200 cursor-pointer ${isActive ? "border-[#1e3a5f] bg-[#1e3a5f] text-white shadow-md shadow-[#1e3a5f]/15" : "border-[#e2e8f0] bg-white text-[#64748b] hover:border-[#cbd5e1] hover:bg-[#f8fafc]"}`}><Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-[#94a3b8]"}`} /><span className={`text-[12px] font-bold ${isActive ? "text-white" : "text-[#475569]"}`}>{label}</span></button>; })}</div></div>
        <div className="space-y-2"><Label className="text-[13px] font-bold text-[#475569]">{t("emailOrMobile")}</Label><div className="relative"><Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-[#94a3b8]" /><Input type="text" placeholder={language === "hi" ? "मोबाइल नंबर या ईमेल दर्ज करें" : "you@example.com / 9876543210"} value={emailOrMobile} onChange={(e) => setEmailOrMobile(e.target.value)} className="pl-11 h-12 rounded-xl border-[#e2e8f0] bg-[#f8f8fa] text-[14px] text-[#1a1f36] placeholder:text-[#94a3b8] focus-visible:ring-2 focus-visible:ring-[#1e3a5f]/20 focus-visible:border-[#1e3a5f] transition-colors font-medium" required /></div></div>
        <div className="space-y-2"><div className="flex items-center justify-between"><Label className="text-[13px] font-bold text-[#475569]">{t("password")}</Label></div><div className="relative"><Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-[#94a3b8]" /><Input type={showPassword ? "text" : "password"} placeholder={language === "hi" ? "पासवर्ड दर्ज करें" : "Enter your password"} value={password} onChange={(e) => setPassword(e.target.value)} className="pl-11 pr-11 h-12 rounded-xl border-[#e2e8f0] bg-[#f8f8fa] text-[14px] text-[#1a1f36] placeholder:text-[#94a3b8] focus-visible:ring-2 focus-visible:ring-[#1e3a5f]/20 focus-visible:border-[#1e3a5f] transition-colors" required /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#475569]"><Eye className="w-5 h-5" /></button></div></div>
        <Button type="submit" disabled={loading} className="w-full h-12 rounded-xl bg-[#1e3a5f] hover:bg-[#162d4a] text-white font-bold text-[14px] shadow-md shadow-[#1e3a5f]/15 transition-all hover:-translate-y-0.5">{loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><span>{t("signInButton")}</span><ArrowRight className="w-4 h-4 ml-2" /></>}</Button>
        </form>
        <p className="text-center text-[12px] text-[#94a3b8]">{t("noAccount")} <Link href="/signup" className="font-bold text-[#1e3a5f] hover:underline">{t("createAccount")}</Link></p>
      </div></div>
    </div>
  );
}