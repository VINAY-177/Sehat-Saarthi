"use client";

import { useState } from "react";
import { Patient, Medication } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Pill } from "lucide-react";

interface Props {
  patient: Patient;
  onMedicationAdded?: () => void;
}

export function MedicationsTab({ patient, onMedicationAdded }: Props) {
  const [medications, setMedications] = useState<Medication[]>(patient.medications || []);
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("Once daily");
  const [startDate, setStartDate] = useState("");
  const [status, setStatus] = useState("ACTIVE");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      const res = await fetch(`http://localhost:5000/api/patients/${patient.id}/medications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, dosage, frequency, startDate, status, notes }),
      });
      if (res.ok) {
        const newMed = await res.json();
        setMedications([newMed, ...medications]);
        setShowAddModal(false);
        setName("");
        setDosage("");
        setNotes("");
        if (onMedicationAdded) onMedicationAdded();
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
          <h3 className="text-lg font-bold text-slate-900">Current & Historical Medications</h3>
          <p className="text-xs text-slate-500">Longitudinal pharmacy tracking and dosing schedules</p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-teal-600 hover:bg-teal-700 font-bold rounded-xl h-10 gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Add Medication
        </Button>
      </div>

      {showAddModal && (
        <Card className="border-2 border-teal-500/30 bg-teal-50/20 shadow-md rounded-2xl animate-in fade-in duration-200">
          <CardContent className="p-5">
            <h4 className="font-bold text-slate-900 text-sm mb-4">Add Medication to Patient Profile</h4>
            <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Drug Name *</label>
                <Input
                  placeholder="e.g. Atorvastatin"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-white rounded-xl"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Dosage *</label>
                <Input
                  placeholder="e.g. 40mg"
                  value={dosage}
                  onChange={(e) => setDosage(e.target.value)}
                  className="bg-white rounded-xl"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Frequency</label>
                <Input
                  placeholder="e.g. Once daily at night"
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  className="bg-white rounded-xl"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Start Date</label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-white rounded-xl"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-sm font-medium"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="DISCONTINUED">Discontinued</option>
                </select>
              </div>
              <div className="sm:col-span-2 md:col-span-2">
                <label className="text-xs font-bold text-slate-500 block mb-1">Instructions / Notes</label>
                <Input
                  placeholder="Take after food, avoid grapefruit..."
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

      {medications.length === 0 ? (
        <Card className="border border-slate-200/80 rounded-2xl text-center py-12">
          <p className="text-sm text-slate-500">No active or past medications recorded.</p>
        </Card>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-4 px-5">Medication</th>
                <th className="py-4 px-4">Dosage</th>
                <th className="py-4 px-4">Frequency</th>
                <th className="py-4 px-4">Started On</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-5">Prescriber / Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {medications.map((med) => (
                <tr key={med.id} className="hover:bg-slate-50/50">
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-2">
                      <Pill className="w-4 h-4 text-teal-600 shrink-0" />
                      <span className="font-bold text-slate-900">{med.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-semibold text-slate-800">{med.dosage}</td>
                  <td className="py-4 px-4 text-xs text-slate-600">{med.frequency}</td>
                  <td className="py-4 px-4 text-xs text-slate-500">{med.startDate || "—"}</td>
                  <td className="py-4 px-4">
                    <Badge
                      variant="outline"
                      className={`text-xs font-bold ${
                        med.status === "ACTIVE"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-slate-100 text-slate-600 border-slate-200"
                      }`}
                    >
                      {med.status}
                    </Badge>
                  </td>
                  <td className="py-4 px-5 text-xs text-slate-500">
                    {med.prescribingDoctor?.name ? `By ${med.prescribingDoctor.name}` : med.notes || "—"}
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
