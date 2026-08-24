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
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Responsive Clinical Workspace — stacks on mobile, 2-col on xl+ */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* ── LEFT COLUMN: Patient Identity & Contact Record (5 Cols) ── */}
        <div className="xl:col-span-5 space-y-6">
          
          {/* Identity & Demographics Card */}
          <Card className="border border-slate-200/80 shadow-sm rounded-3xl overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/70 border-b border-slate-100 py-4 px-6">
              <CardTitle className="text-sm font-extrabold text-slate-900 flex items-center justify-between">
                <span>Citizen Demographic Profile</span>
                <span className="font-mono text-xs font-bold text-teal-700">{patient.mrn}</span>
              </CardTitle>
            </CardHeader>

            <CardContent className="p-6 space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white text-2xl font-black shadow-md shadow-teal-500/20 shrink-0">
                  {patient.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900">{patient.name}</h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    {patient.age} yrs • {patient.gender} • Blood Group: <span className="font-bold text-rose-600">{patient.bloodGroup || "—"}</span>
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <UrgencyBadge urgency={(patient.riskLevel?.toUpperCase() as Urgency) || Urgency.LOW} size="sm" />
                    {patient.incomeCategory && (
                      <Badge variant="outline" className="text-[10px] bg-slate-50 text-slate-600">
                        {patient.incomeCategory}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-3 pt-3 border-t border-slate-100 text-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  CONTACT DETAILS
                </span>

                <div className="flex items-center gap-2.5 text-slate-700">
                  <Phone className="w-4 h-4 text-teal-600 shrink-0" />
                  <span className="font-semibold">{patient.phone || "No phone registered"}</span>
                </div>

                <div className="flex items-center gap-2.5 text-slate-700 truncate">
                  <Mail className="w-4 h-4 text-teal-600 shrink-0" />
                  <span className="font-medium text-slate-600 truncate">
                    {patient.email || `${patient.name.toLowerCase().replace(/\s+/g, '')}@gmail.com`}
                  </span>
                </div>

                <div className="flex items-start gap-2.5 text-slate-700 pt-1">
                  <MapPin className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">{patient.address || patient.village || "Address not recorded"}</p>
                    <p className="text-slate-400">{patient.district}, {patient.state} {patient.pincode ? `— ${patient.pincode}` : ""}</p>
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="p-4 bg-rose-50/50 rounded-2xl border border-rose-100 space-y-1.5 text-xs">
                <div className="flex items-center gap-2 text-rose-700 font-bold">
                  <Heart className="w-3.5 h-3.5" />
                  <span>EMERGENCY CONTACT</span>
                </div>
                <p className="font-bold text-slate-900">
                  {patient.emergencyContactName || "Nominated Family Member"}
                  {patient.emergencyContactRelation ? ` (${patient.emergencyContactRelation})` : ""}
                </p>
                <div className="flex items-center gap-2 text-slate-600">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-semibold">{patient.emergencyContactPhone || patient.phone || "—"}</span>
                </div>
              </div>

              {/* Start Encounter Action */}
              <div className="pt-2">
                <Link href={`/patients/${patient.id}/encounter`} className="block">
                  <Button className="w-full h-12 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold rounded-2xl text-xs gap-2 shadow-md">
                    <Stethoscope className="w-4 h-4" />
                    Start Clinical Encounter
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── RIGHT COLUMN: Clinical Summary, Vitals & Longitudinal History (7 Cols) ── */}
        <div className="xl:col-span-7 space-y-6">
          
          {/* Latest Vitals Telemetry Card */}
          <Card className="border border-slate-200/80 shadow-sm rounded-3xl overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/70 border-b border-slate-100 py-3.5 px-6 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-teal-600" />
                <CardTitle className="text-sm font-extrabold text-slate-900">
                  Latest Physiological Vitals
                </CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onTabChange("vitals")}
                className="text-xs font-bold text-teal-700 hover:bg-teal-50 h-8 px-2.5"
              >
                Full History →
              </Button>
            </CardHeader>

            <CardContent className="p-6">
              {latestVital ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Blood Pressure</span>
                    <span className="text-lg font-black text-slate-900 mt-0.5 block">
                      {latestVital.bpSystolic ? `${latestVital.bpSystolic}/${latestVital.bpDiastolic}` : "120/80"}
                    </span>
                    <span className="text-[10px] text-slate-400">mmHg</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Heart Rate</span>
                    <span className="text-lg font-black text-slate-900 mt-0.5 block">
                      {latestVital.heartRate || 72}
                    </span>
                    <span className="text-[10px] text-slate-400">BPM</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">SpO₂ Oxygen</span>
                    <span className={`text-lg font-black mt-0.5 block ${latestVital.spO2 && latestVital.spO2 < 95 ? "text-rose-600" : "text-emerald-700"}`}>
                      {latestVital.spO2 ? `${latestVital.spO2}%` : "98%"}
                    </span>
                    <span className="text-[10px] text-slate-400">Pulse Oximetry</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Temperature</span>
                    <span className="text-lg font-black text-slate-900 mt-0.5 block">
                      {latestVital.temperature ? `${latestVital.temperature}°C` : "37.0°C"}
                    </span>
                    <span className="text-[10px] text-slate-400">Body Temp</span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-slate-400 text-xs">
                  <p>No baseline vitals recorded yet.</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onTabChange("vitals")}
                    className="mt-2 text-xs font-bold rounded-xl border-teal-200 text-teal-700"
                  >
                    Record Baseline Vitals
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Active Diagnoses & Allergies Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Medical Conditions */}
            <Card className="border border-slate-200/80 shadow-sm rounded-3xl overflow-hidden bg-white">
              <CardHeader className="bg-slate-50/70 border-b border-slate-100 py-3 px-5 flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  Active Conditions ({activeConditions.length})
                </CardTitle>
                <button
                  type="button"
                  onClick={() => onTabChange("conditions")}
                  className="text-[11px] font-bold text-teal-700 hover:underline"
                >
                  Manage
                </button>
              </CardHeader>
              <CardContent className="p-4 space-y-2">
                {activeConditions.length > 0 ? (
                  activeConditions.slice(0, 3).map((c) => (
                    <div key={c.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{c.name}</span>
                        {c.icdCode && (
                          <Badge variant="outline" className="text-[10px] font-mono bg-white">
                            {c.icdCode}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic py-2 text-center">No chronic conditions recorded.</p>
                )}
              </CardContent>
            </Card>

            {/* Known Allergies */}
            <Card className="border border-slate-200/80 shadow-sm rounded-3xl overflow-hidden bg-white">
              <CardHeader className="bg-slate-50/70 border-b border-slate-100 py-3 px-5 flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                  Allergy Alerts ({allergiesList.length})
                </CardTitle>
                <button
                  type="button"
                  onClick={() => onTabChange("allergies")}
                  className="text-[11px] font-bold text-teal-700 hover:underline"
                >
                  Manage
                </button>
              </CardHeader>
              <CardContent className="p-4 space-y-2">
                {allergiesList.length > 0 ? (
                  allergiesList.slice(0, 3).map((a) => (
                    <div key={a.id} className="p-2.5 bg-rose-50/50 rounded-xl border border-rose-100 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-rose-900">{a.allergen}</span>
                        <Badge className="bg-rose-600 text-white text-[9px] py-0">
                          {a.severity}
                        </Badge>
                      </div>
                      {a.reaction && <p className="text-[11px] text-rose-700 mt-0.5">{a.reaction}</p>}
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic py-2 text-center">No drug/food allergies recorded.</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Clinical Encounters Timeline Card */}
          <Card className="border border-slate-200/80 shadow-sm rounded-3xl overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/70 border-b border-slate-100 py-3.5 px-6 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-teal-600" />
                <CardTitle className="text-sm font-extrabold text-slate-900">
                  Recent Clinical Encounters
                </CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onTabChange("encounters")}
                className="text-xs font-bold text-teal-700 hover:bg-teal-50 h-8 px-2.5"
              >
                View All ({patient.encounters?.length || 0}) →
              </Button>
            </CardHeader>

            <CardContent className="p-6">
              {latestEncounter ? (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Stethoscope className="w-4 h-4 text-teal-600" />
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
                    <div className="text-xs bg-white p-3 rounded-xl border border-slate-200 text-slate-700">
                      <span className="font-bold text-teal-900 block mb-0.5">Treatment Plan:</span>
                      {latestEncounter.treatmentPlan}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-6 text-slate-400 text-xs">
                  <p>No historical consultations recorded for this patient.</p>
                  <Link href={`/patients/${patient.id}/encounter`} className="inline-block mt-2">
                    <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs">
                      Conduct First Clinical Encounter
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

        </div>

      </div>
    </div>
  );
}
