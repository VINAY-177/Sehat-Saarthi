"use client";

import { Patient, Encounter, Urgency } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Stethoscope, Clock, Plus } from "lucide-react";
import Link from "next/link";
import { UrgencyBadge } from "@/components/urgency-badge";

interface Props {
  patient: Patient;
}

export function EncountersTab({ patient }: Props) {
  const encounters: Encounter[] = patient.encounters || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Clinical Consultations & Encounters</h3>
          <p className="text-xs text-slate-500">Longitudinal outpatient, emergency, and inpatient doctor notes</p>
        </div>
        <Link href={`/patients/${patient.id}/encounter`}>
          <Button className="bg-teal-600 hover:bg-teal-700 font-bold rounded-xl h-10 gap-1.5 shadow-sm">
            <Plus className="w-4 h-4" />
            New Clinical Encounter
          </Button>
        </Link>
      </div>

      {encounters.length === 0 ? (
        <Card className="border border-slate-200/80 rounded-2xl text-center py-12">
          <p className="text-sm text-slate-500 mb-3">No consultations conducted yet.</p>
          <Link href={`/patients/${patient.id}/encounter`}>
            <Button className="bg-teal-600 hover:bg-teal-700 font-bold rounded-xl">Start Consultation</Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {encounters.map((enc) => {
            let symptomsList: string[] = [];
            if (enc.symptoms) {
              try {
                symptomsList = typeof enc.symptoms === "string" ? JSON.parse(enc.symptoms) : enc.symptoms;
              } catch {
                symptomsList = [enc.symptoms];
              }
            }

            let riskFactorsList: { factor: string; contribution: number; detail: string }[] = [];
            if (enc.riskFactors) {
              try {
                riskFactorsList = typeof enc.riskFactors === "string" ? JSON.parse(enc.riskFactors) : enc.riskFactors;
              } catch {
                riskFactorsList = [];
              }
            }

            return (
              <Card key={enc.id} className="border border-slate-200/80 shadow-sm rounded-2xl overflow-hidden">
                <CardHeader className="bg-slate-50/70 py-4 px-6 border-b border-slate-100 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-teal-100/70 text-teal-700 rounded-xl">
                      <Stethoscope className="w-5 h-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-bold text-slate-900">
                        {enc.diagnosis || enc.chiefComplaint || "Clinical Consultation"}
                      </CardTitle>
                      <p className="text-xs text-slate-500">
                        {new Date(enc.createdAt).toLocaleString()} • Attending: {enc.doctor?.name || "Dr. Assigned"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {enc.riskScore && (
                      <Badge variant="outline" className="bg-white border-teal-200 text-teal-700 font-bold text-xs">
                        Risk: {enc.riskScore}/100
                      </Badge>
                    )}
                    {enc.urgency && <UrgencyBadge urgency={enc.urgency as Urgency} size="sm" />}
                  </div>
                </CardHeader>

                <CardContent className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column: Complaint & HPI */}
                    <div className="space-y-3">
                      <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                          Chief Complaint & Onset
                        </span>
                        <p className="text-sm font-semibold text-slate-800">
                          {enc.chiefComplaint || "Routine follow-up"}
                          {enc.onset ? ` (${enc.onset} onset, ${enc.severity || "moderate"} severity)` : ""}
                        </p>
                      </div>

                      {symptomsList.length > 0 && (
                        <div>
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                            Reported Symptoms
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {symptomsList.map((s, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs bg-slate-100 text-slate-700">
                                {s}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {enc.hpiNotes && (
                        <div>
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                            History of Present Illness (HPI)
                          </span>
                          <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                            {enc.hpiNotes}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Right Column: Assessment & Treatment */}
                    <div className="space-y-3">
                      <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                          Diagnosis & ICD-10 Codification
                        </span>
                        <p className="text-sm font-bold text-slate-900">
                          {enc.diagnosis || "Unspecified"}
                          {enc.diagnosisIcdCode ? ` [${enc.diagnosisIcdCode}]` : ""}
                        </p>
                      </div>

                      {enc.clinicalNotes && (
                        <div>
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                            SOAP Clinical Notes
                          </span>
                          <p className="text-xs font-mono text-slate-600 leading-relaxed bg-slate-50/70 p-3 rounded-xl border border-slate-100 whitespace-pre-wrap">
                            {enc.clinicalNotes}
                          </p>
                        </div>
                      )}

                      {enc.treatmentPlan && (
                        <div>
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                            Management & Treatment Plan
                          </span>
                          <p className="text-xs text-slate-700 leading-relaxed font-medium">
                            {enc.treatmentPlan}
                          </p>
                        </div>
                      )}

                      {enc.followUpDate && (
                        <div className="flex items-center gap-1.5 text-xs text-teal-700 font-bold">
                          <Clock className="w-3.5 h-3.5" />
                          Recommended Follow-up: {new Date(enc.followUpDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* AI Risk Stratification Factor Breakdown */}
                  {riskFactorsList.length > 0 && (
                    <div className="pt-3 border-t border-slate-100">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                        AI Clinical Risk Telemetry Snapshot
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                        {riskFactorsList.map((rf, idx) => (
                          <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                            <span className="font-bold text-slate-800 block">{rf.factor} (+{rf.contribution} pts)</span>
                            <span className="text-[11px] text-slate-500">{rf.detail}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
