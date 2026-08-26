"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Siren,
  Building2,
  Activity,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Calendar,
  Clock,
  FileText,
  Bell,
  CheckCircle2,
  ArrowRight,
  Stethoscope
} from "lucide-react";

export function PatientDashboard() {
  const { currentUser, t, language } = useStore();

  const currentHour = new Date().getHours();
  let greeting = t("goodEvening");
  if (currentHour >= 5 && currentHour < 12) {
    greeting = t("goodMorning");
  } else if (currentHour >= 12 && currentHour < 17) {
    greeting = t("goodAfternoon");
  } else if (currentHour >= 17 && currentHour < 22) {
    greeting = t("goodEvening");
  } else {
    greeting = t("goodNight");
  }

  const firstName = currentUser?.name?.split(" ")[0] || (language === "hi" ? "आरव" : "Aarav");

  // Next Upcoming Appointment (Defaulting to the interconnected SIH demo appointment)
  const nextAppt = {
    doctorName: "Dr. Priya Mehta",
    specialty: "General Medicine",
    facilityName: "Government General Hospital — Delhi",
    date: "28 August 2026",
    time: "10:30 AM",
    status: "CONFIRMED",
    type: "General Consultation",
  };

  return (
    <div className="relative min-h-[calc(100vh-5rem)] -m-4 sm:-m-6 p-4 sm:p-6 overflow-hidden bg-[#F8FAFC]">
      
      {/* Subtle Ambient Healthcare Corner Gradients & Vector Motifs */}
      <div 
        className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-teal-500/10 via-emerald-500/5 to-transparent rounded-full blur-3xl pointer-events-none -z-10" 
      />
      <div 
        className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-emerald-500/8 via-teal-500/4 to-transparent rounded-full blur-3xl pointer-events-none -z-10" 
      />
      {/* Subtle Dot Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:32px_32px] opacity-20 pointer-events-none -z-10" />

      <div className="relative space-y-6 max-w-6xl mx-auto pb-10 z-10 page-enter">
        
        {/* 1. Header Section - Clean & Personal Greeting */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mt-1 section-enter">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              {greeting}, {firstName} 👋
            </h1>
            <p className="text-slate-500 text-sm font-medium">
              {language === "hi" 
                ? "आज के लिए आपका स्वास्थ्य अवलोकन।" 
                : "Here's your healthcare overview for today."}
            </p>
          </div>

          <Link href="/scheduling">
            <Button 
              className="bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs h-10 px-4 rounded-xl shadow-xs gap-1.5 transition-all card-hover btn-press"
            >
              <Calendar className="w-3.5 h-3.5" />
              {language === "hi" ? "नया अपॉइंटमेंट बुक करें" : "Book New Appointment"}
            </Button>
          </Link>
        </div>

        {/* 2. Primary Hero Feature: Next Appointment Spotlight Card */}
        <div className="bg-white border border-teal-100 rounded-2xl p-5 sm:p-6 shadow-xs relative overflow-hidden card-hover section-enter stagger-1">
          {/* Subtle teal accent border on top */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-600 via-teal-500 to-emerald-500" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            
            {/* Left: Next Appointment Details */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-md border border-teal-100/80">
                  {language === "hi" ? "अगला अपॉइंटमेंट" : "NEXT APPOINTMENT"}
                </span>
                <Badge className="bg-emerald-50 text-emerald-800 border-emerald-200 text-[10px] font-bold py-0.5">
                  <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600 inline" />
                  {nextAppt.status}
                </Badge>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-teal-700" />
                  {nextAppt.doctorName}
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  {nextAppt.specialty} • {nextAppt.facilityName}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-700 pt-1">
                <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                  <Calendar className="w-3.5 h-3.5 text-teal-700" />
                  <span>{nextAppt.date}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                  <Clock className="w-3.5 h-3.5 text-teal-700" />
                  <span>{nextAppt.time}</span>
                </div>
              </div>
            </div>

            {/* Right Action Button */}
            <div className="flex items-center gap-3 shrink-0">
              <Link href="/scheduling">
                <Button 
                  className="bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs h-11 px-5 rounded-xl shadow-xs transition-all flex items-center gap-2 btn-press"
                >
                  {language === "hi" ? "अपॉइंटमेंट देखें" : "View Appointment"}
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* 3. Patient Statistics — 4 Compact Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          
          <Card className="bg-white border border-slate-200/80 rounded-2xl shadow-xs card-hover p-4 stagger-1">
            <div className="flex items-center justify-between pb-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                {language === "hi" ? "आगामी विज़िट" : "Upcoming Visits"}
              </span>
              <div className="p-1.5 rounded-lg bg-teal-50 text-teal-700">
                <Calendar className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-xl font-black text-slate-900 mt-1">2</div>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">28 Aug & 04 Sep</p>
          </Card>

          <Card className="bg-white border border-slate-200/80 rounded-2xl shadow-xs card-hover p-4 stagger-2">
            <div className="flex items-center justify-between pb-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                {language === "hi" ? "पूर्ण परामर्श" : "Past Consultations"}
              </span>
              <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-xl font-black text-slate-900 mt-1">1</div>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">18 Aug (Completed)</p>
          </Card>

          <Card className="bg-white border border-slate-200/80 rounded-2xl shadow-xs card-hover p-4 stagger-3">
            <div className="flex items-center justify-between pb-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                {language === "hi" ? "सक्रिय दवाइयाँ" : "Prescriptions"}
              </span>
              <div className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
                <FileText className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-xl font-black text-slate-900 mt-1">1</div>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">Telmisartan 20mg</p>
          </Card>

          <Card className="bg-white border border-slate-200/80 rounded-2xl shadow-xs card-hover p-4 stagger-4">
            <div className="flex items-center justify-between pb-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                {language === "hi" ? "अधिसूचनाएं" : "Notifications"}
              </span>
              <div className="p-1.5 rounded-lg bg-amber-50 text-amber-700">
                <Bell className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-xl font-black text-slate-900 mt-1">2</div>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">Appointment reminder</p>
          </Card>

        </div>

        {/* 4. Split Section: Left Quick Services & Right Patient Health Profile Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column (7 cols): 4-Portal Service Command Grid */}
          <div className="lg:col-span-7 space-y-4">
            
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-extrabold tracking-tight text-slate-900 uppercase">
                {language === "hi" ? "स्वास्थ्य सेवाएँ" : "Healthcare Services"}
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              
              {/* Find Hospitals */}
              <Link href="/hospitals" className="block group">
                <Card className="h-full bg-white border border-slate-200/80 rounded-2xl shadow-xs card-hover p-4">
                  <div className="p-2.5 bg-teal-50 border border-teal-100 text-teal-700 rounded-xl w-fit group-hover:bg-teal-100 transition-colors mb-3">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm mb-0.5">{t("findHospitals") || "Find Hospitals"}</h3>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    {language === "hi" ? "नजदीकी अस्पताल और लाइव बेड" : "Nearby facilities & live bed status"}
                  </p>
                </Card>
              </Link>

              {/* Emergency 108 */}
              <Link href="/emergency" className="block group">
                <Card className="h-full bg-white border border-slate-200/80 rounded-2xl shadow-xs card-hover p-4">
                  <div className="p-2.5 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl w-fit group-hover:bg-rose-100 transition-colors mb-3">
                    <Siren className="h-4 w-4" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm mb-0.5">{t("emergency108") || "Emergency 108"}</h3>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    {language === "hi" ? "तत्काल 108 एम्बुलेंस अनुरोध" : "Instant 108 ambulance dispatch"}
                  </p>
                </Card>
              </Link>

              {/* Check Symptoms */}
              <Link href="/assess" className="block group">
                <Card className="h-full bg-white border border-slate-200/80 rounded-2xl shadow-xs card-hover p-4">
                  <div className="p-2.5 bg-teal-50 border border-teal-100 text-teal-700 rounded-xl w-fit group-hover:bg-teal-100 transition-colors mb-3">
                    <Activity className="h-4 w-4" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm mb-0.5">{t("riskAssessment") || "Check Symptoms"}</h3>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    {language === "hi" ? "AI क्लिनिकल जोखिम जांच" : "AI clinical risk assessment"}
                  </p>
                </Card>
              </Link>

              {/* Scheme Benefits */}
              <Link href="/schemes" className="block group">
                <Card className="h-full bg-white border border-slate-200/80 rounded-2xl shadow-xs card-hover p-4">
                  <div className="p-2.5 bg-teal-50 border border-teal-100 text-teal-700 rounded-xl w-fit group-hover:bg-teal-100 transition-colors mb-3">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm mb-0.5">{t("govSchemes") || "Scheme Benefits"}</h3>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    {language === "hi" ? "PM-JAY व सरकारी योजनाएं" : "PM-JAY & government schemes"}
                  </p>
                </Card>
              </Link>

            </div>

            {/* Health Tip Banner */}
            <Card className="bg-white border border-slate-200/80 rounded-2xl shadow-xs p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-teal-50 border border-teal-100 text-teal-700 rounded-xl shrink-0">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-slate-900">{t("dailyHealthTip") || "Daily Health Tip"}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {t("healthTipText") || "Stay hydrated — drink at least 8 glasses of water daily for optimal health."}
                  </p>
                </div>
              </div>
            </Card>

          </div>

          {/* Right Column (5 cols): Patient Profile & Basic Health Info Card */}
          <div className="lg:col-span-5 space-y-4">
            
            <h2 className="text-sm font-extrabold tracking-tight text-slate-900 uppercase">
              {language === "hi" ? "स्वास्थ्य प्रोफाइल" : "Health Profile"}
            </h2>

            <Card className="bg-white border border-slate-200/80 rounded-2xl shadow-xs p-5 space-y-4 card-hover">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-10 h-10 rounded-full bg-teal-700 text-white flex items-center justify-center font-black text-sm">
                  {firstName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{currentUser?.name || "Aarav Sharma"}</h3>
                  <p className="text-xs text-slate-400 font-medium">ABHA ID: 91-8821-4402-9102</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 font-medium block text-[10px] uppercase">Age / Gender</span>
                  <span className="font-bold text-slate-800 text-xs">28 Yrs • Male</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 font-medium block text-[10px] uppercase">Blood Group</span>
                  <span className="font-bold text-teal-700 text-xs">B +ve</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 col-span-2">
                  <span className="text-slate-400 font-medium block text-[10px] uppercase">Active Condition</span>
                  <span className="font-bold text-slate-800 text-xs">Hypertension — Mild (Monitored)</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 col-span-2">
                  <span className="text-slate-400 font-medium block text-[10px] uppercase">Primary Hospital</span>
                  <span className="font-bold text-slate-800 text-xs">Government General Hospital — Delhi</span>
                </div>
              </div>

              <Link href={currentUser?.patientId ? `/patients/${currentUser.patientId}` : "/profile"} className="block">
                <Button variant="outline" className="w-full h-9 text-xs font-bold rounded-xl border-slate-200 hover:bg-slate-50 text-slate-700 btn-press">
                  {language === "hi" ? "पूर्ण स्वास्थ्य रिकॉर्ड देखें" : "View Full Health Records"}
                  <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </Card>

          </div>

        </div>

      </div>
    </div>
  );
}
