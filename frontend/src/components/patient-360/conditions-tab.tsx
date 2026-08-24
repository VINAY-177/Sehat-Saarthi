"use client";

import { useState } from "react";
import { Patient, MedicalCondition } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

interface Props {
  patient: Patient;
  onConditionAdded?: () => void;
}

export function ConditionsTab({ patient, onConditionAdded }: Props) {
  const [conditions, setConditions] = useState<MedicalCondition[]>(patient.conditions || []);
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState("");
  const [icdCode, setIcdCode] = useState("");
  const [onsetDate, setOnsetDate] = useState("");
  const [status, setStatus] = useState("ACTIVE");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${API}/api/patients/${patient.id}/conditions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, icdCode, onsetDate, status, notes }),
      });
      if (res.ok) {
        const newCondition = await res.json();
        setConditions([newCondition, ...conditions]);
        setShowAddModal(false);
        setName("");
        setIcdCode("");
        setOnsetDate("");
        setNotes("");
        if (onConditionAdded) onConditionAdded();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Medical Conditions & Diagnoses</h3>
          <p className="text-xs text-slate-500">Documented chronic and acute conditions with ICD-10 codification</p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-teal-600 hover:bg-teal-700 font-bold rounded-xl h-10 gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Add Condition
        </Button>
      </div>

      {showAddModal && (
        <Card className="border-2 border-teal-500/30 bg-teal-50/20 shadow-md rounded-2xl animate-in fade-in duration-200">
          <CardContent className="p-5">
            <h4 className="font-bold text-slate-900 text-sm mb-4">Record New Medical Diagnosis</h4>
            <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Condition / Diagnosis *</label>
                <Input
                  placeholder="e.g. Type 2 Diabetes"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-white rounded-xl"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">ICD-10 Code</label>
                <Input
                  placeholder="e.g. E11.9"
                  value={icdCode}
                  onChange={(e) => setIcdCode(e.target.value)}
                  className="bg-white rounded-xl"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Onset Date</label>
                <Input
                  type="date"
                  value={onsetDate}
                  onChange={(e) => setOnsetDate(e.target.value)}
                  className="bg-white rounded-xl"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Clinical Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-sm font-medium"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="CHRONIC">Chronic</option>
                  <option value="RESOLVED">Resolved</option>
                </select>
              </div>
              <div className="sm:col-span-2 md:col-span-3">
                <label className="text-xs font-bold text-slate-500 block mb-1">Clinical Notes</label>
                <Input
                  placeholder="Additional context, severity, treatment regime..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="bg-white rounded-xl"
                />
              </div>
              <div className="flex items-end gap-2">
                <Button type="submit" disabled={saving} className="bg-teal-600 hover:bg-teal-700 font-bold rounded-xl h-10 flex-1">
                  {saving ? "Saving..." : "Save"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowAddModal(false)} className="rounded-xl h-10">
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {conditions.length === 0 ? (
        <Card className="border border-slate-200/80 rounded-2xl text-center py-12">
          <p className="text-sm text-slate-500">No medical conditions recorded for this patient.</p>
        </Card>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-4 px-5">Diagnosis</th>
                <th className="py-4 px-4">ICD-10</th>
                <th className="py-4 px-4">Onset Date</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-5">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {conditions.map((condition) => (
                <tr key={condition.id} className="hover:bg-slate-50/50">
                  <td className="py-4 px-5 font-bold text-slate-900">{condition.name}</td>
                  <td className="py-4 px-4 font-mono text-xs text-slate-500 font-semibold">{condition.icdCode || "—"}</td>
                  <td className="py-4 px-4 text-xs text-slate-600">{condition.onsetDate || "—"}</td>
                  <td className="py-4 px-4">
                    <Badge
                      variant="outline"
                      className={`text-xs font-bold ${
                        condition.status === "ACTIVE"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : condition.status === "CHRONIC"
                          ? "bg-purple-50 text-purple-700 border-purple-200"
                          : "bg-emerald-50 text-emerald-700 border-emerald-200"
                      }`}
                    >
                      {condition.status}
                    </Badge>
                  </td>
                  <td className="py-4 px-5 text-xs text-slate-500">{condition.notes || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
