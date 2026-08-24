"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Role, Appointment } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar as CalendarIcon, ChevronLeft, ChevronRight, 
  Clock, Edit3
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
    const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    fetch(`${API}/api/appointments`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data: Appointment[]) => {
        if (Array.isArray(data) && data.length > 0) {
          setAppointments(data);
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

  // Selected Day Appointments
  const selectedDayAppointments = useMemo(() => {
    return appointmentDays.get(selectedDay) || [];
  }, [appointmentDays, selectedDay]);

  const isToday = (day: number) => {
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === currentMonth &&
      today.getFullYear() === currentYear
    );
  };

  return (
    <div className="space-y-6">
      {/* ── Main Calendar Card ── */}
      <Card className="border border-slate-200/80 shadow-sm rounded-3xl overflow-hidden bg-white">
        {/* Month / Year Header */}
        <CardHeader className="py-4 px-6 bg-slate-50/50 border-b border-slate-100 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-teal-600" />
            <CardTitle className="text-sm font-extrabold tracking-wider text-slate-900">
              {monthNames[currentMonth]} {currentYear}
            </CardTitle>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevMonth}
              className="h-8 w-8 rounded-full hover:bg-slate-200 text-slate-600"
              aria-label="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNextMonth}
              className="h-8 w-8 rounded-full hover:bg-slate-200 text-slate-600"
              aria-label="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-5 space-y-5">
          {/* Day Names (SUN, MON, ...) */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {dayNames.map((d, i) => (
              <span
                key={i}
                className="text-[11px] font-bold text-slate-400 uppercase py-1"
              >
                {d}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1.5 text-center">
            {calendarCells.map((day, index) => {
              if (day === null) {
                return <div key={`empty-${index}`} className="h-9 w-full" />;
              }

              const hasAppt = appointmentDays.has(day);
              const appts = appointmentDays.get(day) || [];
              const isSelected = selectedDay === day;
              const today = isToday(day);

              return (
                <button
                  key={`day-${day}`}
                  type="button"
                  onClick={() => setSelectedDay(day)}
                  className={`
                    relative h-9 w-full rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center
                    ${
                      isSelected
                        ? "bg-teal-600 text-white shadow-md shadow-teal-600/30 scale-105 z-10"
                        : today
                        ? "bg-teal-50 text-teal-700 border border-teal-200"
                        : "hover:bg-slate-100 text-slate-700"
                    }
                  `}
                >
                  <span>{day}</span>

                  {/* Indicator Dots for Appointments */}
                  {hasAppt && (
                    <div className="flex gap-0.5 mt-0.5">
                      {appts.slice(0, 3).map((_, dotIdx) => (
                        <span
                          key={dotIdx}
                          className={`w-1 h-1 rounded-full ${
                            isSelected ? "bg-white" : "bg-teal-500"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Selected Date Summary Section */}
          <div className="pt-3 border-t border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {language === "hi" ? "चयनित तिथि की नियुक्तियां" : "Appointments on"} {selectedDay} {monthNames[currentMonth]}
              </span>
              <span className="text-xs font-extrabold text-teal-700">
                {selectedDayAppointments.length} {language === "hi" ? "दर्ज" : "Booked"}
              </span>
            </div>

            {selectedDayAppointments.length > 0 ? (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {selectedDayAppointments.map((appt) => {
                  const d = new Date(appt.dateTime);
                  const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                  return (
                    <div
                      key={appt.id}
                      className="p-3 rounded-2xl bg-teal-50/60 border border-teal-100 flex items-start justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                          <span className="font-extrabold text-teal-900">{timeStr}</span>
                          <Badge variant="outline" className="text-[10px] bg-white border-teal-200 text-teal-700 font-bold px-1.5 py-0">
                            {appt.visitType}
                          </Badge>
                        </div>
                        <p className="font-bold text-slate-900 truncate">
                          {appt.doctor?.name || "Consulting Specialist"}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate">
                          {appt.reason || appt.doctor?.specialty || "Clinical OPD Consultation"}
                        </p>
                      </div>

                      <Badge 
                        className={`shrink-0 text-[10px] font-bold ${
                          appt.status === "CONFIRMED" 
                            ? "bg-emerald-100 text-emerald-800 border-0" 
                            : "bg-amber-100 text-amber-800 border-0"
                        }`}
                      >
                        {appt.status}
                      </Badge>
                    </div>
                  );
                })}
              </div>
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
    </div>
  );
}
