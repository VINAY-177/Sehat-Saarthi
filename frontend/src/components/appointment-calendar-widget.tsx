"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Role, Appointment, Patient, Doctor } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar as CalendarIcon, Clock, Stethoscope, Plus, User
} from "lucide-react";

interface AppointmentCalendarWidgetProps {
  role: Role;
  userId?: string;
  userName?: string;
}

const STATUS_MAP: Record<string, { label: string; bg: string; text: string }> = {
  REQUESTED: { label: "Requested", bg: "bg-blue-50 border-blue-200", text: "text-blue-700" },
  CONFIRMED: { label: "Confirmed", bg: "bg-purple-50 border-purple-200", text: "text-purple-700" },
  CHECKED_IN: { label: "Checked-In", bg: "bg-amber-50 border-amber-200", text: "text-amber-800" },
  IN_CONSULTATION: { label: "In Consultation", bg: "bg-teal-50 border-teal-300", text: "text-teal-800" },
  COMPLETED: { label: "Completed", bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-700" },
  DECLINED: { label: "Declined", bg: "bg-slate-100 border-slate-200", text: "text-slate-600" },
  CANCELLED: { label: "Cancelled", bg: "bg-rose-50 border-rose-200", text: "text-rose-700" },
};

export function AppointmentCalendarWidget({ role }: AppointmentCalendarWidgetProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  useEffect(() => {
    fetch("http://localhost:5000/api/appointments")
      .then((res) => (res.ok ? res.json() : []))
      .then((data: Appointment[]) => {
        if (data && data.length > 0) {
          setAppointments(data);
        } else {
          // Fallback realistic demo appointments
          setAppointments([
            {
              id: "appt-1",
              patientId: "p-1",
              doctorId: "doc-1",
              dateTime: new Date(Date.now() + 3600000 * 2).toISOString(),
              status: "CONFIRMED",
              visitType: "NEW",
              reason: "Post-op Cardiology Followup & Telemetry Review",
              patient: { id: "p-1", name: "Amit Sharma", mrn: "MRN-2025-0001", age: 45, gender: "Male" } as unknown as Patient,
              doctor: { id: "doc-1", name: "Dr. Priya Sharma", specialty: "Cardiology" } as unknown as Doctor,
            },
            {
              id: "appt-2",
              patientId: "p-2",
              doctorId: "doc-2",
              dateTime: new Date(Date.now() + 3600000 * 5).toISOString(),
              status: "CHECKED_IN",
              visitType: "EMERGENCY",
              reason: "Acute Chest Pain & Hypertensive Crisis Evaluation",
              patient: { id: "p-2", name: "Priya Gupta", mrn: "MRN-2025-0002", age: 34, gender: "Female" } as unknown as Patient,
              doctor: { id: "doc-2", name: "Dr. Rajesh Kumar", specialty: "Emergency Medicine" } as unknown as Doctor,
            },
            {
              id: "appt-3",
              patientId: "p-3",
              doctorId: "doc-1",
              dateTime: new Date(Date.now() + 86400000).toISOString(),
              status: "REQUESTED",
              visitType: "FOLLOW_UP",
              reason: "Diabetes Management & Medication Adjustment",
              patient: { id: "p-3", name: "Ramesh Yadav", mrn: "MRN-2025-0003", age: 58, gender: "Male" } as unknown as Patient,
              doctor: { id: "doc-1", name: "Dr. Priya Sharma", specialty: "Cardiology" } as unknown as Doctor,
            },
            {
              id: "appt-4",
              patientId: "p-4",
              doctorId: "doc-3",
              dateTime: new Date(Date.now() + 86400000 * 2).toISOString(),
              status: "CONFIRMED",
              visitType: "FOLLOW_UP",
              reason: "Routine Antenatal Checkup & Ultrasound",
              patient: { id: "p-4", name: "Sunita Devi", mrn: "MRN-2025-0004", age: 28, gender: "Female" } as unknown as Patient,
              doctor: { id: "doc-3", name: "Dr. Anjali Verma", specialty: "Obstetrics & Gynaecology" } as unknown as Doctor,
            },
          ]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load appointments for calendar:", err);
        setLoading(false);
      });
  }, []);

  // Generate 7-day strip centered around selectedDate
  const daysStrip = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + (i - 1)); // yesterday, today, next 5 days
    return d;
  });

  const isSameDay = (d1: Date, d2: Date) => {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <Card className="shadow-sm border-slate-200/80 rounded-3xl overflow-hidden bg-white">
      {/* Calendar Header */}
      <CardHeader className="py-4 px-6 bg-slate-50/50 border-b border-slate-100 flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-teal-500 to-emerald-600 text-white rounded-2xl shadow-sm">
            <CalendarIcon className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-base font-bold text-slate-900">
              {role === Role.PATIENT && "Your Appointment Calendar"}
              {role === Role.DOCTOR && "Clinical Consultation Schedule"}
              {role === Role.HOSPITAL_STAFF && "Facility Appointment Roster"}
            </CardTitle>
            <p className="text-xs text-slate-500 font-medium">
              {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()} • {appointments.length} Consultations Scheduled
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/scheduling">
            <Button size="sm" className="h-8 text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-sm gap-1">
              <Plus className="h-3.5 w-3.5" />
              {role === Role.PATIENT ? "Book Appointment" : "Manage Queue"}
            </Button>
          </Link>
        </div>
      </CardHeader>

      <CardContent className="p-5 space-y-5">
        {/* Interactive 7-Day Date Strip */}
        <div className="grid grid-cols-7 gap-2">
          {daysStrip.map((day, idx) => {
            const isSelected = isSameDay(day, selectedDate);
            const isToday = isSameDay(day, new Date());
            const countForDay = appointments.filter((a) => {
              const aDate = new Date(a.dateTime);
              return isSameDay(aDate, day);
            }).length;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedDate(day)}
                className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border transition-all relative ${
                  isSelected
                    ? "bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-600/20 font-bold"
                    : isToday
                    ? "bg-teal-50/60 border-teal-200 text-teal-900 font-bold"
                    : "bg-slate-50/50 border-slate-100 text-slate-600 hover:bg-slate-100"
                }`}
              >
                <span className="text-[10px] uppercase tracking-wider opacity-80">
                  {dayNames[day.getDay()]}
                </span>
                <span className="text-base font-extrabold mt-0.5">{day.getDate()}</span>

                {countForDay > 0 && (
                  <span
                    className={`mt-1 flex h-1.5 w-1.5 rounded-full ${
                      isSelected ? "bg-white" : "bg-teal-500"
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Appointment Cards for Calendar */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-800">
              Consultations for {selectedDate.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}
            </span>
            <span className="text-slate-400 font-medium">
              Showing active bookings
            </span>
          </div>

          <div className="space-y-2.5">
            {appointments.map((appt) => {
              const apptDate = new Date(appt.dateTime);
              const statusCfg = STATUS_MAP[appt.status] || { label: appt.status, bg: "bg-slate-100", text: "text-slate-700" };

              return (
                <div
                  key={appt.id}
                  className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 bg-white rounded-xl text-teal-600 border border-slate-100 shadow-sm shrink-0 mt-0.5">
                      <Clock className="h-4 w-4" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-sm text-slate-900">
                          {apptDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                        <Badge variant="outline" className={`text-[10px] font-bold border ${statusCfg.bg} ${statusCfg.text}`}>
                          {statusCfg.label}
                        </Badge>
                        <Badge variant="secondary" className="text-[10px] font-semibold bg-white border border-slate-200">
                          {appt.visitType}
                        </Badge>
                      </div>

                      <div className="text-xs text-slate-600 flex items-center gap-2 flex-wrap font-medium">
                        {role === Role.PATIENT ? (
                          <span className="flex items-center gap-1 font-bold text-slate-800">
                            <Stethoscope className="h-3.5 w-3.5 text-teal-600" />
                            {appt.doctor?.name || "Dr. Priya Sharma"} ({appt.doctor?.specialty || "Cardiology"})
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 font-bold text-slate-800">
                            <User className="h-3.5 w-3.5 text-teal-600" />
                            {appt.patient?.name || "Patient Record"} • {appt.patient?.gender || "Male"}, {appt.patient?.age || 45}y
                          </span>
                        )}
                      </div>

                      {appt.reason && (
                        <p className="text-[11px] text-slate-500 line-clamp-1 italic">
                          &quot;{appt.reason}&quot;
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    {role === Role.DOCTOR && (
                      <Link href={`/patients/${appt.patientId}/encounter`}>
                        <Button size="sm" className="h-8 text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-sm">
                          Start Encounter
                        </Button>
                      </Link>
                    )}
                    {role === Role.PATIENT && (
                      <Link href="/messages">
                        <Button variant="outline" size="sm" className="h-8 text-xs font-bold rounded-xl border-slate-200 hover:bg-slate-100">
                          Message Doctor
                        </Button>
                      </Link>
                    )}
                    {role === Role.HOSPITAL_STAFF && (
                      <Link href="/scheduling">
                        <Button variant="outline" size="sm" className="h-8 text-xs font-bold rounded-xl border-slate-200 hover:bg-slate-100">
                          Check-In
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}

            {appointments.length === 0 && !loading && (
              <div className="text-center py-8 text-slate-400 text-xs font-medium border border-dashed rounded-2xl">
                No consultations scheduled for this date.
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
