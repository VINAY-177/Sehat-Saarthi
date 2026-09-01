"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { HeartPulse, Trash2 } from "lucide-react";
import { PatientRegistrationInput, Comorbidities, BLOOD_GROUPS } from "@/lib/types";
import { SymptomPicker } from "./symptom-picker";
import { VitalsInput } from "./vitals-input";


interface PatientFormProps {
  onSubmit: (data: PatientRegistrationInput) => void;
  isLoading?: boolean;
}

const DRAFT_KEY = "Sehat Saarthi-draft";

const defaultState: PatientRegistrationInput = {
  name: "",
  age: 0,
  gender: "Male",
  bloodGroup: "O+",
  village: "",
  district: "",
  state: "",
  incomeCategory: "BPL",
  vitals: {
    bpSystolic: 0,
    bpDiastolic: 0,
    pulse: 0,
    temperature: 0,
    spO2: 0,
  },
  symptoms: [],
  comorbidities: {
    diabetes: false,
    hypertension: false,
    heartDisease: false,
    pregnancy: false,
    asthma: false,
    kidney: false,
  },
};

export function PatientForm({ onSubmit, isLoading }: PatientFormProps) {
  const [formData, setFormData] = useState<PatientRegistrationInput>(defaultState);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const draft = localStorage.getItem(DRAFT_KEY);
    if (draft) {
      try {
        setFormData(JSON.parse(draft));
      } catch (e) {
        console.error("Failed to parse draft", e);
      }
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(formData));
    }
  }, [formData, mounted]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return alert("Patient name is required");
    if (formData.age < 0 || formData.age > 120) return alert("Please enter a valid age between 0 and 120");
    
    const v = formData.vitals;
    if (!v.bpSystolic || !v.bpDiastolic || !v.pulse || !v.temperature || !v.spO2) {
        return alert("All core vitals (BP, Pulse, Temp, SpO2) are required for clinical evaluation");
    }

    onSubmit(formData);
  };

  const clearDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    setFormData(defaultState);
  };

  if (!mounted) return null;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex justify-between items-center bg-muted/40 p-3 rounded-lg text-xs">
        <span className="text-muted-foreground">
          Local-First Autosave Active (Draft stored in browser IndexedDB/LocalStorage)
        </span>
        <Button type="button" variant="outline" size="sm" onClick={clearDraft} disabled={isLoading} className="h-7 text-xs">
          <Trash2 className="h-3.5 w-3.5 mr-1" />
          Clear Draft
        </Button>
      </div>

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-5 h-5 rounded-lg bg-teal-100 text-teal-800 text-xs font-bold">1</span>
          <h3 className="text-sm font-bold text-slate-900">Citizen Demographics</h3>
        </div>
        <Separator className="bg-slate-100" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1.5 lg:col-span-2">
            <Label htmlFor="name" className="text-xs font-semibold text-slate-700">Full Name *</Label>
            <Input 
              id="name" 
              placeholder="e.g. Ramesh Kumar"
              value={formData.name} 
              onChange={(e) => setFormData({...formData, name: e.target.value})} 
              className="h-10 rounded-xl border-slate-200"
              required 
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="age" className="text-xs font-semibold text-slate-700">Age (Years) *</Label>
            <Input 
              id="age" 
              type="number" 
              min={0} 
              max={120} 
              value={formData.age || ""} 
              onChange={(e) => setFormData({...formData, age: Number(e.target.value)})} 
              className="h-10 rounded-xl border-slate-200"
              required 
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="gender" className="text-xs font-semibold text-slate-700">Gender *</Label>
            <Select value={formData.gender} onValueChange={(v) => v && setFormData({...formData, gender: v})}>
              <SelectTrigger className="h-10 rounded-xl border-slate-200"><SelectValue placeholder="Select gender" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="bloodGroup" className="text-xs font-semibold text-slate-700">Blood Group</Label>
            <Select value={formData.bloodGroup} onValueChange={(v) => v && setFormData({...formData, bloodGroup: v})}>
              <SelectTrigger className="h-10 rounded-xl border-slate-200"><SelectValue placeholder="Select blood group" /></SelectTrigger>
              <SelectContent>
                {BLOOD_GROUPS.map(bg => (
                  <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="village" className="text-xs font-semibold text-slate-700">Village / Ward</Label>
            <Input 
              id="village" 
              placeholder="e.g. Rampur"
              value={formData.village} 
              onChange={(e) => setFormData({...formData, village: e.target.value})} 
              className="h-10 rounded-xl border-slate-200"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="district" className="text-xs font-semibold text-slate-700">District</Label>
            <Input 
              id="district" 
              placeholder="e.g. Varanasi"
              value={formData.district} 
              onChange={(e) => setFormData({...formData, district: e.target.value})} 
              className="h-10 rounded-xl border-slate-200"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="incomeCategory" className="text-xs font-semibold text-slate-700">Socio-Economic Category</Label>
            <Select value={formData.incomeCategory || ""} onValueChange={(v) => v && setFormData({...formData, incomeCategory: v})}>
              <SelectTrigger className="h-10 rounded-xl border-slate-200"><SelectValue placeholder="Select category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="BPL">BPL (Below Poverty Line)</SelectItem>
                <SelectItem value="APL">APL (Above Poverty Line)</SelectItem>
                <SelectItem value="EWS">EWS (Economically Weaker Section)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-5 h-5 rounded-lg bg-blue-100 text-blue-800 text-xs font-bold">2</span>
          <h3 className="text-sm font-bold text-slate-900">Vital Signs Telemetry</h3>
        </div>
        <Separator className="bg-slate-100" />
        <VitalsInput vitals={formData.vitals} onChange={(v) => setFormData({...formData, vitals: v})} />
      </section>

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-5 h-5 rounded-lg bg-amber-100 text-amber-800 text-xs font-bold">3</span>
          <h3 className="text-sm font-bold text-slate-900">Reported Symptoms</h3>
        </div>
        <Separator className="bg-slate-100" />
        <SymptomPicker selected={formData.symptoms} onChange={(s) => setFormData({...formData, symptoms: s})} />
      </section>

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-5 h-5 rounded-lg bg-rose-100 text-rose-800 text-xs font-bold">4</span>
          <h3 className="text-sm font-bold text-slate-900">Known Pre-existing Conditions</h3>
        </div>
        <Separator className="bg-slate-100" />
        <div className="flex flex-wrap gap-2">
          {(Object.keys(formData.comorbidities) as Array<keyof Comorbidities>).map((condition) => {
            const isSelected = formData.comorbidities[condition];
            return (
              <button
                type="button"
                key={condition}
                onClick={() => setFormData({
                  ...formData,
                  comorbidities: {
                    ...formData.comorbidities,
                    [condition]: !isSelected
                  }
                })}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all border ${
                  isSelected 
                    ? 'bg-teal-50 border-teal-300 text-teal-800 shadow-sm' 
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-100'
                }`}
              >
                {condition.replace(/([A-Z])/g, ' $1').trim()}
              </button>
            );
          })}
        </div>
      </section>

      <div className="pt-4 border-t border-slate-100">
        <Button 
          type="submit" 
          size="lg" 
          className="w-full h-12 text-sm font-bold bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white shadow-md rounded-xl" 
          disabled={isLoading}
        >
          <HeartPulse className="h-4 w-4 mr-2" />
          {isLoading ? "Evaluating Clinical Triage..." : "Register Citizen & Run AI Triage Evaluation"}
        </Button>
      </div>
    </form>
  );
}
