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

const DRAFT_KEY = "Sehat Saathi-draft";

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

      <section className="space-y-4">
        <h3 className="text-base font-semibold">1. Citizen Demographics</h3>
        <Separator />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1.5 lg:col-span-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input 
              id="name" 
              placeholder="e.g. Ramesh Kumar"
              value={formData.name} 
              onChange={(e) => setFormData({...formData, name: e.target.value})} 
              required 
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="age">Age (Years) *</Label>
            <Input 
              id="age" 
              type="number" 
              min={0} 
              max={120} 
              value={formData.age || ""} 
              onChange={(e) => setFormData({...formData, age: Number(e.target.value)})} 
              required 
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="gender">Gender *</Label>
            <Select value={formData.gender} onValueChange={(v) => v && setFormData({...formData, gender: v})}>
              <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="bloodGroup">Blood Group</Label>
            <Select value={formData.bloodGroup} onValueChange={(v) => v && setFormData({...formData, bloodGroup: v})}>
              <SelectTrigger><SelectValue placeholder="Select blood group" /></SelectTrigger>
              <SelectContent>
                {BLOOD_GROUPS.map(bg => (
                  <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="village">Village / Ward</Label>
            <Input 
              id="village" 
              value={formData.village} 
              onChange={(e) => setFormData({...formData, village: e.target.value})} 
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="district">District</Label>
            <Input 
              id="district" 
              value={formData.district} 
              onChange={(e) => setFormData({...formData, district: e.target.value})} 
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="incomeCategory">Socio-Economic Category</Label>
            <Select value={formData.incomeCategory || ""} onValueChange={(v) => v && setFormData({...formData, incomeCategory: v})}>
              <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="BPL">BPL (Below Poverty Line)</SelectItem>
                <SelectItem value="APL">APL (Above Poverty Line)</SelectItem>
                <SelectItem value="EWS">EWS (Economically Weaker Section)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-base font-semibold">2. Vital Signs (Recorded at SEHAT Mandir / Camp)</h3>
        <Separator />
        <VitalsInput vitals={formData.vitals} onChange={(v) => setFormData({...formData, vitals: v})} />
      </section>

      <section className="space-y-4">
        <h3 className="text-base font-semibold">3. Reported Symptoms</h3>
        <Separator />
        <SymptomPicker selected={formData.symptoms} onChange={(s) => setFormData({...formData, symptoms: s})} />
      </section>

      <section className="space-y-4">
        <h3 className="text-base font-semibold">4. Known Pre-existing Conditions / Comorbidities</h3>
        <Separator />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {(Object.keys(formData.comorbidities) as Array<keyof Comorbidities>).map((condition) => (
            <label key={condition} className="flex items-center space-x-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-primary focus:ring-primary w-4 h-4"
                checked={formData.comorbidities[condition]}
                onChange={(e) => setFormData({
                  ...formData,
                  comorbidities: {
                    ...formData.comorbidities,
                    [condition]: e.target.checked
                  }
                })}
              />
              <span className="capitalize">{condition.replace(/([A-Z])/g, ' $1').trim()}</span>
            </label>
          ))}
        </div>
      </section>

      <div className="pt-2">
        <Button type="submit" size="lg" className="w-full sm:w-auto h-11 text-base font-semibold" disabled={isLoading}>
          <HeartPulse className="h-5 w-5 mr-2" />
          {isLoading ? "Evaluating Clinical Triage..." : "Register Citizen & Assess AI Risk"}
        </Button>
      </div>
    </form>
  );
}
