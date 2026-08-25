"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { Urgency, Role } from "@/lib/types";
import { StatCard } from "@/components/stat-card";
import { UrgencyBadge } from "@/components/urgency-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, AlertTriangle, Ambulance, Bed, Activity, ArrowRight, Stethoscope } from "lucide-react";
import { AppointmentCalendarWidget } from "@/components/appointment-calendar-widget";

export function DoctorDashboard() {
  const { patients, screenings, referrals, stats, currentUser } = useStore();

  const emergencyScreenings = screenings.filter((s) => s.urgency === Urgency.EMERGENCY);
  const pendingReferrals = referrals.filter((r) => r.status === "PENDING");

  const sortedScreenings = [...screenings].sort((a, b) => {
    const urgencyWeight: Record<string, number> = {
      [Urgency.EMERGENCY]: 3,
      [Urgency.HIGH]: 2,
      "MEDIUM": 1,
      [Urgency.LOW]: 0,
    };
    return (urgencyWeight[b.urgency] || 0) - (urgencyWeight[a.urgency] || 0);
  });

  return (
    <div className="relative min-h-[calc(100vh-5rem)] -m-4 sm:-m-6 p-4 sm:p-6 overflow-hidden">
      {/* Ultra-subtle Ambient Clinical Background Watermark */}
      <div 
        className="absolute inset-0 bg-cover bg-top bg-no-repeat opacity-[0.04] pointer-events-none -z-10 mix-blend-multiply"
        style={{ backgroundImage: "url('/doctor-bg.jpg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50/40 via-background/90 to-background pointer-events-none -z-10" />

      <div className="relative max-w-7xl mx-auto space-y-6 pb-16 animate-in fade-in duration-300 z-10">
        
        {/* Clinical Command Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200/80 pb-4 mt-2">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-sm">
              <Stethoscope className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700">Clinical Command Center</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                Clinical Triage &amp; Encounters
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Real-time priority triage queues, live AI risk stratification, and hospital referrals.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-2.5 bg-white px-4 py-2 rounded-2xl border border-slate-200/80 shadow-xs text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-slate-800">{currentUser?.name || "Dr. Sarah Chen"}</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-500 font-medium">{currentUser?.specialty || "General Medicine"}</span>
            </div>
          </div>
        </div>

        {/* 4 Key Metric Cards */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Active Patients"
            value={patients.length}
            icon={<Users className="h-4 w-4 text-blue-600" />}
            description="Currently registered in EHR"
          />
          <StatCard
            title="Emergency Red-Alerts"
            value={emergencyScreenings.length}
            icon={<AlertTriangle className="h-4 w-4 text-rose-600" />}
            description="Requires immediate clinical review"
            className={emergencyScreenings.length > 0 ? "border-rose-300 bg-rose-50/20" : ""}
          />
          <StatCard
            title="Pending Referrals"
            value={pendingReferrals.length}
            icon={<Ambulance className="h-4 w-4 text-amber-600" />}
            description="Awaiting inter-hospital dispatch"
          />
          <StatCard
            title="ICU Beds Available"
            value={stats.totalICUAvailable || 18}
            icon={<Bed className="h-4 w-4 text-emerald-600" />}
            description="Live available in network"
          />
        </div>

        {/* Main Clinical Grid: Left Triage Table (8 cols) & Right Actions (4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Priority Triage Queue (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <Card className="bg-white shadow-xs border border-slate-200/80 rounded-2xl overflow-hidden">
              <CardHeader className="bg-slate-50/70 border-b border-slate-100 py-4 px-6 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold text-slate-900">Priority Triage Queue</CardTitle>
                  <CardDescription className="text-xs text-slate-500 font-medium">Patients stratified by AI risk engine, ordered by clinical urgency.</CardDescription>
                </div>
                <Badge variant="outline" className="text-[11px] bg-blue-50 text-blue-700 border-blue-200 font-bold px-2.5 py-0.5">
                  {sortedScreenings.length} Active Cases
                </Badge>
              </CardHeader>

              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="text-[11px] text-slate-400 uppercase bg-slate-50/50 border-b border-slate-100 font-bold">
                      <tr>
                        <th className="px-5 py-3">Patient</th>
                        <th className="px-4 py-3">Risk Score</th>
                        <th className="px-4 py-3">Urgency</th>
                        <th className="px-4 py-3">Key Symptoms</th>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-5 py-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {sortedScreenings.map((screening) => {
                        const patient = patients.find((p) => p.id === screening.patientId);
                        return (
                          <tr key={screening.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="px-5 py-3.5 font-bold text-slate-900">
                              {patient?.name || "Patient Record"}
                            </td>
                            <td className="px-4 py-3.5">
                              <span className={`inline-flex items-center justify-center font-black text-xs ${
                                screening.urgency === Urgency.EMERGENCY ? "text-rose-600" :
                                screening.urgency === Urgency.HIGH ? "text-amber-600" : "text-emerald-700"
                              }`}>
                                {screening.riskScore}/100
                              </span>
                            </td>
                            <td className="px-4 py-3.5">
                              <UrgencyBadge urgency={screening.urgency} size="sm" />
                            </td>
                            <td className="px-4 py-3.5">
                              <div className="flex gap-1.5 flex-wrap">
                                {screening.symptoms.slice(0, 2).map((sym, i) => (
                                  <Badge key={i} variant="outline" className="font-medium text-[10px] px-1.5 py-0 bg-slate-50 text-slate-700 border-slate-200">
                                    {sym}
                                  </Badge>
                                ))}
                                {screening.symptoms.length > 2 && (
                                  <span className="text-[10px] text-slate-400 font-medium">
                                    +{screening.symptoms.length - 2}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3.5 text-xs text-slate-500 whitespace-nowrap">
                              {new Date(screening.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </td>
                            <td className="px-5 py-3.5 text-right">
                              <Link href={`/patients/${screening.patientId}`}>
                                <Button 
                                  size="sm" 
                                  className={`h-8 text-xs font-bold rounded-xl ${
                                    screening.urgency === Urgency.EMERGENCY 
                                      ? "bg-rose-600 hover:bg-rose-700 text-white" 
                                      : "bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200"
                                  }`}
                                >
                                  Review
                                </Button>
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                      {sortedScreenings.length === 0 && (
                        <tr>
                          <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                            <div className="flex flex-col items-center gap-2">
                              <Activity className="h-8 w-8 text-slate-300" />
                              <p className="font-semibold text-slate-600 text-sm">No patients in triage queue.</p>
                              <p className="text-xs">Cases will appear here as screenings are submitted.</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Right Sidebar: Quick Clinical Actions & Recent Referrals (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            
            {/* Quick Clinical Actions */}
            <Card className="bg-white shadow-xs border border-slate-200/80 rounded-2xl overflow-hidden">
              <CardHeader className="bg-slate-50/70 border-b border-slate-100 py-3.5 px-5">
                <CardTitle className="text-xs font-bold text-slate-900 uppercase tracking-wider">Quick Clinical Actions</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-2.5">
                <Link href="/assess" className="block">
                  <Button className="w-full justify-start gap-2 h-10 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs">
                    <Activity className="h-4 w-4" />
                    New AI Clinical Triage
                  </Button>
                </Link>
                <Link href="/patients" className="block">
                  <Button className="w-full justify-start gap-2 h-10 text-xs font-bold rounded-xl border-slate-200 hover:bg-slate-50 text-slate-700" variant="outline">
                    <Users className="h-4 w-4 text-blue-600" />
                    Patient Records (360° EHR)
                  </Button>
                </Link>
                <Link href="/referrals" className="block">
                  <Button className="w-full justify-start gap-2 h-10 text-xs font-bold rounded-xl border-slate-200 hover:bg-slate-50 text-slate-700" variant="outline">
                    <Ambulance className="h-4 w-4 text-amber-600" />
                    Initiate Patient Referral
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Doctor Appointment Calendar */}
            <AppointmentCalendarWidget role={Role.DOCTOR} userId={currentUser?.id} userName={currentUser?.name} />

            {/* Recent Referrals */}
            <Card className="bg-white shadow-xs border border-slate-200/80 rounded-2xl overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between py-3 px-5 bg-slate-50/70 border-b border-slate-100">
                <CardTitle className="text-xs font-bold text-slate-900 uppercase tracking-wider">Recent Referrals</CardTitle>
                <Link href="/referrals">
                  <Button variant="ghost" size="sm" className="text-blue-700 text-xs px-2 h-7 gap-1 font-bold">
                    All <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-2.5">
                  {referrals.slice(0, 3).map((ref) => (
                    <div key={ref.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50/60 space-y-1.5">
                      <div className="flex justify-between items-start gap-2">
                        <span className="font-bold text-xs text-slate-900 truncate">{ref.patientName}</span>
                        <UrgencyBadge urgency={ref.urgency} size="sm" />
                      </div>
                      <div className="flex items-center justify-between pt-0.5">
                        <div className="text-[11px] text-slate-500 flex items-center gap-1.5 truncate max-w-[140px]">
                          <Ambulance className="h-3 w-3 shrink-0 text-slate-400" /> 
                          <span className="truncate">{ref.toFacilityName}</span>
                        </div>
                        <Badge variant="outline" className="text-[9px] h-5 px-1.5 bg-white border border-slate-200 font-semibold text-slate-600">
                          {ref.status}
                        </Badge>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {new Date(ref.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  ))}
                  {referrals.length === 0 && (
                    <div className="text-center py-6 text-slate-400 text-xs font-medium">
                      No active referrals.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
