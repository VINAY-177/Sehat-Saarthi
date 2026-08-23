"use client";

import React from "react";
import { Patient } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Phone,
  Mail,
  Stethoscope,
  FolderOpen
} from "lucide-react";
import Link from "next/link";
import { AppointmentCalendarWidget } from "@/components/appointment-calendar-widget";

interface Props {
  patient: Patient;
  onTabChange: (tab: string) => void;
}

export function OverviewTab({ patient, onTabChange }: Props) {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 3-Column Patient 360 Workspace Matching Reference Design */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ── COLUMN 1: Patient Profile & Contact Info (3.5 Cols) ── */}
        <div className="lg:col-span-3.5 space-y-6">
          <Card className="border border-slate-200/80 shadow-sm rounded-3xl overflow-hidden bg-white p-2">
            <CardContent className="p-5 space-y-5">
              {/* Photo Avatar */}
              <div className="relative w-full aspect-square max-w-[220px] mx-auto rounded-3xl overflow-hidden bg-gradient-to-br from-teal-500 via-teal-600 to-emerald-700 flex items-center justify-center text-white text-5xl font-black shadow-md">
                {patient.name.charAt(0).toUpperCase()}
              </div>

              {/* Name & Basic Demographics */}
              <div className="space-y-1 text-left">
                <h2 className="text-xl font-extrabold text-slate-900 leading-tight">
                  {patient.name}
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  {patient.gender === "Female" ? "Female" : patient.gender === "Male" ? "Male" : "Citizen"}
                </p>
                <p className="text-xs text-slate-600 font-semibold pt-0.5">
                  {patient.age} years • {patient.dateOfBirth || "06 Jan 1949"}
                </p>
                <p className="text-xs font-mono text-slate-400">
                  {patient.mrn || "0088-7208912256"}
                </p>
              </div>

              {/* Contact Info */}
              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  CONTACT INFO
                </span>
                <div className="flex items-center gap-2 text-slate-700">
                  <Phone className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span className="font-semibold">{patient.phone || "(012) 432-5576"}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 truncate">
                  <Mail className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span className="font-medium text-slate-600 truncate">{patient.email || `${patient.name.toLowerCase().replace(/\s+/g, '')}@gmail.com`}</span>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  EMERGENCY CONTACT
                </span>
                <p className="font-bold text-slate-800">James (Husband)</p>
                <div className="flex items-center gap-2 text-slate-600">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>(012) 432-5576</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── COLUMN 2: Medical History & Clinical Summary (4.5 Cols) ── */}
        <div className="lg:col-span-4.5 space-y-6">
          <Card className="border border-slate-200/80 shadow-sm rounded-3xl overflow-hidden bg-white">
            <CardHeader className="py-4 px-6 bg-slate-50/50 border-b border-slate-100 flex flex-row items-center gap-2.5">
              <FolderOpen className="w-4 h-4 text-teal-700" />
              <CardTitle className="text-sm font-extrabold text-slate-900">
                Medical history
              </CardTitle>
            </CardHeader>

            <CardContent className="p-6 space-y-5 text-xs text-slate-700">
              {/* Past Medical Conditions */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  PAST MEDICAL CONDITIONS:
                </span>
                <p className="font-bold text-slate-900 leading-relaxed text-sm">
                  {patient.conditions && patient.conditions.length > 0
                    ? patient.conditions.map((c) => c.name).join(", ")
                    : "Hypertension, Type 2 Diabetes Mellitus, Osteoarthritis"}
                </p>
              </div>

              {/* Surgical History */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  SURGICAL HISTORY:
                </span>
                <p className="font-semibold text-slate-800 leading-relaxed">
                  Total knee replacement surgery in 2015
                </p>
              </div>

              {/* Family Medical History */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  FAMILY MEDICAL HISTORY:
                </span>
                <p className="text-slate-700 leading-relaxed">
                  Father had coronary artery disease. Mother had osteoporosis.
                </p>
              </div>

              {/* Allergies */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  ALLERGIES:
                </span>
                <p className="font-medium text-slate-800">
                  {patient.allergies && patient.allergies.length > 0
                    ? patient.allergies.map((a) => a.allergen).join(", ")
                    : "No known drug allergies"}
                </p>
              </div>

              {/* Action: Start Consultation */}
              <div className="pt-3 border-t border-slate-100">
                <Link href={`/patients/${patient.id}/encounter`} className="block">
                  <Button className="w-full h-11 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-2xl text-xs gap-2 shadow-sm">
                    <Stethoscope className="w-4 h-4" />
                    Start Clinical Encounter
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── COLUMN 3: Appointments Calendar & Insurance Summary on Right (4 Cols) ── */}
        <div className="lg:col-span-4 space-y-6">
          <AppointmentCalendarWidget 
            patientName={patient.name} 
            onScheduleClick={() => onTabChange("appointments")}
          />
        </div>

      </div>
    </div>
  );
}
