"use client";

import React from "react";
import { Patient, Urgency } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Phone,
  Mail,
  Stethoscope,
  MapPin,
  Activity,
  AlertTriangle,
  FileText,
  Heart,
  ShieldAlert,
} from "lucide-react";
import Link from "next/link";
import { UrgencyBadge } from "@/components/urgency-badge";

interface Props {
  patient: Patient;
  onTabChange: (tab: string) => void;
}

export function OverviewTab({ patient, onTabChange }: Props) {
  const latestVital = patient.vitals && patient.vitals.length > 0 ? patient.vitals[0] : null;
  const latestEncounter = patient.encounters && patient.encounters.length > 0 ? patient.encounters[0] : null;
  const activeConditions = patient.conditions || [];
  const allergiesList = patient.allergies || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-300 w-full">

      {/* ━━ Patient Identity & Contact Card ━━ */}
      <Card className="border border-slate-200/80 shadow-sm rounded-2xl overflow-hidden bg-white">
        <CardHeader className="bg-slate-50/70 border-b border-slate-100 py-3 px-5">
          <CardTitle className="text-sm font-extrabold text-slate-900 flex items-center justify-between">
            <span>Patient Demographics</span>
            <span className="font-mono text-xs font-bold text-teal-700">{patient.mrn}</span>
          </CardTitle>
        </CardHeader>

        <CardContent className="p-5">
          {/* Top row: avatar + name + action */}
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white text-xl font-black shadow-md shadow-teal-500/20 shrink-0">
                {patient.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">{patient.name}</h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  {patient.age} yrs • {patient.gender} • Blood Group: <span className="font-bold text-rose-600">{patient.bloodGroup || "—"}</span>
                </p>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <UrgencyBadge urgency={(patient.riskLevel?.toUpperCase() as Urgency) || Urgency.LOW} size="sm" />
                  {patient.incomeCategory && (
                    <Badge variant="outline" className="text-[10px] bg-slate-50 text-slate-600">
                      {patient.incomeCategory}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <Link href={`/patients/${patient.id}/encounter`}>
              <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs gap-1.5 h-9 px-4 shrink-0">
                <Stethoscope className="w-3.5 h-3.5" />
                Start Encounter
              </Button>
            </Link>
          </div>

          {/* Contact + Emergency row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5 pt-4 border-t border-slate-100">
            {/* Contact Details */}
            <div className="space-y-2 text-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Contact Details</span>
              <div className="flex items-center gap-2 text-slate-700">
                <Phone className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <span className="font-semibold">{patient.phone || "Not registered"}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <Mail className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <span className="font-medium text-slate-600 truncate">{patient.email || `${patient.name.toLowerCase().replace(/\s+/g, '')}@email.com`}</span>
              </div>
              <div className="flex items-start gap-2 text-slate-700">
                <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                <span className="text-slate-600">
                  {patient.address || patient.village || "—"}, {patient.district}, {patient.state} {patient.pincode || ""}
                </span>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="p-3.5 bg-rose-50/60 rounded-xl border border-rose-100 space-y-1.5 text-xs">
              <div className="flex items-center gap-1.5 text-rose-700 font-bold">
                <Heart className="w-3.5 h-3.5" />
                <span>Emergency Contact</span>
              </div>
              <p className="font-bold text-slate-900">
                {patient.emergencyContactName || "Family Member"}
                {patient.emergencyContactRelation ? ` (${patient.emergencyContactRelation})` : ""}
              </p>
              <div className="flex items-center gap-1.5 text-slate-600">
                <Phone className="w-3 h-3 text-slate-400" />
                <span className="font-semibold">{patient.emergencyContactPhone || patient.phone || "—"}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ━━ Latest Vitals ━━ */}
      <Card className="border border-slate-200/80 shadow-sm rounded-2xl overflow-hidden bg-white">
        <CardHeader className="bg-slate-50/70 border-b border-slate-100 py-3 px-5 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-teal-600" />
            <CardTitle className="text-sm font-extrabold text-slate-900">Latest Vitals</CardTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={() => onTabChange("vitals")} className="text-xs font-bold text-teal-700 hover:bg-teal-50 h-8 px-2.5">
            Full History →
          </Button>
        </CardHeader>

        <CardContent className="p-5">
          {latestVital ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Blood Pressure</span>
                <span className="text-xl font-black text-slate-900 block mt-1">
                  {latestVital.bpSystolic ? `${latestVital.bpSystolic}/${latestVital.bpDiastolic}` : "—"}
                </span>
                <span className="text-[10px] text-slate-400">mmHg</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Heart Rate</span>
                <span className="text-xl font-black text-slate-900 block mt-1">{latestVital.heartRate || "—"}</span>
                <span className="text-[10px] text-slate-400">BPM</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">SpO₂</span>
                <span className={`text-xl font-black block mt-1 ${latestVital.spO2 && latestVital.spO2 < 95 ? "text-rose-600" : "text-emerald-700"}`}>
                  {latestVital.spO2 ? `${latestVital.spO2}%` : "—"}
                </span>
                <span className="text-[10px] text-slate-400">Oxygen</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Temperature</span>
                <span className="text-xl font-black text-slate-900 block mt-1">
                  {latestVital.temperature ? `${latestVital.temperature}°` : "—"}
                </span>
                <span className="text-[10px] text-slate-400">Celsius</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-slate-400 text-sm">
              No vitals recorded yet.
              <Button variant="outline" size="sm" onClick={() => onTabChange("vitals")} className="ml-3 text-xs font-bold rounded-lg border-teal-200 text-teal-700">
                Record Vitals
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ━━ Active Conditions & Allergies (side by side on sm+) ━━ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Conditions */}
        <Card className="border border-slate-200/80 shadow-sm rounded-2xl overflow-hidden bg-white">
          <CardHeader className="bg-slate-50/70 border-b border-slate-100 py-2.5 px-4 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              Conditions ({activeConditions.length})
            </CardTitle>
            <button type="button" onClick={() => onTabChange("conditions")} className="text-[11px] font-bold text-teal-700 hover:underline">
              View All
            </button>
          </CardHeader>
          <CardContent className="p-3 space-y-2">
            {activeConditions.length > 0 ? (
              activeConditions.slice(0, 3).map((c) => (
                <div key={c.id} className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-xs flex items-center justify-between gap-2">
                  <span className="font-bold text-slate-900 truncate">{c.name}</span>
                  {c.icdCode && (
                    <Badge variant="outline" className="text-[10px] font-mono bg-white shrink-0">{c.icdCode}</Badge>
                  )}
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 italic py-3 text-center">No conditions recorded.</p>
            )}
          </CardContent>
        </Card>

        {/* Allergies */}
        <Card className="border border-slate-200/80 shadow-sm rounded-2xl overflow-hidden bg-white">
          <CardHeader className="bg-slate-50/70 border-b border-slate-100 py-2.5 px-4 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
              Allergies ({allergiesList.length})
            </CardTitle>
            <button type="button" onClick={() => onTabChange("allergies")} className="text-[11px] font-bold text-teal-700 hover:underline">
              View All
            </button>
          </CardHeader>
          <CardContent className="p-3 space-y-2">
            {allergiesList.length > 0 ? (
              allergiesList.slice(0, 3).map((a) => (
                <div key={a.id} className="p-2.5 bg-rose-50/50 rounded-lg border border-rose-100 text-xs flex items-center justify-between gap-2">
                  <span className="font-bold text-rose-900 truncate">{a.allergen}</span>
                  <Badge className="bg-rose-600 text-white text-[9px] py-0 shrink-0">{a.severity}</Badge>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 italic py-3 text-center">No allergies recorded.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ━━ Recent Clinical Encounter ━━ */}
      <Card className="border border-slate-200/80 shadow-sm rounded-2xl overflow-hidden bg-white">
        <CardHeader className="bg-slate-50/70 border-b border-slate-100 py-3 px-5 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-teal-600" />
            <CardTitle className="text-sm font-extrabold text-slate-900">Latest Encounter</CardTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={() => onTabChange("encounters")} className="text-xs font-bold text-teal-700 hover:bg-teal-50 h-8 px-2.5">
            All ({patient.encounters?.length || 0}) →
          </Button>
        </CardHeader>

        <CardContent className="p-5">
          {latestEncounter ? (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-teal-600 shrink-0" />
                  <span className="font-bold text-slate-900 text-sm">
                    {latestEncounter.diagnosis || latestEncounter.chiefComplaint || "Clinical Consultation"}
                  </span>
                </div>
                {latestEncounter.urgency && (
                  <UrgencyBadge urgency={latestEncounter.urgency as Urgency} size="sm" />
                )}
              </div>

              <p className="text-xs text-slate-600">
                <span className="font-semibold">Attending:</span> {latestEncounter.doctor?.name || "Dr. Assigned"} •{" "}
                <span className="text-slate-400">{new Date(latestEncounter.createdAt).toLocaleDateString()}</span>
              </p>

              {latestEncounter.treatmentPlan && (
                <div className="text-xs bg-white p-3 rounded-lg border border-slate-200 text-slate-700">
                  <span className="font-bold text-teal-900 block mb-0.5">Treatment Plan:</span>
                  {latestEncounter.treatmentPlan}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-6 text-slate-400 text-sm">
              No consultations recorded yet.
              <Link href={`/patients/${patient.id}/encounter`} className="inline-block ml-3">
                <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg text-xs">
                  Start First Encounter
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
