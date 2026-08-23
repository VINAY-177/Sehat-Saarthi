"use client";

import { Patient, Urgency } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Activity,
  Calendar,
  Pill,
  FileText,
  Clock,
  ArrowUpRight,
  ShieldAlert,
  Stethoscope,
} from "lucide-react";
import Link from "next/link";
import { UrgencyBadge } from "@/components/urgency-badge";

interface Props {
  patient: Patient;
  onTabChange: (tab: string) => void;
}

export function OverviewTab({ patient, onTabChange }: Props) {
  const latestVital = patient.vitals && patient.vitals.length > 0 ? patient.vitals[0] : null;
  const activeConditions = (patient.conditions || []).filter((c) => c.status !== "RESOLVED");
  const activeMedications = (patient.medications || []).filter((m) => m.status === "ACTIVE");
  const latestEncounter = patient.encounters && patient.encounters.length > 0 ? patient.encounters[0] : null;
  const upcomingAppointments = (patient.appointments || []).filter(
    (a) => a.status === "CONFIRMED" || a.status === "REQUESTED" || a.status === "CHECKED_IN"
  );

  return (
    <div className="space-y-6">
      {/* Risk Alert Banner (If HIGH or EMERGENCY) */}
      {(patient.riskLevel === "EMERGENCY" || patient.riskLevel === "HIGH") && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-rose-500 text-white rounded-xl shadow-sm">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h4 className="font-bold text-rose-950 text-base">
                Clinical Priority Alert: {patient.riskLevel} Risk Patient
              </h4>
              <p className="text-rose-700 text-xs font-medium mt-0.5">
                Elevated risk score detected during recent clinical triage. Frequent monitoring recommended.
              </p>
            </div>
          </div>
          <Link href={`/patients/${patient.id}/encounter`}>
            <Button size="sm" className="bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-sm">
              <Stethoscope className="w-4 h-4 mr-1.5" />
              Start Clinical Consultation
            </Button>
          </Link>
        </div>
      )}

      {/* Grid Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Latest Vitals Snapshot */}
        <Card className="border border-slate-200/80 shadow-sm rounded-2xl">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Latest Vitals</span>
              <Activity className="w-4 h-4 text-teal-600" />
            </div>
            {latestVital ? (
              <div className="space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-slate-500 font-medium">Blood Pressure</span>
                  <span className="text-sm font-bold text-slate-900">
                    {latestVital.bpSystolic}/{latestVital.bpDiastolic} <span className="text-[10px] text-slate-400 font-normal">mmHg</span>
                  </span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-slate-500 font-medium">Heart Rate</span>
                  <span className="text-sm font-bold text-slate-900">
                    {latestVital.heartRate || "—"} <span className="text-[10px] text-slate-400 font-normal">bpm</span>
                  </span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-slate-500 font-medium">SpO₂ Oxygen</span>
                  <span className={`text-sm font-bold ${latestVital.spO2 && latestVital.spO2 < 94 ? "text-rose-600" : "text-slate-900"}`}>
                    {latestVital.spO2 ? `${latestVital.spO2}%` : "—"}
                  </span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-slate-500 font-medium">Temperature</span>
                  <span className="text-sm font-bold text-slate-900">
                    {latestVital.temperature ? `${latestVital.temperature}°C` : "—"}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic py-2">No vitals recorded yet</p>
            )}
            <button
              onClick={() => onTabChange("vitals")}
              className="mt-3 text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1"
            >
              View vitals history <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </CardContent>
        </Card>

        {/* Active Diagnoses */}
        <Card className="border border-slate-200/80 shadow-sm rounded-2xl">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Diagnoses</span>
              <FileText className="w-4 h-4 text-blue-600" />
            </div>
            <div className="space-y-1.5">
              {activeConditions.length > 0 ? (
                activeConditions.slice(0, 3).map((c) => (
                  <div key={c.id} className="flex items-center justify-between text-xs py-1 border-b border-slate-100 last:border-0">
                    <span className="font-semibold text-slate-800 truncate max-w-[130px]">{c.name}</span>
                    {c.icdCode && <span className="font-mono text-[10px] text-slate-400">{c.icdCode}</span>}
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic py-2">No active conditions</p>
              )}
            </div>
            <button
              onClick={() => onTabChange("conditions")}
              className="mt-3 text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              View all ({patient.conditions?.length || 0}) <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </CardContent>
        </Card>

        {/* Current Medications */}
        <Card className="border border-slate-200/80 shadow-sm rounded-2xl">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Medications</span>
              <Pill className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="space-y-1.5">
              {activeMedications.length > 0 ? (
                activeMedications.slice(0, 3).map((m) => (
                  <div key={m.id} className="flex items-center justify-between text-xs py-1 border-b border-slate-100 last:border-0">
                    <span className="font-semibold text-slate-800 truncate max-w-[120px]">{m.name}</span>
                    <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                      {m.dosage}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic py-2">No active prescriptions</p>
              )}
            </div>
            <button
              onClick={() => onTabChange("medications")}
              className="mt-3 text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              View medications ({patient.medications?.length || 0}) <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </CardContent>
        </Card>

        {/* Next Appointments */}
        <Card className="border border-slate-200/80 shadow-sm rounded-2xl">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Appointments</span>
              <Calendar className="w-4 h-4 text-purple-600" />
            </div>
            <div className="space-y-2">
              {upcomingAppointments.length > 0 ? (
                upcomingAppointments.slice(0, 2).map((a) => (
                  <div key={a.id} className="p-2 rounded-xl bg-purple-50/50 border border-purple-100 text-xs space-y-1">
                    <div className="flex justify-between items-center font-semibold text-purple-950">
                      <span>{new Date(a.dateTime).toLocaleDateString()}</span>
                      <Badge variant="outline" className="text-[10px] bg-white border-purple-200 text-purple-700">
                        {a.status}
                      </Badge>
                    </div>
                    <p className="text-slate-500 text-[11px] truncate">{a.reason || "General Consultation"}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic py-2">No upcoming visits scheduled</p>
              )}
            </div>
            <button
              onClick={() => onTabChange("appointments")}
              className="mt-3 text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1"
            >
              View schedule <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Encounter Summary */}
      <Card className="border border-slate-200/80 shadow-sm rounded-2xl">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Latest Clinical Consultation</h3>
              <p className="text-xs text-slate-500">
                {latestEncounter
                  ? `Recorded on ${new Date(latestEncounter.createdAt).toLocaleDateString()} by ${latestEncounter.doctor?.name || "Attending Physician"}`
                  : "No prior encounters recorded for this patient."}
              </p>
            </div>
            {latestEncounter && (
              <div className="flex items-center gap-2">
                {latestEncounter.riskScore && (
                  <Badge variant="outline" className="font-bold border-teal-200 text-teal-700 bg-teal-50">
                    AI Risk Score: {latestEncounter.riskScore}/100
                  </Badge>
                )}
                {latestEncounter.urgency && (
                  <UrgencyBadge urgency={latestEncounter.urgency as Urgency} size="sm" />
                )}
              </div>
            )}
          </div>

          {latestEncounter ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-5">
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Chief Complaint</span>
                <p className="text-sm font-semibold text-slate-800">{latestEncounter.chiefComplaint || "General checkup"}</p>
                {latestEncounter.hpiNotes && (
                  <p className="text-xs text-slate-500 leading-relaxed pt-1">{latestEncounter.hpiNotes}</p>
                )}
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Assessment / Diagnosis</span>
                <p className="text-sm font-bold text-slate-900">{latestEncounter.diagnosis || "Under Evaluation"}</p>
                {latestEncounter.clinicalNotes && (
                  <p className="text-xs text-slate-500 leading-relaxed pt-1 font-mono bg-slate-50 p-2 rounded-lg border border-slate-100">
                    {latestEncounter.clinicalNotes}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Treatment Plan</span>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {latestEncounter.treatmentPlan || "Prescribed symptomatic management."}
                </p>
                {latestEncounter.followUpDate && (
                  <div className="flex items-center gap-1.5 text-xs text-teal-700 font-bold mt-2">
                    <Clock className="w-3.5 h-3.5" />
                    Follow-up: {new Date(latestEncounter.followUpDate).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="py-8 text-center">
              <p className="text-sm text-slate-500 mb-3">No consultations have been conducted yet.</p>
              <Link href={`/patients/${patient.id}/encounter`}>
                <Button className="bg-teal-600 hover:bg-teal-700 font-bold rounded-xl">
                  Conduct First Consultation
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
