"use client";

import { Patient, LabReport } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FlaskConical } from "lucide-react";

interface Props {
  patient: Patient;
}

export function LabReportsTab({ patient }: Props) {
  const reports: LabReport[] = patient.labReports || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Diagnostic Laboratory Results</h3>
          <p className="text-xs text-slate-500">Pathology, biochemistry, and hematology investigations</p>
        </div>
      </div>

      {reports.length === 0 ? (
        <Card className="border border-slate-200/80 rounded-2xl text-center py-12">
          <p className="text-sm text-slate-500">No laboratory investigations ordered for this patient.</p>
        </Card>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-4 px-5">Investigation / Test</th>
                <th className="py-4 px-4">Category</th>
                <th className="py-4 px-4">Observed Value</th>
                <th className="py-4 px-4">Biological Reference</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-5">Report Date & Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-slate-50/50">
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                        <FlaskConical className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-slate-900">{report.testName}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <Badge variant="outline" className="text-xs font-semibold bg-slate-50 text-slate-600 border-slate-200">
                      {report.category}
                    </Badge>
                  </td>
                  <td className="py-4 px-4 font-bold text-slate-900 text-base">
                    {report.result ? `${report.result} ${report.unit || ""}` : "Pending Result"}
                  </td>
                  <td className="py-4 px-4 text-xs font-mono text-slate-500">{report.referenceRange || "—"}</td>
                  <td className="py-4 px-4">
                    <Badge
                      variant="outline"
                      className={`text-xs font-bold ${
                        report.status === "COMPLETED"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}
                    >
                      {report.status}
                    </Badge>
                  </td>
                  <td className="py-4 px-5 text-xs text-slate-500">
                    <span className="font-medium text-slate-700 block">{report.reportDate || "Ordered"}</span>
                    {report.notes && <span className="text-[11px] text-slate-400 italic">{report.notes}</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
