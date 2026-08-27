"use client";

import Link from "next/link";
import Image from "next/image";
import { useStore } from "@/lib/store";
import { Urgency } from "@/lib/types";
import { formatAppointmentTime, getAppointmentDateKey } from "@/lib/appointment-time";
import { StatCard } from "@/components/stat-card";
import { UrgencyBadge } from "@/components/urgency-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  AlertTriangle, 
  Ambulance, 
  Calendar, 
  Activity, 
  ArrowRight, 
  Clock, 
  Building2,
} from "lucide-react";

export function DoctorDashboard() {
  const { patients, screenings, referrals, currentUser, language, appointments = [] } = useStore();

  const emergencyScreenings = screenings.filter((s) => s.urgency === Urgency.EMERGENCY);
  const pendingReferrals = referrals.filter((r) => r.status === "PENDING");

  const currentHour = new Date().getHours();
  let greeting = "Good evening";
  if (currentHour >= 5 && currentHour < 12) {
    greeting = "Good morning";
  } else if (currentHour >= 12 && currentHour < 17) {
    greeting = "Good afternoon";
  } else if (currentHour >= 17 && currentHour < 22) {
    greeting = "Good evening";
  } else {
    greeting = "Good night";
  }

  const today = getAppointmentDateKey(new Date());
  const todayAppointments = appointments
    .filter((a) => {
      const apptDate = getAppointmentDateKey(a.dateTime);
      return a.doctorId === currentUser?.doctorId && apptDate === today && !['CANCELLED', 'DECLINED'].includes(a.status);
    })
    .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())
    .map((a) => ({
      id: a.id,
      patientName: a.patient?.name || 'Patient',
      patientId: a.patient?.id || '',
      age: a.patient?.age || '-',
      gender: a.patient?.gender || '-',
      time: formatAppointmentTime(a.dateTime, { hour: 'numeric', minute: '2-digit', hour12: true }),
      type: a.visitType || 'NEW',
      status: a.status,
      reason: a.reason || 'General Consultation',
    }));

  return (
    <div className="relative min-h-[calc(100vh-5rem)] -m-4 sm:-m-6 p-4 sm:p-6 overflow-hidden bg-[#F8FAFC]">
      
      {/* Visible Clinical ECG Telemetry Background Image */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <Image
          src="/doctor-bg.jpg"
          alt="Clinical ECG background"
          fill
          priority
          className="object-cover object-top opacity-15 mix-blend-multiply"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-slate-50/85 to-[#F8FAFC]" />
      </div>

      {/* Ultra-subtle Ambient Clinical Background Accents */}
      <div 
        className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-sky-600/8 via-teal-600/4 to-transparent rounded-full blur-3xl pointer-events-none -z-10" 
      />
      <div 
        className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-teal-600/6 via-sky-600/3 to-transparent rounded-full blur-3xl pointer-events-none -z-10" 
      />
      {/* Subtle Clinical Dot Matrix Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:32px_32px] opacity-20 pointer-events-none -z-10" />

      <div className="relative max-w-7xl mx-auto space-y-6 pb-12 z-10 page-enter">
        
        {/* 1. Header Section — Doctor Greeting & On-Duty Status */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-1 section-enter">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              {greeting}, {currentUser?.name || "Dr. Priya Mehta"} 👋
            </h1>
            <p className="text-slate-500 text-sm font-medium">
              {language === "hi" 
                ? `आज आपके पास ${todayAppointments.length} अपॉइंटमेंट निर्धारित हैं।` 
                : `You have ${todayAppointments.length} appointments scheduled for today.`}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-slate-200/80 shadow-xs text-xs font-semibold text-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 pulse-subtle" />
              <span>On Duty</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-500 font-medium">{currentUser?.specialty || "General Medicine"}</span>
            </div>

            <Link href="/assess">
              <Button className="bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs h-9 px-3.5 rounded-xl shadow-xs gap-1.5 transition-all btn-press">
                <Activity className="w-3.5 h-3.5" />
                {language === "hi" ? "नया क्लिनिकल ट्राइएज" : "New AI Triage"}
              </Button>
            </Link>
          </div>
        </div>

        {/* 2. Doctor Statistics — 4 Compact Metrics */}
        <div className="grid gap-3.5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title={language === "hi" ? "आज के अपॉइंटमेंट्स" : "Today's Appointments"}
            value={todayAppointments.length.toString()}
            icon={<Calendar className="h-4 w-4 text-sky-700" />}
            description={`${todayAppointments.length} appointments today`}
            className="stagger-1"
          />
          <StatCard
            title={language === "hi" ? "लंबित समीक्षाएं" : "Pending Reviews"}
            value={emergencyScreenings.length > 0 ? emergencyScreenings.length : "1"}
            icon={<AlertTriangle className="h-4 w-4 text-amber-600" />}
            description="Clinical triage cases"
            className="stagger-2"
          />
          <StatCard
            title={language === "hi" ? "रेफरल केस" : "Outbound Referrals"}
            value={pendingReferrals.length > 0 ? pendingReferrals.length : "1"}
            icon={<Ambulance className="h-4 w-4 text-teal-700" />}
            description="AIIMS Cardiology dispatch"
            className="stagger-3"
          />
          <StatCard
            title={language === "hi" ? "कुल पंजीकृत मरीज" : "Total Patients"}
            value={patients.length > 0 ? patients.length : "1"}
            icon={<Users className="h-4 w-4 text-slate-700" />}
            description="Under primary care"
            className="stagger-4"
          />
        </div>

        {/* 3. Main Clinical Layout: Today's Schedule & Patient Queue (7 cols) & Clinical Actions (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Today's Schedule & Patient Queue (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            
            <Card className="bg-white shadow-xs border border-slate-200/80 rounded-2xl overflow-hidden card-hover">
              <CardHeader className="py-3.5 px-5 bg-slate-50/70 border-b border-slate-100 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    {language === "hi" ? "आज का अपॉइंटमेंट शेड्यूल" : "Today's Schedule & Queue"}
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500 font-medium">
                    Chronological consultation queue for {new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </CardDescription>
                </div>
                <Badge variant="outline" className="text-[11px] bg-sky-50 text-sky-800 border-sky-200 font-bold px-2.5 py-0.5">
                  {todayAppointments.length} Patients Scheduled
                </Badge>
              </CardHeader>

              <CardContent className="p-0">
                <div className="divide-y divide-slate-100">
                  {todayAppointments.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 text-sm">
                      No appointments scheduled for today.
                    </div>
                  ) : (
                    todayAppointments.map((appt) => (
                      <div key={appt.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 transition-colors">
                        <div className="flex items-start gap-3.5">
                          <div className="p-2.5 bg-slate-100 rounded-xl text-slate-700 font-bold text-xs shrink-0 flex flex-col items-center justify-center min-w-[65px]">
                            <Clock className="w-3.5 h-3.5 mb-0.5 text-slate-500" />
                            <span>{appt.time}</span>
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-sm text-slate-900">{appt.patientName}</span>
                              <span className="text-[11px] text-slate-400 font-medium">({appt.age})</span>
                              
                              {/* Status Indicators: Green=Completed, Amber=Waiting, Slate=Upcoming */}
                              {appt.status === "CONFIRMED" && (
                                <Badge className="bg-emerald-50 text-emerald-800 border-emerald-200 text-[10px] font-bold py-0">
                                  Confirmed
                                </Badge>
                              )}
                              {appt.status === "WAITING" && (
                                <Badge className="bg-amber-50 text-amber-800 border-amber-200 text-[10px] font-bold py-0">
                                  Waiting
                                </Badge>
                              )}
                              {appt.status === "CHECKED_IN" && (
                                <Badge className="bg-blue-50 text-blue-800 border-blue-200 text-[10px] font-bold py-0">
                                  Checked In
                                </Badge>
                              )}
                              {(appt.status === "REQUESTED" || appt.status === "UPCOMING") && (
                                <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200 text-[10px] font-medium py-0">
                                  Upcoming
                                </Badge>
                              )}
                            </div>

                            <p className="text-xs text-slate-600 font-medium">
                              <span className="font-semibold text-slate-700">{appt.type}:</span> {appt.reason}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 sm:self-center shrink-0">
                          <Link href={`/patients/${appt.patientId}`}>
                            <Button 
                              size="sm" 
                              className="h-8 text-xs font-bold rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 shadow-xs"
                            >
                              View Patient
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Priority Triage Cases Preview */}
            <Card className="bg-white shadow-xs border border-slate-200/80 rounded-2xl overflow-hidden card-hover">
              <CardHeader className="py-3 px-5 bg-slate-50/70 border-b border-slate-100 flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  AI Triage & Clinical Risk Cases
                </CardTitle>
                <Link href="/assess">
                  <Button variant="ghost" size="sm" className="text-teal-700 text-xs px-2 h-7 gap-1 font-bold">
                    View All <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="p-4">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">Aarav Sharma</span>
                      <UrgencyBadge urgency={Urgency.MODERATE} size="sm" />
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Hypertension mild (BP 138/88 mmHg) • Score: 45/100
                    </p>
                  </div>
                  <Link href="/patients/pat-aarav-001">
                    <Button size="sm" variant="ghost" className="h-7 text-xs font-bold text-teal-700 hover:bg-teal-50">
                      Review
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

          </div>
          
          {/* Right Sidebar: Quick Clinical Actions & Recent Referrals (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Quick Clinical Actions */}
            <Card className="bg-white shadow-xs border border-slate-200/80 rounded-2xl overflow-hidden card-hover">
              <CardHeader className="bg-slate-50/70 border-b border-slate-100 py-3 px-5">
                <CardTitle className="text-xs font-bold text-slate-900 uppercase tracking-wider">Clinical Tools</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-2.5">
                <Link href="/assess" className="block">
                  <Button className="w-full justify-start gap-2.5 h-10 text-xs font-bold bg-teal-700 hover:bg-teal-800 text-white rounded-xl shadow-xs btn-press">
                    <Activity className="h-4 w-4" />
                    New AI Clinical Assessment
                  </Button>
                </Link>
                <Link href="/patients" className="block">
                  <Button className="w-full justify-start gap-2.5 h-10 text-xs font-bold rounded-xl border-slate-200 hover:bg-slate-50 text-slate-700 btn-press" variant="outline">
                    <Users className="h-4 w-4 text-sky-700" />
                    Patient Records (360° EHR)
                  </Button>
                </Link>
                <Link href="/referrals" className="block">
                  <Button className="w-full justify-start gap-2.5 h-10 text-xs font-bold rounded-xl border-slate-200 hover:bg-slate-50 text-slate-700 btn-press" variant="outline">
                    <Ambulance className="h-4 w-4 text-amber-600" />
                    Initiate Tertiary Referral
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Outbound Tertiary Referral Spotlight */}
            <Card className="bg-white shadow-xs border border-slate-200/80 rounded-2xl overflow-hidden card-hover">
              <CardHeader className="flex flex-row items-center justify-between py-3 px-5 bg-slate-50/70 border-b border-slate-100">
                <CardTitle className="text-xs font-bold text-slate-900 uppercase tracking-wider">Active Referrals</CardTitle>
                <Link href="/referrals">
                  <Button variant="ghost" size="sm" className="text-teal-700 text-xs px-2 h-7 gap-1 font-bold">
                    All <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50 space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <span className="font-bold text-xs text-slate-900">Aarav Sharma</span>
                    <UrgencyBadge urgency={Urgency.MODERATE} size="sm" />
                  </div>
                  
                  <div className="text-[11px] text-slate-600 flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5 shrink-0 text-slate-400" /> 
                    <span className="font-medium">To: AIIMS New Delhi (Cardiology)</span>
                  </div>

                  <p className="text-[11px] text-slate-500">
                    Reason: Further 24h ambulatory BP monitoring & cardio review
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[10px]">
                    <span className="text-slate-400 font-mono">Status: PENDING</span>
                    <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200 text-[9px] font-bold">
                      Awaiting Intake
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>

      </div>
    </div>
  );
}
