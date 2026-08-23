"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { Role } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Users, Stethoscope, Building2, Mail, Lock, Eye, EyeOff,
  ArrowRight, Shield
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const { login, language, setLanguage, t } = useStore();
  const [selectedRole, setSelectedRole] = useState<Role>(Role.PATIENT);
  const [emailOrMobile, setEmailOrMobile] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login({
      id: "1",
      name: selectedRole === Role.DOCTOR ? "Dr. Rajesh Kumar" : selectedRole === Role.HOSPITAL_STAFF ? "Sunita Sharma (Nurse)" : "Citizen Demo",
      email: emailOrMobile || "demo@example.com",
      role: selectedRole,
      phone: emailOrMobile || "9876543210",
      specialty: selectedRole === Role.DOCTOR ? "General Medicine" : undefined,
    });
    router.push("/");
  };

  const roles = [
    { value: Role.PATIENT, label: t("patientRole"), icon: Users },
    { value: Role.DOCTOR, label: t("doctorRole"), icon: Stethoscope },
    { value: Role.HOSPITAL_STAFF, label: t("staffRole"), icon: Building2 },
  ] as const;

  return (
    <div className="min-h-screen bg-[#f8f8fa] flex font-sans relative">

      {/* Top Floating Language Switcher */}
      <div className="absolute top-6 right-6 z-30 flex items-center bg-white/90 backdrop-blur-md p-1 rounded-2xl border border-slate-200 shadow-sm">
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

          {/* Flat vector hospital illustration */}
          <div className="pt-4">
            <svg viewBox="0 0 520 220" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[480px] opacity-90">
              <rect x="0" y="195" width="520" height="25" rx="6" fill="#f1f5f9" />
              <rect x="140" y="60" width="180" height="135" rx="4" fill="#e2e8f0" />
              <rect x="145" y="65" width="170" height="125" rx="3" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
              <rect x="218" y="78" width="24" height="8" rx="2" fill="#0d9488" opacity="0.7" />
              <rect x="226" y="70" width="8" height="24" rx="2" fill="#0d9488" opacity="0.7" />
              <rect x="160" y="105" width="22" height="22" rx="3" fill="#e0f2fe" stroke="#bae6fd" strokeWidth="0.5" />
              <rect x="195" y="105" width="22" height="22" rx="3" fill="#e0f2fe" stroke="#bae6fd" strokeWidth="0.5" />
              <rect x="245" y="105" width="22" height="22" rx="3" fill="#e0f2fe" stroke="#bae6fd" strokeWidth="0.5" />
              <rect x="280" y="105" width="22" height="22" rx="3" fill="#e0f2fe" stroke="#bae6fd" strokeWidth="0.5" />
              <rect x="160" y="140" width="22" height="22" rx="3" fill="#e0f2fe" stroke="#bae6fd" strokeWidth="0.5" />
              <rect x="280" y="140" width="22" height="22" rx="3" fill="#e0f2fe" stroke="#bae6fd" strokeWidth="0.5" />
              <rect x="210" y="145" width="40" height="45" rx="2" fill="#0d9488" opacity="0.85" />
              <rect x="215" y="150" width="13" height="35" rx="1" fill="#ccfbf1" opacity="0.6" />
              <rect x="232" y="150" width="13" height="35" rx="1" fill="#ccfbf1" opacity="0.6" />
              <rect x="50" y="100" width="90" height="95" rx="4" fill="#cbd5e1" opacity="0.6" />
              <rect x="55" y="105" width="80" height="85" rx="3" fill="#f1f5f9" />
              <rect x="70" y="125" width="18" height="18" rx="2" fill="#e0f2fe" />
              <rect x="100" y="125" width="18" height="18" rx="2" fill="#e0f2fe" />
              <rect x="70" y="155" width="18" height="18" rx="2" fill="#e0f2fe" />
              <rect x="100" y="155" width="18" height="18" rx="2" fill="#e0f2fe" />
              <rect x="320" y="110" width="100" height="85" rx="4" fill="#cbd5e1" opacity="0.6" />
              <rect x="325" y="115" width="90" height="75" rx="3" fill="#f1f5f9" />
              <rect x="345" y="130" width="18" height="18" rx="2" fill="#e0f2fe" />
              <rect x="380" y="130" width="18" height="18" rx="2" fill="#e0f2fe" />
              <rect x="365" y="155" width="25" height="35" rx="2" fill="#94a3b8" opacity="0.5" />
              <rect x="390" y="160" width="60" height="35" rx="4" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
              <rect x="428" y="167" width="20" height="18" rx="2" fill="#e0f2fe" />
              <circle cx="403" cy="195" r="5" fill="#475569" />
              <circle cx="437" cy="195" r="5" fill="#475569" />
              <rect x="408" y="172" width="10" height="3" rx="0.5" fill="#ef4444" />
              <rect x="411.5" y="168.5" width="3" height="10" rx="0.5" fill="#ef4444" />
              <circle cx="28" cy="175" r="14" fill="#a7f3d0" opacity="0.7" />
              <rect x="26" y="178" width="4" height="18" rx="2" fill="#94a3b8" />
              <circle cx="490" cy="178" r="11" fill="#a7f3d0" opacity="0.7" />
              <rect x="488" y="180" width="4" height="16" rx="2" fill="#94a3b8" />
            </svg>
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
                      onClick={() => setSelectedRole(value)}
                      className={`
                        relative flex flex-col items-center gap-2 py-3.5 px-2.5 rounded-2xl
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
                  className="pl-11 h-12 rounded-xl border-[#e2e8f0] bg-[#f8f8fa] text-[14px] text-[#1a1f36] placeholder:text-[#94a3b8] focus-visible:ring-2 focus-visible:ring-[#1e3a5f]/20 focus-visible:border-[#1e3a5f] transition-colors"
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
                <a href="#" className="text-[12px] font-bold text-[#0d9488] hover:text-[#0f766e] transition-colors">
                  {t("forgotPassword")}
                </a>
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
              className="w-full h-12 rounded-xl bg-[#1e3a5f] hover:bg-[#162d4a] text-white font-bold text-[14px] shadow-sm hover:shadow-md transition-all duration-200 group"
            >
              {t("continueBtn")}
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
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
