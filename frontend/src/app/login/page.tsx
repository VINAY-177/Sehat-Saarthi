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
  ShieldPlus, Users, Stethoscope, Building2, Mail, Lock, Eye, ArrowRight,
  Heart, Shield, Cpu
} from "lucide-react";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useStore();
  const [selectedRole, setSelectedRole] = useState<Role>(Role.PATIENT);

  // Form states
  const [emailOrMobile, setEmailOrMobile] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(
      {
        id: "1",
        name: "Citizen Demo",
        email: emailOrMobile || "demo@example.com",
        role: selectedRole,
        phone: emailOrMobile || "9876543210",
      }
    );
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 lg:p-8 font-sans">
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
        
        {/* Left Side - Brand & Illustration */}
        <div className="hidden lg:flex flex-col justify-center space-y-10 relative">
          
          {/* Logo & Tagline */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-gradient-to-br from-blue-700 to-teal-500 p-2 rounded-xl text-white">
                <ShieldPlus className="w-8 h-8" />
              </div>
              <h1 className="text-3xl font-black tracking-tight text-blue-900">
                SEHAT <span className="text-teal-500">SAATHI</span>
              </h1>
            </div>
            <p className="text-slate-500 font-medium ml-1">AI-Powered Healthcare for a Healthier India</p>
          </div>

          {/* Hero Text */}
          <div className="space-y-4">
            <h2 className="text-5xl font-extrabold text-slate-800 leading-[1.15]">
              Better Healthcare.<br />
              <span className="text-slate-800">Stronger Communities.</span>
            </h2>
            <p className="text-slate-600 text-lg max-w-md leading-relaxed">
              Sehat Saathi connects patients, doctors, and healthcare providers on one intelligent platform for a healthier India.
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
                  <Shield className="w-5 h-5 text-blue-600" /> Trust
                </div>
                <div className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                  <Cpu className="w-5 h-5 text-blue-600" /> Technology
                </div>
                <div className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                  <Users className="w-5 h-5 text-blue-600" /> Care for All
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Security Badge */}
          <div className="inline-flex items-center gap-4 bg-white px-6 py-4 rounded-2xl shadow-sm border border-slate-100 max-w-max mt-4">
            <div className="bg-teal-50 p-2 rounded-lg text-teal-600">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">Your data is secure with us</p>
              <p className="text-xs text-slate-500 font-medium">End-to-end encryption & secure access</p>
            </div>
          </div>

        </div>

        {/* Right Side - Login Form */}
        <div className="flex justify-center w-full">
          <Card className="w-full max-w-md border-0 shadow-2xl shadow-slate-200/50 rounded-[2rem] overflow-hidden bg-white p-2">
            <CardContent className="p-8 sm:p-10 space-y-8">
              
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-blue-950">Welcome back</h2>
                <p className="text-slate-500 font-medium">Sign in to continue to Sehat Saathi</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                
                {/* Role Selector */}
                <div className="space-y-3">
                  <Label className="text-slate-700 font-bold text-sm">Select your role</Label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedRole(Role.PATIENT)}
                      className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                        selectedRole === Role.PATIENT 
                          ? "border-blue-600 bg-blue-50/50 text-blue-700" 
                          : "border-slate-100 text-slate-500 hover:border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <Users className="w-6 h-6 mb-2" />
                      <span className="text-sm font-semibold">Patient</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedRole(Role.DOCTOR)}
                      className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                        selectedRole === Role.DOCTOR 
                          ? "border-blue-600 bg-blue-50/50 text-blue-700" 
                          : "border-slate-100 text-slate-500 hover:border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <Stethoscope className="w-6 h-6 mb-2" />
                      <span className="text-sm font-semibold">Doctor</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedRole(Role.HOSPITAL_STAFF)}
                      className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                        selectedRole === Role.HOSPITAL_STAFF 
                          ? "border-blue-600 bg-blue-50/50 text-blue-700" 
                          : "border-slate-100 text-slate-500 hover:border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <Building2 className="w-6 h-6 mb-2" />
                      <span className="text-sm font-semibold">Staff</span>
                    </button>
                  </div>
                </div>

                {/* Email / Mobile */}
                <div className="space-y-2">
                  <Label className="text-slate-700 font-bold text-sm">Email or Mobile Number</Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                    <Input 
                      type="text" 
                      placeholder="Enter your email or mobile number" 
                      value={emailOrMobile}
                      onChange={(e) => setEmailOrMobile(e.target.value)}
                      className="pl-12 h-12 rounded-xl border-slate-200 focus-visible:ring-blue-600 text-base bg-white"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label className="text-slate-700 font-bold text-sm">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                    <Input 
                      type="password" 
                      placeholder="Enter your password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-12 pr-12 h-12 rounded-xl border-slate-200 focus-visible:ring-blue-600 text-base bg-white"
                      required
                    />
                    <button type="button" className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600">
                      <Eye className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Forgot Password */}
                <div className="flex justify-end">
                  <a href="#" className="text-sm font-bold text-teal-600 hover:text-teal-700">
                    Forgot password?
                  </a>
                </div>

                {/* Submit */}
                <Button 
                  type="submit" 
                  className="w-full h-12 rounded-xl bg-[#003399] hover:bg-blue-800 text-white font-bold text-base flex justify-between items-center px-6 shadow-md shadow-blue-900/20"
                >
                  <span className="mx-auto">Sign In</span>
                  <ArrowRight className="h-5 w-5 absolute right-6" />
                </Button>


                {/* Register Link */}
                <p className="text-center text-sm font-medium text-slate-500 pt-2">
                  New here? <a href="/register" className="text-teal-600 font-bold hover:underline">Create an account</a>
                </p>

              </form>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
