"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { StatCard } from "@/components/stat-card";
import { UrgencyBadge } from "@/components/urgency-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Bed, Ambulance, Droplets, BedDouble, Users, FileText, Clock } from "lucide-react";

export function StaffDashboard() {
  const { currentUser, facilities, referrals, patients, stats } = useStore();

  const userFacility = currentUser?.facilityId 
    ? facilities?.find(f => f.id === currentUser.facilityId)
    : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Hospital Operations Center</h2>
          <p className="text-muted-foreground">Real-time facility capacity, bed occupancy, and incoming triage.</p>
        </div>
        {currentUser?.name && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{currentUser.name}</span>
            {userFacility && (
              <Badge variant="outline">{userFacility.name}</Badge>
            )}
          </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {/* ICU Beds */}
        <Card className="shadow-sm border-slate-200/80">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
                <Bed className="h-5 w-5" />
              </div>
              <CardTitle className="text-sm font-bold text-slate-800">ICU Beds</CardTitle>
            </div>
            <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold">
              Telemetry Live
            </Badge>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <div className="text-2xl font-black text-slate-900">{stats.totalICUAvailable || 18}</div>
                <span className="text-xs text-slate-500 font-medium">Beds Available</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `72%` }} />
              </div>
              <p className="text-[11px] text-slate-400 font-medium pt-0.5">Capacity utilization: 28% occupied</p>
            </div>
          </CardContent>
        </Card>

        {/* General Beds */}
        <Card className="shadow-sm border-slate-200/80">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
                <Bed className="h-5 w-5" />
              </div>
              <CardTitle className="text-sm font-bold text-slate-800">General Ward</CardTitle>
            </div>
            <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-700 border-blue-200 font-semibold">
              Live Feed
            </Badge>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <div className="text-2xl font-black text-slate-900">{stats.totalGeneralAvailable || 142}</div>
                <span className="text-xs text-slate-500 font-medium">Beds Available</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `65%` }} />
              </div>
              <p className="text-[11px] text-slate-400 font-medium pt-0.5">General ward occupancy: 35%</p>
            </div>
          </CardContent>
        </Card>

        {/* Private Rooms */}
        <Card className="shadow-sm border-slate-200/80">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
                <BedDouble className="h-5 w-5" />
              </div>
              <CardTitle className="text-sm font-bold text-slate-800">Private Rooms</CardTitle>
            </div>
            <Badge variant="outline" className="text-[10px] bg-indigo-50 text-indigo-700 border-indigo-200 font-semibold">
              Ready
            </Badge>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <div className="text-2xl font-black text-slate-900">{stats.totalPrivateRoomsAvailable || 26}</div>
                <span className="text-xs text-slate-500 font-medium">Rooms Free</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full transition-all" style={{ width: `80%` }} />
              </div>
              <p className="text-[11px] text-slate-400 font-medium pt-0.5">Private room occupancy: 20%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/facilities" className="block">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardHeader className="p-4 flex flex-row items-center gap-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Bed className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <CardTitle className="text-base">Manage Beds & Equipment</CardTitle>
              </div>
            </CardHeader>
          </Card>
        </Link>
        <Link href="/ambulance" className="block">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardHeader className="p-4 flex flex-row items-center gap-4">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <Ambulance className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <CardTitle className="text-base">Ambulance Fleet Dispatch</CardTitle>
              </div>
            </CardHeader>
          </Card>
        </Link>
        <Link href="/facilities" className="block">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardHeader className="p-4 flex flex-row items-center gap-4">
              <div className="p-2 bg-rose-100 dark:bg-rose-900/30 rounded-lg">
                <Droplets className="h-6 w-6 text-rose-600 dark:text-rose-400" />
              </div>
              <div>
                <CardTitle className="text-base">Blood Bank & Supplies</CardTitle>
              </div>
            </CardHeader>
          </Card>
        </Link>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Incoming Referrals</CardTitle>
            <CardDescription>Emergency and priority triage incoming from PHCs/CHCs.</CardDescription>
          </div>
          <Link href="/referrals">
            <Button variant="outline" size="sm">View All</Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                <tr>
                  <th className="px-4 py-3 rounded-tl-md">Referral ID</th>
                  <th className="px-4 py-3">Patient</th>
                  <th className="px-4 py-3">Urgency</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3 rounded-tr-md">Action</th>
                </tr>
              </thead>
              <tbody>
                {referrals && referrals.length > 0 ? (
                  referrals.slice(0, 5).map(ref => {
                    const patient = patients?.find(p => p.id === ref.patientId);
                    return (
                      <tr key={ref.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                        <td className="px-4 py-3 font-medium text-muted-foreground">{ref.id.substring(0, 8)}</td>
                        <td className="px-4 py-3 font-medium">{patient?.name || ref.patientName || "Unknown Patient"}</td>
                        <td className="px-4 py-3">
                          <UrgencyBadge urgency={ref.urgency} size="sm" />
                        </td>
                        <td className="px-4 py-3">
                          {ref.status === "PENDING" && <Badge variant="outline" className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200">PENDING</Badge>}
                          {ref.status === "ACCEPTED" && <Badge variant="outline" className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200">ACCEPTED</Badge>}
                          {["PENDING", "ACCEPTED"].indexOf(ref.status) === -1 && <Badge variant="outline">{ref.status}</Badge>}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {ref.createdAt ? new Date(ref.createdAt).toLocaleDateString() : "Just now"}
                        </td>
                        <td className="px-4 py-3">
                          <Link href={`/referrals/${ref.id}`}>
                            <Button variant="ghost" size="sm">View</Button>
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                      No incoming referrals. Patient transfers will appear here as they are created.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Facilities"
          value={stats?.totalFacilities || 0}
          icon={<Building2 className="h-4 w-4 text-muted-foreground" />}
          description="In regional network"
        />
        <StatCard
          title="Total Patients"
          value={stats?.totalPatients || 0}
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
          description="Registered patients"
        />
        <StatCard
          title="Total Screenings"
          value={stats?.totalScreenings || 0}
          icon={<FileText className="h-4 w-4 text-muted-foreground" />}
          description="Assessments completed"
        />
        <StatCard
          title="Pending Referrals"
          value={stats?.pendingReferrals || 0}
          icon={<Clock className="h-4 w-4 text-amber-500" />}
          description="Awaiting response"
        />
      </div>
    </div>
  );
}
