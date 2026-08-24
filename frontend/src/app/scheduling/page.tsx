"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Appointment, Doctor, Patient } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar as CalendarIcon,
  Clock,
  Stethoscope,
  Plus,
  Search,
  Play,
  RefreshCw,
  Check,
  X,
} from "lucide-react";

const STATUS_CONFIG: Record<
  string,
  { label: string; bg: string; text: string; border: string; step: number }
> = {
  REQUESTED: { label: "Requested", bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", step: 1 },
  CONFIRMED: { label: "Confirmed", bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200", step: 2 },
  CHECKED_IN: { label: "Checked-In", bg: "bg-amber-50", text: "text-amber-800", border: "border-amber-200", step: 3 },
  IN_CONSULTATION: { label: "In Consultation", bg: "bg-teal-50", text: "text-teal-800", border: "border-teal-300", step: 4 },
  COMPLETED: { label: "Completed", bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", step: 5 },
  DECLINED: { label: "Declined", bg: "bg-slate-100", text: "text-slate-600", border: "border-slate-200", step: 0 },
  CANCELLED: { label: "Cancelled", bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200", step: 0 },
};

export default function SchedulingPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Views
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [viewMode, setViewMode] = useState<"list" | "roster">("list");

  // Drawer / Modals
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showBookModal, setShowBookModal] = useState(false);

  // Book Form State
  const [bookPatientId, setBookPatientId] = useState("");
  const [bookDoctorId, setBookDoctorId] = useState("");
  const [bookDateTime, setBookDateTime] = useState("");
  const [bookVisitType, setBookVisitType] = useState("NEW");
  const [bookReason, setBookReason] = useState("");
  const [bookNotes, setBookNotes] = useState("");
  const [booking, setBooking] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const [apptsRes, docsRes, patsRes] = await Promise.all([
        fetch(`${API}/api/appointments`),
        fetch(`${API}/api/doctors`),
        fetch(`${API}/api/patients`),
      ]);

      if (apptsRes.ok) setAppointments(await apptsRes.json());
      if (docsRes.ok) {
        const docs = await docsRes.json();
        setDoctors(docs);
        if (docs.length > 0 && !bookDoctorId) setBookDoctorId(docs[0].id);
      }
      if (patsRes.ok) {
        const pats = await patsRes.json();
        setPatients(pats);
        if (pats.length > 0 && !bookPatientId) setBookPatientId(pats[0].id);
      }
    } catch (err) {
      console.error("Error fetching scheduling data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filtered Appointments
  const filteredAppointments = useMemo(() => {
    return appointments.filter((appt) => {
      const matchesDoctor = selectedDoctor === "ALL" || appt.doctorId === selectedDoctor;
      const matchesStatus = selectedStatus === "ALL" || appt.status === selectedStatus;
      const q = searchQuery.toLowerCase().trim();
      const patientName = appt.patient?.name?.toLowerCase() || "";
      const doctorName = appt.doctor?.name?.toLowerCase() || "";
      const reason = appt.reason?.toLowerCase() || "";
      const matchesSearch = !q || patientName.includes(q) || doctorName.includes(q) || reason.includes(q);

      return matchesDoctor && matchesStatus && matchesSearch;
    });
  }, [appointments, selectedDoctor, selectedStatus, searchQuery]);

  // Update Status Action
  const handleUpdateStatus = async (appointmentId: string, newStatus: string) => {
    try {
      const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${API}/api/appointments/${appointmentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setAppointments((prev) => prev.map((a) => (a.id === appointmentId ? { ...a, status: newStatus } : a)));
        if (selectedAppointment?.id === appointmentId) {
          setSelectedAppointment((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
      }
    } catch (err) {
      console.error("Error updating appointment status:", err);
    }
  };

  // Book Appointment Submit
  const handleBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookPatientId || !bookDoctorId || !bookDateTime) {
      alert("Please fill all required fields.");
      return;
    }

    setBooking(true);
    try {
      const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${API}/api/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: bookPatientId,
          doctorId: bookDoctorId,
          dateTime: new Date(bookDateTime).toISOString(),
          visitType: bookVisitType,
          reason: bookReason,
          notes: bookNotes,
          status: "CONFIRMED",
        }),
      });

      if (res.ok) {
        setShowBookModal(false);
        setBookReason("");
        setBookNotes("");
        fetchData();
      }
    } catch (err) {
      console.error("Error booking appointment:", err);
    } finally {
      setBooking(false);
    }
  };

  // Metrics
  const requestedCount = appointments.filter((a) => a.status === "REQUESTED").length;
  const confirmedCount = appointments.filter((a) => a.status === "CONFIRMED").length;
  const checkedInCount = appointments.filter((a) => a.status === "CHECKED_IN").length;
  const inConsultCount = appointments.filter((a) => a.status === "IN_CONSULTATION").length;
  const completedCount = appointments.filter((a) => a.status === "COMPLETED").length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-200/80 pb-6">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-gradient-to-br from-teal-500 to-emerald-600 text-white rounded-2xl shadow-md shadow-teal-500/20">
            <CalendarIcon className="h-8 w-8" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                Scheduling & Consultation Queue
              </h1>
              <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-200 font-bold px-2.5 py-0.5">
                Real-Time Roster
              </Badge>
            </div>
            <p className="text-slate-500 mt-1 font-medium">
              Manage clinical appointments, facility check-ins, and consultation lifecycles.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Button
            variant="outline"
            onClick={fetchData}
            className="h-11 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>

          <Button
            onClick={() => setShowBookModal(true)}
            className="h-11 px-5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white shadow-md font-bold gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>Book Appointment</span>
          </Button>
        </div>
      </div>

      {/* Appointment Lifecycle Metric Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div
          onClick={() => setSelectedStatus("ALL")}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            selectedStatus === "ALL"
              ? "bg-slate-900 text-white border-slate-900 shadow-md"
              : "bg-white text-slate-700 border-slate-200/80 hover:bg-slate-50"
          }`}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider block opacity-70">Total Roster</span>
          <span className="text-2xl font-black mt-1 block">{appointments.length}</span>
        </div>

        <div
          onClick={() => setSelectedStatus("REQUESTED")}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            selectedStatus === "REQUESTED"
              ? "bg-blue-600 text-white border-blue-600 shadow-md"
              : "bg-white text-slate-700 border-slate-200/80 hover:bg-blue-50/50"
          }`}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider block text-blue-500">Requested</span>
          <span className="text-2xl font-black mt-1 block text-blue-700">{requestedCount}</span>
        </div>

        <div
          onClick={() => setSelectedStatus("CONFIRMED")}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            selectedStatus === "CONFIRMED"
              ? "bg-purple-600 text-white border-purple-600 shadow-md"
              : "bg-white text-slate-700 border-slate-200/80 hover:bg-purple-50/50"
          }`}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider block text-purple-500">Confirmed</span>
          <span className="text-2xl font-black mt-1 block text-purple-700">{confirmedCount}</span>
        </div>

        <div
          onClick={() => setSelectedStatus("CHECKED_IN")}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            selectedStatus === "CHECKED_IN"
              ? "bg-amber-600 text-white border-amber-600 shadow-md"
              : "bg-white text-slate-700 border-slate-200/80 hover:bg-amber-50/50"
          }`}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider block text-amber-600">Checked-In</span>
          <span className="text-2xl font-black mt-1 block text-amber-700">{checkedInCount}</span>
        </div>

        <div
          onClick={() => setSelectedStatus("IN_CONSULTATION")}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            selectedStatus === "IN_CONSULTATION"
              ? "bg-teal-600 text-white border-teal-600 shadow-md"
              : "bg-white text-slate-700 border-slate-200/80 hover:bg-teal-50/50"
          }`}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider block text-teal-600">In Consult</span>
          <span className="text-2xl font-black mt-1 block text-teal-700">{inConsultCount}</span>
        </div>

        <div
          onClick={() => setSelectedStatus("COMPLETED")}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            selectedStatus === "COMPLETED"
              ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
              : "bg-white text-slate-700 border-slate-200/80 hover:bg-emerald-50/50"
          }`}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider block text-emerald-600">Completed</span>
          <span className="text-2xl font-black mt-1 block text-emerald-700">{completedCount}</span>
        </div>
      </div>

      {/* Control & Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col md:flex-row gap-3 justify-between items-center">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto flex-1">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="search"
              placeholder="Search by patient, doctor or reason..."
              className="pl-10 h-11 rounded-xl border-slate-200 bg-slate-50 text-sm focus:bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
            className="h-11 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-700 w-full sm:w-auto"
          >
            <option value="ALL">All Attending Clinicians</option>
            {doctors.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.specialty})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <div className="p-1 bg-slate-100 rounded-xl flex items-center gap-1">
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === "list" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Queue List
            </button>
            <button
              onClick={() => setViewMode("roster")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === "roster" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Doctor Roster
            </button>
          </div>
        </div>
      </div>

      {/* Main View: List or Roster */}
      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center space-y-3">
          <RefreshCw className="h-8 w-8 text-teal-600 animate-spin" />
          <p className="text-slate-500 font-medium">Assembling Appointment Queue...</p>
        </div>
      ) : filteredAppointments.length === 0 ? (
        <Card className="border-dashed border-2 border-slate-200 shadow-sm bg-slate-50/50 rounded-2xl">
          <CardContent className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
              <CalendarIcon className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">No appointments scheduled</h3>
            <p className="text-slate-500 max-w-sm mb-6">
              No clinical visits match your filter parameters. Book an intake to populate the roster.
            </p>
            <Button onClick={() => setShowBookModal(true)} className="h-11 px-6 rounded-xl bg-teal-600 hover:bg-teal-700">
              Book First Appointment
            </Button>
          </CardContent>
        </Card>
      ) : viewMode === "list" ? (
        /* Queue Table View */
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-4 px-5">Date & Time</th>
                  <th className="py-4 px-4">Patient Details</th>
                  <th className="py-4 px-4">Doctor & Department</th>
                  <th className="py-4 px-4">Visit Type & Reason</th>
                  <th className="py-4 px-4">Lifecycle State</th>
                  <th className="py-4 px-5 text-right">Quick Transition</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredAppointments.map((appt) => {
                  const statusCfg = STATUS_CONFIG[appt.status] || STATUS_CONFIG.REQUESTED;
                  const dateObj = new Date(appt.dateTime);

                  return (
                    <tr
                      key={appt.id}
                      onClick={() => setSelectedAppointment(appt)}
                      className="hover:bg-teal-50/30 transition-colors cursor-pointer group"
                    >
                      {/* Date & Time */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 bg-slate-100 text-slate-700 rounded-xl group-hover:bg-teal-100 group-hover:text-teal-800 transition-colors">
                            <Clock className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block text-xs">
                              {dateObj.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                            </span>
                            <span className="text-[11px] font-semibold text-teal-700">
                              {dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Patient */}
                      <td className="py-4 px-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                            {appt.patient?.name || "Patient"}
                          </span>
                          <span className="text-xs text-slate-400">
                            {appt.patient?.age} yrs • {appt.patient?.gender} • {appt.patient?.mrn || "No MRN"}
                          </span>
                        </div>
                      </td>

                      {/* Doctor */}
                      <td className="py-4 px-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-800">{appt.doctor?.name || "Dr. Assigned"}</span>
                          <span className="text-xs text-slate-500">{appt.doctor?.specialty || "General Medicine"}</span>
                        </div>
                      </td>

                      {/* Visit Type & Reason */}
                      <td className="py-4 px-4">
                        <div className="flex flex-col gap-1 max-w-[200px]">
                          <Badge
                            variant="secondary"
                            className={`w-fit text-[10px] font-bold ${
                              appt.visitType === "EMERGENCY"
                                ? "bg-rose-100 text-rose-800"
                                : appt.visitType === "FOLLOW_UP"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {appt.visitType}
                          </Badge>
                          <span className="text-xs text-slate-600 truncate">{appt.reason || "Consultation"}</span>
                        </div>
                      </td>

                      {/* Lifecycle Status */}
                      <td className="py-4 px-4">
                        <Badge
                          variant="outline"
                          className={`font-bold text-xs ${statusCfg.bg} ${statusCfg.text} ${statusCfg.border}`}
                        >
                          {statusCfg.label}
                        </Badge>
                      </td>

                      {/* Action Buttons */}
                      <td className="py-4 px-5 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          {appt.status === "REQUESTED" && (
                            <Button
                              size="sm"
                              onClick={() => handleUpdateStatus(appt.id, "CONFIRMED")}
                              className="h-8 px-3 text-xs bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl"
                            >
                              <Check className="w-3.5 h-3.5 mr-1" /> Confirm
                            </Button>
                          )}

                          {appt.status === "CONFIRMED" && (
                            <Button
                              size="sm"
                              onClick={() => handleUpdateStatus(appt.id, "CHECKED_IN")}
                              className="h-8 px-3 text-xs bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl"
                            >
                              Check-In
                            </Button>
                          )}

                          {appt.status === "CHECKED_IN" && (
                            <Link href={`/patients/${appt.patientId}/encounter?appointmentId=${appt.id}`}>
                              <Button
                                size="sm"
                                className="h-8 px-3 text-xs bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl gap-1 shadow-sm"
                              >
                                <Play className="w-3 h-3 fill-current" /> Start Consult
                              </Button>
                            </Link>
                          )}

                          {appt.status === "IN_CONSULTATION" && (
                            <Link href={`/patients/${appt.patientId}/encounter?appointmentId=${appt.id}`}>
                              <Button
                                size="sm"
                                className="h-8 px-3 text-xs bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl gap-1"
                              >
                                Resume
                              </Button>
                            </Link>
                          )}

                          {appt.status === "COMPLETED" && (
                            <Link href={`/patients/${appt.patientId}`}>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 px-3 text-xs font-bold rounded-xl text-slate-600 border-slate-200 hover:bg-slate-50"
                              >
                                View 360°
                              </Button>
                            </Link>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Doctor Roster Column Grid */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {doctors.map((doctor) => {
            const docAppts = appointments.filter((a) => a.doctorId === doctor.id);

            return (
              <Card key={doctor.id} className="border border-slate-200/80 shadow-sm rounded-3xl overflow-hidden bg-white">
                <CardHeader className="bg-slate-50/80 p-5 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-teal-600 text-white font-bold flex items-center justify-center shadow-sm text-base">
                      {doctor.name.replace("Dr. ", "").charAt(0)}
                    </div>
                    <div>
                      <CardTitle className="text-base font-bold text-slate-900">{doctor.name}</CardTitle>
                      <p className="text-xs text-slate-500">{doctor.specialty} • {docAppts.length} appointments</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  {docAppts.length === 0 ? (
                    <p className="text-xs text-slate-400 italic text-center py-8">No appointments scheduled for this doctor.</p>
                  ) : (
                    docAppts.map((appt) => {
                      const statusCfg = STATUS_CONFIG[appt.status] || STATUS_CONFIG.REQUESTED;

                      return (
                        <div
                          key={appt.id}
                          onClick={() => setSelectedAppointment(appt)}
                          className="p-3.5 rounded-2xl border border-slate-200/70 hover:border-teal-300 hover:bg-teal-50/20 transition-all cursor-pointer space-y-2 bg-slate-50/30"
                        >
                          <div className="flex justify-between items-start">
                            <span className="font-bold text-slate-900 text-sm">{appt.patient?.name}</span>
                            <Badge variant="outline" className={`text-[10px] font-bold ${statusCfg.bg} ${statusCfg.text} ${statusCfg.border}`}>
                              {statusCfg.label}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <Clock className="w-3.5 h-3.5 text-teal-600" />
                            <span>{new Date(appt.dateTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                            <span>•</span>
                            <span className="truncate">{appt.reason || "Consultation"}</span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Appointment Detail Summary Drawer / Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <Card className="max-w-xl w-full border-0 shadow-2xl rounded-3xl overflow-hidden bg-white animate-in zoom-in-95 duration-200">
            <CardHeader className="bg-slate-50/90 p-6 border-b border-slate-100 flex flex-row items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Appointment Details</span>
                <CardTitle className="text-xl font-black text-slate-900">
                  {selectedAppointment.patient?.name || "Patient Appointment"}
                </CardTitle>
              </div>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="w-8 h-8 rounded-full bg-slate-200/60 hover:bg-slate-200 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              {/* Lifecycle Stage Stepper */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Consultation Lifecycle State
                </span>
                <div className="grid grid-cols-5 gap-1.5 text-center text-[10px] font-bold">
                  {["REQUESTED", "CONFIRMED", "CHECKED_IN", "IN_CONSULTATION", "COMPLETED"].map((stepStatus, idx) => {
                    const currentStep = STATUS_CONFIG[selectedAppointment.status]?.step || 0;
                    const thisStep = idx + 1;
                    const isReached = currentStep >= thisStep;

                    return (
                      <div
                        key={stepStatus}
                        className={`p-2 rounded-xl border transition-all ${
                          isReached
                            ? "bg-teal-600 text-white border-teal-600 shadow-sm"
                            : "bg-slate-50 text-slate-400 border-slate-200"
                        }`}
                      >
                        <span>{thisStep}. {STATUS_CONFIG[stepStatus].label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Patient & Doctor Card */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 font-bold block mb-1">PATIENT</span>
                  <span className="font-bold text-slate-900 text-sm block">{selectedAppointment.patient?.name}</span>
                  <span className="text-slate-500">
                    {selectedAppointment.patient?.age} yrs • {selectedAppointment.patient?.gender}
                  </span>
                  <span className="font-mono text-[10px] text-teal-700 block mt-1">
                    MRN: {selectedAppointment.patient?.mrn || "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block mb-1">CLINICIAN</span>
                  <span className="font-bold text-slate-900 text-sm block">{selectedAppointment.doctor?.name}</span>
                  <span className="text-slate-500">{selectedAppointment.doctor?.specialty}</span>
                  <span className="text-[10px] text-slate-500 block mt-1">
                    Time: {new Date(selectedAppointment.dateTime).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Reason & Notes */}
              <div className="space-y-1.5 text-xs">
                <span className="font-bold text-slate-400 uppercase tracking-wider block">Clinical Intake Reason</span>
                <p className="font-semibold text-slate-800 text-sm">
                  {selectedAppointment.reason || "General Routine Health Review"}
                </p>
                {selectedAppointment.notes && (
                  <p className="text-slate-500 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                    {selectedAppointment.notes}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                {selectedAppointment.status === "REQUESTED" && (
                  <Button
                    onClick={() => handleUpdateStatus(selectedAppointment.id, "CONFIRMED")}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl h-11"
                  >
                    <Check className="w-4 h-4 mr-1.5" /> Confirm Appointment
                  </Button>
                )}

                {selectedAppointment.status === "CONFIRMED" && (
                  <Button
                    onClick={() => handleUpdateStatus(selectedAppointment.id, "CHECKED_IN")}
                    className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl h-11"
                  >
                    Check-In Patient
                  </Button>
                )}

                {(selectedAppointment.status === "CHECKED_IN" || selectedAppointment.status === "IN_CONSULTATION") && (
                  <Link
                    href={`/patients/${selectedAppointment.patientId}/encounter?appointmentId=${selectedAppointment.id}`}
                    className="flex-1"
                  >
                    <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl h-11 gap-2 shadow-sm">
                      <Stethoscope className="w-4 h-4" /> Start Clinical Consultation
                    </Button>
                  </Link>
                )}

                <Link href={`/patients/${selectedAppointment.patientId}`} className="flex-1">
                  <Button variant="outline" className="w-full font-bold rounded-xl h-11 border-slate-200">
                    Open Patient 360° Profile
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Book New Appointment Modal */}
      {showBookModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <Card className="max-w-xl w-full border-0 shadow-2xl rounded-3xl overflow-hidden bg-white animate-in zoom-in-95 duration-200">
            <CardHeader className="bg-slate-50/90 p-6 border-b border-slate-100 flex flex-row items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600">New Intake</span>
                <CardTitle className="text-xl font-black text-slate-900">Schedule Clinical Appointment</CardTitle>
              </div>
              <button
                onClick={() => setShowBookModal(false)}
                className="w-8 h-8 rounded-full bg-slate-200/60 hover:bg-slate-200 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </CardHeader>

            <CardContent className="p-6">
              <form onSubmit={handleBookSubmit} className="space-y-4">
                <div>
                  <Label className="text-xs font-bold text-slate-700 block mb-1">Select Patient *</Label>
                  <select
                    value={bookPatientId}
                    onChange={(e) => setBookPatientId(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold focus:ring-2 focus:ring-teal-500"
                    required
                  >
                    {patients.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.mrn} • {p.age} yrs • {p.district})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs font-bold text-slate-700 block mb-1">Attending Clinician *</Label>
                    <select
                      value={bookDoctorId}
                      onChange={(e) => setBookDoctorId(e.target.value)}
                      className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold focus:ring-2 focus:ring-teal-500"
                      required
                    >
                      {doctors.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name} ({d.specialty})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label className="text-xs font-bold text-slate-700 block mb-1">Visit Type</Label>
                    <select
                      value={bookVisitType}
                      onChange={(e) => setBookVisitType(e.target.value)}
                      className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium"
                    >
                      <option value="NEW">New Patient Consultation</option>
                      <option value="FOLLOW_UP">Follow-Up Review</option>
                      <option value="EMERGENCY">Emergency Triage</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label className="text-xs font-bold text-slate-700 block mb-1">Appointment Date & Time *</Label>
                  <Input
                    type="datetime-local"
                    value={bookDateTime}
                    onChange={(e) => setBookDateTime(e.target.value)}
                    className="rounded-xl h-11 bg-slate-50"
                    required
                  />
                </div>

                <div>
                  <Label className="text-xs font-bold text-slate-700 block mb-1">Chief Reason for Appointment</Label>
                  <Input
                    placeholder="e.g. Chronic knee pain review, ECG follow-up..."
                    value={bookReason}
                    onChange={(e) => setBookReason(e.target.value)}
                    className="rounded-xl h-11 bg-slate-50"
                  />
                </div>

                <div>
                  <Label className="text-xs font-bold text-slate-700 block mb-1">Internal Clinical Notes</Label>
                  <Textarea
                    placeholder="Special precautions, prior lab values..."
                    value={bookNotes}
                    onChange={(e) => setBookNotes(e.target.value)}
                    className="rounded-xl min-h-[60px] bg-slate-50 text-xs"
                  />
                </div>

                <div className="flex justify-end gap-2.5 pt-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowBookModal(false)}
                    className="rounded-xl h-11 font-bold"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={booking}
                    className="bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl h-11 px-6 shadow-sm"
                  >
                    {booking ? "Booking..." : "Confirm Booking"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
