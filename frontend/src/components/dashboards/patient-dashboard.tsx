"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useStore, DEFAULT_DELHI_HOSPITALS } from "@/lib/store";
import { formatAppointmentDate, formatAppointmentTime } from "@/lib/appointment-time";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
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
  Stethoscope,
  MapPin,
  Star,
  Search,
  Phone,
  Bot,
  Map as MapIcon,
  HeartPulse,
} from "lucide-react";

// Regional categorization for Delhi-NCR
function getHospitalRegion(facility: { district?: string; state?: string; city?: string; area?: string; location?: string }): string {
  const city = (facility.city || "").toLowerCase();
  const district = (facility.district || "").toLowerCase();
  const area = (facility.area || "").toLowerCase();
  const location = (facility.location || "").toLowerCase();

  if (city === "greater noida" || area.includes("greater noida") || location.includes("greater noida")) return "Greater Noida";
  if (city === "noida" || district.includes("gautam") || location.includes("noida")) {
    if (area.includes("greater noida") || location.includes("greater noida") || location.includes("pari chowk") || location.includes("knowledge park")) {
      return "Greater Noida";
    }
    return "Noida";
  }
  if (area.includes("najafgarh") || area.includes("dwarka") || location.includes("najafgarh") || location.includes("dwarka") || district.includes("south west")) {
    return "Dwarka & Najafgarh";
  }
  if (city === "ghaziabad" || district === "ghaziabad" || location.includes("ghaziabad") || location.includes("indirapuram") || location.includes("vaishali") || location.includes("kaushambi")) return "Ghaziabad";
  if (city === "gurugram" || district === "gurugram" || city === "gurgaon" || district === "gurgaon" || location.includes("gurugram") || location.includes("gurgaon")) return "Gurugram";
  if (city === "faridabad" || district === "faridabad" || location.includes("faridabad")) return "Faridabad";
  if (district.includes("south") || district.includes("central") || district.includes("new delhi") || location.includes("ansari nagar") || location.includes("raj ghat")) {
    return "South & Central Delhi";
  }
  return "Delhi NCR";
}

export function PatientDashboard() {
  const { currentUser, t, language, appointments = [], notifications = [], facilities = [] } = useStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("ALL");

  // Ensure all 32 Delhi-NCR facilities are available
  const allFacilities = useMemo(() => {
    return facilities && facilities.length >= DEFAULT_DELHI_HOSPITALS.length
      ? facilities
      : DEFAULT_DELHI_HOSPITALS;
  }, [facilities]);

  // Filtered hospitals list
  const filteredHospitals = useMemo(() => {
    return allFacilities.filter((hosp) => {
      const region = getHospitalRegion(hosp);
      const matchesRegion =
        selectedRegion === "ALL" ||
        (selectedRegion === "Delhi" && (region === "South & Central Delhi" || region === "Dwarka & Najafgarh" || region === "Delhi NCR")) ||
        (selectedRegion === "Dwarka & Najafgarh" && region === "Dwarka & Najafgarh") ||
        (selectedRegion === "South & Central Delhi" && region === "South & Central Delhi") ||
        (selectedRegion === "Noida" && (region === "Noida" || region === "Greater Noida")) ||
        (selectedRegion === "Ghaziabad" && region === "Ghaziabad") ||
        (selectedRegion === "Gurugram" && region === "Gurugram") ||
        (selectedRegion === "Faridabad" && region === "Faridabad");

      if (!matchesRegion) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      const rawSpecs = hosp.specialties || hosp.specialists || [];
      const specString = Array.isArray(rawSpecs) ? rawSpecs.join(" ") : String(rawSpecs);

      return (
        hosp.name.toLowerCase().includes(q) ||
        (hosp.city || "").toLowerCase().includes(q) ||
        (hosp.area || "").toLowerCase().includes(q) ||
        (hosp.district || "").toLowerCase().includes(q) ||
        (hosp.location || "").toLowerCase().includes(q) ||
        specString.toLowerCase().includes(q)
      );
    });
  }, [allFacilities, selectedRegion, searchQuery]);

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

  // Derive next appointment from database
  const myAppointments = appointments.filter(
    (a) => a.patientId === currentUser?.patientId && !['COMPLETED', 'CANCELLED', 'DECLINED'].includes(a.status)
  ).sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
  const nextApptData = myAppointments[0];
  const nextAppt = nextApptData ? {
    doctorName: nextApptData.doctor?.name || 'Doctor',
    specialty: nextApptData.doctor?.specialty || 'General Medicine',
    facilityName: nextApptData.doctor?.facility?.name || 'Government General Hospital — Delhi',
    date: formatAppointmentDate(nextApptData.dateTime, { day: 'numeric', month: 'long', year: 'numeric' }),
    time: formatAppointmentTime(nextApptData.dateTime, { hour: 'numeric', minute: '2-digit', hour12: true }),
    status: nextApptData.status,
    type: nextApptData.reason || nextApptData.visitType || 'General Consultation',
  } : null;

  const upcomingCount = myAppointments.length;
  const pastCount = appointments.filter(
    (a) => a.patientId === currentUser?.patientId && a.status === 'COMPLETED'
  ).length;
  const unreadNotifCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative min-h-[calc(100vh-5rem)] -m-4 sm:-m-6 p-4 sm:p-6 overflow-hidden bg-[#F8FAFC]">
      
      {/* ── 1. Unique Patient Wellness Background Image & Glass Overlay ── */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <Image
          src="/backgrounds/patient-dashboard.jpg"
          alt="Patient wellness sanctuary"
          fill
          priority
          className="object-cover object-center opacity-25 mix-blend-multiply scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-slate-50/85 to-[#F8FAFC]/95 backdrop-blur-[2px]" />
      </div>

      {/* ── 2. Subtle Ambient Healthcare Corner Gradients ── */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-teal-500/15 via-emerald-500/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-emerald-500/12 via-teal-500/8 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      
      {/* Dot Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:32px_32px] opacity-15 pointer-events-none -z-10" />

      <div className="relative space-y-6 max-w-6xl mx-auto pb-12 z-10 page-enter">
        
        {/* ── 1. Header Section ── */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mt-1 section-enter">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-xs font-bold shadow-2xs">
              <HeartPulse className="w-3.5 h-3.5 text-teal-600 animate-pulse" />
              <span>{language === "hi" ? "व्यक्तिगत स्वास्थ्य पोर्टल" : "Personal Health Portal"}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
              {greeting}, {firstName} 👋
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm font-medium">
              {language === "hi" 
                ? "यहाँ आज का आपका स्वास्थ्य और दिल्ली-एनसीआर अस्पताल अवलोकन है।" 
                : "Here is your unified health overview and Delhi-NCR hospital network."}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link href="/chatbot">
              <button 
                type="button"
                className="btn-3d-glass h-10 px-4 text-xs gap-2 font-bold text-teal-800 border-teal-200"
              >
                <Bot className="w-4 h-4 text-teal-600" />
                <span>{language === "hi" ? "AI चैटबॉट बुकिंग" : "AI Assistant"}</span>
              </button>
            </Link>

            <Link href="/scheduling">
              <button 
                type="button"
                className="btn-3d-primary h-10 px-4 text-xs gap-2 font-bold"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>{language === "hi" ? "नया अपॉइंटमेंट" : "Book Appointment"}</span>
              </button>
            </Link>
          </div>
        </div>

        {/* ── 2. Primary Hero Feature: Next Appointment Spotlight Card ── */}
        {nextAppt ? (
          <div className="glass-panel p-5 sm:p-6 relative overflow-hidden card-hover section-enter stagger-1 border border-teal-200/80 bg-white/85 shadow-lg">
            {/* Top Accent Gradient Bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-teal-600 via-teal-500 to-emerald-500" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
              
              {/* Left: Next Appointment Details */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-lg border border-teal-200/80 shadow-2xs">
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

                <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-700 pt-1">
                  <div className="flex items-center gap-1.5 bg-white/90 px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
                    <Calendar className="w-3.5 h-3.5 text-teal-700" />
                    <span>{nextAppt.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white/90 px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
                    <Clock className="w-3.5 h-3.5 text-teal-700" />
                    <span>{nextAppt.time}</span>
                  </div>
                </div>
              </div>

              {/* Right Action Button */}
              <div className="flex items-center gap-3 shrink-0">
                <Link href="/scheduling">
                  <button 
                    type="button"
                    className="btn-3d-primary h-11 px-5 text-xs font-bold gap-2"
                  >
                    <span>{language === "hi" ? "अपॉइंटमेंट देखें" : "View Appointment"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="glass-panel p-6 sm:p-8 text-center card-hover section-enter stagger-1">
            <Calendar className="w-10 h-10 mx-auto mb-3 text-slate-300" />
            <p className="font-bold text-slate-800 text-sm">
              {language === "hi" ? "कोई आगामी अपॉइंटमेंट नहीं" : "No upcoming appointments"}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {language === "hi" ? "शुरू करने के लिए अपना पहला अपॉइंटमेंट बुक करें" : "Book your first clinical consultation to get started"}
            </p>
            <Link href="/scheduling" className="inline-block mt-4">
              <button type="button" className="btn-3d-glass h-9 px-4 text-xs font-bold text-teal-800 border-teal-200">
                {language === "hi" ? "अपॉइंटमेंट बुक करें" : "Book Appointment"}
              </button>
            </Link>
          </div>
        )}

        {/* ── 3. Patient Statistics — 4 Compact Glass Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          
          <div className="glass-panel p-4 card-hover stagger-1">
            <div className="flex items-center justify-between pb-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                {language === "hi" ? "आगामी विज़िट" : "Upcoming Visits"}
              </span>
              <div className="p-2 rounded-xl bg-teal-50 text-teal-700 border border-teal-100 shadow-2xs">
                <Calendar className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 mt-1">{upcomingCount}</div>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">{language === "hi" ? "कुल निर्धारित" : "Total scheduled"}</p>
          </div>

          <div className="glass-panel p-4 card-hover stagger-2">
            <div className="flex items-center justify-between pb-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                {language === "hi" ? "पूर्ण परामर्श" : "Past Consultations"}
              </span>
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-2xs">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 mt-1">{pastCount || 1}</div>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">{language === "hi" ? "सफलतापूर्वक पूर्ण" : "Completed successfully"}</p>
          </div>

          <div className="glass-panel p-4 card-hover stagger-3">
            <div className="flex items-center justify-between pb-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                {language === "hi" ? "सक्रिय दवाइयाँ" : "Prescriptions"}
              </span>
              <div className="p-2 rounded-xl bg-blue-50 text-blue-700 border border-blue-100 shadow-2xs">
                <FileText className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 mt-1">1</div>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">Telmisartan 20mg</p>
          </div>

          <div className="glass-panel p-4 card-hover stagger-4">
            <div className="flex items-center justify-between pb-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                {language === "hi" ? "अधिसूचनाएं" : "Notifications"}
              </span>
              <div className="p-2 rounded-xl bg-amber-50 text-amber-700 border border-amber-100 shadow-2xs">
                <Bell className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 mt-1">{unreadNotifCount || 2}</div>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">{language === "hi" ? "अपठित अलर्ट" : "Unread alerts"}</p>
          </div>

        </div>

        {/* ── 4. Split Section: Left Quick Services & Right Patient Health Profile Card ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column (7 cols): 4-Portal Service Command Grid */}
          <div className="lg:col-span-7 space-y-4">
            
            <div className="flex items-center justify-between">
              <h2 className="text-xs sm:text-sm font-extrabold tracking-tight text-slate-900 uppercase">
                {language === "hi" ? "स्वास्थ्य सेवाएँ" : "Healthcare Services"}
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              
              {/* Find Hospitals */}
              <Link href="/hospitals" className="block group">
                <div className="h-full glass-panel card-hover p-4 border border-white/80 group-hover:border-teal-300 transition-all">
                  <div className="p-2.5 bg-gradient-to-br from-teal-50 to-teal-100 border border-teal-200 text-teal-700 rounded-2xl w-fit group-hover:scale-105 transition-transform mb-3 shadow-2xs">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm mb-0.5 group-hover:text-teal-700 transition-colors">
                    {t("findHospitals") || "Find Hospitals"}
                  </h3>
                  <p className="text-[11px] text-slate-500 leading-snug font-medium">
                    {language === "hi" ? "32 दिल्ली-एनसीआर अस्पताल और लाइव बेड" : "32 Delhi-NCR hospitals & live beds"}
                  </p>
                </div>
              </Link>

              {/* Emergency 108 */}
              <Link href="/emergency" className="block group">
                <div className="h-full glass-panel card-hover p-4 border border-white/80 group-hover:border-red-300 transition-all">
                  <div className="p-2.5 bg-gradient-to-br from-red-50 to-red-100 border border-red-200 text-red-600 rounded-2xl w-fit group-hover:scale-105 transition-transform mb-3 shadow-2xs">
                    <Siren className="h-4 w-4" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm mb-0.5 group-hover:text-red-600 transition-colors">
                    {t("emergency108") || "Emergency 108"}
                  </h3>
                  <p className="text-[11px] text-slate-500 leading-snug font-medium">
                    {language === "hi" ? "तत्काल 108 एम्बुलेंस अनुरोध" : "Instant 108 ambulance dispatch"}
                  </p>
                </div>
              </Link>

              {/* Check Symptoms */}
              <Link href="/assess" className="block group">
                <div className="h-full glass-panel card-hover p-4 border border-white/80 group-hover:border-teal-300 transition-all">
                  <div className="p-2.5 bg-gradient-to-br from-teal-50 to-teal-100 border border-teal-200 text-teal-700 rounded-2xl w-fit group-hover:scale-105 transition-transform mb-3 shadow-2xs">
                    <Activity className="h-4 w-4" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm mb-0.5 group-hover:text-teal-700 transition-colors">
                    {t("riskAssessment") || "Check Symptoms"}
                  </h3>
                  <p className="text-[11px] text-slate-500 leading-snug font-medium">
                    {language === "hi" ? "AI क्लिनिकल जोखिम जांच" : "AI clinical risk assessment"}
                  </p>
                </div>
              </Link>

              {/* Scheme Benefits */}
              <Link href="/schemes" className="block group">
                <div className="h-full glass-panel card-hover p-4 border border-white/80 group-hover:border-teal-300 transition-all">
                  <div className="p-2.5 bg-gradient-to-br from-teal-50 to-teal-100 border border-teal-200 text-teal-700 rounded-2xl w-fit group-hover:scale-105 transition-transform mb-3 shadow-2xs">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm mb-0.5 group-hover:text-teal-700 transition-colors">
                    {t("govSchemes") || "Scheme Benefits"}
                  </h3>
                  <p className="text-[11px] text-slate-500 leading-snug font-medium">
                    {language === "hi" ? "PM-JAY व सरकारी योजनाएं" : "PM-JAY & government schemes"}
                  </p>
                </div>
              </Link>

            </div>

            {/* Health Tip Banner */}
            <div className="glass-panel p-4 flex items-start gap-3 border border-teal-100/80">
              <div className="p-2 bg-teal-50 border border-teal-200 text-teal-700 rounded-xl shrink-0 shadow-2xs">
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-slate-900">{t("dailyHealthTip") || "Daily Health Tip"}</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  {t("healthTipText") || "Stay hydrated — drink at least 8 glasses of water daily for optimal health."}
                </p>
              </div>
            </div>

          </div>

          {/* Right Column (5 cols): Patient Profile & Basic Health Info Card */}
          <div className="lg:col-span-5 space-y-4">
            
            <h2 className="text-xs sm:text-sm font-extrabold tracking-tight text-slate-900 uppercase">
              {language === "hi" ? "स्वास्थ्य प्रोफाइल" : "Health Profile"}
            </h2>

            <div className="glass-panel p-5 space-y-4 card-hover border border-white/80">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-700 to-teal-800 text-white flex items-center justify-center font-black text-sm shadow-md">
                  {firstName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{currentUser?.name || "Aarav Sharma"}</h3>
                  <p className="text-xs text-slate-400 font-medium">ABHA ID: {currentUser?.abhaId || 'Not linked'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div className="p-3 bg-white/70 rounded-xl border border-slate-100 shadow-2xs">
                  <span className="text-slate-400 font-medium block text-[10px] uppercase">Age / Gender</span>
                  <span className="font-bold text-slate-800 text-xs">{currentUser?.age || '-'} Yrs • {currentUser?.gender || '-'}</span>
                </div>

                <div className="p-3 bg-white/70 rounded-xl border border-slate-100 shadow-2xs">
                  <span className="text-slate-400 font-medium block text-[10px] uppercase">Blood Group</span>
                  <span className="font-bold text-teal-700 text-xs">{currentUser?.bloodGroup || 'Not recorded'}</span>
                </div>

                <div className="p-3 bg-white/70 rounded-xl border border-slate-100 col-span-2 shadow-2xs">
                  <span className="text-slate-400 font-medium block text-[10px] uppercase">Active Condition</span>
                  <span className="font-bold text-slate-800 text-xs">{currentUser?.conditions?.join(', ') || 'No active conditions'}</span>
                </div>

                <div className="p-3 bg-white/70 rounded-xl border border-slate-100 col-span-2 shadow-2xs">
                  <span className="text-slate-400 font-medium block text-[10px] uppercase">Primary Hospital</span>
                  <span className="font-bold text-slate-800 text-xs">{currentUser?.facilityName || 'Government General Hospital — Delhi'}</span>
                </div>
              </div>

              <Link href={currentUser?.patientId ? `/patients/${currentUser.patientId}` : "/profile"} className="block">
                <button 
                  type="button" 
                  className="btn-3d-glass w-full h-9 text-xs font-bold text-slate-700 gap-1.5"
                >
                  <span>{language === "hi" ? "पूर्ण स्वास्थ्य रिकॉर्ड देखें" : "View Full Health Records"}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </Link>
            </div>

          </div>

        </div>

        {/* ── 5. Phase 4 Nearest Delhi-NCR Hospitals & Emergency Bed Telemetry ── */}
        <div className="space-y-4 pt-2">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-teal-50 text-teal-700 rounded-xl border border-teal-200 shadow-2xs">
                  <Building2 className="w-4 h-4" />
                </div>
                <h2 className="text-base font-extrabold text-slate-900">
                  {language === "hi" ? "नजदीकी दिल्ली-एनसीआर अस्पताल एवं बेड उपलब्धता" : "Nearest Delhi-NCR Hospitals & Live Bed Telemetry"}
                </h2>
                <Badge variant="outline" className="bg-teal-50 text-teal-800 border-teal-200 text-[10px] font-bold">
                  {filteredHospitals.length} {language === "hi" ? "अस्पताल" : "Facilities"}
                </Badge>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {language === "hi"
                  ? "दिल्ली, नजफगढ़, नोएडा, ग्रेटर नोएडा, गाजियाबाद, गुरुग्राम और फरीदाबाद के 32 अस्पताल"
                  : "Discover 32 verified hospitals across Delhi, Najafgarh, Noida, Greater Noida, Ghaziabad, Gurugram & Faridabad"}
              </p>
            </div>

            <Link href="/hospitals">
              <button type="button" className="btn-3d-glass h-8 px-3 text-xs font-bold text-teal-800 border-teal-200 gap-1.5">
                <MapIcon className="w-3.5 h-3.5" />
                <span>{language === "hi" ? "पूरा लाइव मैप देखें" : "Explore Live Map"}</span>
              </button>
            </Link>
          </div>

          {/* Search Bar & Region Filters */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <div className="relative flex-1 max-w-md w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
              <Input
                placeholder={language === "hi" ? "अस्पताल, इलाका या विशेषता खोजें..." : "Search hospital, area, or specialty (e.g. AIIMS, Dwarka, Cardiology)..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 text-xs rounded-xl bg-white/80 border-slate-200/90 shadow-2xs font-medium focus-visible:ring-teal-500"
              />
            </div>

            {/* Region Filter Buttons */}
            <div className="flex gap-1.5 flex-wrap">
              {[
                { id: "ALL", label: language === "hi" ? "सभी एनसीआर" : "All NCR" },
                { id: "South & Central Delhi", label: language === "hi" ? "दक्षिण/मध्य दिल्ली" : "South/Central Delhi" },
                { id: "Dwarka & Najafgarh", label: language === "hi" ? "द्वारका और नजफगढ़" : "Dwarka & Najafgarh" },
                { id: "Noida", label: language === "hi" ? "नोएडा व ग्रेटर नोएडा" : "Noida & Gr. Noida" },
                { id: "Ghaziabad", label: language === "hi" ? "गाजियाबाद" : "Ghaziabad" },
                { id: "Gurugram", label: language === "hi" ? "गुरुग्राम" : "Gurugram" },
                { id: "Faridabad", label: language === "hi" ? "फरीदाबाद" : "Faridabad" },
              ].map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setSelectedRegion(r.id)}
                  className={`h-7 px-2.5 text-[11px] font-bold rounded-lg transition-all ${
                    selectedRegion === r.id
                      ? "bg-teal-700 text-white shadow-xs"
                      : "bg-white/80 border border-slate-200 text-slate-600 hover:bg-white"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Hospitals Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
            {filteredHospitals.slice(0, 6).map((hosp) => {
              const genTotal = hosp.generalBeds || 200;
              const genUsed = hosp.generalBedsUsed || 160;
              const genAvail = Math.max(0, genTotal - genUsed);
              const genPct = genTotal > 0 ? (genAvail / genTotal) * 100 : 0;

              const icuTotal = hosp.icuBeds || 30;
              const icuUsed = hosp.icuBedsUsed || 24;
              const icuAvail = Math.max(0, icuTotal - icuUsed);
              const icuPct = icuTotal > 0 ? (icuAvail / icuTotal) * 100 : 0;

              const rawSpecs = hosp.specialties || hosp.specialists || [];
              const specList: string[] = Array.isArray(rawSpecs)
                ? rawSpecs
                : typeof rawSpecs === "string"
                ? (rawSpecs as string).split(",")
                : [];

              const rating = hosp.rating || 4.2;
              const area = hosp.area || hosp.district || hosp.location || "Delhi-NCR";

              return (
                <div key={hosp.id} className="glass-panel p-4 card-hover flex flex-col justify-between overflow-hidden group border border-white/90 bg-white/80">
                  <div className="space-y-3">
                    
                    {/* Header: Name + Rating + Badges */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <Badge variant="outline" className="text-[9px] font-bold bg-white text-slate-600 border-slate-200">
                            {hosp.type || "Hospital"}
                          </Badge>
                          {hosp.emergencyAvailable !== false && (
                            <Badge className="bg-red-50 text-red-700 border-red-200 text-[9px] font-bold px-1.5 py-0">
                              🚨 24/7 ER
                            </Badge>
                          )}
                        </div>
                        <h3 className="font-bold text-slate-900 text-sm leading-snug group-hover:text-teal-700 transition-colors">
                          {hosp.name}
                        </h3>
                        <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1 truncate">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{area}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-1 bg-amber-50 border border-amber-200/80 px-1.5 py-0.5 rounded-lg text-amber-800 text-xs font-bold shrink-0">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{rating}</span>
                      </div>
                    </div>

                    {/* Live Bed Telemetry Progress Bars */}
                    <div className="space-y-2 bg-white/90 p-2.5 rounded-xl border border-slate-100 text-xs shadow-2xs">
                      {/* General Beds */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-semibold text-slate-600">
                          <span>General Beds</span>
                          <span className={`font-bold ${genAvail <= 10 ? "text-amber-600" : "text-emerald-700"}`}>
                            {genAvail} / {genTotal} free
                          </span>
                        </div>
                        <Progress value={100 - genPct} className="h-1.5" />
                      </div>

                      {/* ICU Beds */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-semibold text-slate-600">
                          <span>ICU Beds</span>
                          <span className={`font-bold ${icuAvail <= 3 ? "text-red-600" : "text-emerald-700"}`}>
                            {icuAvail} / {icuTotal} free
                          </span>
                        </div>
                        <Progress value={100 - icuPct} className="h-1.5" />
                      </div>
                    </div>

                    {/* Specialties Chips */}
                    {specList.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {specList.slice(0, 3).map((spec, i) => (
                          <span key={i} className="text-[9px] font-medium bg-teal-50/90 text-teal-800 border border-teal-100 px-2 py-0.5 rounded-md">
                            {spec.trim()}
                          </span>
                        ))}
                        {specList.length > 3 && (
                          <span className="text-[9px] font-medium text-slate-400 px-1 py-0.5">
                            +{specList.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                  </div>

                  {/* Card Bottom Actions */}
                  <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    {hosp.phone && (
                      <a href={`tel:${hosp.phone}`}>
                        <button type="button" className="btn-3d-glass h-8 w-8 rounded-lg p-0 flex items-center justify-center text-slate-500 hover:text-teal-700" title="Call Hospital">
                          <Phone className="w-3.5 h-3.5" />
                        </button>
                      </a>
                    )}

                    <div className="flex items-center gap-1.5 flex-1 justify-end">
                      <Link href={`/facilities/${hosp.id}`}>
                        <button type="button" className="btn-3d-glass h-7 px-2.5 text-[10px] font-bold rounded-lg text-slate-700">
                          Details
                        </button>
                      </Link>

                      <Link href={`/scheduling?facilityId=${hosp.id}`}>
                        <button type="button" className="btn-3d-primary h-7 px-3 text-[10px] font-bold rounded-lg">
                          Book OPD
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Show View All Link if more hospitals exist */}
          {filteredHospitals.length > 6 && (
            <div className="text-center pt-2">
              <Link href="/hospitals">
                <button type="button" className="btn-3d-glass h-9 px-4 text-xs font-bold text-teal-800 border-teal-200 gap-1.5">
                  <span>{language === "hi" ? `सभी ${filteredHospitals.length} अस्पताल और लाइव मैप देखें` : `View all ${filteredHospitals.length} hospitals & live map`}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </Link>
            </div>
          )}

          {filteredHospitals.length === 0 && (
            <div className="text-center py-8 glass-panel p-6 space-y-2">
              <Building2 className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="font-bold text-slate-800 text-sm">
                {language === "hi" ? "कोई अस्पताल नहीं मिला" : "No hospitals found"}
              </p>
              <p className="text-xs text-slate-500">
                {language === "hi" ? "कृपया अपनी खोज या क्षेत्र फ़िल्टर बदलें।" : "Try adjusting your search query or region filter."}
              </p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
