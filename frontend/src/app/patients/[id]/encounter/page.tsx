"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Patient,
  Doctor,
  Vitals,
  Comorbidities,
  SYMPTOM_LIST,
  Urgency,
} from "@/lib/types";
import { calculateRiskScore } from "@/lib/risk-engine";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Stethoscope,
  Activity,
  Plus,
  Trash2,
  CheckCircle2,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { UrgencyBadge } from "@/components/urgency-badge";

interface RxItem {
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

const COMMON_LABS = [
  "Complete Blood Count (CBC)",
  "HbA1c (Glycated Hemoglobin)",
  "Lipid Panel",
  "Liver Function Test (LFT)",
  "Kidney Function Test (KFT / Creatinine)",
  "Cardiac Troponin I",
  "Thyroid Stimulating Hormone (TSH)",
  "Serum Electrolytes (Na, K, Cl)",
  "12-Lead Electrocardiogram (ECG)",
  "Chest X-Ray (PA View)",
];

import { useStore } from "@/lib/store";

export default function ClinicalEncounterPage() {
  const params = useParams();
  const router = useRouter();
  const rawId = params.id as string;
  const id = rawId ? decodeURIComponent(rawId) : "";

  const { patients: storePatients, getPatient } = useStore();
  const [patient, setPatient] = useState<Patient | null>(() => {
    return getPatient(id) || storePatients.find((p) => p.id === id || p.mrn === id) || null;
  });
  const [doctors, setDoctors] = useState<Doctor[]>([
    { id: "doc-1", name: "Dr. Rajesh Kumar", specialty: "General Medicine", available: true },
    { id: "doc-2", name: "Dr. Priya Sharma", specialty: "Cardiology", available: true },
    { id: "doc-3", name: "Dr. Sunita Verma", specialty: "Obstetrics & Gynecology", available: true },
  ]);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>("doc-1");
  const [loading, setLoading] = useState(!patient);
  const [submitting, setSubmitting] = useState(false);

  // Section 1: HPI
  const [chiefComplaint, setChiefComplaint] = useState("");
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [onset, setOnset] = useState<string>("Gradual");
  const [severity, setSeverity] = useState<string>("Moderate");
  const [hpiNotes, setHpiNotes] = useState("");

  // Section 2: Vitals
  const [vitals, setVitals] = useState<Vitals>({
    bpSystolic: 120,
    bpDiastolic: 80,
    pulse: 72,
    temperature: 37.0,
    spO2: 98,
    respiratoryRate: 16,
  });
  const [height, setHeight] = useState<string>("170");
  const [weight, setWeight] = useState<string>("70");

  // Section 3: Diagnosis
  const [diagnosis, setDiagnosis] = useState("");
  const [diagnosisIcdCode, setDiagnosisIcdCode] = useState("");
  const [clinicalNotes, setClinicalNotes] = useState("");

  // Section 4: Treatment & Rx
  const [rxItems, setRxItems] = useState<RxItem[]>([
    { medicationName: "", dosage: "", frequency: "Twice daily", duration: "7 days", instructions: "After meals" },
  ]);
  const [selectedLabs, setSelectedLabs] = useState<string[]>([]);
  const [treatmentPlan, setTreatmentPlan] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");

  // Fetch initial patient and doctor records
  useEffect(() => {
    async function loadData() {
      if (!id) return;
      try {
        const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const [pRes, dRes] = await Promise.all([
          fetch(`${API}/api/patients/${id}`),
          fetch(`${API}/api/doctors`),
        ]);
        if (pRes.ok) {
          const pData = await pRes.json();
          setPatient(pData);
        } else {
          const fallback = getPatient(id) || storePatients.find((p) => p.id === id || p.mrn === id);
          if (fallback) setPatient(fallback);
        }
        if (dRes.ok) {
          const dData = await dRes.json();
          if (Array.isArray(dData) && dData.length > 0) {
            setDoctors(dData);
            setSelectedDoctorId(dData[0].id);
          }
        }
      } catch (err) {
        console.error("Error loading encounter initial data:", err);
        const fallback = getPatient(id) || storePatients.find((p) => p.id === id || p.mrn === id);
        if (fallback) setPatient(fallback);
      } finally {
        setLoading(false);
      }
    }
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, storePatients]);

  // Derive comorbidities from patient conditions
  const comorbidities: Comorbidities = useMemo(() => {
    if (!patient?.conditions) {
      return {
        diabetes: false,
        hypertension: false,
        heartDisease: false,
        pregnancy: false,
        asthma: false,
        kidney: false,
      };
    }
    const condNames = patient.conditions.map((c) => c.name.toLowerCase());
    return {
      diabetes: condNames.some((c) => c.includes("diabet")),
      hypertension: condNames.some((c) => c.includes("hypertens") || c.includes("bp")),
      heartDisease: condNames.some((c) => c.includes("coronary") || c.includes("heart") || c.includes("cardiac")),
      pregnancy: condNames.some((c) => c.includes("pregnan")),
      asthma: condNames.some((c) => c.includes("asthma") || c.includes("copd")),
      kidney: condNames.some((c) => c.includes("kidney") || c.includes("renal") || c.includes("ckd")),
    };
  }, [patient]);

  // LIVE AI Risk Engine Calculation
  const aiRiskAssessment = useMemo(() => {
    return calculateRiskScore({
      symptoms: selectedSymptoms,
      vitals,
      age: patient?.age || 35,
      gender: patient?.gender || "Male",
      comorbidities,
    });
  }, [selectedSymptoms, vitals, patient, comorbidities]);

  const toggleSymptom = (sym: string) => {
    if (selectedSymptoms.includes(sym)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== sym));
    } else {
      setSelectedSymptoms([...selectedSymptoms, sym]);
    }
  };

  const toggleLab = (lab: string) => {
    if (selectedLabs.includes(lab)) {
      setSelectedLabs(selectedLabs.filter((l) => l !== lab));
    } else {
      setSelectedLabs([...selectedLabs, lab]);
    }
  };

  const addRxItem = () => {
    setRxItems([
      ...rxItems,
      { medicationName: "", dosage: "", frequency: "Once daily", duration: "7 days", instructions: "After meals" },
    ]);
  };

  const removeRxItem = (idx: number) => {
    setRxItems(rxItems.filter((_, i) => i !== idx));
  };

  const updateRxItem = (index: number, field: keyof RxItem, value: string) => {
    const updated = [...rxItems];
    updated[index][field] = value;
    setRxItems(updated);
  };

  // Submit complete encounter
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!diagnosis.trim()) {
      alert("Please specify a diagnosis or provisional assessment.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        doctorId: selectedDoctorId,
        chiefComplaint: chiefComplaint || selectedSymptoms.join(", ") || "Clinical consultation",
        symptoms: selectedSymptoms,
        onset,
        severity,
        hpiNotes,
        diagnosis,
        diagnosisIcdCode,
        clinicalNotes,
        treatmentPlan,
        riskScore: aiRiskAssessment.score,
        urgency: aiRiskAssessment.urgency,
        riskFactors: aiRiskAssessment.factors,
        suggestedDepartment:
          aiRiskAssessment.urgency === Urgency.EMERGENCY
            ? "Emergency & Critical Care"
            : aiRiskAssessment.urgency === Urgency.HIGH
            ? "Specialty Inpatient Unit"
            : "Outpatient General Medicine",
        followUpDate: followUpDate || undefined,
        vitals: {
          ...vitals,
          height: height ? parseFloat(height) : undefined,
          weight: weight ? parseFloat(weight) : undefined,
        },
        prescriptionItems: rxItems.filter((item) => item.medicationName.trim().length > 0),
        labOrders: selectedLabs,
      };

      const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${API}/api/patients/${id}/encounters`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push(`/patients/${id}`);
      } else {
        alert("Failed to save encounter record.");
      }
    } catch (err) {
      console.error("Error saving encounter:", err);
      alert("Error saving encounter.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-32 flex flex-col items-center justify-center space-y-3">
        <RefreshCw className="h-8 w-8 text-teal-600 animate-spin" />
        <p className="text-slate-500 font-medium">Initializing Clinical Encounter Workspace...</p>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="py-20 text-center">
        <p className="text-slate-500">Patient not found.</p>
        <Link href="/patients">
          <Button className="mt-4">Back to Registry</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-24 animate-in fade-in duration-300">
      {/* Top Navigation */}
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
        <Link
          href={`/patients/${patient.id}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Exit Consultation & Return to 360° Profile</span>
        </Link>

        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-teal-50 text-teal-800 border-teal-200 font-bold px-3 py-1 text-xs">
            Active Clinical Encounter
          </Badge>
        </div>
      </div>

      {/* Patient Header Bar */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200/80 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-teal-100 text-teal-800 font-black text-xl flex items-center justify-center border border-teal-200">
            {patient.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-black text-slate-900">{patient.name}</h2>
              <span className="font-mono text-xs font-bold text-slate-400">({patient.mrn})</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {patient.age} yrs • {patient.gender} • Blood: <span className="text-rose-600 font-bold">{patient.bloodGroup || "—"}</span> • {patient.district}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="flex-1 md:flex-initial">
            <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Attending Clinician
            </Label>
            <select
              value={selectedDoctorId}
              onChange={(e) => setSelectedDoctorId(e.target.value)}
              className="h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-teal-500 outline-none w-full md:w-64"
            >
              {doctors.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.name} ({doc.specialty})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Consultation Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left 2 Columns: Clinical Documentation */}
        <div className="lg:col-span-2 space-y-8">
          {/* Section 1: History of Present Illness (HPI) */}
          <Card className="border border-slate-200/80 shadow-sm rounded-3xl overflow-hidden">
            <CardHeader className="bg-slate-50/80 border-b border-slate-100 p-6">
              <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-teal-600 text-white text-xs flex items-center justify-center font-bold">1</span>
                History of Present Illness (HPI)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div>
                <Label className="text-xs font-bold text-slate-700 block mb-1.5">Chief Complaint / Reason for Visit</Label>
                <Input
                  placeholder="e.g. Severe retrosternal chest pain with shortness of breath..."
                  value={chiefComplaint}
                  onChange={(e) => setChiefComplaint(e.target.value)}
                  className="rounded-xl h-11 text-sm bg-slate-50/40"
                />
              </div>

              <div>
                <Label className="text-xs font-bold text-slate-700 block mb-2">
                  Reported Symptom Checklist (Feeds AI Triage Engine)
                </Label>
                <div className="flex flex-wrap gap-2">
                  {SYMPTOM_LIST.map((sym) => {
                    const isSelected = selectedSymptoms.includes(sym);
                    return (
                      <button
                        type="button"
                        key={sym}
                        onClick={() => toggleSymptom(sym)}
                        className={`text-xs px-3.5 py-2 rounded-xl font-semibold border transition-all ${
                          isSelected
                            ? "bg-teal-600 text-white border-teal-600 shadow-sm"
                            : "bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-100"
                        }`}
                      >
                        {sym}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-bold text-slate-700 block mb-1">Onset</Label>
                  <select
                    value={onset}
                    onChange={(e) => setOnset(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium"
                  >
                    <option value="Sudden">Sudden (&lt; 24 hrs)</option>
                    <option value="Gradual">Gradual / Insidious</option>
                  </select>
                </div>
                <div>
                  <Label className="text-xs font-bold text-slate-700 block mb-1">Severity</Label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium"
                  >
                    <option value="Mild">Mild</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Severe">Severe / Incapacitating</option>
                  </select>
                </div>
              </div>

              <div>
                <Label className="text-xs font-bold text-slate-700 block mb-1.5">HPI Narrative Description</Label>
                <Textarea
                  placeholder="Detailed patient history, radiation of pain, aggravating/relieving factors..."
                  value={hpiNotes}
                  onChange={(e) => setHpiNotes(e.target.value)}
                  className="rounded-xl min-h-[80px] bg-slate-50/40 text-sm"
                />
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Vitals Entry (Real-time trigger) */}
          <Card className="border border-slate-200/80 shadow-sm rounded-3xl overflow-hidden">
            <CardHeader className="bg-slate-50/80 border-b border-slate-100 p-6 flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-teal-600 text-white text-xs flex items-center justify-center font-bold">2</span>
                Clinical Vitals & Biometrics
              </CardTitle>
              <span className="text-xs font-bold text-teal-700 flex items-center gap-1">
                <Activity className="w-3.5 h-3.5" />
                Live Scoring Active
              </span>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <Label className="text-xs font-bold text-slate-700">BP Systolic</Label>
                    {vitals.bpSystolic > 140 && <Badge className="bg-rose-500 text-[10px] py-0">High</Badge>}
                  </div>
                  <Input
                    type="number"
                    value={vitals.bpSystolic}
                    onChange={(e) => setVitals({ ...vitals, bpSystolic: parseInt(e.target.value) || 120 })}
                    className="rounded-xl h-11 bg-slate-50/40 font-bold"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <Label className="text-xs font-bold text-slate-700">BP Diastolic</Label>
                    {vitals.bpDiastolic > 90 && <Badge className="bg-rose-500 text-[10px] py-0">High</Badge>}
                  </div>
                  <Input
                    type="number"
                    value={vitals.bpDiastolic}
                    onChange={(e) => setVitals({ ...vitals, bpDiastolic: parseInt(e.target.value) || 80 })}
                    className="rounded-xl h-11 bg-slate-50/40 font-bold"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <Label className="text-xs font-bold text-slate-700">Heart Rate (BPM)</Label>
                    {vitals.pulse > 100 && <Badge className="bg-rose-500 text-[10px] py-0">Tachycardia</Badge>}
                  </div>
                  <Input
                    type="number"
                    value={vitals.pulse}
                    onChange={(e) => setVitals({ ...vitals, pulse: parseInt(e.target.value) || 72 })}
                    className="rounded-xl h-11 bg-slate-50/40 font-bold"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <Label className="text-xs font-bold text-slate-700">SpO₂ Oxygen (%)</Label>
                    {vitals.spO2 < 94 && <Badge className="bg-rose-600 text-[10px] py-0 animate-pulse">Critical</Badge>}
                  </div>
                  <Input
                    type="number"
                    value={vitals.spO2}
                    onChange={(e) => setVitals({ ...vitals, spO2: parseFloat(e.target.value) || 98 })}
                    className={`rounded-xl h-11 font-bold ${vitals.spO2 < 94 ? "border-rose-400 bg-rose-50 text-rose-700" : "bg-slate-50/40"}`}
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <Label className="text-xs font-bold text-slate-700">Temperature (°C)</Label>
                    {vitals.temperature > 38.5 && <Badge className="bg-amber-500 text-[10px] py-0">Fever</Badge>}
                  </div>
                  <Input
                    type="number"
                    step="0.1"
                    value={vitals.temperature}
                    onChange={(e) => setVitals({ ...vitals, temperature: parseFloat(e.target.value) || 37.0 })}
                    className="rounded-xl h-11 bg-slate-50/40 font-bold"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <Label className="text-xs font-bold text-slate-700">Resp Rate (/min)</Label>
                  </div>
                  <Input
                    type="number"
                    value={vitals.respiratoryRate}
                    onChange={(e) => setVitals({ ...vitals, respiratoryRate: parseInt(e.target.value) || 16 })}
                    className="rounded-xl h-11 bg-slate-50/40 font-bold"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <Label className="text-xs font-bold text-slate-700">Height (cm)</Label>
                  </div>
                  <Input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="rounded-xl h-11 bg-slate-50/40 font-bold"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <Label className="text-xs font-bold text-slate-700">Weight (kg)</Label>
                  </div>
                  <Input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="rounded-xl h-11 bg-slate-50/40 font-bold"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 3: Assessment & Diagnosis */}
          <Card className="border border-slate-200/80 shadow-sm rounded-3xl overflow-hidden">
            <CardHeader className="bg-slate-50/80 border-b border-slate-100 p-6">
              <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-teal-600 text-white text-xs flex items-center justify-center font-bold">3</span>
                Assessment & ICD-10 Diagnosis
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <Label className="text-xs font-bold text-slate-700 block mb-1">Primary Clinical Diagnosis *</Label>
                  <Input
                    placeholder="e.g. Acute Coronary Syndrome, Stable Angina, Pneumonia"
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    className="rounded-xl h-11 bg-slate-50/40 font-bold text-slate-900"
                    required
                  />
                </div>
                <div>
                  <Label className="text-xs font-bold text-slate-700 block mb-1">ICD-10 Code</Label>
                  <Input
                    placeholder="e.g. I20.0"
                    value={diagnosisIcdCode}
                    onChange={(e) => setDiagnosisIcdCode(e.target.value)}
                    className="rounded-xl h-11 bg-slate-50/40 font-mono"
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs font-bold text-slate-700 block mb-1.5">SOAP Clinical Notes / Findings</Label>
                <Textarea
                  placeholder="Subjective, Objective, Assessment, Plan notes..."
                  value={clinicalNotes}
                  onChange={(e) => setClinicalNotes(e.target.value)}
                  className="rounded-xl min-h-[90px] bg-slate-50/40 font-mono text-xs"
                />
              </div>
            </CardContent>
          </Card>

          {/* Section 4: Treatment Plan & Prescriptions */}
          <Card className="border border-slate-200/80 shadow-sm rounded-3xl overflow-hidden">
            <CardHeader className="bg-slate-50/80 border-b border-slate-100 p-6 flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-teal-600 text-white text-xs flex items-center justify-center font-bold">4</span>
                Treatment Plan & Electronic Prescription
              </CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addRxItem}
                className="rounded-xl border-teal-200 text-teal-700 bg-teal-50 hover:bg-teal-100 font-bold gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Drug
              </Button>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Prescription Items */}
              <div className="space-y-3">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Medication Regimen (Rx)
                </Label>
                {rxItems.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 grid grid-cols-1 sm:grid-cols-5 gap-3 items-end">
                    <div className="sm:col-span-2">
                      <Label className="text-[10px] font-bold text-slate-500 block mb-1">Medication Name</Label>
                      <Input
                        placeholder="e.g. Metoprolol"
                        value={item.medicationName}
                        onChange={(e) => updateRxItem(idx, "medicationName", e.target.value)}
                        className="bg-white rounded-xl h-10 text-sm font-semibold"
                      />
                    </div>
                    <div>
                      <Label className="text-[10px] font-bold text-slate-500 block mb-1">Dosage</Label>
                      <Input
                        placeholder="e.g. 50mg"
                        value={item.dosage}
                        onChange={(e) => updateRxItem(idx, "dosage", e.target.value)}
                        className="bg-white rounded-xl h-10 text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-[10px] font-bold text-slate-500 block mb-1">Frequency</Label>
                      <Input
                        placeholder="e.g. BD (Twice daily)"
                        value={item.frequency}
                        onChange={(e) => updateRxItem(idx, "frequency", e.target.value)}
                        className="bg-white rounded-xl h-10 text-sm"
                      />
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <Label className="text-[10px] font-bold text-slate-500 block mb-1">Duration</Label>
                        <Input
                          placeholder="30 days"
                          value={item.duration}
                          onChange={(e) => updateRxItem(idx, "duration", e.target.value)}
                          className="bg-white rounded-xl h-10 text-sm"
                        />
                      </div>
                      {rxItems.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeRxItem(idx)}
                          className="text-rose-500 hover:bg-rose-50 rounded-xl h-10 w-10 shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Lab Orders */}
              <div>
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  Order Diagnostic Investigations
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {COMMON_LABS.map((lab) => {
                    const isSelected = selectedLabs.includes(lab);
                    return (
                      <button
                        type="button"
                        key={lab}
                        onClick={() => toggleLab(lab)}
                        className={`text-left text-xs p-2.5 rounded-xl border flex items-center justify-between transition-colors ${
                          isSelected
                            ? "bg-blue-50 text-blue-900 border-blue-300 font-bold"
                            : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        <span className="truncate">{lab}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 ml-2" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Treatment & Follow-up */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-bold text-slate-700 block mb-1">General Management Advice</Label>
                  <Textarea
                    placeholder="Dietary precautions, lifestyle counseling, warning signs..."
                    value={treatmentPlan}
                    onChange={(e) => setTreatmentPlan(e.target.value)}
                    className="rounded-xl min-h-[70px] text-xs bg-slate-50/40"
                  />
                </div>
                <div>
                  <Label className="text-xs font-bold text-slate-700 block mb-1">Scheduled Follow-up Date</Label>
                  <Input
                    type="date"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    className="rounded-xl h-11 bg-slate-50/40"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right 1 Column: LIVE AI Clinical Risk Panel & Action Box */}
        <div className="space-y-6 sticky top-20">
          {/* Live AI Risk Assessment Card */}
          <Card className="border-2 border-teal-500/40 shadow-xl rounded-3xl overflow-hidden bg-gradient-to-b from-white to-slate-50">
            <CardHeader className="bg-gradient-to-r from-teal-700 to-emerald-800 text-white p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-teal-200 animate-pulse" />
                  <CardTitle className="text-base font-black tracking-wide">
                    AI Clinical Decision Support
                  </CardTitle>
                </div>
                <UrgencyBadge urgency={aiRiskAssessment.urgency} size="sm" />
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              {/* Score Gauge */}
              <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm text-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Stratified Clinical Risk Score
                </span>
                <div className="text-5xl font-black text-slate-900 tracking-tight my-1">
                  {aiRiskAssessment.score}
                  <span className="text-lg text-slate-400 font-normal"> / 100</span>
                </div>
                <Progress
                  value={aiRiskAssessment.score}
                  className="h-2.5 w-full max-w-[200px] mt-2"
                />
              </div>

              {/* Contributing Risk Factors */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Identified Contributing Factors ({aiRiskAssessment.factors.length})
                </span>
                {aiRiskAssessment.factors.length > 0 ? (
                  <div className="space-y-1.5">
                    {aiRiskAssessment.factors.map((rf, i) => (
                      <div key={i} className="p-2.5 rounded-xl bg-slate-100/80 text-xs flex justify-between items-start">
                        <span className="font-semibold text-slate-800 pr-2">{rf.factor}</span>
                        <span className="font-bold text-rose-600 shrink-0">+{rf.contribution} pts</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">No acute risk triggers detected.</p>
                )}
              </div>

              {/* Triage Recommendation */}
              <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200/60 text-xs space-y-1.5">
                <span className="font-bold text-teal-950 uppercase tracking-wider text-[10px] block">
                  System Recommendation
                </span>
                <p className="text-teal-900 font-medium leading-relaxed">
                  {aiRiskAssessment.urgency === Urgency.EMERGENCY
                    ? "Immediate stabilization required. Arrange urgent transfer to ICU / Tertiary Center."
                    : aiRiskAssessment.urgency === Urgency.HIGH
                    ? "Urgent specialist review required. Monitor telemetry closely."
                    : "Standard clinical outpatient protocol and scheduled follow-up."}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-3">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-14 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-extrabold text-base rounded-2xl shadow-lg shadow-teal-600/25 gap-2"
                >
                  <Stethoscope className="w-5 h-5" />
                  {submitting ? "Committing Record..." : "Save & Complete Encounter"}
                </Button>

                <p className="text-[10px] text-slate-400 text-center leading-normal">
                  Protected under Ayushman Bharat ABDM standards. Artificial Intelligence decision support is auxiliary; final clinical diagnosis is rendered by the physician.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
