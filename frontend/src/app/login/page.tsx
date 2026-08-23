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

export default function LoginPage() {
  const router = useRouter();
  const { login } = useStore();
  const [selectedRole, setSelectedRole] = useState<Role>(Role.PATIENT);
  const [emailOrMobile, setEmailOrMobile] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login({
      id: "1",
      name: "Citizen Demo",
      email: emailOrMobile || "demo@example.com",
      role: selectedRole,
      phone: emailOrMobile || "9876543210",
    });
    router.push("/");
  };

  const roles = [
    { value: Role.PATIENT, label: "Patient", icon: Users },
    { value: Role.DOCTOR, label: "Doctor", icon: Stethoscope },
    { value: Role.HOSPITAL_STAFF, label: "Staff", icon: Building2 },
  ] as const;

  return (
    <div className="min-h-screen bg-[#f8f8fa] flex font-sans">

      {/* ── Left Panel: Brand & Illustration ── */}
      <div className="hidden lg:flex lg:w-[52%] flex-col justify-between p-12 xl:p-16 relative overflow-hidden">

        {/* Soft decorative gradient blobs — very subtle, no flashy effects */}
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
                Sehat <span className="text-[#0d9488]">Saathi</span>
              </h1>
              <p className="text-[11px] font-medium text-[#0d9488] tracking-wide">
                Saath Aapka, Sehat Hamari
              </p>
            </div>
          </div>
        </div>

        {/* Middle: Headline + Sub */}
        <div className="relative z-10 space-y-6 max-w-lg">
          <h2 className="text-[42px] font-extrabold text-[#1a1f36] leading-[1.1] tracking-tight">
            Smarter healthcare,{" "}
            <span className="text-[#1e3a5f]">accessible to everyone.</span>
          </h2>
          <p className="text-[17px] text-[#64748b] leading-relaxed max-w-md">
            One platform connecting patients, doctors, and hospitals — powered
            by AI for a healthier India.
          </p>

          {/* Flat vector hospital illustration */}
          <div className="pt-4">
            <svg viewBox="0 0 520 220" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[480px] opacity-90">
              {/* Ground */}
              <rect x="0" y="195" width="520" height="25" rx="6" fill="#f1f5f9" />

              {/* Main Hospital Building */}
              <rect x="140" y="60" width="180" height="135" rx="4" fill="#e2e8f0" />
              <rect x="145" y="65" width="170" height="125" rx="3" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
              {/* Hospital cross */}
              <rect x="218" y="78" width="24" height="8" rx="2" fill="#0d9488" opacity="0.7" />
              <rect x="226" y="70" width="8" height="24" rx="2" fill="#0d9488" opacity="0.7" />
              {/* Windows row 1 */}
              <rect x="160" y="105" width="22" height="22" rx="3" fill="#e0f2fe" stroke="#bae6fd" strokeWidth="0.5" />
              <rect x="192" y="105" width="22" height="22" rx="3" fill="#e0f2fe" stroke="#bae6fd" strokeWidth="0.5" />
              <rect x="248" y="105" width="22" height="22" rx="3" fill="#e0f2fe" stroke="#bae6fd" strokeWidth="0.5" />
              <rect x="280" y="105" width="22" height="22" rx="3" fill="#e0f2fe" stroke="#bae6fd" strokeWidth="0.5" />
              {/* Windows row 2 */}
              <rect x="160" y="140" width="22" height="22" rx="3" fill="#e0f2fe" stroke="#bae6fd" strokeWidth="0.5" />
              <rect x="192" y="140" width="22" height="22" rx="3" fill="#e0f2fe" stroke="#bae6fd" strokeWidth="0.5" />
              <rect x="248" y="140" width="22" height="22" rx="3" fill="#e0f2fe" stroke="#bae6fd" strokeWidth="0.5" />
              <rect x="280" y="140" width="22" height="22" rx="3" fill="#e0f2fe" stroke="#bae6fd" strokeWidth="0.5" />
              {/* Door */}
              <rect x="215" y="163" width="30" height="32" rx="3" fill="#1e3a5f" opacity="0.15" />
              <rect x="218" y="166" width="24" height="26" rx="2" fill="#1e3a5f" opacity="0.08" />

              {/* Left Wing */}
              <rect x="50" y="110" width="90" height="85" rx="3" fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="1" />
              <rect x="62" y="125" width="16" height="16" rx="2" fill="#e0f2fe" stroke="#bae6fd" strokeWidth="0.5" />
              <rect x="86" y="125" width="16" height="16" rx="2" fill="#e0f2fe" stroke="#bae6fd" strokeWidth="0.5" />
              <rect x="110" y="125" width="16" height="16" rx="2" fill="#e0f2fe" stroke="#bae6fd" strokeWidth="0.5" />
              <rect x="62" y="155" width="16" height="16" rx="2" fill="#e0f2fe" stroke="#bae6fd" strokeWidth="0.5" />
              <rect x="86" y="155" width="16" height="16" rx="2" fill="#e0f2fe" stroke="#bae6fd" strokeWidth="0.5" />
              <rect x="110" y="155" width="16" height="16" rx="2" fill="#e0f2fe" stroke="#bae6fd" strokeWidth="0.5" />

              {/* Right Wing */}
              <rect x="320" y="110" width="90" height="85" rx="3" fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="1" />
              <rect x="332" y="125" width="16" height="16" rx="2" fill="#e0f2fe" stroke="#bae6fd" strokeWidth="0.5" />
              <rect x="356" y="125" width="16" height="16" rx="2" fill="#e0f2fe" stroke="#bae6fd" strokeWidth="0.5" />
              <rect x="380" y="125" width="16" height="16" rx="2" fill="#e0f2fe" stroke="#bae6fd" strokeWidth="0.5" />
              <rect x="332" y="155" width="16" height="16" rx="2" fill="#e0f2fe" stroke="#bae6fd" strokeWidth="0.5" />
              <rect x="356" y="155" width="16" height="16" rx="2" fill="#e0f2fe" stroke="#bae6fd" strokeWidth="0.5" />
              <rect x="380" y="155" width="16" height="16" rx="2" fill="#e0f2fe" stroke="#bae6fd" strokeWidth="0.5" />

              {/* Trees */}
              <rect x="22" y="165" width="6" height="30" rx="3" fill="#a3b899" opacity="0.5" />
              <circle cx="25" cy="155" r="14" fill="#0d9488" opacity="0.15" />
              <circle cx="25" cy="148" r="10" fill="#0d9488" opacity="0.12" />
              <rect x="438" y="168" width="5" height="27" rx="2.5" fill="#a3b899" opacity="0.5" />
              <circle cx="440" cy="158" r="12" fill="#0d9488" opacity="0.15" />
              <circle cx="440" cy="152" r="8" fill="#0d9488" opacity="0.12" />
              <rect x="475" y="172" width="4" height="23" rx="2" fill="#a3b899" opacity="0.4" />
              <circle cx="477" cy="164" r="10" fill="#0d9488" opacity="0.12" />

              {/* Ambulance */}
              <rect x="420" y="178" width="42" height="17" rx="3" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="0.8" />
              <rect x="425" y="174" width="22" height="8" rx="2" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="0.5" />
              <rect x="432" y="176" width="6" height="2" rx="1" fill="#ef4444" opacity="0.5" />
              <rect x="434" y="175" width="2" height="4" rx="0.5" fill="#ef4444" opacity="0.5" />
              <circle cx="428" cy="197" r="4" fill="#e2e8f0" />
              <circle cx="428" cy="197" r="2" fill="#cbd5e1" />
              <circle cx="454" cy="197" r="4" fill="#e2e8f0" />
              <circle cx="454" cy="197" r="2" fill="#cbd5e1" />
            </svg>
          </div>
        </div>

        {/* Bottom: Trust line */}
        <div className="relative z-10 flex items-center gap-3 text-[13px] text-[#94a3b8] font-medium">
          <Shield className="w-4 h-4 text-[#94a3b8]" />
          <span>ABDM Compliant · End-to-End Encrypted · HIPAA Ready</span>
        </div>
      </div>

      {/* ── Right Panel: Login Form ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-12 bg-white lg:border-l border-[#eef0f4]">
        <div className="w-full max-w-[400px] space-y-10">

          {/* Mobile-only logo */}
          <div className="flex items-center gap-3 lg:hidden">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#f8f8fa] border border-slate-100 p-1 flex items-center justify-center">
              <Image src="/logo.png" alt="Sehat Saathi" width={36} height={36} className="object-contain" priority />
            </div>
            <span className="text-lg font-bold text-[#1a1f36] tracking-tight">
              Sehat <span className="text-[#0d9488]">Saathi</span>
            </span>
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h2 className="text-[28px] font-bold text-[#1a1f36] tracking-tight">
              Sign in to your account
            </h2>
            <p className="text-[15px] text-[#64748b]">
              Select your role and enter your credentials to continue.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-7">

            {/* Role Selector — pill-style segmented control */}
            <div className="space-y-3">
              <Label className="text-[13px] font-semibold text-[#475569] uppercase tracking-wider">
                I am a
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
                        relative flex flex-col items-center gap-2 py-4 px-3 rounded-2xl
                        border transition-all duration-200 cursor-pointer
                        ${isActive
                          ? "border-[#1e3a5f] bg-[#1e3a5f] text-white shadow-md shadow-[#1e3a5f]/15"
                          : "border-[#e2e8f0] bg-white text-[#64748b] hover:border-[#cbd5e1] hover:bg-[#f8fafc]"
                        }
                      `}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-[#94a3b8]"}`} />
                      <span className={`text-[13px] font-semibold ${isActive ? "text-white" : "text-[#475569]"}`}>
                        {label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Email / Mobile */}
            <div className="space-y-2">
              <Label className="text-[13px] font-semibold text-[#475569]">
                Email or Mobile Number
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-[#94a3b8]" />
                <Input
                  type="text"
                  placeholder="you@example.com"
                  value={emailOrMobile}
                  onChange={(e) => setEmailOrMobile(e.target.value)}
                  className="pl-11 h-12 rounded-xl border-[#e2e8f0] bg-[#f8f8fa] text-[15px] text-[#1a1f36] placeholder:text-[#94a3b8] focus-visible:ring-2 focus-visible:ring-[#1e3a5f]/20 focus-visible:border-[#1e3a5f] transition-colors"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-[13px] font-semibold text-[#475569]">
                  Password
                </Label>
                <a href="#" className="text-[13px] font-semibold text-[#0d9488] hover:text-[#0f766e] transition-colors">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-[#94a3b8]" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-11 pr-11 h-12 rounded-xl border-[#e2e8f0] bg-[#f8f8fa] text-[15px] text-[#1a1f36] placeholder:text-[#94a3b8] focus-visible:ring-2 focus-visible:ring-[#1e3a5f]/20 focus-visible:border-[#1e3a5f] transition-colors"
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
              className="w-full h-12 rounded-xl bg-[#1e3a5f] hover:bg-[#162d4a] text-white font-semibold text-[15px] shadow-sm hover:shadow-md transition-all duration-200 group"
            >
              Continue
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#e2e8f0]" />
              </div>
              <div className="relative flex justify-center text-[13px]">
                <span className="bg-white px-4 text-[#94a3b8] font-medium">or</span>
              </div>
            </div>

            {/* Register Link */}
            <p className="text-center text-[14px] text-[#64748b]">
              Don&apos;t have an account?{" "}
              <a href="/signup" className="font-semibold text-[#0d9488] hover:text-[#0f766e] transition-colors">
                Create one
              </a>
            </p>
          </form>

          {/* Mobile trust badge */}
          <div className="flex items-center justify-center gap-2 text-[12px] text-[#94a3b8] font-medium lg:hidden pt-4">
            <Shield className="w-3.5 h-3.5" />
            <span>ABDM Compliant · Encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
}
