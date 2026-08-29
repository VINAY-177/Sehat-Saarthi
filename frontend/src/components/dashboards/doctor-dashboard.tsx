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
    <div className="relative min-h-[calc(100vh-5rem)] -m-4 sm:-m-6 p-4 sm:p-6 overflow-hidden bg-[#F8FAFC]">
      
      {/* ── 1. Unique Doctor Clinical Workspace Background Image & Overlay ── */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <Image
          src="/backgrounds/doctor-dashboard.jpg"
          alt="Clinical Doctor Workstation"
          fill
          priority
          className="object-cover object-center opacity-20 mix-blend-multiply scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/10 via-slate-50/85 to-[#F8FAFC]/95 backdrop-blur-[2px]" />
      </div>

      {/* ── 2. Deep Clinical Ambient Glows ── */}
      <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-gradient-to-bl from-teal-600/12 via-sky-600/6 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-sky-600/10 via-teal-600/5 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      
      {/* Dot Matrix */}
      <div className="absolute inset-0 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:32px_32px] opacity-15 pointer-events-none -z-10" />

      <div className="relative max-w-7xl mx-auto space-y-6 pb-12 z-10 page-enter">
        
        {/* ── 1. Header Section — Doctor Greeting & On-Duty Status ── */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-1 section-enter">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold shadow-2xs">
              <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
              <span>{currentUser?.specialty || "General Physician"} • OPD Clinical Desk</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
              {greeting}, {currentUser?.name || "Dr. Priya Mehta"} 👋
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm font-medium">
              {language === "hi" 
                ? `आज आपके पास ${todayAppointments.length} अपॉइंटमेंट निर्धारित हैं।` 
                : `You have ${todayAppointments.length} appointments scheduled today.`}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link href="/patients">
              <button 
                type="button" 
                className="btn-3d-glass h-10 px-4 text-xs font-bold text-slate-800 border-slate-200 gap-1.5"
              >
                <Users className="w-4 h-4 text-teal-600" />
                <span>{language === "hi" ? "मरीज़ रजिस्ट्री" : "Patient Registry"}</span>
              </button>
            </Link>

            <Link href="/scheduling">
              <button 
                type="button" 
                className="btn-3d-primary h-10 px-4 text-xs font-bold gap-2"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>{language === "hi" ? "रोस्टर व स्लॉट" : "OPD Schedule"}</span>
              </button>
            </Link>
          </div>
        </div>

        {/* ── 2. Top Metric Statistics Grid ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div className="glass-panel p-4 card-hover stagger-1">
            <div className="flex items-center justify-between pb-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                {language === "hi" ? "आज के अपॉइंटमेंट" : "Today's OPD Queue"}
              </span>
              <div className="p-2 rounded-xl bg-teal-50 text-teal-700 border border-teal-100 shadow-2xs">
                <Calendar className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 mt-1">{todayAppointments.length}</div>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">{language === "hi" ? "कुल निर्धारित" : "Scheduled consultations"}</p>
          </div>

          <div className="glass-panel p-4 card-hover stagger-2">
            <div className="flex items-center justify-between pb-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                {language === "hi" ? "कुल पंजीकृत मरीज़" : "Total Patients"}
              </span>
              <div className="p-2 rounded-xl bg-blue-50 text-blue-700 border border-blue-100 shadow-2xs">
                <Users className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 mt-1">{patients.length || 18}</div>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">{language === "hi" ? "सक्रिय ईएचआर" : "Active EHR records"}</p>
          </div>

          <div className="glass-panel p-4 card-hover stagger-3">
            <div className="flex items-center justify-between pb-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                {language === "hi" ? "लंबित रेफरल" : "Pending Referrals"}
              </span>
              <div className="p-2 rounded-xl bg-amber-50 text-amber-700 border border-amber-100 shadow-2xs">
                <AlertTriangle className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 mt-1">{pendingReferrals.length || 2}</div>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">{language === "hi" ? "समीक्षा आवश्यक" : "Awaiting triage"}</p>
          </div>

          <div className="glass-panel p-4 card-hover stagger-4">
            <div className="flex items-center justify-between pb-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                {language === "hi" ? "आपातकालीन ट्रायज" : "Emergency Alerts"}
              </span>
              <div className="p-2 rounded-xl bg-red-50 text-red-600 border border-red-100 shadow-2xs">
                <Activity className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl font-black text-red-600 mt-1">{emergencyScreenings.length || 1}</div>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">{language === "hi" ? "रेड अलर्ट मरीज" : "Immediate review"}</p>
          </div>
        </div>

        {/* ── 3. Split Main Section: Today's Clinical Schedule & Clinical Alert Spotlight ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column (8 cols): Today's Schedule Table */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-teal-50 text-teal-700 rounded-xl border border-teal-100 shadow-2xs">
                  <Clock className="w-4 h-4" />
                </div>
                <h2 className="text-sm font-extrabold tracking-tight text-slate-900 uppercase">
                  {language === "hi" ? "आज की ओपीडी सूची" : "Today's Clinical Roster"}
                </h2>
              </div>

              <Link href="/scheduling">
                <button type="button" className="btn-3d-glass h-8 px-3 text-xs font-bold text-teal-800 border-teal-200">
                  {language === "hi" ? "पूरा कैलेंडर देखें" : "View Full Calendar"}
                </button>
              </Link>
            </div>

            <div className="glass-panel overflow-hidden border border-white/90 bg-white/85 shadow-md">
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
                      <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500 uppercase tracking-wider font-extrabold">
                        <th className="py-3 px-4 text-left">Time</th>
                        <th className="py-3 px-4 text-left">Patient</th>
                        <th className="py-3 px-4 text-left">Chief Complaint</th>
                        <th className="py-3 px-4 text-left">Status</th>
                        <th className="py-3 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {todayAppointments.map((appt) => (
                        <tr key={appt.id} className="hover:bg-teal-50/40 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-slate-800 whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-teal-600" />
                              <span>{appt.time}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-bold text-slate-900">
                            <div>{appt.patientName}</div>
                            <div className="text-[10px] text-slate-400 font-normal">{appt.age} • {appt.gender}</div>
                          </td>
                          <td className="py-3.5 px-4 text-slate-600 font-medium max-w-[180px] truncate">
                            {appt.reason}
                          </td>
                          <td className="py-3.5 px-4">
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
                          <td className="py-3.5 px-4 text-right">
                            <Link href={`/patients/${appt.patientId}/encounter?appointmentId=${appt.id}`}>
                              <button 
                                type="button" 
                                className="btn-3d-primary h-7 px-2.5 text-[10px] font-bold rounded-lg gap-1"
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
              <h2 className="text-xs sm:text-sm font-extrabold tracking-tight text-slate-900 uppercase">
                {language === "hi" ? "प्राथमिकता ट्रायज" : "Priority Patient Triage"}
              </h2>
            </div>

            {triagePatient && (
              <div className="glass-panel p-5 space-y-3.5 card-hover border border-teal-200/80 bg-white/90 shadow-md">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-800 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                    High Attention
                  </span>
                  <UrgencyBadge urgency={triagePatient.riskLevel === "EMERGENCY" ? Urgency.EMERGENCY : Urgency.HIGH} />
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-base">{triagePatient.name}</h3>
                  <p className="text-xs text-slate-500 font-medium">
                    MRN: {triagePatient.mrn || "MRN-2026-0001"} • {triagePatient.age || 28} Yrs • {triagePatient.gender || "Male"}
                  </p>
                </div>

                <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100 space-y-1 text-xs">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Clinical Summary</span>
                  <p className="text-slate-700 font-medium leading-relaxed">
                    Patient presenting with acute chest discomfort and elevated BP readings. Continuous telemetry recommended.
                  </p>
                </div>

                <div className="pt-1 flex items-center gap-2">
                  <Link href={`/patients/${triagePatient.id}`} className="flex-1">
                    <button type="button" className="btn-3d-glass w-full h-9 text-xs font-bold text-slate-700">
                      Open 360°
                    </button>
                  </Link>

                  <Link href={`/patients/${triagePatient.id}/encounter`} className="flex-1">
                    <button type="button" className="btn-3d-primary w-full h-9 text-xs font-bold gap-1">
                      <FileCheck className="w-3.5 h-3.5" />
                      <span>Encounter</span>
                    </button>
                  </Link>
                </div>
              </div>
            )}

            {/* Quick Operational Telemetry Summary */}
            <div className="glass-panel p-4 space-y-3 border border-white/80 bg-white/80">
              <h4 className="text-xs font-extrabold text-slate-900 uppercase">Emergency Ward Status</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center text-slate-600 font-semibold">
                  <span>General Ward Capacity</span>
                  <span className="text-teal-800 font-bold">88% Occupied</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-teal-600 rounded-full" style={{ width: "88%" }} />
                </div>

                <div className="flex justify-between items-center text-slate-600 font-semibold pt-1">
                  <span>ICU Bed Availability</span>
                  <span className="text-emerald-700 font-bold">4 Beds Available</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
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
