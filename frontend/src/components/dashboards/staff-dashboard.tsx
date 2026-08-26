"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { StatCard } from "@/components/stat-card";
import { UrgencyBadge } from "@/components/urgency-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Urgency } from "@/lib/types";
import { 
  Building2, 
  Bed, 
  Ambulance, 
  Droplets, 
  BedDouble, 
  Users, 
  Clock, 
  ArrowRight,
  UserPlus,
} from "lucide-react";

export function StaffDashboard() {
  const { currentUser, facilities, referrals, patients, stats, language } = useStore();

  const userFacility = currentUser?.facilityId 
    ? facilities?.find(f => f.id === currentUser.facilityId)
    : { name: "Government General Hospital — Delhi" };

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

  const firstName = currentUser?.name?.split(" ")[0] || "Neha";

  return (
    <div className="relative min-h-[calc(100vh-5rem)] -m-4 sm:-m-6 p-4 sm:p-6 overflow-hidden bg-[#F8FAFC]">
      
      {/* Ultra-subtle Ambient Operations Background Accents */}
      <div 
        className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-indigo-500/8 via-teal-500/4 to-transparent rounded-full blur-3xl pointer-events-none -z-10" 
      />
      <div 
        className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-teal-500/6 via-indigo-500/3 to-transparent rounded-full blur-3xl pointer-events-none -z-10" 
      />
      {/* Subtle Operations Dot Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:32px_32px] opacity-20 pointer-events-none -z-10" />

      <div className="relative max-w-7xl mx-auto space-y-6 pb-12 z-10 page-enter">
        
        {/* 1. Header Section — Staff Greeting & Hospital Affiliation */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-1 section-enter">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              {greeting}, {firstName} 👋
            </h1>
            <p className="text-slate-500 text-sm font-medium">
              {language === "hi" 
                ? "यहाँ आज का अस्पताल संचालन अवलोकन है।" 
                : "Here's today's hospital operations overview."}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-slate-200/80 shadow-xs text-xs font-semibold text-slate-700">
              <span className="w-2 h-2 rounded-full bg-indigo-500 pulse-subtle" />
              <span>Operations Lead</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-600 font-medium">{userFacility?.name || "GGH Delhi"}</span>
            </div>

            <Link href="/register">
              <Button className="bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs h-9 px-3.5 rounded-xl shadow-xs gap-1.5 transition-all btn-press">
                <UserPlus className="w-3.5 h-3.5" />
                {language === "hi" ? "मरीज पंजीकरण" : "Register Patient"}
              </Button>
            </Link>
          </div>
        </div>

        {/* 2. Ward Occupancy Telemetry (3 Structured Cards with Visual Progress Bars) */}
        <div className="grid gap-3.5 grid-cols-1 md:grid-cols-3">
          
          {/* ICU Beds Telemetry */}
          <Card className="bg-white shadow-xs border border-slate-200/80 rounded-2xl overflow-hidden card-hover stagger-1">
            <CardHeader className="pb-2 pt-4 px-5 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100">
                  <Bed className="h-4 w-4" />
                </div>
                <CardTitle className="text-sm font-bold text-slate-900">ICU Beds Telemetry</CardTitle>
              </div>
              <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-800 border-emerald-200 font-bold px-2 py-0.5">
                Live Feed
              </Badge>
            </CardHeader>
            <CardContent className="pt-1 pb-4 px-5">
              <div className="space-y-2">
                <div className="flex items-baseline justify-between">
                  <div className="text-2xl font-black text-slate-900">{stats?.totalICUAvailable || 18}</div>
                  <span className="text-xs text-slate-500 font-medium">Beds Available</span>
                </div>
                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full transition-all" style={{ width: `72%` }} />
                </div>
                <p className="text-[11px] text-slate-400 font-medium">Capacity utilization: 28% occupied</p>
              </div>
            </CardContent>
          </Card>

          {/* General Ward */}
          <Card className="bg-white shadow-xs border border-slate-200/80 rounded-2xl overflow-hidden card-hover stagger-2">
            <CardHeader className="pb-2 pt-4 px-5 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-sky-50 text-sky-700 rounded-xl border border-sky-100">
                  <Bed className="h-4 w-4" />
                </div>
                <CardTitle className="text-sm font-bold text-slate-900">General Ward Beds</CardTitle>
              </div>
              <Badge variant="outline" className="text-[10px] bg-sky-50 text-sky-800 border-sky-200 font-bold px-2 py-0.5">
                65% Free
              </Badge>
            </CardHeader>
            <CardContent className="pt-1 pb-4 px-5">
              <div className="space-y-2">
                <div className="flex items-baseline justify-between">
                  <div className="text-2xl font-black text-slate-900">{stats?.totalGeneralAvailable || 142}</div>
                  <span className="text-xs text-slate-500 font-medium">Beds Available</span>
                </div>
                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-sky-600 rounded-full transition-all" style={{ width: `65%` }} />
                </div>
                <p className="text-[11px] text-slate-400 font-medium">General ward occupancy: 35%</p>
              </div>
            </CardContent>
          </Card>

          {/* Private Rooms */}
          <Card className="bg-white shadow-xs border border-slate-200/80 rounded-2xl overflow-hidden card-hover stagger-3">
            <CardHeader className="pb-2 pt-4 px-5 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-50 text-indigo-700 rounded-xl border border-indigo-100">
                  <BedDouble className="h-4 w-4" />
                </div>
                <CardTitle className="text-sm font-bold text-slate-900">Private Recovery Rooms</CardTitle>
              </div>
              <Badge variant="outline" className="text-[10px] bg-indigo-50 text-indigo-800 border-indigo-200 font-bold px-2 py-0.5">
                Ready
              </Badge>
            </CardHeader>
            <CardContent className="pt-1 pb-4 px-5">
              <div className="space-y-2">
                <div className="flex items-baseline justify-between">
                  <div className="text-2xl font-black text-slate-900">{stats?.totalPrivateRoomsAvailable || 26}</div>
                  <span className="text-xs text-slate-500 font-medium">Rooms Free</span>
                </div>
                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-600 rounded-full transition-all" style={{ width: `80%` }} />
                </div>
                <p className="text-[11px] text-slate-400 font-medium">Private room occupancy: 20%</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 3. Quick Operations 3-Box Grid */}
        <div className="grid gap-3.5 grid-cols-1 md:grid-cols-3">
          <Link href="/facilities" className="block group">
            <Card className="bg-white hover:border-teal-300 card-hover rounded-2xl border-slate-200/80 overflow-hidden h-full">
              <CardHeader className="p-4.5 flex flex-row items-center gap-3">
                <div className="p-2 bg-teal-50 text-teal-700 rounded-xl border border-teal-100 group-hover:bg-teal-100 transition-colors">
                  <Bed className="h-4 w-4" />
                </div>
                <div>
                  <CardTitle className="text-sm font-bold text-slate-900">Manage Beds & Equipment</CardTitle>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">ICU, HDU & Ward bed telemetry</p>
                </div>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/ambulance" className="block group">
            <Card className="bg-white hover:border-rose-300 card-hover rounded-2xl border-slate-200/80 overflow-hidden h-full">
              <CardHeader className="p-4.5 flex flex-row items-center gap-3">
                <div className="p-2 bg-rose-50 text-rose-600 rounded-xl border border-rose-100 group-hover:bg-rose-100 transition-colors">
                  <Ambulance className="h-4 w-4" />
                </div>
                <div>
                  <CardTitle className="text-sm font-bold text-slate-900">Ambulance Fleet Dispatch</CardTitle>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">108 Fleet GPS & Unit coordination</p>
                </div>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/facilities" className="block group">
            <Card className="bg-white hover:border-indigo-300 card-hover rounded-2xl border-slate-200/80 overflow-hidden h-full">
              <CardHeader className="p-4.5 flex flex-row items-center gap-3">
                <div className="p-2 bg-indigo-50 text-indigo-700 rounded-xl border border-indigo-100 group-hover:bg-indigo-100 transition-colors">
                  <Droplets className="h-4 w-4" />
                </div>
                <div>
                  <CardTitle className="text-sm font-bold text-slate-900">Blood Bank & Supplies</CardTitle>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Blood units & critical medical stock</p>
                </div>
              </CardHeader>
            </Card>
          </Link>
        </div>

        {/* 4. Split Section: Incoming Referrals Table (7 cols) & Today's Appointments (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Incoming Referrals Table (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <Card className="bg-white shadow-xs border border-slate-200/80 rounded-2xl overflow-hidden card-hover">
              <CardHeader className="flex flex-row items-center justify-between py-3.5 px-5 bg-slate-50/70 border-b border-slate-100">
                <div>
                  <CardTitle className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    {language === "hi" ? "आने वाले क्लिनिकल रेफरल्स" : "Incoming Patient Referrals"}
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500 font-medium mt-0.5">
                    Transfers from primary health centers & community clinics
                  </CardDescription>
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
                      <tr className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-5 py-3.5 font-bold text-slate-900">Aarav Sharma</td>
                        <td className="px-3 py-3.5">
                          <UrgencyBadge urgency={Urgency.MODERATE} size="sm" />
                        </td>
                        <td className="px-3 py-3.5">
                          <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200 text-[10px] font-bold">
                            PENDING
                          </Badge>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <Link href="/referrals">
                            <Button variant="ghost" size="sm" className="h-7 text-xs font-bold text-teal-700 hover:bg-teal-50">
                              View
                            </Button>
                          </Link>
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-5 py-3.5 font-bold text-slate-900">Sunita Verma</td>
                        <td className="px-3 py-3.5">
                          <UrgencyBadge urgency={Urgency.LOW} size="sm" />
                        </td>
                        <td className="px-3 py-3.5">
                          <Badge variant="outline" className="bg-emerald-50 text-emerald-800 border-emerald-200 text-[10px] font-bold">
                            ACCEPTED
                          </Badge>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <Link href="/referrals">
                            <Button variant="ghost" size="sm" className="h-7 text-xs font-bold text-teal-700 hover:bg-teal-50">
                              View
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Today's Appointments Roster (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <Card className="bg-white shadow-xs border border-slate-200/80 rounded-2xl overflow-hidden card-hover">
              <CardHeader className="flex flex-row items-center justify-between py-3.5 px-5 bg-slate-50/70 border-b border-slate-100">
                <CardTitle className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Today&apos;s OPD Roster
                </CardTitle>
                <Link href="/scheduling">
                  <Button variant="ghost" size="sm" className="text-teal-700 text-xs px-2 h-7 gap-1 font-bold">
                    Schedule <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="p-4 space-y-2.5">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-900">Aarav Sharma</span>
                    <p className="text-[11px] text-slate-500">Dr. Priya Mehta • 10:30 AM</p>
                  </div>
                  <Badge className="bg-emerald-50 text-emerald-800 border-emerald-200 text-[10px] font-bold">
                    Confirmed
                  </Badge>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-900">Sunita Verma</span>
                    <p className="text-[11px] text-slate-500">Dr. Priya Mehta • 11:45 AM</p>
                  </div>
                  <Badge className="bg-amber-50 text-amber-800 border-amber-200 text-[10px] font-bold">
                    Waiting
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>

        {/* 5. Bottom Row Stats */}
        <div className="grid gap-3.5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Facilities"
            value={facilities?.length || 3}
            icon={<Building2 className="h-4 w-4 text-indigo-700" />}
            description="In regional network"
            className="stagger-1"
          />
          <StatCard
            title="Total Patients"
            value={patients?.length || 1}
            icon={<Users className="h-4 w-4 text-sky-700" />}
            description="Registered EHR records"
            className="stagger-2"
          />
          <StatCard
            title="Ward Occupancy"
            value="35%"
            icon={<Bed className="h-4 w-4 text-emerald-700" />}
            description="Bed utilization rate"
            className="stagger-3"
          />
          <StatCard
            title="Pending Referrals"
            value={referrals?.length || 1}
            icon={<Clock className="h-4 w-4 text-amber-600" />}
            description="Awaiting coordination"
            className="stagger-4"
          />
        </div>

      </div>
    </div>
  );
}
