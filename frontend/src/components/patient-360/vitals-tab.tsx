"use client";

import { useState } from "react";
import { Patient, Vital } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Activity } from "lucide-react";

interface Props {
  patient: Patient;
  onVitalRecorded?: () => void;
}

export function VitalsTab({ patient, onVitalRecorded }: Props) {
  const [vitals, setVitals] = useState<Vital[]>(patient.vitals || []);
  const [showAddModal, setShowAddModal] = useState(false);
  const [temperature, setTemperature] = useState("");
  const [bpSystolic, setBpSystolic] = useState("");
  const [bpDiastolic, setBpDiastolic] = useState("");
  const [heartRate, setHeartRate] = useState("");
  const [respiratoryRate, setRespiratoryRate] = useState("");
  const [spO2, setSpO2] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [saving, setSaving] = useState(false);

  const handleRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload: Record<string, number> = {};
      if (temperature) payload.temperature = parseFloat(temperature);
      if (bpSystolic) payload.bpSystolic = parseInt(bpSystolic);
      if (bpDiastolic) payload.bpDiastolic = parseInt(bpDiastolic);
      if (heartRate) payload.heartRate = parseInt(heartRate);
      if (respiratoryRate) payload.respiratoryRate = parseInt(respiratoryRate);
      if (spO2) payload.spO2 = parseFloat(spO2);
      if (height) payload.height = parseFloat(height);
      if (weight) payload.weight = parseFloat(weight);

      const res = await fetch(`http://localhost:5000/api/patients/${patient.id}/vitals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const newVital = await res.json();
        setVitals([newVital, ...vitals]);
        setShowAddModal(false);
        setTemperature("");
        setBpSystolic("");
        setBpDiastolic("");
        setHeartRate("");
        setRespiratoryRate("");
        setSpO2("");
        setHeight("");
        setWeight("");
        if (onVitalRecorded) onVitalRecorded();
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
          <h3 className="text-lg font-bold text-slate-900">Vitals & Physiological Telemetry</h3>
          <p className="text-xs text-slate-500">Historical timeline of vital signs and biometric assessments</p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-teal-600 hover:bg-teal-700 font-bold rounded-xl h-10 gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Record Vitals
        </Button>
      </div>

      {showAddModal && (
        <Card className="border-2 border-teal-500/30 bg-teal-50/20 shadow-md rounded-2xl animate-in fade-in duration-200">
          <CardContent className="p-5">
            <h4 className="font-bold text-slate-900 text-sm mb-4">Record New Vital Measurements</h4>
            <form onSubmit={handleRecord} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">BP Systolic (mmHg)</label>
                <Input
                  type="number"
                  placeholder="120"
                  value={bpSystolic}
                  onChange={(e) => setBpSystolic(e.target.value)}
                  className="bg-white rounded-xl"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">BP Diastolic (mmHg)</label>
                <Input
                  type="number"
                  placeholder="80"
                  value={bpDiastolic}
                  onChange={(e) => setBpDiastolic(e.target.value)}
                  className="bg-white rounded-xl"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Heart Rate (BPM)</label>
                <Input
                  type="number"
                  placeholder="72"
                  value={heartRate}
                  onChange={(e) => setHeartRate(e.target.value)}
                  className="bg-white rounded-xl"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">SpO₂ Oxygen (%)</label>
                <Input
                  type="number"
                  placeholder="98"
                  value={spO2}
                  onChange={(e) => setSpO2(e.target.value)}
                  className="bg-white rounded-xl"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Temperature (°C)</label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="37.0"
                  value={temperature}
                  onChange={(e) => setTemperature(e.target.value)}
                  className="bg-white rounded-xl"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Resp Rate (breaths/min)</label>
                <Input
                  type="number"
                  placeholder="16"
                  value={respiratoryRate}
                  onChange={(e) => setRespiratoryRate(e.target.value)}
                  className="bg-white rounded-xl"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Height (cm)</label>
                <Input
                  type="number"
                  placeholder="170"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="bg-white rounded-xl"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Weight (kg)</label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="70"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="bg-white rounded-xl"
                />
              </div>
              <div className="col-span-2 sm:col-span-4 flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowAddModal(false)} className="rounded-xl h-10">
                  Cancel
                </Button>
                <Button type="submit" disabled={saving} className="bg-teal-600 hover:bg-teal-700 font-bold rounded-xl h-10 px-6">
                  {saving ? "Recording..." : "Save Vitals"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {vitals.length === 0 ? (
        <Card className="border border-slate-200/80 rounded-2xl text-center py-12">
          <p className="text-sm text-slate-500">No physiological telemetry recorded.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {vitals.map((vital) => (
            <Card key={vital.id} className="border border-slate-200/80 shadow-sm rounded-2xl overflow-hidden hover:border-teal-200 transition-colors">
              <CardContent className="p-5">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-3 mb-4 border-b border-slate-100 gap-2">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-teal-600" />
                    <span className="font-bold text-slate-800 text-sm">
                      {new Date(vital.recordedAt).toLocaleString()}
                    </span>
                  </div>
                  {vital.bmi && (
                    <Badge variant="outline" className="font-semibold text-slate-700 bg-slate-50 border-slate-200">
                      BMI: {vital.bmi} kg/m²
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4 text-center">
                  <div className="p-3 bg-slate-50/80 rounded-xl">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Blood Pressure</span>
                    <span className="text-base font-extrabold text-slate-900">
                      {vital.bpSystolic ? `${vital.bpSystolic}/${vital.bpDiastolic}` : "—"}
                    </span>
                    <span className="text-[10px] text-slate-400 block">mmHg</span>
                  </div>

                  <div className="p-3 bg-slate-50/80 rounded-xl">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Pulse / HR</span>
                    <span className="text-base font-extrabold text-slate-900">{vital.heartRate || "—"}</span>
                    <span className="text-[10px] text-slate-400 block">BPM</span>
                  </div>

                  <div className="p-3 bg-slate-50/80 rounded-xl">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">SpO₂ Oxygen</span>
                    <span className={`text-base font-extrabold ${vital.spO2 && vital.spO2 < 94 ? "text-rose-600" : "text-slate-900"}`}>
                      {vital.spO2 ? `${vital.spO2}%` : "—"}
                    </span>
                    <span className="text-[10px] text-slate-400 block">Pulse Oximetry</span>
                  </div>

                  <div className="p-3 bg-slate-50/80 rounded-xl">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Temperature</span>
                    <span className="text-base font-extrabold text-slate-900">{vital.temperature ? `${vital.temperature}°C` : "—"}</span>
                    <span className="text-[10px] text-slate-400 block">Body Temp</span>
                  </div>

                  <div className="p-3 bg-slate-50/80 rounded-xl">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Resp Rate</span>
                    <span className="text-base font-extrabold text-slate-900">{vital.respiratoryRate || "—"}</span>
                    <span className="text-[10px] text-slate-400 block">breaths/min</span>
                  </div>

                  <div className="p-3 bg-slate-50/80 rounded-xl">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Height / Weight</span>
                    <span className="text-xs font-extrabold text-slate-900">
                      {vital.height ? `${vital.height}cm` : "—"} / {vital.weight ? `${vital.weight}kg` : "—"}
                    </span>
                    <span className="text-[10px] text-slate-400 block">Anthropometry</span>
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
