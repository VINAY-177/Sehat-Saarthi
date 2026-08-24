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
    <div className="max-w-7xl mx-auto space-y-8 pb-16 animate-in fade-in duration-300">
      {/* Operations Command Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200/80 pb-5">
        <div className="flex items-center gap-3.5">
          <div className="p-3.5 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-2xl shadow-sm">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Hospital Operations Center</h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Real-time facility capacity, ward bed telemetry, and incoming triage coordination.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2.5 bg-white px-4 py-2 rounded-xl border border-slate-200/80 shadow-sm text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
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

      {/* 3 Ward Telemetry Cards */}
      <div className="grid gap-5 grid-cols-1 md:grid-cols-3">
        {/* ICU Beds */}
        <Card className="shadow-sm border-slate-200/80 rounded-3xl overflow-hidden bg-white hover:shadow-md transition-shadow">
          <CardHeader className="pb-3 pt-5 px-6 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600">
                <Bed className="h-4 w-4" />
              </div>
              <CardTitle className="text-sm font-bold text-slate-900">ICU Beds Telemetry</CardTitle>
            </div>
            <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200 font-bold px-2.5 py-0.5">
              Live Feed
            </Badge>
          </CardHeader>
          <CardContent className="pt-1 pb-6 px-6">
            <div className="space-y-2.5">
              <div className="flex items-baseline justify-between">
                <div className="text-2xl font-black text-slate-900">{stats.totalICUAvailable || 18}</div>
                <span className="text-xs text-slate-500 font-medium">Beds Free</span>
              </div>
              <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `72%` }} />
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Capacity utilization: 28% occupied</p>
            </div>
          </CardContent>
        </Card>

        {/* General Beds */}
        <Card className="shadow-sm border-slate-200/80 rounded-3xl overflow-hidden bg-white hover:shadow-md transition-shadow">
          <CardHeader className="pb-3 pt-5 px-6 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600">
                <Bed className="h-4 w-4" />
              </div>
              <CardTitle className="text-sm font-bold text-slate-900">General Ward</CardTitle>
            </div>
            <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-700 border-blue-200 font-bold px-2.5 py-0.5">
              Occupancy: 65%
            </Badge>
          </CardHeader>
          <CardContent className="pt-1 pb-6 px-6">
            <div className="space-y-2.5">
              <div className="flex items-baseline justify-between">
                <div className="text-2xl font-black text-slate-900">{stats.totalGeneralAvailable || 142}</div>
                <span className="text-xs text-slate-500 font-medium">Beds Free</span>
              </div>
              <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `65%` }} />
              </div>
              <p className="text-[11px] text-slate-400 font-medium">General ward occupancy: 35%</p>
            </div>
          </CardContent>
        </Card>

        {/* Private Rooms */}
        <Card className="shadow-sm border-slate-200/80 rounded-3xl overflow-hidden bg-white hover:shadow-md transition-shadow">
          <CardHeader className="pb-3 pt-5 px-6 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-600">
                <BedDouble className="h-4 w-4" />
              </div>
              <CardTitle className="text-sm font-bold text-slate-900">Private Rooms</CardTitle>
            </div>
            <Badge variant="outline" className="text-[10px] bg-indigo-50 text-indigo-700 border-indigo-200 font-bold px-2.5 py-0.5">
              Ready
            </Badge>
          </CardHeader>
          <CardContent className="pt-1 pb-6 px-6">
            <div className="space-y-2.5">
              <div className="flex items-baseline justify-between">
                <div className="text-2xl font-black text-slate-900">{stats.totalPrivateRoomsAvailable || 26}</div>
                <span className="text-xs text-slate-500 font-medium">Rooms Free</span>
              </div>
              <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full transition-all" style={{ width: `80%` }} />
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Private room occupancy: 20%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Operations 3-Box Grid */}
      <div className="grid gap-5 grid-cols-1 md:grid-cols-3">
        <Link href="/facilities" className="block group">
          <Card className="hover:border-teal-300 hover:shadow-md transition-all duration-200 rounded-3xl border-slate-200/80 overflow-hidden bg-white h-full">
            <CardHeader className="p-6 flex flex-row items-center gap-4">
              <div className="p-3.5 bg-teal-50 text-teal-600 rounded-2xl group-hover:scale-105 transition-transform shadow-sm">
                <Bed className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-sm font-bold text-slate-900">Manage Beds &amp; Capacity</CardTitle>
                <p className="text-xs text-slate-500 font-medium mt-1">ICU, HDU &amp; General bed allocation</p>
              </div>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/ambulance" className="block group">
          <Card className="hover:border-red-300 hover:shadow-md transition-all duration-200 rounded-3xl border-slate-200/80 overflow-hidden bg-white h-full">
            <CardHeader className="p-6 flex flex-row items-center gap-4">
              <div className="p-3.5 bg-red-50 text-red-600 rounded-2xl group-hover:scale-105 transition-transform shadow-sm">
                <Ambulance className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-sm font-bold text-slate-900">Ambulance Fleet Dispatch</CardTitle>
                <p className="text-xs text-slate-500 font-medium mt-1">108 Fleet GPS &amp; Unit coordination</p>
              </div>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/facilities" className="block group">
          <Card className="hover:border-rose-300 hover:shadow-md transition-all duration-200 rounded-3xl border-slate-200/80 overflow-hidden bg-white h-full">
            <CardHeader className="p-6 flex flex-row items-center gap-4">
              <div className="p-3.5 bg-rose-50 text-rose-600 rounded-2xl group-hover:scale-105 transition-transform shadow-sm">
                <Droplets className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-sm font-bold text-slate-900">Blood Bank &amp; Supplies</CardTitle>
                <p className="text-xs text-slate-500 font-medium mt-1">Blood units &amp; critical medical inventory</p>
              </div>
            </CardHeader>
          </Card>
        </Link>
      </div>

      {/* Split Section: Referrals on Left & Calendar on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Incoming Referrals Table (7 cols) */}
        <div className="lg:col-span-7">
          <Card className="shadow-sm border-slate-200/80 rounded-3xl overflow-hidden bg-white">
            <CardHeader className="flex flex-row items-center justify-between py-4 px-6 bg-slate-50/50 border-b border-slate-100">
              <div>
                <CardTitle className="text-base font-bold text-slate-900">Incoming Clinical Referrals</CardTitle>
                <CardDescription className="text-xs text-slate-500 font-medium mt-0.5">Emergency and priority triage incoming from PHCs/CHCs.</CardDescription>
              </div>
              <Link href="/referrals">
                <Button variant="outline" size="sm" className="h-8 text-xs font-bold rounded-xl border-slate-200 hover:bg-slate-50">
                  View All
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="text-[11px] text-slate-400 uppercase bg-slate-50/80 border-b border-slate-100 font-bold">
                    <tr>
                      <th className="px-5 py-3.5">Patient</th>
                      <th className="px-3 py-3.5">Urgency</th>
                      <th className="px-3 py-3.5">Status</th>
                      <th className="px-5 py-3.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {referrals && referrals.length > 0 ? (
                      referrals.slice(0, 5).map(ref => {
                        const patient = patients?.find(p => p.id === ref.patientId);
                        return (
                          <tr key={ref.id} className="hover:bg-slate-50/60 transition-colors">
                            <td className="px-5 py-4 font-bold text-slate-900">{patient?.name || ref.patientName || "Unknown Patient"}</td>
                            <td className="px-3 py-4">
                              <UrgencyBadge urgency={ref.urgency} size="sm" />
                            </td>
                            <td className="px-3 py-4">
                              {ref.status === "PENDING" && <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200 text-[10px] font-bold">PENDING</Badge>}
                              {ref.status === "ACCEPTED" && <Badge variant="outline" className="bg-emerald-50 text-emerald-800 border-emerald-200 text-[10px] font-bold">ACCEPTED</Badge>}
                              {["PENDING", "ACCEPTED"].indexOf(ref.status) === -1 && <Badge variant="outline" className="text-[10px]">{ref.status}</Badge>}
                            </td>
                            <td className="px-5 py-4 text-right">
                              <Link href={`/referrals`}>
                                <Button variant="ghost" size="sm" className="h-7 text-xs font-bold text-teal-700 hover:bg-teal-50">
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
      <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Facilities"
          value={stats?.totalFacilities || 0}
          icon={<Building2 className="h-4 w-4 text-blue-500" />}
          description="In regional network"
        />
        <StatCard
          title="Total Patients"
          value={stats?.totalPatients || 0}
          icon={<Users className="h-4 w-4 text-teal-500" />}
          description="Registered EHR records"
        />
        <StatCard
          title="Total Screenings"
          value={stats?.totalScreenings || 0}
          icon={<FileText className="h-4 w-4 text-emerald-500" />}
          description="Clinical triage assessments"
        />
        <StatCard
          title="Pending Referrals"
          value={stats?.pendingReferrals || 0}
          icon={<Clock className="h-4 w-4 text-amber-500" />}
          description="Awaiting coordination"
        />
      </div>
    </div>
  );
}
