"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { Role } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Users, Stethoscope, Building2, Mail, Lock, Eye, ArrowRight,
  Heart, Shield, Cpu, User, Phone, Award
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

  // Role-Specific Optional Fields
  const [specialty, setSpecialty] = useState("");
  const [facilityName, setFacilityName] = useState("");

  const handleSignup = (e: React.FormEvent) => {
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

    // Register & Log in user
    login({
      id: `user-${Date.now()}`,
      name: fullName.trim(),
      email: email.trim() || `${phone.trim()}@sehatsaathi.in`,
      role: selectedRole,
      phone: phone.trim(),
      specialty: selectedRole === Role.DOCTOR ? (specialty.trim() || "General Medicine") : undefined,
      facilityId: selectedRole === Role.HOSPITAL_STAFF ? "fac-1" : undefined,
    });

    toast.success(language === "hi" ? `सेहत साथी में आपका स्वागत है, ${fullName}!` : `Welcome to Sehat Saathi, ${fullName}!`);
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 lg:p-8 font-sans relative">
      
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

      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
        
        {/* Left Side - Brand & Illustration */}
        <div className="hidden lg:flex flex-col justify-center space-y-10 relative">
          
          {/* Logo & Tagline */}
          <div>
            <div className="flex items-center gap-3.5 mb-2">
              <div className="relative w-14 h-14 rounded-2xl overflow-hidden shadow-md border border-slate-100 bg-white p-1 shrink-0">
                <Image 
                  src="/logo.png" 
                  alt="Sehat Saathi Official Logo" 
                  width={56} 
                  height={56} 
                  className="object-contain"
                  priority
                />
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight text-[#003399]">
                  {t("brandName")}
                </h1>
                <p className="text-xs font-bold text-teal-700 tracking-tight">{t("tagline")}</p>
              </div>
            </div>
            <p className="text-slate-500 font-medium text-sm ml-1">{t("subTagline")}</p>
          </div>

          {/* Hero Text */}
          <div className="space-y-4">
            <h2 className="text-4xl xl:text-5xl font-extrabold text-slate-800 leading-[1.15]">
              {t("signupHeroHeadline")}
            </h2>
            <p className="text-slate-600 text-base xl:text-lg max-w-md leading-relaxed font-medium">
              {t("signupHeroSubtext")}
            </p>
          </div>

          {/* Core Values Floating Card */}
          <div className="grid grid-cols-2 gap-3 max-w-md pt-2">
            <div className="p-3.5 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center gap-2.5">
              <Heart className="w-4 h-4 text-teal-600 shrink-0" />
              <span className="text-xs font-bold text-slate-700">{language === "hi" ? "सहानुभूतिपूर्ण देखभाल" : "Patient First Care"}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center gap-2.5">
              <Shield className="w-4 h-4 text-teal-600 shrink-0" />
              <span className="text-xs font-bold text-slate-700">{language === "hi" ? "ABDM डिजिटल रिकॉर्ड्स" : "ABDM Certified"}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center gap-2.5">
              <Cpu className="w-4 h-4 text-teal-600 shrink-0" />
              <span className="text-xs font-bold text-slate-700">{language === "hi" ? "AI क्लिनिकल ट्राइएज" : "AI Clinical Triage"}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center gap-2.5">
              <Users className="w-4 h-4 text-teal-600 shrink-0" />
              <span className="text-xs font-bold text-slate-700">{language === "hi" ? "सुलभ स्वास्थ्य सेवा" : "Universal Healthcare"}</span>
            </div>
          </div>
        </div>

        {/* Right Side - Signup Form */}
        <div className="flex flex-col justify-center">
          <Card className="border-0 shadow-2xl shadow-blue-950/5 rounded-3xl bg-white overflow-hidden p-6 sm:p-10">
            <CardContent className="p-0 space-y-6">
              
              <div className="space-y-2">
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900">{t("signUpTitle")}</h3>
                <p className="text-slate-500 font-medium text-xs sm:text-sm">{t("signUpSub")}</p>
              </div>

              {/* 3-Way Role Selector */}
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedRole(Role.PATIENT)}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all ${
                    selectedRole === Role.PATIENT
                      ? "border-teal-500 bg-teal-50/50 text-teal-800 font-bold shadow-sm"
                      : "border-slate-100 bg-slate-50/50 text-slate-500 hover:border-slate-200"
                  }`}
                >
                  <Users className={`w-5 h-5 mb-1 ${selectedRole === Role.PATIENT ? "text-teal-600" : "text-slate-400"}`} />
                  <span className="text-xs">{t("patientRole")}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole(Role.DOCTOR)}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all ${
                    selectedRole === Role.DOCTOR
                      ? "border-teal-500 bg-teal-50/50 text-teal-800 font-bold shadow-sm"
                      : "border-slate-100 bg-slate-50/50 text-slate-500 hover:border-slate-200"
                  }`}
                >
                  <Stethoscope className={`w-5 h-5 mb-1 ${selectedRole === Role.DOCTOR ? "text-teal-600" : "text-slate-400"}`} />
                  <span className="text-xs">{t("doctorRole")}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole(Role.HOSPITAL_STAFF)}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all ${
                    selectedRole === Role.HOSPITAL_STAFF
                      ? "border-teal-500 bg-teal-50/50 text-teal-800 font-bold shadow-sm"
                      : "border-slate-100 bg-slate-50/50 text-slate-500 hover:border-slate-200"
                  }`}
                >
                  <Building2 className={`w-5 h-5 mb-1 ${selectedRole === Role.HOSPITAL_STAFF ? "text-teal-600" : "text-slate-400"}`} />
                  <span className="text-xs">{t("staffRole")}</span>
                </button>
              </div>

              {/* Signup Form */}
              <form onSubmit={handleSignup} className="space-y-4">
                
                {/* Full Name */}
                <div className="space-y-1.5">
                  <Label className="text-slate-700 font-bold text-xs">
                    {t("fullName")} *
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                    <Input 
                      placeholder={selectedRole === Role.DOCTOR ? (language === "hi" ? "उदा. डॉ. राजेश कुमार" : "e.g. Dr. Rajesh Kumar") : (language === "hi" ? "उदा. अमित शर्मा" : "e.g. Amit Sharma")} 
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="pl-10 h-11 rounded-xl border-slate-200 focus-visible:ring-teal-600 text-xs bg-slate-50/50"
                      required
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div className="space-y-1.5">
                  <Label className="text-slate-700 font-bold text-xs">{t("phoneLabel")} *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                    <Input 
                      type="tel"
                      placeholder="9876543210" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="pl-10 h-11 rounded-xl border-slate-200 focus-visible:ring-teal-600 text-xs bg-slate-50/50"
                      required
                    />
                  </div>
                </div>

                {/* Optional Email */}
                <div className="space-y-1.5">
                  <Label className="text-slate-700 font-bold text-xs">{t("emailOrMobile")} ({language === "hi" ? "वैकल्पिक" : "Optional"})</Label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                    <Input 
                      type="email"
                      placeholder="you@example.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-11 rounded-xl border-slate-200 focus-visible:ring-teal-600 text-xs bg-slate-50/50"
                    />
                  </div>
                </div>

                {/* Role-Specific Fields */}
                {selectedRole === Role.DOCTOR && (
                  <div className="space-y-1.5 animate-in fade-in duration-200">
                    <Label className="text-slate-700 font-bold text-xs">{t("specialtyLabel")}</Label>
                    <div className="relative">
                      <Award className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                      <Input 
                        placeholder={language === "hi" ? "उदा. सामान्य चिकित्सा / हृदय रोग" : "e.g. General Medicine / Cardiology"} 
                        value={specialty}
                        onChange={(e) => setSpecialty(e.target.value)}
                        className="pl-10 h-11 rounded-xl border-slate-200 focus-visible:ring-teal-600 text-xs bg-slate-50/50"
                      />
                    </div>
                  </div>
                )}

                {selectedRole === Role.HOSPITAL_STAFF && (
                  <div className="space-y-1.5 animate-in fade-in duration-200">
                    <Label className="text-slate-700 font-bold text-xs">{t("facilityLabel")}</Label>
                    <div className="relative">
                      <Building2 className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                      <Input 
                        placeholder={language === "hi" ? "उदा. एम्स नई दिल्ली / जिला अस्पताल" : "e.g. AIIMS New Delhi / District Hospital"} 
                        value={facilityName}
                        onChange={(e) => setFacilityName(e.target.value)}
                        className="pl-10 h-11 rounded-xl border-slate-200 focus-visible:ring-teal-600 text-xs bg-slate-50/50"
                      />
                    </div>
                  </div>
                )}

                {/* Password */}
                <div className="space-y-1.5">
                  <Label className="text-slate-700 font-bold text-xs">{t("password")} *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                    <Input 
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 h-11 rounded-xl border-slate-200 focus-visible:ring-teal-600 text-xs bg-slate-50/50"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md mt-2"
                >
                  {t("createAccountBtn")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>

              {/* Login Link */}
              <div className="text-center pt-2">
                <p className="text-xs text-slate-500 font-medium">
                  {t("alreadyAccount")}{" "}
                  <Link href="/login" className="font-bold text-teal-600 hover:underline">
                    {t("logInHere")}
                  </Link>
                </p>
              </div>

            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
