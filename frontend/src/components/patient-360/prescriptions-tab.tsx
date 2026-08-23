"use client";

import { Patient, Prescription } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

interface Props {
  patient: Patient;
}

export function PrescriptionsTab({ patient }: Props) {
  const prescriptions: Prescription[] = patient.prescriptions || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Prescription Orders & Pharmacy History</h3>
          <p className="text-xs text-slate-500">Official digital Rx slips with dosage regimens and dispensing guidance</p>
        </div>
      </div>

      {prescriptions.length === 0 ? (
        <Card className="border border-slate-200/80 rounded-2xl text-center py-12">
          <p className="text-sm text-slate-500">No prescriptions issued for this patient yet.</p>
        </Card>
      ) : (
        <div className="space-y-6">
          {prescriptions.map((rx) => (
            <Card key={rx.id} className="border-2 border-slate-200/90 shadow-sm rounded-2xl overflow-hidden bg-white">
              {/* Rx Header */}
              <div className="bg-slate-50/90 p-5 border-b border-slate-200/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-serif font-black text-teal-800 tracking-wider">℞</span>
                    <span className="font-bold text-slate-900 text-base">
                      Prescription Slip #{rx.id.slice(0, 8).toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Date: {rx.date} • Prescribed by: {rx.doctor?.name || "Attending Physician"}
                  </p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.print()}
                  className="rounded-xl border-slate-200 text-slate-700 hover:bg-slate-100 font-bold gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  Print Rx Slip
                </Button>
              </div>

              <CardContent className="p-6 space-y-4">
                {/* Medication Items Table */}
                <div className="rounded-xl border border-slate-200/80 overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        <th className="py-3 px-4">#</th>
                        <th className="py-3 px-4">Medication & Strength</th>
                        <th className="py-3 px-4">Frequency</th>
                        <th className="py-3 px-4">Duration</th>
                        <th className="py-3 px-4">Instructions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {rx.items.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-slate-50/50">
                          <td className="py-3 px-4 font-bold text-slate-400 text-xs">{idx + 1}</td>
                          <td className="py-3 px-4">
                            <span className="font-bold text-slate-900">{item.medicationName}</span>
                            <span className="text-xs text-slate-500 block">{item.dosage}</span>
                          </td>
                          <td className="py-3 px-4 font-semibold text-teal-700 text-xs">{item.frequency}</td>
                          <td className="py-3 px-4 text-xs text-slate-600">{item.duration}</td>
                          <td className="py-3 px-4 text-xs text-slate-500 italic">{item.instructions || "As directed"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {rx.notes && (
                  <div className="text-xs text-slate-600 bg-teal-50/40 p-3 rounded-xl border border-teal-100/60">
                    <span className="font-bold text-teal-900">Doctor&apos;s Advice: </span>
                    {rx.notes}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
