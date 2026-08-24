"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { Urgency, Role } from "@/lib/types";
import { StatCard } from "@/components/stat-card";
import { UrgencyBadge } from "@/components/urgency-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, AlertTriangle, Ambulance, Bed, Activity, ArrowRight } from "lucide-react";
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
      {/* Ambient Clinical ECG Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-top bg-no-repeat opacity-[0.12] pointer-events-none -z-10 mix-blend-multiply"
        style={{ backgroundImage: "url('/doctor-bg.jpg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 via-background/85 to-background pointer-events-none -z-10" />

      <div className="relative max-w-7xl mx-auto space-y-6 pb-16 animate-in fade-in duration-300 z-10">
        {/* Clinical Command Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-teal-500 to-emerald-600 text-white rounded-2xl shadow-sm">
            <Activity className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900">Clinical Triage &amp; Encounters</h1>
            <p className="text-xs text-slate-500 font-medium">
              Real-time priority triage queues, live AI risk assessments, and hospital referrals.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-xl border border-slate-200/80 shadow-sm text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-slate-800">{currentUser?.name || "Dr. Sarah Chen"}</span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-500 font-medium">{currentUser?.specialty || "Emergency Medicine"}</span>
          </div>
        </div>
      </div>

      {/* 4 Key Metric Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Active Patients"
          value={patients.length}
          icon={<Users className="h-4 w-4 text-blue-500" />}
          description="Currently registered in EHR"
        />
        <StatCard
          title="Emergency Red-Alerts"
          value={emergencyScreenings.length}
          icon={<AlertTriangle className="h-4 w-4 text-rose-500" />}
          description="Requires immediate clinical review"
          className={emergencyScreenings.length > 0 ? "border-rose-200 bg-rose-50/30" : ""}
        />
        <StatCard
          title="Pending Referrals"
          value={pendingReferrals.length}
          icon={<Ambulance className="h-4 w-4 text-amber-500" />}
          description="Awaiting inter-hospital dispatch"
        />
        <StatCard
          title="ICU Beds Available"
          value={stats.totalICUAvailable || 18}
          icon={<Bed className="h-4 w-4 text-emerald-500" />}
          description="Live available in network"
        />
      </div>

      {/* Appointment & Consultation Schedule Calendar */}
      <AppointmentCalendarWidget role={Role.DOCTOR} userId={currentUser?.id} userName={currentUser?.name} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Emergency Triage Queue (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <Card className="shadow-sm border-slate-200/80 rounded-3xl overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4 px-6 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-slate-900">Priority Triage Queue</CardTitle>
                <CardDescription className="text-xs text-slate-500 font-medium">Patients triaged by AI risk engine, sorted by clinical urgency.</CardDescription>
              </div>
              <Badge variant="outline" className="text-[10px] bg-teal-50 text-teal-700 border-teal-200 font-bold">
                {sortedScreenings.length} Active Cases
              </Badge>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="text-[11px] text-slate-400 uppercase bg-slate-50/80 border-b border-slate-100 font-bold">
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
                        <tr key={screening.id} className="hover:bg-muted/30 transition-colors">
                          <td className="px-6 py-4 font-medium text-foreground">
                            {patient?.name || "Unknown"}
                          </td>
                          <td className="px-4 py-4">
                            <span className={`inline-flex items-center justify-center font-bold text-sm ${
                              screening.urgency === Urgency.EMERGENCY ? "text-rose-600" :
                              screening.urgency === Urgency.HIGH ? "text-amber-600" : "text-emerald-600"
                            }`}>
                              {screening.riskScore}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <UrgencyBadge urgency={screening.urgency} size="sm" />
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex gap-1.5 flex-wrap">
                              {screening.symptoms.slice(0, 2).map((sym, i) => (
                                <Badge key={i} variant="secondary" className="font-normal text-[11px] px-1.5 py-0 h-5">
                                  {sym}
                                </Badge>
                              ))}
                              {screening.symptoms.length > 2 && (
                                <Badge variant="outline" className="font-normal text-[11px] px-1.5 py-0 h-5 text-muted-foreground">
                                  +{screening.symptoms.length - 2} more
                                </Badge>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-4 text-xs text-muted-foreground whitespace-nowrap">
                            {new Date(screening.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Link href={`/patients/${screening.patientId}`}>
                              <Button size="sm" className="h-8 shadow-none" variant={screening.urgency === Urgency.EMERGENCY ? "default" : "outline"}>
                                Review
                              </Button>
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                    {sortedScreenings.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground bg-muted/10">
                          <div className="flex flex-col items-center gap-2">
                            <Activity className="h-8 w-8 text-muted-foreground/40" />
                            <p>No patients in triage queue.</p>
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
        
        {/* Right Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <AppointmentCalendarWidget role={Role.DOCTOR} />

          <Card className="shadow-sm border-slate-200/80 rounded-3xl overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-3.5 px-5">
              <CardTitle className="text-sm font-bold text-slate-900">Quick Clinical Actions</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2.5">
              <Link href="/assess" className="block">
                <Button className="w-full justify-start gap-2 h-11 text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-sm">
                  <Activity className="h-4 w-4" />
                  New AI Clinical Triage
                </Button>
              </Link>
              <Link href="/patients" className="block">
                <Button className="w-full justify-start gap-2 h-11 text-xs font-bold rounded-xl border-slate-200 hover:bg-slate-50" variant="outline">
                  <Users className="h-4 w-4 text-teal-600" />
                  Patient Records (360° EHR)
                </Button>
              </Link>
              <Link href="/referrals" className="block">
                <Button className="w-full justify-start gap-2 h-11 text-xs font-bold rounded-xl border-slate-200 hover:bg-slate-50" variant="outline">
                  <Ambulance className="h-4 w-4 text-amber-500" />
                  Initiate Patient Referral
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-slate-200/80 rounded-3xl overflow-hidden bg-white">
            <CardHeader className="flex flex-row items-center justify-between py-3.5 px-5 bg-slate-50/50 border-b border-slate-100">
              <CardTitle className="text-sm font-bold text-slate-900">Recent Referrals</CardTitle>
              <Link href="/referrals">
                <Button variant="ghost" size="sm" className="text-teal-700 text-xs px-2 h-7 gap-1 font-bold">
                  All <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-2.5">
                {referrals.slice(0, 3).map((ref) => (
                  <div key={ref.id} className="p-3 rounded-2xl border border-slate-100 bg-slate-50/60 space-y-1.5">
                    <div className="flex justify-between items-start gap-2">
                      <span className="font-bold text-xs text-slate-900 truncate">{ref.patientName}</span>
                      <UrgencyBadge urgency={ref.urgency} size="sm" />
                    </div>
                    <div className="flex items-center justify-between pt-0.5">
                      <div className="text-[11px] text-slate-500 flex items-center gap-1.5 truncate max-w-[140px]">
                        <Ambulance className="h-3 w-3 shrink-0 text-slate-400" /> 
                        <span className="truncate">{ref.toFacilityName}</span>
                      </div>
                      <Badge variant="secondary" className="text-[9px] h-5 px-1.5 bg-white border border-slate-200 font-semibold">
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
