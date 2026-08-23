"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Vitals } from "@/lib/types";

interface VitalsInputProps {
  vitals: Vitals;
  onChange: (vitals: Vitals) => void;
}

export function VitalsInput({ vitals, onChange }: VitalsInputProps) {
  const handleChange = (field: keyof Vitals, value: string) => {
    const numValue = value === "" ? undefined : Number(value);
    onChange({ ...vitals, [field]: numValue });
  };

  const getBpSystolicColor = (val?: number) => {
    if (!val) return "text-muted-foreground";
    if (val < 90 || val > 180) return "text-red-500 font-medium";
    if (val > 140) return "text-yellow-600 font-medium";
    return "text-green-600 font-medium";
  };

  const getBpDiastolicColor = (val?: number) => {
    if (!val) return "text-muted-foreground";
    if (val < 60 || val > 120) return "text-red-500 font-medium";
    if (val > 90) return "text-yellow-600 font-medium";
    return "text-green-600 font-medium";
  };

  const getPulseColor = (val?: number) => {
    if (!val) return "text-muted-foreground";
    if (val < 50 || val > 120) return "text-red-500 font-medium";
    if (val < 60 || val > 100) return "text-yellow-600 font-medium";
    return "text-green-600 font-medium";
  };

  const getTempColor = (val?: number) => {
    if (!val) return "text-muted-foreground";
    if (val < 35 || val > 39) return "text-red-500 font-medium";
    if (val < 36.1 || val > 37.2) return "text-yellow-600 font-medium";
    return "text-green-600 font-medium";
  };

  const getSpO2Color = (val?: number) => {
    if (!val) return "text-muted-foreground";
    if (val < 90) return "text-red-500 font-medium";
    if (val < 95) return "text-yellow-600 font-medium";
    return "text-green-600 font-medium";
  };

  const getRrColor = (val?: number) => {
    if (!val) return "text-muted-foreground";
    if (val < 10 || val > 30) return "text-red-500 font-medium";
    if (val < 12 || val > 20) return "text-yellow-600 font-medium";
    return "text-green-600 font-medium";
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-sm font-medium">Blood Pressure (mmHg)</Label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Systolic"
            value={vitals.bpSystolic || ""}
            onChange={(e) => handleChange("bpSystolic", e.target.value)}
            className="h-11 rounded-lg"
          />
          <span className="text-muted-foreground font-bold text-lg shrink-0">/</span>
          <Input
            type="number"
            placeholder="Diastolic"
            value={vitals.bpDiastolic || ""}
            onChange={(e) => handleChange("bpDiastolic", e.target.value)}
            className="h-11 rounded-lg"
          />
        </div>
        <p className={`text-xs flex gap-1 ${getBpSystolicColor(vitals.bpSystolic)} ${getBpDiastolicColor(vitals.bpDiastolic)}`}>
          <span className="text-muted-foreground">Normal:</span> 90-140 / 60-90
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Pulse (bpm)</Label>
          <Input
            type="number"
            placeholder="e.g. 72"
            value={vitals.pulse || ""}
            onChange={(e) => handleChange("pulse", e.target.value)}
            className="h-11 rounded-lg"
          />
          <p className={`text-xs flex gap-1 ${getPulseColor(vitals.pulse)}`}>
            <span className="text-muted-foreground">Normal:</span> 60-100
          </p>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Temperature (°C)</Label>
          <Input
            type="number"
            step="0.1"
            placeholder="e.g. 36.5"
            value={vitals.temperature || ""}
            onChange={(e) => handleChange("temperature", e.target.value)}
            className="h-11 rounded-lg"
          />
          <p className={`text-xs flex gap-1 ${getTempColor(vitals.temperature)}`}>
            <span className="text-muted-foreground">Normal:</span> 36.1-37.2
          </p>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">SpO2 (%)</Label>
          <Input
            type="number"
            placeholder="e.g. 98"
            value={vitals.spO2 || ""}
            onChange={(e) => handleChange("spO2", e.target.value)}
            className="h-11 rounded-lg"
          />
          <p className={`text-xs flex gap-1 ${getSpO2Color(vitals.spO2)}`}>
            <span className="text-muted-foreground">Normal:</span> 95-100
          </p>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Respiratory Rate (breaths/min)</Label>
          <Input
            type="number"
            placeholder="e.g. 16"
            value={vitals.respiratoryRate || ""}
            onChange={(e) => handleChange("respiratoryRate", e.target.value)}
            className="h-11 rounded-lg"
          />
          <p className={`text-xs flex gap-1 ${getRrColor(vitals.respiratoryRate)}`}>
            <span className="text-muted-foreground">Normal:</span> 12-20
          </p>
        </div>
      </div>
    </div>
  );
}
