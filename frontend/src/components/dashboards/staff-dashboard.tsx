"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useStore } from "@/lib/store";
import { formatAppointmentTime, formatAppointmentDate, getAppointmentDateKey } from "@/lib/appointment-time";
import { UrgencyBadge } from "@/components/urgency-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Building2,
  Bed,
  Ambulance as AmbulanceIcon,
  Droplets,
  BedDouble,
  Users,
  Clock,
  ArrowRight,
  UserPlus,
  Search,
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Activity,
  Wrench,
  Package,
  Bell,
  CalendarCheck,
  Stethoscope,
  Heart,
  Truck,
  ShieldCheck,
  ChevronRight,
  Eye,
  LogIn,
} from "lucide-react";
import type { Equipment, BloodStock } from "@/lib/types";

// ============================================================
// Staff Operations Center — Full Hospital Dashboard
// ============================================================

// ---------- Status Badge Component ----------
function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string; border: string; label: string }> = {
    REQUESTED: { bg: "bg-amber-50", text: "text-amber-800", border: "border-amber-200", label: "Requested" },
    CONFIRMED: { bg: "bg-emerald-50", text: "text-emerald-800", border: "border-emerald-200", label: "Confirmed" },
    CHECKED_IN: { bg: "bg-sky-50", text: "text-sky-800", border: "border-sky-200", label: "Checked In" },
    IN_CONSULTATION: { bg: "bg-indigo-50", text: "text-indigo-800", border: "border-indigo-200", label: "In Consultation" },
    COMPLETED: { bg: "bg-slate-50", text: "text-slate-700", border: "border-slate-200", label: "Completed" },
    DECLINED: { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200", label: "Declined" },
    CANCELLED: { bg: "bg-gray-50", text: "text-gray-600", border: "border-gray-200", label: "Cancelled" },
  };
  const c = config[status] || { bg: "bg-slate-50", text: "text-slate-700", border: "border-slate-200", label: status };
  return (
    <Badge variant="outline" className={`${c.bg} ${c.text} ${c.border} text-[10px] font-bold`}>
      {c.label}
    </Badge>
  );
}

// ---------- Demo Data for Staff Operations ----------
const DEMO_EQUIPMENT: Equipment[] = [
  { id: "eq-1", name: "Ventilator", category: "Critical Care", status: "AVAILABLE", count: 12, inUseCount: 8, maintenanceCount: 1, location: "ICU Ward" },
  { id: "eq-2", name: "Cardiac Monitor", category: "Monitoring", status: "AVAILABLE", count: 24, inUseCount: 18, maintenanceCount: 2, location: "CCU / ICU" },
  { id: "eq-3", name: "Defibrillator", category: "Emergency", status: "AVAILABLE", count: 6, inUseCount: 2, maintenanceCount: 0, location: "Emergency Bay" },
  { id: "eq-4", name: "Dialysis Machine", category: "Renal", status: "AVAILABLE", count: 8, inUseCount: 6, maintenanceCount: 1, location: "Nephrology Unit" },
  { id: "eq-5", name: "Infusion Pump", category: "General", status: "AVAILABLE", count: 40, inUseCount: 32, maintenanceCount: 3, location: "All Wards" },
  { id: "eq-6", name: "Portable X-Ray", category: "Imaging", status: "IN_USE", count: 4, inUseCount: 3, maintenanceCount: 1, location: "Radiology" },
  { id: "eq-7", name: "Pulse Oximeter", category: "Monitoring", status: "AVAILABLE", count: 50, inUseCount: 35, maintenanceCount: 0, location: "All Wards" },
  { id: "eq-8", name: "Nebulizer", category: "Respiratory", status: "AVAILABLE", count: 20, inUseCount: 12, maintenanceCount: 2, location: "Pulmonology / Emergency" },
];

const DEMO_BLOOD_STOCK: BloodStock = {
  "O+": 42, "O-": 8, "A+": 35, "A-": 6, "B+": 28, "B-": 5, "AB+": 15, "AB-": 3,
};

const BLOOD_THRESHOLDS: Record<string, number> = {
  "O+": 20, "O-": 5, "A+": 15, "A-": 5, "B+": 15, "B-": 5, "AB+": 8, "AB-": 3,
};

interface AmbulanceUnit {
  id: string;
  vehicleNo: string;
  driverName: string;
  driverPhone: string;
  type: string;
  status: string;
  location: string;
  destination?: string;
  assignedPatientName?: string;
  etaMinutes?: number;
}

const DEMO_AMBULANCES: AmbulanceUnit[] = [
  { id: "amb-01", vehicleNo: "DL-01-AMB-1088", driverName: "Ravi Kumar", driverPhone: "9811001001", type: "ALS", status: "AVAILABLE", location: "Base Station — GGH Delhi" },
  { id: "amb-02", vehicleNo: "DL-01-AMB-1089", driverName: "Suresh Yadav", driverPhone: "9811001002", type: "BLS", status: "DISPATCHED", location: "Connaught Place", destination: "GGH Delhi Emergency", assignedPatientName: "Ramesh Gupta", etaMinutes: 12 },
  { id: "amb-03", vehicleNo: "DL-01-AMB-1090", driverName: "Amit Singh", driverPhone: "9811001003", type: "ALS", status: "EN_ROUTE", location: "Dwarka Sector 12", destination: "GGH Delhi Trauma", assignedPatientName: "Sunita Devi", etaMinutes: 18 },
  { id: "amb-04", vehicleNo: "DL-01-AMB-1091", driverName: "Pankaj Sharma", driverPhone: "9811001004", type: "BLS", status: "AVAILABLE", location: "Base Station — GGH Delhi" },
  { id: "amb-05", vehicleNo: "DL-01-AMB-1092", driverName: "Deepak Mehra", driverPhone: "9811001005", type: "PATIENT_TRANSPORT", status: "MAINTENANCE", location: "Service Bay" },
  { id: "amb-06", vehicleNo: "DL-01-AMB-1093", driverName: "Vikas Tiwari", driverPhone: "9811001006", type: "ALS", status: "ARRIVED", location: "GGH Delhi Emergency", destination: "GGH Delhi Emergency", assignedPatientName: "Pradeep Verma", etaMinutes: 0 },
];

// ---------- Supply Items ----------
interface SupplyRow {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  minimumThreshold: number;
}

const DEMO_SUPPLIES: SupplyRow[] = [
  { id: "sup-1", name: "Surgical Gloves (Sterile)", category: "PPE", quantity: 2400, unit: "pairs", minimumThreshold: 500 },
  { id: "sup-2", name: "N95 Masks", category: "PPE", quantity: 180, unit: "pieces", minimumThreshold: 200 },
  { id: "sup-3", name: "IV Cannula (18G)", category: "Consumables", quantity: 600, unit: "pieces", minimumThreshold: 100 },
  { id: "sup-4", name: "Syringes (5ml)", category: "Consumables", quantity: 3200, unit: "pieces", minimumThreshold: 500 },
  { id: "sup-5", name: "Oxygen Cylinders (Type D)", category: "Gases", quantity: 14, unit: "cylinders", minimumThreshold: 10 },
  { id: "sup-6", name: "Saline (0.9% NS 500ml)", category: "IV Fluids", quantity: 420, unit: "bags", minimumThreshold: 100 },
  { id: "sup-7", name: "Suture Kit (Chromic)", category: "Surgical", quantity: 85, unit: "kits", minimumThreshold: 30 },
  { id: "sup-8", name: "Bandage Rolls (4 inch)", category: "Dressing", quantity: 350, unit: "rolls", minimumThreshold: 100 },
];

// ============================================================
// Main Staff Dashboard Component
// ============================================================

export function StaffDashboard() {
  const {
    currentUser,
    facilities,
    referrals = [],
    patients = [],
    language,
    appointments = [],
    notifications = [],
    updateAppointmentStatus,
    refreshAppointments,
    refreshNotifications,
  } = useStore();

  // ---------- Local State ----------
  const [activeTab, setActiveTab] = useState("overview");
  const [apptSearch, setApptSearch] = useState("");
  const [apptStatusFilter, setApptStatusFilter] = useState<string>("ALL");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [bloodStock, setBloodStock] = useState<BloodStock>(DEMO_BLOOD_STOCK);
  const [equipmentList] = useState<Equipment[]>(DEMO_EQUIPMENT);
  const [ambulanceFleet] = useState<AmbulanceUnit[]>(DEMO_AMBULANCES);
  const [supplies] = useState<SupplyRow[]>(DEMO_SUPPLIES);

  // ---------- Derived Data ----------
  const today = getAppointmentDateKey(new Date());

  const todayAppointments = useMemo(() =>
    appointments
      .filter((a) => getAppointmentDateKey(a.dateTime) === today && !['CANCELLED', 'DECLINED'].includes(a.status))
      .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()),
    [appointments, today]
  );

  const pendingRequests = useMemo(() =>
    appointments.filter((a) => a.status === "REQUESTED"),
    [appointments]
  );

  const confirmedToday = useMemo(() =>
    todayAppointments.filter((a) => a.status === "CONFIRMED"),
    [todayAppointments]
  );

  const inConsultToday = useMemo(() =>
    todayAppointments.filter((a) => a.status === "IN_CONSULTATION"),
    [todayAppointments]
  );

  const completedToday = useMemo(() =>
    todayAppointments.filter((a) => a.status === "COMPLETED"),
    [todayAppointments]
  );

  // Appointment filtering
  const filteredAppointments = useMemo(() => {
    let list = appointments;
    if (apptStatusFilter !== "ALL") {
      list = list.filter((a) => a.status === apptStatusFilter);
    }
    if (apptSearch.trim()) {
      const q = apptSearch.toLowerCase().trim();
      list = list.filter((a) =>
        (a.patient?.name || "").toLowerCase().includes(q) ||
        (a.doctor?.name || "").toLowerCase().includes(q) ||
        a.id.toLowerCase().includes(q) ||
        (a.patient?.phone || "").includes(q) ||
        (a.reason || "").toLowerCase().includes(q)
      );
    }
    return list.sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());
  }, [appointments, apptStatusFilter, apptSearch]);

  // Facility data
  const userFacility = currentUser?.facilityId
    ? facilities?.find(f => f.id === currentUser.facilityId)
    : null;

  const facilityName = userFacility?.name || currentUser?.facilityName || "Government General Hospital — Delhi";

  // Bed telemetry from facility
  const icuTotal = userFacility?.icuBeds || 25;
  const icuUsed = userFacility?.icuBedsUsed || 7;
  const icuAvail = icuTotal - icuUsed;
  const generalTotal = userFacility?.generalBeds || 220;
  const generalUsed = userFacility?.generalBedsUsed || 78;
  const generalAvail = generalTotal - generalUsed;
  const privateTotal = userFacility?.privateRooms || 30;
  const privateUsed = userFacility?.privateRoomsUsed || 6;
  const privateAvail = privateTotal - privateUsed;

  // Blood alerts
  const bloodAlertCount = useMemo(() => {
    return Object.entries(bloodStock).filter(([group, units]) => {
      const threshold = BLOOD_THRESHOLDS[group] || 10;
      return (units as number) <= threshold;
    }).length;
  }, [bloodStock]);

  // Ambulance stats
  const ambulancesAvailable = ambulanceFleet.filter(a => a.status === "AVAILABLE").length;

  // Greeting
  const currentHour = new Date().getHours();
  let greeting = "Good evening";
  if (currentHour >= 5 && currentHour < 12) greeting = "Good morning";
  else if (currentHour >= 12 && currentHour < 17) greeting = "Good afternoon";
  else if (currentHour >= 17 && currentHour < 22) greeting = "Good evening";
  else greeting = "Good night";

  const firstName = currentUser?.name?.split(" ")[0] || "Staff";

  // Staff notifications
  const staffNotifications = useMemo(() =>
    notifications.filter(n => n.role === "HOSPITAL_STAFF" || n.role === "ALL").slice(0, 15),
    [notifications]
  );

  // ---------- Actions ----------
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([refreshAppointments(), refreshNotifications()]);
    } catch (e) {
      console.error("Refresh failed:", e);
    } finally {
      setIsRefreshing(false);
    }
  }, [refreshAppointments, refreshNotifications]);

  const handleStatusChange = useCallback(async (appointmentId: string, newStatus: string) => {
    setActionLoading(appointmentId);
    try {
      await updateAppointmentStatus(appointmentId, newStatus);
    } catch (e) {
      console.error("Status update failed:", e);
    } finally {
      setActionLoading(null);
    }
  }, [updateAppointmentStatus]);

  const handleBloodAdjust = useCallback((group: string, delta: number) => {
    setBloodStock(prev => {
      const current = (prev as unknown as Record<string, number>)[group] || 0;
      const newVal = Math.max(0, current + delta);
      return { ...prev, [group]: newVal } as BloodStock;
    });
  }, []);

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="relative min-h-screen w-full p-4 sm:p-8 font-sans isolate overflow-hidden">

      {/* 1. Full-bleed Hospital Command Photography Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <Image
          src="/backgrounds/staff-dashboard.jpg"
          alt="Hospital Command & Operations Center"
          fill
          priority
          className="object-cover object-center scale-105"
        />
        {/* Soft daylight luminescent veil */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/20 via-slate-900/10 to-slate-950/40 backdrop-blur-[1.5px]" />
      </div>

      {/* 2. Floating Ambient Glows */}
      <div className="absolute top-10 right-10 w-[500px] h-[500px] bg-sky-500/15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-[450px] h-[450px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="relative max-w-7xl mx-auto space-y-6 pb-16 z-10 page-enter">

        {/* ===== HEADER ===== */}
        <div className="glass-card-auth p-6 sm:p-7 rounded-[28px] border border-white/70 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5 backdrop-blur-2xl bg-white/90 section-enter">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-extrabold shadow-2xs">
              <Building2 className="w-4 h-4 text-indigo-600" />
              <span>Hospital Operations Center • {facilityName}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
              {greeting}, {firstName} 👋
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm font-medium">
              {language === "hi" ? "यहाँ आज का अस्पताल संचालन अवलोकन एवं बेड व एम्बुलेंस नियंत्रण कक्ष है।" : "Unified operational command center for beds, ambulances, blood bank & OPD queue."}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              onClick={handleRefresh}
              variant="outline"
              className="btn-3d-glass h-11 px-4 rounded-xl text-xs font-bold gap-2 border-slate-200"
              disabled={isRefreshing}
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
              {isRefreshing ? "Refreshing..." : "Refresh Live Data"}
            </Button>

            <Link href="/register">
              <button type="button" className="btn-3d-primary h-11 px-5 rounded-2xl text-xs font-extrabold gap-2">
                <UserPlus className="w-4 h-4" />
                <span>{language === "hi" ? "मरीज पंजीकरण" : "Register Patient"}</span>
              </button>
            </Link>
          </div>
        </div>

        {/* ===== TABBED OPERATIONS CENTER ===== */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full flex overflow-x-auto bg-white border border-slate-200/80 rounded-xl p-1 shadow-xs gap-0.5">
            <TabsTrigger value="overview" className="flex-1 text-xs font-bold gap-1.5 rounded-lg data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-800">
              <Activity className="w-3.5 h-3.5" /> Overview
            </TabsTrigger>
            <TabsTrigger value="appointments" className="flex-1 text-xs font-bold gap-1.5 rounded-lg data-[state=active]:bg-teal-50 data-[state=active]:text-teal-800">
              <CalendarCheck className="w-3.5 h-3.5" /> Appointments
              {pendingRequests.length > 0 && (
                <span className="ml-1 bg-amber-500 text-white text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center">
                  {pendingRequests.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="beds" className="flex-1 text-xs font-bold gap-1.5 rounded-lg data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-800">
              <Bed className="w-3.5 h-3.5" /> Beds
            </TabsTrigger>
            <TabsTrigger value="equipment" className="flex-1 text-xs font-bold gap-1.5 rounded-lg data-[state=active]:bg-sky-50 data-[state=active]:text-sky-800">
              <Wrench className="w-3.5 h-3.5" /> Equipment
            </TabsTrigger>
            <TabsTrigger value="ambulance" className="flex-1 text-xs font-bold gap-1.5 rounded-lg data-[state=active]:bg-rose-50 data-[state=active]:text-rose-800">
              <Truck className="w-3.5 h-3.5" /> Ambulance
            </TabsTrigger>
            <TabsTrigger value="bloodbank" className="flex-1 text-xs font-bold gap-1.5 rounded-lg data-[state=active]:bg-red-50 data-[state=active]:text-red-800">
              <Heart className="w-3.5 h-3.5" /> Blood Bank
              {bloodAlertCount > 0 && (
                <span className="ml-1 bg-red-500 text-white text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center">
                  {bloodAlertCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex-1 text-xs font-bold gap-1.5 rounded-lg data-[state=active]:bg-amber-50 data-[state=active]:text-amber-800">
              <Bell className="w-3.5 h-3.5" /> Alerts
            </TabsTrigger>
          </TabsList>

          {/* ===== TAB 1: OVERVIEW ===== */}
          <TabsContent value="overview" className="mt-4 space-y-5">
            {/* KPI Summary Cards */}
            <div className="grid gap-3.5 grid-cols-2 md:grid-cols-4">
              <div className="glass-panel bg-white/92 backdrop-blur-2xl shadow-xl border border-white/80 rounded-[24px] p-4 flex items-center gap-3 card-hover">
                <div className="p-3 bg-teal-50 text-teal-700 rounded-2xl border border-teal-100/80 shadow-2xs">
                  <CalendarCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-black text-slate-900">{todayAppointments.length}</p>
                  <p className="text-[11px] text-slate-500 font-bold">Today&apos;s Appointments</p>
                </div>
              </div>

              <div className="glass-panel bg-white/92 backdrop-blur-2xl shadow-xl border border-white/80 rounded-[24px] p-4 flex items-center gap-3 card-hover">
                <div className="p-3 bg-amber-50 text-amber-700 rounded-2xl border border-amber-100/80 shadow-2xs">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-black text-slate-900">{pendingRequests.length}</p>
                  <p className="text-[11px] text-slate-500 font-bold">Pending Requests</p>
                </div>
              </div>

              <div className="glass-panel bg-white/92 backdrop-blur-2xl shadow-xl border border-white/80 rounded-[24px] p-4 flex items-center gap-3 card-hover">
                <div className="p-3 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100/80 shadow-2xs">
                  <Bed className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-black text-slate-900">{icuAvail + generalAvail}</p>
                  <p className="text-[11px] text-slate-500 font-bold">Available Beds</p>
                </div>
              </div>

              <div className="glass-panel bg-white/92 backdrop-blur-2xl shadow-xl border border-white/80 rounded-[24px] p-4 flex items-center gap-3 card-hover">
                <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl border border-rose-100/80 shadow-2xs">
                  <AmbulanceIcon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-black text-slate-900">{ambulancesAvailable}</p>
                  <p className="text-[11px] text-slate-500 font-bold">Ambulances Ready</p>
                </div>
              </div>
            </div>

            {/* Second Row KPIs */}
            <div className="grid gap-3.5 grid-cols-2 md:grid-cols-4">
              <div className="glass-panel bg-white/92 backdrop-blur-2xl shadow-xl border border-white/80 rounded-[24px] p-4 flex items-center gap-3 card-hover">
                <div className="p-3 bg-indigo-50 text-indigo-700 rounded-2xl border border-indigo-100/80 shadow-2xs">
                  <Stethoscope className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-black text-slate-900">{inConsultToday.length}</p>
                  <p className="text-[11px] text-slate-500 font-bold">In Consultation</p>
                </div>
              </div>

              <div className="glass-panel bg-white/92 backdrop-blur-2xl shadow-xl border border-white/80 rounded-[24px] p-4 flex items-center gap-3 card-hover">
                <div className="p-3 bg-sky-50 text-sky-700 rounded-2xl border border-sky-100/80 shadow-2xs">
                  <Bed className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-black text-slate-900">{icuAvail}</p>
                  <p className="text-[11px] text-slate-500 font-bold">ICU Beds Free</p>
                </div>
              </div>

              <div className="glass-panel bg-white/92 backdrop-blur-2xl shadow-xl border border-white/80 rounded-[24px] p-4 flex items-center gap-3 card-hover">
                <div className="p-3 bg-red-50 text-red-600 rounded-2xl border border-red-100/80 shadow-2xs">
                  <Droplets className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-black text-slate-900">{bloodAlertCount}</p>
                  <p className="text-[11px] text-slate-500 font-bold">Blood Alerts</p>
                </div>
              </div>

              <div className="glass-panel bg-white/92 backdrop-blur-2xl shadow-xl border border-white/80 rounded-[24px] p-4 flex items-center gap-3 card-hover">
                <div className="p-3 bg-violet-50 text-violet-700 rounded-2xl border border-violet-100/80 shadow-2xs">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-black text-slate-900">{patients.length}</p>
                  <p className="text-[11px] text-slate-500 font-bold">Registered Patients</p>
                </div>
              </div>
            </div>

            {/* Ward Occupancy Telemetry */}
            <div className="grid gap-3.5 grid-cols-1 md:grid-cols-3">
              {/* ICU */}
              <Card className="bg-white shadow-xs border border-slate-200/80 rounded-2xl">
                <CardHeader className="pb-2 pt-4 px-5 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100">
                      <Bed className="h-4 w-4" />
                    </div>
                    <CardTitle className="text-sm font-bold text-slate-900">ICU Beds</CardTitle>
                  </div>
                  <Badge variant="outline" className={`text-[10px] font-bold px-2 py-0.5 ${icuAvail <= 3 ? "bg-red-50 text-red-800 border-red-200" : "bg-emerald-50 text-emerald-800 border-emerald-200"}`}>
                    {icuAvail} / {icuTotal} Free
                  </Badge>
                </CardHeader>
                <CardContent className="pt-1 pb-4 px-5">
                  <div className="space-y-2">
                    <div className="flex items-baseline justify-between">
                      <div className="text-2xl font-black text-slate-900">{icuAvail}</div>
                      <span className="text-xs text-slate-500 font-medium">Available</span>
                    </div>
                    <Progress value={icuTotal > 0 ? (icuUsed / icuTotal) * 100 : 0} className="h-2.5" />
                    <p className="text-[11px] text-slate-400 font-medium">Occupancy: {icuTotal > 0 ? Math.round((icuUsed / icuTotal) * 100) : 0}%</p>
                  </div>
                </CardContent>
              </Card>

              {/* General Ward */}
              <Card className="bg-white shadow-xs border border-slate-200/80 rounded-2xl">
                <CardHeader className="pb-2 pt-4 px-5 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-sky-50 text-sky-700 rounded-xl border border-sky-100">
                      <Bed className="h-4 w-4" />
                    </div>
                    <CardTitle className="text-sm font-bold text-slate-900">General Ward</CardTitle>
                  </div>
                  <Badge variant="outline" className="text-[10px] bg-sky-50 text-sky-800 border-sky-200 font-bold px-2 py-0.5">
                    {generalAvail} / {generalTotal} Free
                  </Badge>
                </CardHeader>
                <CardContent className="pt-1 pb-4 px-5">
                  <div className="space-y-2">
                    <div className="flex items-baseline justify-between">
                      <div className="text-2xl font-black text-slate-900">{generalAvail}</div>
                      <span className="text-xs text-slate-500 font-medium">Available</span>
                    </div>
                    <Progress value={generalTotal > 0 ? (generalUsed / generalTotal) * 100 : 0} className="h-2.5" />
                    <p className="text-[11px] text-slate-400 font-medium">Occupancy: {generalTotal > 0 ? Math.round((generalUsed / generalTotal) * 100) : 0}%</p>
                  </div>
                </CardContent>
              </Card>

              {/* Private Rooms */}
              <Card className="bg-white shadow-xs border border-slate-200/80 rounded-2xl">
                <CardHeader className="pb-2 pt-4 px-5 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-indigo-50 text-indigo-700 rounded-xl border border-indigo-100">
                      <BedDouble className="h-4 w-4" />
                    </div>
                    <CardTitle className="text-sm font-bold text-slate-900">Private Rooms</CardTitle>
                  </div>
                  <Badge variant="outline" className="text-[10px] bg-indigo-50 text-indigo-800 border-indigo-200 font-bold px-2 py-0.5">
                    {privateAvail} / {privateTotal} Free
                  </Badge>
                </CardHeader>
                <CardContent className="pt-1 pb-4 px-5">
                  <div className="space-y-2">
                    <div className="flex items-baseline justify-between">
                      <div className="text-2xl font-black text-slate-900">{privateAvail}</div>
                      <span className="text-xs text-slate-500 font-medium">Available</span>
                    </div>
                    <Progress value={privateTotal > 0 ? (privateUsed / privateTotal) * 100 : 0} className="h-2.5" />
                    <p className="text-[11px] text-slate-400 font-medium">Occupancy: {privateTotal > 0 ? Math.round((privateUsed / privateTotal) * 100) : 0}%</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Split: Referrals + Today's Appointments */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              {/* Incoming Referrals */}
              <div className="lg:col-span-7">
                <Card className="bg-white shadow-xs border border-slate-200/80 rounded-2xl overflow-hidden">
                  <CardHeader className="flex flex-row items-center justify-between py-3.5 px-5 bg-slate-50/70 border-b border-slate-100">
                    <div>
                      <CardTitle className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                        Incoming Patient Referrals
                      </CardTitle>
                      <CardDescription className="text-xs text-slate-500 font-medium mt-0.5">
                        Transfers from primary health centers
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
                          {referrals && referrals.length > 0 ? (
                            referrals.slice(0, 4).map((ref) => (
                              <tr key={ref.id} className="hover:bg-slate-50/60 transition-colors">
                                <td className="px-5 py-3.5 font-bold text-slate-900">{ref.patientName}</td>
                                <td className="px-3 py-3.5"><UrgencyBadge urgency={ref.urgency} size="sm" /></td>
                                <td className="px-3 py-3.5">
                                  <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200 text-[10px] font-bold">{ref.status}</Badge>
                                </td>
                                <td className="px-5 py-3.5 text-right">
                                  <Link href="/referrals">
                                    <Button variant="ghost" size="sm" className="h-7 text-xs font-bold text-teal-700 hover:bg-teal-50">View</Button>
                                  </Link>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={4} className="px-5 py-6 text-center text-slate-400 font-medium">No incoming referrals pending</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Today's OPD */}
              <div className="lg:col-span-5">
                <Card className="bg-white shadow-xs border border-slate-200/80 rounded-2xl overflow-hidden">
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
                    {todayAppointments.length > 0 ? (
                      todayAppointments.slice(0, 6).map((appt) => (
                        <div key={appt.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs hover:bg-slate-100/70 transition-colors">
                          <div className="space-y-0.5 min-w-0 flex-1">
                            <span className="font-bold text-slate-900">{appt.patient?.name || "Patient"}</span>
                            <p className="text-[11px] text-slate-500 truncate">
                              {appt.doctor?.name || "Doctor"} • {formatAppointmentTime(appt.dateTime, { hour: "numeric", minute: "2-digit", hour12: true })}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <StatusBadge status={appt.status} />
                            {appt.status === "REQUESTED" && (
                              <Button
                                size="sm"
                                className="h-6 px-2 text-[10px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg"
                                onClick={() => handleStatusChange(appt.id, "CONFIRMED")}
                                disabled={actionLoading === appt.id}
                              >
                                Accept
                              </Button>
                            )}
                            {appt.status === "CONFIRMED" && (
                              <Button
                                size="sm"
                                className="h-6 px-2 text-[10px] font-bold bg-sky-600 hover:bg-sky-700 text-white rounded-lg"
                                onClick={() => handleStatusChange(appt.id, "CHECKED_IN")}
                                disabled={actionLoading === appt.id}
                              >
                                <LogIn className="w-3 h-3 mr-0.5" /> Check In
                              </Button>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-6 text-center text-slate-400 font-medium text-xs">
                        No OPD appointments scheduled for today
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Bottom Row Stats */}
            <div className="grid gap-3.5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="bg-white shadow-xs border border-slate-200/80 rounded-2xl">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="p-2 bg-indigo-50 text-indigo-700 rounded-xl border border-indigo-100">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-lg font-black text-slate-900">{facilities?.length || 0}</p>
                    <p className="text-[11px] text-slate-500 font-medium">Total Facilities</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white shadow-xs border border-slate-200/80 rounded-2xl">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-lg font-black text-slate-900">{completedToday.length}</p>
                    <p className="text-[11px] text-slate-500 font-medium">Completed Today</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white shadow-xs border border-slate-200/80 rounded-2xl">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="p-2 bg-sky-50 text-sky-700 rounded-xl border border-sky-100">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-lg font-black text-slate-900">{confirmedToday.length}</p>
                    <p className="text-[11px] text-slate-500 font-medium">Confirmed Today</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white shadow-xs border border-slate-200/80 rounded-2xl">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="p-2 bg-amber-50 text-amber-600 rounded-xl border border-amber-100">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-lg font-black text-slate-900">{referrals?.length || 0}</p>
                    <p className="text-[11px] text-slate-500 font-medium">Pending Referrals</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ===== TAB 2: APPOINTMENTS ===== */}
          <TabsContent value="appointments" className="mt-4 space-y-4">
            {/* Search & Filters */}
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search by patient, doctor, ID, phone..."
                  value={apptSearch}
                  onChange={(e) => setApptSearch(e.target.value)}
                  className="pl-10 h-9 text-xs rounded-xl border-slate-200"
                />
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {["ALL", "REQUESTED", "CONFIRMED", "CHECKED_IN", "IN_CONSULTATION", "COMPLETED", "DECLINED", "CANCELLED"].map((s) => (
                  <Button
                    key={s}
                    variant={apptStatusFilter === s ? "default" : "outline"}
                    size="sm"
                    className={`h-7 text-[10px] font-bold rounded-lg ${apptStatusFilter === s ? "bg-indigo-600 text-white" : "border-slate-200 text-slate-600"}`}
                    onClick={() => setApptStatusFilter(s)}
                  >
                    {s === "ALL" ? "All" : s === "IN_CONSULTATION" ? "In Consult" : s === "CHECKED_IN" ? "Checked In" : s.charAt(0) + s.slice(1).toLowerCase()}
                  </Button>
                ))}
              </div>
            </div>

            {/* Appointments Table */}
            <Card className="bg-white shadow-xs border border-slate-200/80 rounded-2xl overflow-hidden">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="text-[11px] text-slate-400 uppercase bg-slate-50/50 border-b border-slate-100 font-bold">
                      <tr>
                        <th className="px-4 py-3">Patient</th>
                        <th className="px-3 py-3">Doctor</th>
                        <th className="px-3 py-3">Date / Time</th>
                        <th className="px-3 py-3">Type</th>
                        <th className="px-3 py-3">Status</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredAppointments.length > 0 ? (
                        filteredAppointments.slice(0, 25).map((appt) => (
                          <tr key={appt.id} className="hover:bg-slate-50/60 transition-colors">
                            <td className="px-4 py-3">
                              <div className="space-y-0.5">
                                <span className="font-bold text-slate-900">{appt.patient?.name || "Unknown"}</span>
                                {appt.patient?.phone && (
                                  <p className="text-[10px] text-slate-400">{appt.patient.phone}</p>
                                )}
                              </div>
                            </td>
                            <td className="px-3 py-3">
                              <div className="space-y-0.5">
                                <span className="font-semibold text-slate-800">{appt.doctor?.name || "—"}</span>
                                {appt.doctor?.specialty && (
                                  <p className="text-[10px] text-slate-400">{appt.doctor.specialty}</p>
                                )}
                              </div>
                            </td>
                            <td className="px-3 py-3 whitespace-nowrap">
                              <div className="space-y-0.5">
                                <span className="font-semibold text-slate-800">{formatAppointmentDate(appt.dateTime)}</span>
                                <p className="text-[10px] text-slate-400">{formatAppointmentTime(appt.dateTime, { hour: "numeric", minute: "2-digit", hour12: true })}</p>
                              </div>
                            </td>
                            <td className="px-3 py-3">
                              <Badge variant="outline" className="text-[10px] font-bold border-slate-200 text-slate-600">
                                {appt.visitType || "General"}
                              </Badge>
                            </td>
                            <td className="px-3 py-3">
                              <StatusBadge status={appt.status} />
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {appt.status === "REQUESTED" && (
                                  <>
                                    <Button
                                      size="sm"
                                      className="h-6 px-2 text-[10px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg"
                                      onClick={() => handleStatusChange(appt.id, "CONFIRMED")}
                                      disabled={actionLoading === appt.id}
                                    >
                                      <CheckCircle2 className="w-3 h-3 mr-0.5" /> Accept
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="h-6 px-2 text-[10px] font-bold text-rose-600 border-rose-200 hover:bg-rose-50 rounded-lg"
                                      onClick={() => handleStatusChange(appt.id, "DECLINED")}
                                      disabled={actionLoading === appt.id}
                                    >
                                      <XCircle className="w-3 h-3 mr-0.5" /> Decline
                                    </Button>
                                  </>
                                )}
                                {appt.status === "CONFIRMED" && (
                                  <Button
                                    size="sm"
                                    className="h-6 px-2 text-[10px] font-bold bg-sky-600 hover:bg-sky-700 text-white rounded-lg"
                                    onClick={() => handleStatusChange(appt.id, "CHECKED_IN")}
                                    disabled={actionLoading === appt.id}
                                  >
                                    <LogIn className="w-3 h-3 mr-0.5" /> Check In
                                  </Button>
                                )}
                                {appt.patientId && (
                                  <Link href={`/patients/${appt.patientId}`}>
                                    <Button variant="ghost" size="sm" className="h-6 px-2 text-[10px] font-bold text-teal-700 hover:bg-teal-50 rounded-lg">
                                      <Eye className="w-3 h-3 mr-0.5" /> Patient
                                    </Button>
                                  </Link>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="px-5 py-8 text-center text-slate-400 font-medium">
                            {apptSearch ? "No appointments match your search" : "No appointments found"}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
            {filteredAppointments.length > 25 && (
              <p className="text-center text-xs text-slate-400 font-medium">
                Showing 25 of {filteredAppointments.length} appointments. Use search or filters to narrow results.
              </p>
            )}
          </TabsContent>

          {/* ===== TAB 3: BED MANAGEMENT ===== */}
          <TabsContent value="beds" className="mt-4 space-y-5">
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
              {/* General Ward */}
              <Card className="bg-white shadow-xs border border-slate-200/80 rounded-2xl">
                <CardHeader className="pb-2 pt-4 px-5">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-sky-50 text-sky-700 rounded-xl border border-sky-100">
                      <Bed className="h-4 w-4" />
                    </div>
                    <CardTitle className="text-sm font-bold text-slate-900">General Ward</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="px-5 pb-4 space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="bg-slate-50 rounded-lg p-2">
                      <p className="text-lg font-black text-slate-900">{generalTotal}</p>
                      <p className="text-[10px] text-slate-500 font-medium">Total</p>
                    </div>
                    <div className="bg-emerald-50 rounded-lg p-2">
                      <p className="text-lg font-black text-emerald-700">{generalAvail}</p>
                      <p className="text-[10px] text-emerald-600 font-medium">Available</p>
                    </div>
                    <div className="bg-amber-50 rounded-lg p-2">
                      <p className="text-lg font-black text-amber-700">{generalUsed}</p>
                      <p className="text-[10px] text-amber-600 font-medium">Occupied</p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-2">
                      <p className="text-lg font-black text-slate-600">{generalTotal > 0 ? Math.round((generalUsed / generalTotal) * 100) : 0}%</p>
                      <p className="text-[10px] text-slate-500 font-medium">Utilization</p>
                    </div>
                  </div>
                  <Progress value={generalTotal > 0 ? (generalUsed / generalTotal) * 100 : 0} className="h-2" />
                </CardContent>
              </Card>

              {/* ICU */}
              <Card className="bg-white shadow-xs border border-slate-200/80 rounded-2xl">
                <CardHeader className="pb-2 pt-4 px-5">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100">
                      <Activity className="h-4 w-4" />
                    </div>
                    <CardTitle className="text-sm font-bold text-slate-900">ICU</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="px-5 pb-4 space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="bg-slate-50 rounded-lg p-2">
                      <p className="text-lg font-black text-slate-900">{icuTotal}</p>
                      <p className="text-[10px] text-slate-500 font-medium">Total</p>
                    </div>
                    <div className={`rounded-lg p-2 ${icuAvail <= 3 ? "bg-red-50" : "bg-emerald-50"}`}>
                      <p className={`text-lg font-black ${icuAvail <= 3 ? "text-red-700" : "text-emerald-700"}`}>{icuAvail}</p>
                      <p className={`text-[10px] font-medium ${icuAvail <= 3 ? "text-red-600" : "text-emerald-600"}`}>Available</p>
                    </div>
                    <div className="bg-amber-50 rounded-lg p-2">
                      <p className="text-lg font-black text-amber-700">{icuUsed}</p>
                      <p className="text-[10px] text-amber-600 font-medium">Occupied</p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-2">
                      <p className="text-lg font-black text-slate-600">{icuTotal > 0 ? Math.round((icuUsed / icuTotal) * 100) : 0}%</p>
                      <p className="text-[10px] text-slate-500 font-medium">Utilization</p>
                    </div>
                  </div>
                  <Progress value={icuTotal > 0 ? (icuUsed / icuTotal) * 100 : 0} className="h-2" />
                  {icuAvail <= 3 && (
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-red-600 bg-red-50 rounded-lg px-2 py-1.5">
                      <AlertTriangle className="w-3 h-3" /> ICU beds critically low
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Emergency */}
              <Card className="bg-white shadow-xs border border-slate-200/80 rounded-2xl">
                <CardHeader className="pb-2 pt-4 px-5">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-rose-50 text-rose-600 rounded-xl border border-rose-100">
                      <AlertTriangle className="h-4 w-4" />
                    </div>
                    <CardTitle className="text-sm font-bold text-slate-900">Emergency</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="px-5 pb-4 space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="bg-slate-50 rounded-lg p-2">
                      <p className="text-lg font-black text-slate-900">15</p>
                      <p className="text-[10px] text-slate-500 font-medium">Total</p>
                    </div>
                    <div className="bg-emerald-50 rounded-lg p-2">
                      <p className="text-lg font-black text-emerald-700">9</p>
                      <p className="text-[10px] text-emerald-600 font-medium">Available</p>
                    </div>
                    <div className="bg-amber-50 rounded-lg p-2">
                      <p className="text-lg font-black text-amber-700">5</p>
                      <p className="text-[10px] text-amber-600 font-medium">Occupied</p>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-2">
                      <p className="text-lg font-black text-orange-600">1</p>
                      <p className="text-[10px] text-orange-600 font-medium">Reserved</p>
                    </div>
                  </div>
                  <Progress value={40} className="h-2" />
                </CardContent>
              </Card>

              {/* Private Rooms */}
              <Card className="bg-white shadow-xs border border-slate-200/80 rounded-2xl">
                <CardHeader className="pb-2 pt-4 px-5">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-indigo-50 text-indigo-700 rounded-xl border border-indigo-100">
                      <BedDouble className="h-4 w-4" />
                    </div>
                    <CardTitle className="text-sm font-bold text-slate-900">Private Rooms</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="px-5 pb-4 space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="bg-slate-50 rounded-lg p-2">
                      <p className="text-lg font-black text-slate-900">{privateTotal}</p>
                      <p className="text-[10px] text-slate-500 font-medium">Total</p>
                    </div>
                    <div className="bg-emerald-50 rounded-lg p-2">
                      <p className="text-lg font-black text-emerald-700">{privateAvail}</p>
                      <p className="text-[10px] text-emerald-600 font-medium">Available</p>
                    </div>
                    <div className="bg-amber-50 rounded-lg p-2">
                      <p className="text-lg font-black text-amber-700">{privateUsed}</p>
                      <p className="text-[10px] text-amber-600 font-medium">Occupied</p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-2">
                      <p className="text-lg font-black text-slate-600">{privateTotal > 0 ? Math.round((privateUsed / privateTotal) * 100) : 0}%</p>
                      <p className="text-[10px] text-slate-500 font-medium">Utilization</p>
                    </div>
                  </div>
                  <Progress value={privateTotal > 0 ? (privateUsed / privateTotal) * 100 : 0} className="h-2" />
                </CardContent>
              </Card>
            </div>

            {/* Summary Row */}
            <Card className="bg-white shadow-xs border border-slate-200/80 rounded-2xl">
              <CardContent className="p-4">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                  <div>
                    <p className="text-xl font-black text-slate-900">{generalTotal + icuTotal + privateTotal + 15}</p>
                    <p className="text-[11px] text-slate-500 font-medium">Total Beds</p>
                  </div>
                  <div>
                    <p className="text-xl font-black text-amber-700">{generalUsed + icuUsed + privateUsed + 5}</p>
                    <p className="text-[11px] text-amber-600 font-medium">Occupied</p>
                  </div>
                  <div>
                    <p className="text-xl font-black text-emerald-700">{generalAvail + icuAvail + privateAvail + 9}</p>
                    <p className="text-[11px] text-emerald-600 font-medium">Available</p>
                  </div>
                  <div>
                    <p className="text-xl font-black text-orange-600">1</p>
                    <p className="text-[11px] text-orange-600 font-medium">Reserved</p>
                  </div>
                  <div>
                    <p className="text-xl font-black text-slate-600">0</p>
                    <p className="text-[11px] text-slate-500 font-medium">Maintenance</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ===== TAB 4: EQUIPMENT ===== */}
          <TabsContent value="equipment" className="mt-4 space-y-4">
            <Card className="bg-white shadow-xs border border-slate-200/80 rounded-2xl overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between py-3.5 px-5 bg-slate-50/70 border-b border-slate-100">
                <div>
                  <CardTitle className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Equipment Inventory
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500 font-medium mt-0.5">
                    Medical equipment status and availability
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="text-[11px] text-slate-400 uppercase bg-slate-50/50 border-b border-slate-100 font-bold">
                      <tr>
                        <th className="px-5 py-3">Equipment</th>
                        <th className="px-3 py-3">Category</th>
                        <th className="px-3 py-3 text-center">Total</th>
                        <th className="px-3 py-3 text-center">Available</th>
                        <th className="px-3 py-3 text-center">In Use</th>
                        <th className="px-3 py-3 text-center">Maintenance</th>
                        <th className="px-3 py-3">Location</th>
                        <th className="px-3 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {equipmentList.map((eq) => {
                        const available = eq.count - (eq.inUseCount || 0) - (eq.maintenanceCount || 0);
                        const isWarning = available <= 1;
                        return (
                          <tr key={eq.id || eq.name} className="hover:bg-slate-50/60 transition-colors">
                            <td className="px-5 py-3.5">
                              <div className="flex items-center gap-2">
                                <Wrench className="w-3.5 h-3.5 text-slate-400" />
                                <span className="font-bold text-slate-900">{eq.name}</span>
                              </div>
                            </td>
                            <td className="px-3 py-3.5">
                              <Badge variant="outline" className="text-[10px] font-bold border-slate-200 text-slate-600">{eq.category || "General"}</Badge>
                            </td>
                            <td className="px-3 py-3.5 text-center font-bold text-slate-800">{eq.count}</td>
                            <td className="px-3 py-3.5 text-center">
                              <span className={`font-black ${isWarning ? "text-red-600" : "text-emerald-700"}`}>{available}</span>
                            </td>
                            <td className="px-3 py-3.5 text-center font-bold text-amber-700">{eq.inUseCount || 0}</td>
                            <td className="px-3 py-3.5 text-center font-bold text-orange-600">{eq.maintenanceCount || 0}</td>
                            <td className="px-3 py-3.5 text-slate-600">{eq.location || "—"}</td>
                            <td className="px-3 py-3.5">
                              {isWarning ? (
                                <Badge className="bg-red-50 text-red-700 border-red-200 text-[10px] font-bold">
                                  <AlertTriangle className="w-3 h-3 mr-0.5" /> Low
                                </Badge>
                              ) : (eq.maintenanceCount || 0) > 0 ? (
                                <Badge className="bg-amber-50 text-amber-700 border-amber-200 text-[10px] font-bold">
                                  Partial Maintenance
                                </Badge>
                              ) : (
                                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] font-bold">
                                  Operational
                                </Badge>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Supply Items */}
            <Card className="bg-white shadow-xs border border-slate-200/80 rounded-2xl overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between py-3.5 px-5 bg-slate-50/70 border-b border-slate-100">
                <div>
                  <CardTitle className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Medical Supplies Inventory
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500 font-medium mt-0.5">
                    Consumables, PPE, and critical supplies
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="text-[11px] text-slate-400 uppercase bg-slate-50/50 border-b border-slate-100 font-bold">
                      <tr>
                        <th className="px-5 py-3">Item</th>
                        <th className="px-3 py-3">Category</th>
                        <th className="px-3 py-3 text-center">Quantity</th>
                        <th className="px-3 py-3">Unit</th>
                        <th className="px-3 py-3 text-center">Min Threshold</th>
                        <th className="px-3 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {supplies.map((item) => {
                        const isLow = item.quantity <= item.minimumThreshold;
                        const isCritical = item.quantity <= item.minimumThreshold * 0.5;
                        return (
                          <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                            <td className="px-5 py-3.5">
                              <div className="flex items-center gap-2">
                                <Package className="w-3.5 h-3.5 text-slate-400" />
                                <span className="font-bold text-slate-900">{item.name}</span>
                              </div>
                            </td>
                            <td className="px-3 py-3.5">
                              <Badge variant="outline" className="text-[10px] font-bold border-slate-200 text-slate-600">{item.category}</Badge>
                            </td>
                            <td className={`px-3 py-3.5 text-center font-black ${isCritical ? "text-red-600" : isLow ? "text-amber-600" : "text-slate-900"}`}>
                              {item.quantity.toLocaleString()}
                            </td>
                            <td className="px-3 py-3.5 text-slate-600">{item.unit}</td>
                            <td className="px-3 py-3.5 text-center text-slate-500">{item.minimumThreshold.toLocaleString()}</td>
                            <td className="px-3 py-3.5">
                              {isCritical ? (
                                <Badge className="bg-red-50 text-red-700 border-red-200 text-[10px] font-bold">
                                  <AlertTriangle className="w-3 h-3 mr-0.5" /> Critical
                                </Badge>
                              ) : isLow ? (
                                <Badge className="bg-amber-50 text-amber-700 border-amber-200 text-[10px] font-bold">
                                  Low Stock
                                </Badge>
                              ) : (
                                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] font-bold">
                                  Normal
                                </Badge>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ===== TAB 5: AMBULANCE DISPATCH ===== */}
          <TabsContent value="ambulance" className="mt-4 space-y-4">
            {/* Fleet Summary */}
            <div className="grid gap-3.5 grid-cols-2 md:grid-cols-4">
              <Card className="bg-white shadow-xs border border-slate-200/80 rounded-2xl">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-black text-slate-900">{ambulanceFleet.length}</p>
                  <p className="text-[11px] text-slate-500 font-medium">Total Fleet</p>
                </CardContent>
              </Card>
              <Card className="bg-white shadow-xs border border-emerald-200/80 rounded-2xl">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-black text-emerald-700">{ambulancesAvailable}</p>
                  <p className="text-[11px] text-emerald-600 font-medium">Available</p>
                </CardContent>
              </Card>
              <Card className="bg-white shadow-xs border border-amber-200/80 rounded-2xl">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-black text-amber-700">{ambulanceFleet.filter(a => ["DISPATCHED", "EN_ROUTE", "ARRIVED", "IN_SERVICE"].includes(a.status)).length}</p>
                  <p className="text-[11px] text-amber-600 font-medium">Active / Dispatched</p>
                </CardContent>
              </Card>
              <Card className="bg-white shadow-xs border border-orange-200/80 rounded-2xl">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-black text-orange-600">{ambulanceFleet.filter(a => a.status === "MAINTENANCE").length}</p>
                  <p className="text-[11px] text-orange-600 font-medium">Maintenance</p>
                </CardContent>
              </Card>
            </div>

            {/* Fleet Table */}
            <Card className="bg-white shadow-xs border border-slate-200/80 rounded-2xl overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between py-3.5 px-5 bg-slate-50/70 border-b border-slate-100">
                <div>
                  <CardTitle className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    108 Ambulance Fleet
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500 font-medium mt-0.5">
                    Real-time fleet status and dispatch center
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="text-[11px] text-slate-400 uppercase bg-slate-50/50 border-b border-slate-100 font-bold">
                      <tr>
                        <th className="px-4 py-3">Unit ID</th>
                        <th className="px-3 py-3">Vehicle</th>
                        <th className="px-3 py-3">Driver</th>
                        <th className="px-3 py-3">Type</th>
                        <th className="px-3 py-3">Status</th>
                        <th className="px-3 py-3">Location</th>
                        <th className="px-3 py-3">Patient</th>
                        <th className="px-3 py-3">ETA</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {ambulanceFleet.map((amb) => {
                        const statusColors: Record<string, string> = {
                          AVAILABLE: "bg-emerald-50 text-emerald-800 border-emerald-200",
                          DISPATCHED: "bg-amber-50 text-amber-800 border-amber-200",
                          EN_ROUTE: "bg-sky-50 text-sky-800 border-sky-200",
                          ARRIVED: "bg-indigo-50 text-indigo-800 border-indigo-200",
                          IN_SERVICE: "bg-violet-50 text-violet-800 border-violet-200",
                          MAINTENANCE: "bg-orange-50 text-orange-800 border-orange-200",
                        };
                        return (
                          <tr key={amb.id} className="hover:bg-slate-50/60 transition-colors">
                            <td className="px-4 py-3.5 font-bold text-slate-900">{amb.id}</td>
                            <td className="px-3 py-3.5 font-semibold text-slate-800">{amb.vehicleNo}</td>
                            <td className="px-3 py-3.5">
                              <div className="space-y-0.5">
                                <span className="font-semibold text-slate-800">{amb.driverName}</span>
                                <p className="text-[10px] text-slate-400">{amb.driverPhone}</p>
                              </div>
                            </td>
                            <td className="px-3 py-3.5">
                              <Badge variant="outline" className="text-[10px] font-bold border-slate-200">{amb.type}</Badge>
                            </td>
                            <td className="px-3 py-3.5">
                              <Badge variant="outline" className={`text-[10px] font-bold ${statusColors[amb.status] || ""}`}>
                                {amb.status.replace("_", " ")}
                              </Badge>
                            </td>
                            <td className="px-3 py-3.5 text-slate-600 max-w-[140px] truncate">{amb.location}</td>
                            <td className="px-3 py-3.5 text-slate-600">{amb.assignedPatientName || "—"}</td>
                            <td className="px-3 py-3.5">
                              {amb.etaMinutes !== undefined && amb.etaMinutes > 0 ? (
                                <span className="font-bold text-sky-700">{amb.etaMinutes} min</span>
                              ) : amb.status === "ARRIVED" ? (
                                <span className="font-bold text-emerald-700">Arrived</span>
                              ) : (
                                "—"
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ===== TAB 6: BLOOD BANK ===== */}
          <TabsContent value="bloodbank" className="mt-4 space-y-4">
            <div className="grid gap-3.5 grid-cols-2 md:grid-cols-4">
              {(Object.entries(bloodStock) as [string, number][]).map(([group, units]) => {
                const threshold = BLOOD_THRESHOLDS[group] || 10;
                const isCritical = units <= threshold * 0.5;
                const isLow = units <= threshold;
                return (
                  <Card key={group} className={`bg-white shadow-xs rounded-2xl ${isCritical ? "border-red-300 border-2" : isLow ? "border-amber-300 border-2" : "border border-slate-200/80"}`}>
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`p-2 rounded-xl border ${isCritical ? "bg-red-50 text-red-600 border-red-100" : isLow ? "bg-amber-50 text-amber-600 border-amber-100" : "bg-red-50 text-red-500 border-red-100"}`}>
                            <Droplets className="h-4 w-4" />
                          </div>
                          <span className="text-lg font-black text-slate-900">{group}</span>
                        </div>
                        {isCritical ? (
                          <Badge className="bg-red-100 text-red-800 border-red-200 text-[9px] font-black">CRITICAL</Badge>
                        ) : isLow ? (
                          <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-[9px] font-black">LOW</Badge>
                        ) : (
                          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-[9px] font-black">NORMAL</Badge>
                        )}
                      </div>

                      <div className="text-center">
                        <p className={`text-3xl font-black ${isCritical ? "text-red-600" : isLow ? "text-amber-600" : "text-slate-900"}`}>{units}</p>
                        <p className="text-[10px] text-slate-500 font-medium">units available</p>
                      </div>

                      <Progress
                        value={Math.min(100, (units / (threshold * 3)) * 100)}
                        className="h-2"
                      />

                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
                        <span>Threshold: {threshold} units</span>
                      </div>

                      <div className="flex gap-1.5">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 h-7 text-[10px] font-bold rounded-lg border-red-200 text-red-600 hover:bg-red-50"
                          onClick={() => handleBloodAdjust(group, -1)}
                          disabled={units <= 0}
                        >
                          − Issue
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 h-7 text-[10px] font-bold rounded-lg border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                          onClick={() => handleBloodAdjust(group, 1)}
                        >
                          + Receive
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Blood Bank Summary */}
            <Card className="bg-white shadow-xs border border-slate-200/80 rounded-2xl">
              <CardContent className="p-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-xl font-black text-slate-900">
                      {Object.values(bloodStock).reduce((sum, v) => sum + (v as number), 0)}
                    </p>
                    <p className="text-[11px] text-slate-500 font-medium">Total Units</p>
                  </div>
                  <div>
                    <p className="text-xl font-black text-emerald-700">
                      {Object.entries(bloodStock).filter(([g, u]) => (u as number) > (BLOOD_THRESHOLDS[g] || 10)).length}
                    </p>
                    <p className="text-[11px] text-emerald-600 font-medium">Groups Normal</p>
                  </div>
                  <div>
                    <p className="text-xl font-black text-red-600">{bloodAlertCount}</p>
                    <p className="text-[11px] text-red-600 font-medium">Groups Low/Critical</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ===== TAB 7: NOTIFICATIONS ===== */}
          <TabsContent value="notifications" className="mt-4 space-y-4">
            <Card className="bg-white shadow-xs border border-slate-200/80 rounded-2xl overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between py-3.5 px-5 bg-slate-50/70 border-b border-slate-100">
                <div>
                  <CardTitle className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Operational Notifications
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500 font-medium mt-0.5">
                    Appointments, beds, blood bank, ambulance alerts
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs font-bold rounded-lg border-slate-200"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                >
                  <RefreshCw className={`w-3 h-3 mr-1 ${isRefreshing ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
              </CardHeader>
              <CardContent className="p-4 space-y-2.5">
                {staffNotifications.length > 0 ? (
                  staffNotifications.map((notif) => {
                    const urgencyColors: Record<string, string> = {
                      EMERGENCY: "border-l-red-500 bg-red-50/50",
                      HIGH: "border-l-amber-500 bg-amber-50/30",
                      NORMAL: "border-l-slate-300 bg-white",
                    };
                    return (
                      <div
                        key={notif.id}
                        className={`p-3 rounded-xl border border-slate-100 border-l-4 ${urgencyColors[notif.urgency] || urgencyColors.NORMAL} flex items-start gap-3 hover:shadow-xs transition-all`}
                      >
                        <div className={`p-1.5 rounded-lg ${notif.urgency === "EMERGENCY" ? "bg-red-100 text-red-600" : notif.urgency === "HIGH" ? "bg-amber-100 text-amber-600" : "bg-slate-100 text-slate-500"}`}>
                          <Bell className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-slate-900">{notif.title}</span>
                            <Badge variant="outline" className="text-[9px] font-bold border-slate-200 text-slate-500">{notif.category}</Badge>
                            {!notif.read && <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />}
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">{notif.message}</p>
                          <p className="text-[10px] text-slate-400 mt-1">{new Date(notif.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</p>
                        </div>
                        {notif.link && (
                          <Link href={notif.link}>
                            <Button variant="ghost" size="sm" className="h-6 px-2 text-[10px] font-bold text-teal-700">
                              <ChevronRight className="w-3 h-3" />
                            </Button>
                          </Link>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="py-8 text-center text-slate-400 font-medium text-xs space-y-2">
                    <Bell className="w-8 h-8 mx-auto text-slate-300" />
                    <p>No operational notifications</p>
                    <p className="text-[10px]">Notifications will appear here for appointment requests, low stock alerts, and operational events</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>

      </div>
    </div>
  );
}
