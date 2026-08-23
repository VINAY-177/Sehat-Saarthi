"use client";

import { Patient, Insurance } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck } from "lucide-react";

interface Props {
  patient: Patient;
}

export function InsuranceTab({ patient }: Props) {
  const insuranceList: Insurance[] = patient.insurance || [];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-slate-900">Health Insurance & Government Scheme Benefits</h3>
        <p className="text-xs text-slate-500">Empanelment status for Ayushman Bharat PM-JAY, CGHS, and private coverage</p>
      </div>

      {insuranceList.length === 0 ? (
        <Card className="border border-slate-200/80 rounded-2xl text-center py-12">
          <p className="text-sm text-slate-500">No active insurance or scheme policies linked to this citizen.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {insuranceList.map((ins) => (
            <Card key={ins.id} className="border-2 border-teal-500/20 bg-gradient-to-br from-white to-teal-50/20 shadow-sm rounded-2xl overflow-hidden">
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-teal-100 text-teal-700 rounded-xl">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-lg">{ins.provider}</h4>
                      <p className="text-xs text-slate-400 font-mono">Policy #{ins.policyNumber || "Auto-Linked"}</p>
                    </div>
                  </div>
                  <Badge className="bg-emerald-600 text-white font-bold text-xs uppercase">
                    Active Coverage
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs pt-3 border-t border-slate-100">
                  <div>
                    <span className="text-slate-400 font-bold block uppercase tracking-wider text-[10px]">Coverage Type</span>
                    <span className="font-semibold text-slate-800">{ins.coverageType || "Family Floater"}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold block uppercase tracking-wider text-[10px]">Validity</span>
                    <span className="font-semibold text-slate-800">{ins.validFrom || "2024"} — {ins.validTo || "2026"}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold block uppercase tracking-wider text-[10px]">PM-JAY Empanelment</span>
                    <span className="font-semibold text-teal-700">{ins.pmjayStatus || "Eligible"}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold block uppercase tracking-wider text-[10px]">CGHS Status</span>
                    <span className="font-semibold text-slate-700">{ins.cghsStatus || "N/A"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
