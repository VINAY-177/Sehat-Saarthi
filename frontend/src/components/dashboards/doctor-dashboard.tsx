"use client";

import Link from "next/link";
import Image from "next/image";
import { useStore } from "@/lib/store";
import { Urgency } from "@/lib/types";
import { formatAppointmentTime, getAppointmentDateKey } from "@/lib/appointment-time";
import { UrgencyBadge } from "@/components/urgency-badge";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  AlertTriangle, 
  Calendar, 
  Activity, 
  Clock, 
  Stethoscope,
  Play,
  FileCheck,
} from "lucide-react";

export function DoctorDashboard() {
  const { patients = [], screenings = [], referrals = [], currentUser, language, appointments = [] } = useStore();

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
      const isDoctorMatch = currentUser?.doctorId ? a.doctorId === currentUser.doctorId : true;
      return isDoctorMatch && apptDate === today && !['CANCELLED', 'DECLINED'].includes(a.status);
    })
    .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())
    .map((a) => ({
      id: a.id,
      patientName: a.patient?.name || 'Patient',
      patientId: a.patient?.id || a.patientId || '',
      age: a.patient?.age ? `${a.patient.age} yrs` : '-',
      gender: a.patient?.gender || '-',
      bloodGroup: a.patient?.bloodGroup || '',
      time: formatAppointmentTime(a.dateTime, { hour: 'numeric', minute: '2-digit', hour12: true }),
      type: a.visitType || 'NEW',
      status: a.status,
      reason: a.reason || 'General Consultation',
    }));

  const triagePatient = patients.find((p) => p.riskLevel === "HIGH" || p.riskLevel === "EMERGENCY") || patients.find((p) => p.riskLevel === "MODERATE") || patients[0];

  return (
    <div className="relative min-h-screen w-full p-4 sm:p-8 overflow-x-hidden font-sans">
      
      {/* ── 1. Full-bleed Clinical Diagnostic Photography Background ── */}
      <div className="fixed inset-0 pointer-events-none -z-20 overflow-hidden">
        <Image
          src="/backgrounds/doctor-dashboard.jpg"
          alt="Clinical Doctor Workstation"
          fill
          priority
          className="object-cover object-center scale-105 transition-transform duration-1000 ease-out"
        />
        {/* Deep Clinical Atmospheric Veil */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-900/50 to-slate-950/80 backdrop-blur-[5px]" />
      </div>

      {/* ── 2. Deep Clinical Ambient Glows ── */}
      <div className="fixed top-1/4 right-10 w-[500px] h-[500px] bg-sky-500/20 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" />
      <div className="fixed bottom-1/4 left-10 w-[450px] h-[450px] bg-teal-500/15 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="relative max-w-7xl mx-auto space-y-6 pb-16 z-10 page-enter">
        
        {/* ── 1. Header Section — Doctor Greeting & On-Duty Status ── */}
        <div className="glass-card-auth p-6 sm:p-7 rounded-[28px] border border-white/70 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5 backdrop-blur-2xl bg-white/90">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-extrabold shadow-2xs">
              <Stethoscope className="w-4 h-4 text-teal-600" />
              <span>{currentUser?.specialty || "General Physician"} • On-Duty OPD Clinic</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
              {greeting}, {currentUser?.name || "Dr. Priya Mehta"} 👋
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm font-medium max-w-xl">
              {language === "hi" 
                ? `आज आपके पास ${todayAppointments.length} अपॉइंटमेंट निर्धारित हैं।` 
                : `You have ${todayAppointments.length} clinical appointments and EHR encounters scheduled today.`}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link href="/patients">
              <button 
                type="button" 
                className="btn-3d-glass h-11 px-4 text-xs font-bold text-slate-800 border-slate-200 gap-2"
              >
                <Users className="w-4 h-4 text-teal-600" />
                <span>{language === "hi" ? "मरीज़ रजिस्ट्री" : "Patient Registry"}</span>
              </button>
            </Link>

            <Link href="/scheduling">
              <button 
                type="button" 
                className="btn-3d-primary h-11 px-5 text-xs font-extrabold gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>{language === "hi" ? "रोस्टर व स्लॉट" : "OPD Schedule"}</span>
              </button>
            </Link>
          </div>
        </div>

        {/* ── 2. Top Metric Statistics Grid ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-panel p-5 card-hover stagger-1 bg-white/90 border-white/80 rounded-[24px]">
            <div className="flex items-center justify-between pb-1">
              <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                {language === "hi" ? "आज के अपॉइंटमेंट" : "Today's OPD Queue"}
              </span>
              <div className="p-2.5 rounded-xl bg-teal-100 text-teal-800 border border-teal-200 shadow-2xs">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900 mt-2">{todayAppointments.length}</div>
            <p className="text-[11px] text-teal-700 font-bold mt-1">{language === "hi" ? "कुल निर्धारित" : "Scheduled consultations"}</p>
          </div>

          <div className="glass-panel p-5 card-hover stagger-2 bg-white/90 border-white/80 rounded-[24px]">
            <div className="flex items-center justify-between pb-1">
              <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                {language === "hi" ? "कुल पंजीकृत मरीज़" : "Total Patients"}
              </span>
              <div className="p-2.5 rounded-xl bg-blue-100 text-blue-800 border border-blue-200 shadow-2xs">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900 mt-2">{patients.length || 18}</div>
            <p className="text-[11px] text-blue-700 font-bold mt-1">{language === "hi" ? "सक्रिय ईएचआर" : "Active EHR records"}</p>
          </div>

          <div className="glass-panel p-5 card-hover stagger-3 bg-white/90 border-white/80 rounded-[24px]">
            <div className="flex items-center justify-between pb-1">
              <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                {language === "hi" ? "लंबित रेफरल" : "Pending Referrals"}
              </span>
              <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800 border border-amber-200 shadow-2xs">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900 mt-2">{pendingReferrals.length || 2}</div>
            <p className="text-[11px] text-amber-700 font-bold mt-1">{language === "hi" ? "समीक्षा आवश्यक" : "Awaiting triage"}</p>
          </div>

          <div className="glass-panel p-5 card-hover stagger-4 bg-white/90 border-white/80 rounded-[24px]">
            <div className="flex items-center justify-between pb-1">
              <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                {language === "hi" ? "आपातकालीन ट्रायज" : "Emergency Alerts"}
              </span>
              <div className="p-2.5 rounded-xl bg-red-100 text-red-700 border border-red-200 shadow-2xs">
                <Activity className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-red-600 mt-2">{emergencyScreenings.length || 1}</div>
            <p className="text-[11px] text-red-700 font-bold mt-1">{language === "hi" ? "रेड अलर्ट मरीज" : "Immediate review"}</p>
          </div>
        </div>

        {/* ── 3. Split Main Section: Today's Clinical Schedule & Clinical Alert Spotlight ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column (8 cols): Today's Schedule Table */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-teal-100 text-teal-800 rounded-xl border border-teal-200 shadow-2xs">
                  <Clock className="w-4 h-4" />
                </div>
                <h2 className="text-sm font-extrabold tracking-tight text-white uppercase drop-shadow-sm">
                  {language === "hi" ? "आज की ओपीडी सूची" : "Today's Clinical Roster"}
                </h2>
              </div>

              <Link href="/scheduling">
                <button type="button" className="btn-3d-glass h-9 px-3.5 text-xs font-bold text-teal-900 border-teal-200">
                  {language === "hi" ? "पूरा कैलेंडर देखें" : "View Full Calendar"}
                </button>
              </Link>
            </div>

            <div className="glass-panel overflow-hidden border border-white/85 bg-white/90 shadow-xl rounded-[28px]">
              {todayAppointments.length === 0 ? (
                <div className="text-center py-12 p-6 space-y-2">
                  <Calendar className="w-10 h-10 mx-auto text-slate-300" />
                  <p className="font-bold text-slate-800 text-sm">
                    {language === "hi" ? "आज कोई अपॉइंटमेंट नहीं" : "No appointments scheduled for today"}
                  </p>
                  <p className="text-xs text-slate-500">
                    {language === "hi" ? "नया अपॉइंटमेंट शेड्यूल करने के लिए शेड्यूलिंग पेज पर जाएं।" : "Open the scheduling module to manage walk-in patients."}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase tracking-wider font-extrabold">
                        <th className="py-3.5 px-4 text-left">Time</th>
                        <th className="py-3.5 px-4 text-left">Patient</th>
                        <th className="py-3.5 px-4 text-left">Chief Complaint</th>
                        <th className="py-3.5 px-4 text-left">Status</th>
                        <th className="py-3.5 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {todayAppointments.map((appt) => (
                        <tr key={appt.id} className="hover:bg-teal-50/50 transition-colors">
                          <td className="py-4 px-4 font-bold text-slate-800 whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-teal-600" />
                              <span>{appt.time}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4 font-bold text-slate-900">
                            <div>{appt.patientName}</div>
                            <div className="text-[10px] text-slate-400 font-normal">{appt.age} • {appt.gender}</div>
                          </td>
                          <td className="py-4 px-4 text-slate-600 font-medium max-w-[180px] truncate">
                            {appt.reason}
                          </td>
                          <td className="py-4 px-4">
                            <Badge className={`text-[10px] font-bold py-0.5 ${
                              appt.status === "COMPLETED"
                                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                : appt.status === "IN_CONSULTATION"
                                ? "bg-teal-50 text-teal-800 border-teal-300"
                                : "bg-purple-50 text-purple-800 border-purple-200"
                            }`}>
                              {appt.status}
                            </Badge>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <Link href={`/patients/${appt.patientId}/encounter?appointmentId=${appt.id}`}>
                              <button 
                                type="button" 
                                className="btn-3d-primary h-8 px-3 text-[10px] font-bold rounded-xl gap-1"
                              >
                                <Play className="w-3 h-3 fill-current" />
                                <span>Consult</span>
                              </button>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Right Column (4 cols): Priority Clinical Triage & Quick Prescriptions */}
          <div className="lg:col-span-4 space-y-4">
            
            <div className="flex items-center justify-between">
              <h2 className="text-xs sm:text-sm font-extrabold tracking-tight text-white uppercase drop-shadow-sm">
                {language === "hi" ? "प्राथमिकता ट्रायज" : "Priority Patient Triage"}
              </h2>
            </div>

            {triagePatient && (
              <div className="glass-panel p-6 space-y-4 card-hover border border-teal-200/90 bg-white/90 shadow-xl rounded-[28px]">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-800 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                    High Attention
                  </span>
                  <UrgencyBadge urgency={triagePatient.riskLevel === "EMERGENCY" ? Urgency.EMERGENCY : Urgency.HIGH} />
                </div>

                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg">{triagePatient.name}</h3>
                  <p className="text-xs text-slate-500 font-medium">
                    MRN: {triagePatient.mrn || "MRN-2026-0001"} • {triagePatient.age || 28} Yrs • {triagePatient.gender || "Male"}
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1 text-xs">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Clinical Summary</span>
                  <p className="text-slate-700 font-medium leading-relaxed">
                    Patient presenting with acute chest discomfort and elevated BP readings. Continuous telemetry recommended.
                  </p>
                </div>

                <div className="pt-1 flex items-center gap-2.5">
                  <Link href={`/patients/${triagePatient.id}`} className="flex-1">
                    <button type="button" className="btn-3d-glass w-full h-10 text-xs font-bold text-slate-800 rounded-xl">
                      Open 360°
                    </button>
                  </Link>

                  <Link href={`/patients/${triagePatient.id}/encounter`} className="flex-1">
                    <button type="button" className="btn-3d-primary w-full h-10 text-xs font-bold gap-1.5 rounded-xl">
                      <FileCheck className="w-4 h-4" />
                      <span>Encounter</span>
                    </button>
                  </Link>
                </div>
              </div>
            )}

            {/* Quick Operational Telemetry Summary */}
            <div className="glass-panel p-5 space-y-3.5 border border-white/85 bg-white/90 rounded-[28px] shadow-xl">
              <h4 className="text-xs font-extrabold text-slate-900 uppercase">Emergency Ward Status</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center text-slate-600 font-semibold">
                  <span>General Ward Capacity</span>
                  <span className="text-teal-800 font-bold">88% Occupied</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-teal-600 rounded-full" style={{ width: "88%" }} />
                </div>

                <div className="flex justify-between items-center text-slate-600 font-semibold pt-1">
                  <span>ICU Bed Availability</span>
                  <span className="text-emerald-700 font-bold">4 Beds Available</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: "20%" }} />
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
