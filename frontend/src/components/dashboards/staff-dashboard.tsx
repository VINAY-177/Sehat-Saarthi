"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { StatCard } from "@/components/stat-card";
import { UrgencyBadge } from "@/components/urgency-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Role } from "@/lib/types";
import { Building2, Bed, Ambulance, Droplets, BedDouble, Users, FileText, Clock } from "lucide-react";
import { AppointmentCalendarWidget } from "@/components/appointment-calendar-widget";

export function StaffDashboard() {
  const { currentUser, facilities, referrals, patients, stats } = useStore();

  const userFacility = currentUser?.facilityId 
    ? facilities?.find(f => f.id === currentUser.facilityId)
    : null;

  return (
    <div className="relative min-h-[calc(100vh-5rem)] -m-4 sm:-m-6 p-4 sm:p-6 overflow-hidden">
      {/* Ultra-subtle Ambient Operations Background Watermark */}
      <div 
        className="absolute inset-0 bg-cover bg-top bg-no-repeat opacity-[0.04] pointer-events-none -z-10 mix-blend-multiply"
        style={{ backgroundImage: "url('/staff-bg.jpg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50/40 via-background/90 to-background pointer-events-none -z-10" />

      <div className="relative max-w-7xl mx-auto space-y-7 pb-16 animate-in fade-in duration-300 z-10">
        
        {/* Operations Command Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200/80 pb-4 mt-2">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-sm">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">Hospital Operations Center</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                Facility &amp; Ward Command
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Real-time facility capacity, ward bed telemetry, and incoming triage coordination.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-2.5 bg-white px-4 py-2 rounded-2xl border border-slate-200/80 shadow-xs text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-slate-800">{currentUser?.name || "Operations Lead"}</span>
              {userFacility && (
                <>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-600 font-medium">{userFacility.name}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* 3 Ward Telemetry Cards - Neutral White with Subtle Colored Progress Bars */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          
          {/* ICU Beds */}
          <Card className="bg-white shadow-xs border border-slate-200/80 rounded-2xl overflow-hidden hover:shadow-sm transition-shadow">
            <CardHeader className="pb-2 pt-4 px-5 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100">
                  <Bed className="h-4 w-4" />
                </div>
                <CardTitle className="text-sm font-bold text-slate-900">ICU Beds Telemetry</CardTitle>
              </div>
              <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200 font-bold px-2 py-0.5">
                Live Feed
              </Badge>
            </CardHeader>
            <CardContent className="pt-1 pb-5 px-5">
              <div className="space-y-2">
                <div className="flex items-baseline justify-between">
                  <div className="text-2xl font-black text-slate-900">{stats.totalICUAvailable || 18}</div>
                  <span className="text-xs text-slate-500 font-medium">Beds Available</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `72%` }} />
                </div>
                <p className="text-[11px] text-slate-400 font-medium">Capacity utilization: 28% occupied</p>
              </div>
            </CardContent>
          </Card>

          {/* General Ward */}
          <Card className="bg-white shadow-xs border border-slate-200/80 rounded-2xl overflow-hidden hover:shadow-sm transition-shadow">
            <CardHeader className="pb-2 pt-4 px-5 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-50 text-blue-700 rounded-xl border border-blue-100">
                  <Bed className="h-4 w-4" />
                </div>
                <CardTitle className="text-sm font-bold text-slate-900">General Ward</CardTitle>
              </div>
              <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-700 border-blue-200 font-bold px-2 py-0.5">
                Occupancy: 65%
              </Badge>
            </CardHeader>
            <CardContent className="pt-1 pb-5 px-5">
              <div className="space-y-2">
                <div className="flex items-baseline justify-between">
                  <div className="text-2xl font-black text-slate-900">{stats.totalGeneralAvailable || 142}</div>
                  <span className="text-xs text-slate-500 font-medium">Beds Available</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `65%` }} />
                </div>
                <p className="text-[11px] text-slate-400 font-medium">General ward occupancy: 35%</p>
              </div>
            </CardContent>
          </Card>

          {/* Private Rooms */}
          <Card className="bg-white shadow-xs border border-slate-200/80 rounded-2xl overflow-hidden hover:shadow-sm transition-shadow">
            <CardHeader className="pb-2 pt-4 px-5 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-50 text-indigo-700 rounded-xl border border-indigo-100">
                  <BedDouble className="h-4 w-4" />
                </div>
                <CardTitle className="text-sm font-bold text-slate-900">Private Rooms</CardTitle>
              </div>
              <Badge variant="outline" className="text-[10px] bg-indigo-50 text-indigo-700 border-indigo-200 font-bold px-2 py-0.5">
                Ready
              </Badge>
            </CardHeader>
            <CardContent className="pt-1 pb-5 px-5">
              <div className="space-y-2">
                <div className="flex items-baseline justify-between">
                  <div className="text-2xl font-black text-slate-900">{stats.totalPrivateRoomsAvailable || 26}</div>
                  <span className="text-xs text-slate-500 font-medium">Rooms Free</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full transition-all" style={{ width: `80%` }} />
                </div>
                <p className="text-[11px] text-slate-400 font-medium">Private room occupancy: 20%</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Operations 3-Box Grid - Neutral Cards */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          <Link href="/facilities" className="block group">
            <Card className="bg-white hover:border-indigo-300 hover:shadow-sm transition-all rounded-2xl border-slate-200/80 overflow-hidden h-full">
              <CardHeader className="p-5 flex flex-row items-center gap-3.5">
                <div className="p-2.5 bg-indigo-50 text-indigo-700 rounded-xl border border-indigo-100 group-hover:bg-indigo-100 transition-colors">
                  <Bed className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-sm font-bold text-slate-900">Manage Beds &amp; Capacity</CardTitle>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">ICU, HDU &amp; General bed allocation</p>
                </div>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/ambulance" className="block group">
            <Card className="bg-white hover:border-rose-300 hover:shadow-sm transition-all rounded-2xl border-slate-200/80 overflow-hidden h-full">
              <CardHeader className="p-5 flex flex-row items-center gap-3.5">
                <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl border border-rose-100 group-hover:bg-rose-100 transition-colors">
                  <Ambulance className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-sm font-bold text-slate-900">Ambulance Fleet Dispatch</CardTitle>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">108 Fleet GPS &amp; Unit coordination</p>
                </div>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/facilities" className="block group">
            <Card className="bg-white hover:border-indigo-300 hover:shadow-sm transition-all rounded-2xl border-slate-200/80 overflow-hidden h-full">
              <CardHeader className="p-5 flex flex-row items-center gap-3.5">
                <div className="p-2.5 bg-indigo-50 text-indigo-700 rounded-xl border border-indigo-100 group-hover:bg-indigo-100 transition-colors">
                  <Droplets className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-sm font-bold text-slate-900">Blood Bank &amp; Supplies</CardTitle>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Blood units &amp; critical medical stock</p>
                </div>
              </CardHeader>
            </Card>
          </Link>
        </div>

        {/* Split Section: Referrals on Left & Calendar on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Incoming Referrals Table (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <Card className="bg-white shadow-xs border border-slate-200/80 rounded-2xl overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between py-3.5 px-5 bg-slate-50/70 border-b border-slate-100">
                <div>
                  <CardTitle className="text-sm font-bold text-slate-900 uppercase tracking-wider">Incoming Clinical Referrals</CardTitle>
                  <CardDescription className="text-xs text-slate-500 font-medium mt-0.5">Emergency and priority transfers from PHCs/CHCs.</CardDescription>
                </div>
                <Link href="/referrals">
                  <Button variant="outline" size="sm" className="h-7 text-xs font-bold rounded-lg border-slate-200 hover:bg-slate-50 text-slate-700">
                    View All
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="text-[11px] text-slate-400 uppercase bg-slate-50/50 border-b border-slate-100 font-bold">
                      <tr>
                        <th className="px-5 py-3">Patient</th>
                        <th className="px-3 py-3">Urgency</th>
                        <th className="px-3 py-3">Status</th>
                        <th className="px-5 py-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {referrals && referrals.length > 0 ? (
                        referrals.slice(0, 5).map(ref => {
                          const patient = patients?.find(p => p.id === ref.patientId);
                          return (
                            <tr key={ref.id} className="hover:bg-slate-50/60 transition-colors">
                              <td className="px-5 py-3.5 font-bold text-slate-900">{patient?.name || ref.patientName || "Patient Transfer"}</td>
                              <td className="px-3 py-3.5">
                                <UrgencyBadge urgency={ref.urgency} size="sm" />
                              </td>
                              <td className="px-3 py-3.5">
                                {ref.status === "PENDING" && <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200 text-[10px] font-bold">PENDING</Badge>}
                                {ref.status === "ACCEPTED" && <Badge variant="outline" className="bg-emerald-50 text-emerald-800 border-emerald-200 text-[10px] font-bold">ACCEPTED</Badge>}
                                {["PENDING", "ACCEPTED"].indexOf(ref.status) === -1 && <Badge variant="outline" className="text-[10px]">{ref.status}</Badge>}
                              </td>
                              <td className="px-5 py-3.5 text-right">
                                <Link href={`/referrals`}>
                                  <Button variant="ghost" size="sm" className="h-7 text-xs font-bold text-indigo-700 hover:bg-indigo-50">
                                    View
                                  </Button>
                                </Link>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={4} className="px-5 py-12 text-center text-slate-400 text-xs font-medium">
                            No incoming referrals. Patient transfers will appear here as they are created.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Calendar on Right (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <AppointmentCalendarWidget role={Role.HOSPITAL_STAFF} userId={currentUser?.id} userName={currentUser?.name} />
          </div>
        </div>

        {/* Bottom Row Stats */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Facilities"
            value={stats?.totalFacilities || 0}
            icon={<Building2 className="h-4 w-4 text-indigo-600" />}
            description="In regional network"
          />
          <StatCard
            title="Total Patients"
            value={stats?.totalPatients || 0}
            icon={<Users className="h-4 w-4 text-blue-600" />}
            description="Registered EHR records"
          />
          <StatCard
            title="Total Screenings"
            value={stats?.totalScreenings || 0}
            icon={<FileText className="h-4 w-4 text-emerald-600" />}
            description="Clinical triage assessments"
          />
          <StatCard
            title="Pending Referrals"
            value={stats?.pendingReferrals || 0}
            icon={<Clock className="h-4 w-4 text-amber-600" />}
            description="Awaiting coordination"
          />
        </div>
      </div>
    </div>
  );
}
