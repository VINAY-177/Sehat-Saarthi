"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Role, Appointment, Patient, Doctor } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar as CalendarIcon, ChevronLeft, ChevronRight, 
  Clock, ShieldCheck, Edit3, Paperclip
} from "lucide-react";

import { useStore } from "@/lib/store";

interface AppointmentCalendarWidgetProps {
  role?: Role;
  userId?: string;
  userName?: string;
  patientName?: string;
  onScheduleClick?: () => void;
}

const MONTH_NAMES_EN = [
  "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
  "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
];

const MONTH_NAMES_HI = [
  "जनवरी", "फ़रवरी", "मार्च", "अप्रैल", "मई", "जून",
  "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर"
];

const DAY_NAMES_EN = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const DAY_NAMES_HI = ["रवि", "सोम", "मंगल", "बुध", "गुरु", "शुक्र", "शनि"];

export function AppointmentCalendarWidget({ 
  patientName = "Patient",
  onScheduleClick 
}: AppointmentCalendarWidgetProps) {
  const { t, language } = useStore();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  
  // Current viewing month and year
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDate());

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const monthNames = language === "hi" ? MONTH_NAMES_HI : MONTH_NAMES_EN;
  const dayNames = language === "hi" ? DAY_NAMES_HI : DAY_NAMES_EN;

  useEffect(() => {
    fetch("http://localhost:5000/api/appointments")
      .then((res) => (res.ok ? res.json() : []))
      .then((data: Appointment[]) => {
        if (data && data.length > 0) {
          setAppointments(data);
        } else {
          // Pre-seed realistic dates for calendar
          const now = new Date();
          const y = now.getFullYear();
          const m = now.getMonth();

          setAppointments([
            {
              id: "appt-1",
              patientId: "p-1",
              doctorId: "doc-1",
              dateTime: new Date(y, m, 6, 9, 0).toISOString(),
              status: "CONFIRMED",
              visitType: "FOLLOW_UP",
              reason: "9:00 AM Follow-up Appointment",
              notes: "Cardiology telemetry follow-up and BP review.",
              patient: { id: "p-1", name: patientName, mrn: "MRN-2025-0001" } as Patient,
              doctor: { id: "doc-1", name: "Dr. Priya Sharma", specialty: "Cardiology" } as Doctor,
            },
            {
              id: "appt-2",
              patientId: "p-1",
              doctorId: "doc-2",
              dateTime: new Date(y, m, 9, 11, 30).toISOString(),
              status: "CONFIRMED",
              visitType: "NEW",
              reason: "11:30 AM Routine Clinical Checkup",
              notes: "Fasting lipid profile & blood glucose evaluation.",
              patient: { id: "p-1", name: patientName, mrn: "MRN-2025-0001" } as Patient,
              doctor: { id: "doc-2", name: "Dr. Rajesh Kumar", specialty: "General Medicine" } as Doctor,
            },
            {
              id: "appt-3",
              patientId: "p-1",
              doctorId: "doc-3",
              dateTime: new Date(y, m, 11, 14, 0).toISOString(),
              status: "CHECKED_IN",
              visitType: "FOLLOW_UP",
              reason: "02:00 PM Orthopedic Consultation",
              notes: "Knee replacement post-op mobility review.",
              patient: { id: "p-1", name: patientName, mrn: "MRN-2025-0001" } as Patient,
              doctor: { id: "doc-3", name: "Dr. Vikram Sethi", specialty: "Orthopedics" } as Doctor,
            },
            {
              id: "appt-4",
              patientId: "p-1",
              doctorId: "doc-1",
              dateTime: new Date(y, m, 20, 10, 0).toISOString(),
              status: "CONFIRMED",
              visitType: "FOLLOW_UP",
              reason: "10:00 AM Medication Review",
              notes: "Atorvastatin & Metoprolol titration check.",
              patient: { id: "p-1", name: patientName, mrn: "MRN-2025-0001" } as Patient,
              doctor: { id: "doc-1", name: "Dr. Priya Sharma", specialty: "Cardiology" } as Doctor,
            },
            {
              id: "appt-5",
              patientId: "p-1",
              doctorId: "doc-2",
              dateTime: new Date(y, m, 28, 16, 30).toISOString(),
              status: "REQUESTED",
              visitType: "FOLLOW_UP",
              reason: "04:30 PM Diet & Lifestyle Counseling",
              notes: "Ayurvedic and dietary regimen review.",
              patient: { id: "p-1", name: patientName, mrn: "MRN-2025-0001" } as Patient,
              doctor: { id: "doc-2", name: "Dr. Rajesh Kumar", specialty: "General Medicine" } as Doctor,
            },
          ]);
        }
      })
      .catch((err) => {
        console.warn("Appointments fetch error:", err);
      });
  }, [patientName]);

  // Navigate Months
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  // Calendar Grid Calculation
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Create grid cells: leading blanks + days of month
  const calendarCells = useMemo(() => {
    const cells: (number | null)[] = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      cells.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      cells.push(day);
    }
    return cells;
  }, [firstDayOfMonth, daysInMonth]);

  // Find appointment days for current month
  const appointmentDays = useMemo(() => {
    const map = new Map<number, Appointment[]>();
    appointments.forEach((appt) => {
      const d = new Date(appt.dateTime);
      if (d.getFullYear() === currentYear && d.getMonth() === currentMonth) {
        const day = d.getDate();
        if (!map.has(day)) {
          map.set(day, []);
        }
        map.get(day)!.push(appt);
      }
    });
    return map;
  }, [appointments, currentYear, currentMonth]);

  // Appointments for the currently selected day
  const selectedDayAppointments = appointmentDays.get(selectedDay) || [];

  return (
    <div className="space-y-6">
      {/* ── Appointments Calendar Box ── */}
      <Card className="border border-slate-200/80 shadow-sm rounded-3xl overflow-hidden bg-white">
        <CardHeader className="py-4 px-6 bg-slate-50/50 border-b border-slate-100 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-teal-50 text-teal-700 rounded-xl border border-teal-100">
              <CalendarIcon className="h-4 w-4" />
            </div>
            <CardTitle className="text-base font-extrabold text-slate-900">
              {t("appointments")}
            </CardTitle>
          </div>

          {/* Month Stepper Controls */}
          <div className="flex items-center gap-1 text-slate-500">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg hover:bg-slate-200/60 transition-colors"
              title="Previous Month"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg hover:bg-slate-200/60 transition-colors"
              title="Next Month"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </CardHeader>

        <CardContent className="p-5 space-y-4">
          {/* Month & Year Label */}
          <div className="text-center font-bold text-xs tracking-wider text-slate-700 uppercase">
            {monthNames[currentMonth]} {currentYear}
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 text-center text-[10px] font-bold text-slate-400">
            {dayNames.map((d) => (
              <div key={d} className="py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Monthly Dates Grid */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs">
            {calendarCells.map((day, idx) => {
              if (day === null) {
                return <div key={`blank-${idx}`} className="h-8 w-8" />;
              }

              const hasAppt = appointmentDays.has(day);
              const isSelected = selectedDay === day;

              return (
                <button
                  key={`day-${day}`}
                  type="button"
                  onClick={() => setSelectedDay(day)}
                  className={`h-8 w-8 mx-auto flex items-center justify-center rounded-xl font-bold transition-all text-xs ${
                    isSelected
                      ? "bg-teal-600 text-white shadow-md shadow-teal-600/25 ring-2 ring-teal-400/40"
                      : hasAppt
                      ? "bg-amber-100 text-amber-900 border border-amber-300 font-extrabold hover:bg-amber-200"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Selected Date Appointments Banner */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            {selectedDayAppointments.length > 0 ? (
              selectedDayAppointments.map((appt) => (
                <div
                  key={appt.id}
                  className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200 text-xs flex items-center justify-between shadow-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 font-bold text-amber-950">
                      <Clock className="w-3.5 h-3.5 text-amber-700" />
                      <span>{appt.reason}</span>
                    </div>
                    {appt.notes && (
                      <p className="text-[11px] text-amber-800/80 font-medium pl-5">{appt.notes}</p>
                    )}
                  </div>
                  <Badge variant="outline" className="bg-white/80 text-[10px] border-amber-300 text-amber-900 font-bold">
                    {appt.status}
                  </Badge>
                </div>
              ))
            ) : (
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-slate-500 text-xs flex items-center justify-between">
                <span>{language === "hi" ? `${selectedDay} ${monthNames[currentMonth]} को कोई अपॉइंटमेंट नहीं है` : `No appointments for ${monthNames[currentMonth].slice(0, 3)} ${selectedDay}`}</span>
                <span className="text-[10px] font-mono text-slate-400">{language === "hi" ? "उपलब्ध" : "Available"}</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            <Link href="/chatbot" className="w-full">
              <Button
                type="button"
                onClick={onScheduleClick}
                className="w-full h-10 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs gap-1.5 shadow-sm"
              >
                <CalendarIcon className="w-3.5 h-3.5" />
                {t("scheduleAppointment")}
              </Button>
            </Link>

            <Link href="/scheduling" className="w-full">
              <Button
                type="button"
                variant="outline"
                className="w-full h-10 border-slate-200 font-bold rounded-xl text-xs hover:bg-slate-50 text-slate-700 gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5 text-teal-600" />
                {t("addAppointmentNote")}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* ── Insurance Summary Card (Matching the Reference Image) ── */}
      <Card className="border border-slate-200/80 shadow-sm rounded-3xl overflow-hidden bg-white">
        <CardHeader className="py-3.5 px-6 bg-slate-50/50 border-b border-slate-100 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            {t("insuranceSummary")}
          </CardTitle>
          <Badge className="bg-emerald-100 text-emerald-800 text-[10px] font-bold border-0">
            {t("activeCover")}
          </Badge>
        </CardHeader>

        <CardContent className="p-5 space-y-3.5 text-xs">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider">
              {language === "hi" ? "बीमा प्रोफ़ाइल" : "INSURANCE PROFILE"}
            </span>
            <span className="font-extrabold text-slate-800">
              Ayushman Bharat PM-JAY / Medicare
            </span>
          </div>

          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider">
              {language === "hi" ? "सदस्य संख्या" : "MEMBER NUMBER"}
            </span>
            <span className="font-mono font-extrabold text-slate-800">
              57 478911 B
            </span>
          </div>

          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider">
              {language === "hi" ? "लाभार्थी नाम" : "RESPONSIBLE PARTY"}
            </span>
            <span className="font-bold text-slate-800">
              {patientName}
            </span>
          </div>

          {/* Attached policy file preview */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-rose-100 text-rose-700 rounded-lg">
                <Paperclip className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="font-bold text-slate-800 text-xs block">insurance.pdf</span>
                <span className="text-[10px] text-slate-400 block">
                  {language === "hi" ? "22 जनवरी 2026 को सत्यापित" : "Uploaded on 22 Jan 2026"}
                </span>
              </div>
            </div>
            <Badge variant="outline" className="text-[10px] bg-white text-slate-600">
              {language === "hi" ? "सत्यापित" : "Verified"}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
