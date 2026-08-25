"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { Role, AuthUser } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Users, Stethoscope, Building2, Mail, Lock, Eye, EyeOff,
  ArrowRight, Shield, Siren, Loader2
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

  // Quick Demo Auto-fill Helper for SIH Presentation
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
      const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emailOrMobile: emailOrMobile.trim(),
          password,
          role: selectedRole,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Login failed. Please check your credentials.");
        setLoading(false);
        return;
      }

      // Successful DB authentication
      const user: AuthUser = {
        id: data.user.userId,
        name: data.user.name,
        role: data.user.role as Role, // From database authority
        phone: data.user.phone,
        email: data.user.email || `${data.user.phone}@sehatsaathi.in`,
        patientId: data.user.patientId,
        doctorId: data.user.doctorId,
        staffId: data.user.staffId,
        facilityId: data.user.facilityId,
        specialty: data.user.role === Role.DOCTOR ? "Cardiology" : undefined,
      };

      login(user, data.token);
      toast.success(language === "hi" ? `स्वागत है, ${user.name}!` : `Welcome, ${user.name}!`);
      router.push("/");
    } catch (err) {
      console.error("Login network error:", err);
      // Fallback for offline presentation if server unreachable
      login({
        id: "demo-user",
        name: selectedRole === Role.DOCTOR ? "Dr. Priya Mehta" : selectedRole === Role.HOSPITAL_STAFF ? "Neha Kapoor" : "Aarav Sharma",
        email: emailOrMobile || "patient.demo@sehatsaathi.test",
        role: selectedRole,
        phone: emailOrMobile || "9876500001",
        specialty: selectedRole === Role.DOCTOR ? "General Medicine" : undefined,
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
    <div className="min-h-screen bg-[#f8f8fa] flex font-sans relative">

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

      {/* ── Left Panel: Brand & Illustration ── */}
      <div className="hidden lg:flex lg:w-[52%] flex-col justify-between p-12 xl:p-16 relative overflow-hidden">

        {/* Soft decorative gradient blobs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-[#e8f4f8] to-transparent rounded-full blur-3xl opacity-60 -translate-y-1/4 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-[#eef0fb] to-transparent rounded-full blur-3xl opacity-50 translate-y-1/4 -translate-x-1/4" />

        {/* Top: Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl overflow-hidden bg-white shadow-sm border border-slate-100 p-1.5 flex items-center justify-center">
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
              <h1 className="text-[22px] font-bold tracking-tight text-[#1a1f36]">
                {t("brandName")}
              </h1>
              <p className="text-[11px] font-bold text-[#0d9488] tracking-wide">
                {t("tagline")}
              </p>
            </div>
          </div>
        </div>

        {/* Middle: Headline + Sub */}
        <div className="relative z-10 space-y-6 max-w-lg">
          <h2 className="text-[38px] xl:text-[42px] font-extrabold text-[#1a1f36] leading-[1.15] tracking-tight">
            {t("heroHeadline")}{" "}
            <span className="text-[#1e3a5f]">{t("heroHeadlineAccent")}</span>
          </h2>
          <p className="text-[16px] xl:text-[17px] text-[#64748b] leading-relaxed max-w-md">
            {t("heroSubtext")}
          </p>

          {/* Quick Demo Info Pill */}
          <div className="p-4 bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <Shield className="w-4 h-4 text-teal-600" />
              <span>SIH Interconnected Demo Credentials (Select role):</span>
            </div>
            <div className="text-[11px] text-slate-600 grid grid-cols-3 gap-2">
              <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                <p className="font-bold text-slate-900">Dr. Priya</p>
                <p className="font-mono text-[10px] text-slate-500">9876500002</p>
              </div>
              <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                <p className="font-bold text-slate-900">Neha (Staff)</p>
                <p className="font-mono text-[10px] text-slate-500">9876500003</p>
              </div>
              <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                <p className="font-bold text-slate-900">Aarav (Patient)</p>
                <p className="font-mono text-[10px] text-slate-500">9876500001</p>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 font-medium text-center">Password: <span className="font-mono font-bold text-slate-700">Demo@1234</span></p>
          </div>
        </div>

        {/* Bottom: Trust line */}
        <div className="relative z-10 flex items-center gap-3 text-[13px] text-[#94a3b8] font-medium">
          <Shield className="w-4 h-4 text-[#94a3b8]" />
          <span>{t("trustBadgeText")}</span>
        </div>
      </div>

      {/* ── Right Panel: Login Form ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-12 bg-white lg:border-l border-[#eef0f4]">
        <div className="w-full max-w-[420px] space-y-8">

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
          <div className="space-y-2">
            <h2 className="text-[26px] sm:text-[28px] font-black text-[#1a1f36] tracking-tight">
              {t("signInTitle")}
            </h2>
            <p className="text-[14px] sm:text-[15px] text-[#64748b] font-medium">
              {t("signInSub")}
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">

            {/* Role Selector — pill-style segmented control */}
            <div className="space-y-2.5">
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
                      onClick={() => handleRoleSelect(value)}
                      className={`
                        relative flex flex-col items-center gap-2 py-3 px-2 rounded-2xl
                        border transition-all duration-200 cursor-pointer
                        ${isActive
                          ? "border-[#1e3a5f] bg-[#1e3a5f] text-white shadow-md shadow-[#1e3a5f]/15"
                          : "border-[#e2e8f0] bg-white text-[#64748b] hover:border-[#cbd5e1] hover:bg-[#f8fafc]"
                        }
                      `}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-[#94a3b8]"}`} />
                      <span className={`text-[12px] font-bold ${isActive ? "text-white" : "text-[#475569]"}`}>
                        {label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Email / Mobile */}
            <div className="space-y-2">
              <Label className="text-[13px] font-bold text-[#475569]">
                {t("emailOrMobile")}
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-[#94a3b8]" />
                <Input
                  type="text"
                  placeholder={language === "hi" ? "मोबाइल नंबर या ईमेल दर्ज करें" : "you@example.com / 9876543210"}
                  value={emailOrMobile}
                  onChange={(e) => setEmailOrMobile(e.target.value)}
                  className="pl-11 h-12 rounded-xl border-[#e2e8f0] bg-[#f8f8fa] text-[14px] text-[#1a1f36] placeholder:text-[#94a3b8] focus-visible:ring-2 focus-visible:ring-[#1e3a5f]/20 focus-visible:border-[#1e3a5f] transition-colors font-medium"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-[13px] font-bold text-[#475569]">
                  {t("password")}
                </Label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-[#94a3b8]" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder={language === "hi" ? "पासवर्ड दर्ज करें" : "Enter your password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-11 pr-11 h-12 rounded-xl border-[#e2e8f0] bg-[#f8f8fa] text-[14px] text-[#1a1f36] placeholder:text-[#94a3b8] focus-visible:ring-2 focus-visible:ring-[#1e3a5f]/20 focus-visible:border-[#1e3a5f] transition-colors"
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

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-[#1e3a5f] hover:bg-[#162d4a] text-white font-bold text-[14px] shadow-sm hover:shadow-md transition-all duration-200 group gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>{t("continueBtn")}</span>
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#e2e8f0]" />
              </div>
              <div className="relative flex justify-center text-[13px]">
                <span className="bg-white px-4 text-[#94a3b8] font-bold">{t("orDivider")}</span>
              </div>
            </div>

            {/* Register Link */}
            <p className="text-center text-[13px] text-[#64748b] font-medium">
              {t("noAccount")}{" "}
              <Link href="/signup" className="font-bold text-[#0d9488] hover:text-[#0f766e] transition-colors">
                {t("createOne")}
              </Link>
            </p>
          </form>

          {/* Mobile trust badge */}
          <div className="flex items-center justify-center gap-2 text-[12px] text-[#94a3b8] font-medium lg:hidden pt-2">
            <Shield className="w-3.5 h-3.5" />
            <span>{t("trustBadgeText")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
