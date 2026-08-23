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
  Heart, Shield, Cpu, User, Phone, MapPin, Award
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

export default function SignupPage() {
  const router = useRouter();
  const { login } = useStore();
  const [selectedRole, setSelectedRole] = useState<Role>(Role.PATIENT);

  // Common Fields
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Role-Specific Optional Fields
  const [district, setDistrict] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [facilityName, setFacilityName] = useState("");

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      toast.error("Please enter your full name");
      return;
    }
    if (!phone.trim()) {
      toast.error("Please enter your phone number");
      return;
    }
    if (!password.trim() || password.length < 4) {
      toast.error("Password must be at least 4 characters");
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

    toast.success(`Welcome to Sehat Saathi, ${fullName}! Your ${selectedRole} account is active.`);
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 lg:p-8 font-sans">
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
                  Sehat <span className="text-teal-500">Saathi</span>
                </h1>
                <p className="text-xs font-bold text-teal-700 tracking-tight">Saath Aapka, Sehat Hamari</p>
              </div>
            </div>
            <p className="text-slate-500 font-medium text-sm ml-1">AI-Powered Healthcare Navigation for India</p>
          </div>

          {/* Hero Text */}
          <div className="space-y-4">
            <h2 className="text-5xl font-extrabold text-slate-800 leading-[1.15]">
              Create Your<br />
              <span className="text-slate-800">Healthcare Account.</span>
            </h2>
            <p className="text-slate-600 text-lg max-w-md leading-relaxed">
              Join thousands of citizens, certified doctors, and healthcare facilities unified on the Sehat Saathi clinical intelligence network.
            </p>
          </div>

          {/* Illustration Container */}
          <div className="relative mt-8 max-w-xl">
            <Image 
              src="/hospital-illustration.jpg" 
              alt="Hospital Illustration" 
              width={600} 
              height={400} 
              className="rounded-3xl mix-blend-multiply"
              priority
            />
            
            {/* Core Values Floating Card */}
            <Card className="absolute -right-4 bottom-12 border-0 shadow-xl shadow-blue-900/10 rounded-2xl bg-white/95 backdrop-blur-sm">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                  <Heart className="w-5 h-5 text-blue-600" /> Compassion
                </div>
                <div className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                  <Shield className="w-5 h-5 text-blue-600" /> Trust &amp; ABDM Ready
                </div>
                <div className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                  <Cpu className="w-5 h-5 text-blue-600" /> AI-Assisted Care
                </div>
                <div className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                  <Users className="w-5 h-5 text-blue-600" /> Care for Every Citizen
                </div>
              </CardContent>
            </Card>
          </div>

        </div>

        {/* Right Side - Signup Form */}
        <div className="flex flex-col justify-center">
          <Card className="border-0 shadow-2xl shadow-blue-950/5 rounded-3xl bg-white overflow-hidden p-6 sm:p-10">
            <CardContent className="p-0 space-y-6">
              
              <div className="space-y-2">
                <h3 className="text-3xl font-extrabold text-slate-900">Create an account</h3>
                <p className="text-slate-500 font-medium text-sm">Select your role to get started</p>
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
                  <span className="text-xs">Citizen</span>
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
                  <span className="text-xs">Doctor</span>
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
                  <span className="text-xs">Hospital Staff</span>
                </button>
              </div>

              {/* Signup Form */}
              <form onSubmit={handleSignup} className="space-y-4">
                
                {/* Full Name */}
                <div className="space-y-1.5">
                  <Label className="text-slate-700 font-bold text-xs">
                    {selectedRole === Role.DOCTOR ? "Doctor Full Name *" : "Full Name *"}
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                    <Input 
                      placeholder={selectedRole === Role.DOCTOR ? "e.g. Dr. Rajesh Sharma" : "e.g. Ramesh Kumar"} 
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="pl-10 h-10 rounded-xl border-slate-200 focus-visible:ring-blue-600 text-sm bg-white"
                      required
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div className="space-y-1.5">
                  <Label className="text-slate-700 font-bold text-xs">Phone Number *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                    <Input 
                      type="tel"
                      placeholder="e.g. 9876543210" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="pl-10 h-10 rounded-xl border-slate-200 focus-visible:ring-blue-600 text-sm bg-white"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <Label className="text-slate-700 font-bold text-xs">Password *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                    <Input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="Create a secure password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 h-10 rounded-xl border-slate-200 focus-visible:ring-blue-600 text-sm bg-white"
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

                {/* Email (Optional) */}
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <Label className="text-slate-700 font-bold text-xs">Email Address</Label>
                    <span className="text-[10px] text-slate-400 font-medium">Optional</span>
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                    <Input 
                      type="email"
                      placeholder="e.g. ramesh@example.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-10 rounded-xl border-slate-200 focus-visible:ring-blue-600 text-sm bg-white"
                    />
                  </div>
                </div>

                {/* Role-Specific Optional Field */}
                {selectedRole === Role.PATIENT && (
                  <div className="space-y-1.5 animate-in fade-in duration-200">
                    <div className="flex justify-between">
                      <Label className="text-slate-700 font-bold text-xs">District / City</Label>
                      <span className="text-[10px] text-slate-400 font-medium">Optional</span>
                    </div>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                      <Input 
                        placeholder="e.g. New Delhi / Varanasi" 
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="pl-10 h-10 rounded-xl border-slate-200 focus-visible:ring-blue-600 text-sm bg-white"
                      />
                    </div>
                  </div>
                )}

                {selectedRole === Role.DOCTOR && (
                  <div className="space-y-1.5 animate-in fade-in duration-200">
                    <div className="flex justify-between">
                      <Label className="text-slate-700 font-bold text-xs">Specialty / Registration No.</Label>
                      <span className="text-[10px] text-slate-400 font-medium">Optional</span>
                    </div>
                    <div className="relative">
                      <Award className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                      <Input 
                        placeholder="e.g. Cardiology / MCI-29481" 
                        value={specialty}
                        onChange={(e) => setSpecialty(e.target.value)}
                        className="pl-10 h-10 rounded-xl border-slate-200 focus-visible:ring-blue-600 text-sm bg-white"
                      />
                    </div>
                  </div>
                )}

                {selectedRole === Role.HOSPITAL_STAFF && (
                  <div className="space-y-1.5 animate-in fade-in duration-200">
                    <div className="flex justify-between">
                      <Label className="text-slate-700 font-bold text-xs">Facility / Department</Label>
                      <span className="text-[10px] text-slate-400 font-medium">Optional</span>
                    </div>
                    <div className="relative">
                      <Building2 className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                      <Input 
                        placeholder="e.g. AIIMS Delhi - Emergency Triage" 
                        value={facilityName}
                        onChange={(e) => setFacilityName(e.target.value)}
                        className="pl-10 h-10 rounded-xl border-slate-200 focus-visible:ring-blue-600 text-sm bg-white"
                      />
                    </div>
                  </div>
                )}

                {/* Submit */}
                <Button 
                  type="submit" 
                  className="w-full h-11 rounded-xl bg-[#003399] hover:bg-blue-800 text-white font-bold text-sm flex justify-between items-center px-6 shadow-md shadow-blue-900/20 mt-2"
                >
                  <span className="mx-auto">Create Account &amp; Sign In</span>
                  <ArrowRight className="h-4 w-4 absolute right-6" />
                </Button>

                {/* Login Link */}
                <p className="text-center text-sm font-medium text-slate-500 pt-1">
                  Already have an account?{" "}
                  <Link href="/login" className="text-teal-600 font-bold hover:underline">
                    Sign In
                  </Link>
                </p>

              </form>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
