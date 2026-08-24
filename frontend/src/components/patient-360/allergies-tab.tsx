"use client";

import { useState } from "react";
import { Patient, Allergy } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

interface Props {
  patient: Patient;
  onAllergyAdded?: () => void;
}

export function AllergiesTab({ patient, onAllergyAdded }: Props) {
  const [allergies, setAllergies] = useState<Allergy[]>(patient.allergies || []);
  const [showAddModal, setShowAddModal] = useState(false);
  const [allergen, setAllergen] = useState("");
  const [type, setType] = useState("DRUG");
  const [reaction, setReaction] = useState("");
  const [severity, setSeverity] = useState("MODERATE");
  const [saving, setSaving] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!allergen.trim()) return;
    try {
      const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${API}/api/patients/${patient.id}/allergies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ allergen, type, reaction, severity }),
      });
      if (res.ok) {
        const newAllergy = await res.json();
        setAllergies([newAllergy, ...allergies]);
        setShowAddModal(false);
        setAllergen("");
        setReaction("");
        if (onAllergyAdded) onAllergyAdded();
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
          <h3 className="text-lg font-bold text-slate-900">Allergies & Adverse Drug Reactions</h3>
          <p className="text-xs text-slate-500">Critical clinical alerts to prevent adverse pharmaceutical interactions</p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-rose-600 hover:bg-rose-700 font-bold rounded-xl h-10 gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Add Allergy Alert
        </Button>
      </div>

      {showAddModal && (
        <Card className="border-2 border-rose-500/30 bg-rose-50/20 shadow-md rounded-2xl animate-in fade-in duration-200">
          <CardContent className="p-5">
            <h4 className="font-bold text-slate-900 text-sm mb-4">Record New Allergy Alert</h4>
            <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Allergen (Substance/Drug) *</label>
                <Input
                  placeholder="e.g. Penicillin, Peanuts"
                  value={allergen}
                  onChange={(e) => setAllergen(e.target.value)}
                  className="bg-white rounded-xl"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Allergy Category</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-sm font-medium"
                >
                  <option value="DRUG">Drug / Medication</option>
                  <option value="FOOD">Food</option>
                  <option value="ENVIRONMENTAL">Environmental</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Severity Level</label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-sm font-medium"
                >
                  <option value="MILD">Mild</option>
                  <option value="MODERATE">Moderate</option>
                  <option value="SEVERE">Severe</option>
                  <option value="LIFE_THREATENING">Life Threatening (Anaphylaxis)</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Reaction Symptoms</label>
                <Input
                  placeholder="e.g. Urticaria, Bronchospasm"
                  value={reaction}
                  onChange={(e) => setReaction(e.target.value)}
                  className="bg-white rounded-xl"
                />
              </div>
              <div className="sm:col-span-2 md:col-span-4 flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setShowAddModal(false)} className="rounded-xl h-10">
                  Cancel
                </Button>
                <Button type="submit" disabled={saving} className="bg-rose-600 hover:bg-rose-700 font-bold rounded-xl h-10 px-6">
                  {saving ? "Saving..." : "Save Allergy"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {allergies.length === 0 ? (
        <Card className="border border-slate-200/80 rounded-2xl text-center py-12">
          <p className="text-sm text-slate-500">No known drug or environmental allergies recorded.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {allergies.map((allergy) => (
            <Card
              key={allergy.id}
              className={`border-2 rounded-2xl shadow-sm ${
                allergy.severity === "LIFE_THREATENING" || allergy.severity === "SEVERE"
                  ? "border-rose-200 bg-rose-50/30"
                  : "border-amber-200 bg-amber-50/20"
              }`}
            >
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {allergy.type} ALLERGY
                    </span>
                    <h4 className="text-lg font-extrabold text-slate-900">{allergy.allergen}</h4>
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-xs font-bold ${
                      allergy.severity === "LIFE_THREATENING" || allergy.severity === "SEVERE"
                        ? "bg-rose-100 text-rose-800 border-rose-300"
                        : "bg-amber-100 text-amber-800 border-amber-300"
                    }`}
                  >
                    {allergy.severity}
                  </Badge>
                </div>
                <div className="text-xs text-slate-600">
                  <span className="font-semibold text-slate-700">Observed Reaction: </span>
                  {allergy.reaction || "Not specified"}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
