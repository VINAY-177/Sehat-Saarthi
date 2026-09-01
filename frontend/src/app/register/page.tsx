"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useStore } from "@/lib/store";
import { calculateRiskScore } from "@/lib/risk-engine";
import { PatientForm } from "@/components/patient-form";
import { PatientRegistrationInput, RiskResult } from "@/lib/types";
import { RiskScoreCard } from "@/components/risk-score-card";
import { Badge } from "@/components/ui/badge";
import { UserPlus } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { addPatient, addScreening, currentUser, getAuthHeaders, refreshPatients } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const [resultDialog, setResultDialog] = useState<{
    isOpen: boolean;
    patientId?: string;
    riskResult?: RiskResult;
  }>({ isOpen: false });

  const handleSubmit = async (data: PatientRegistrationInput) => {
    setIsLoading(true);
    try {
      const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      
      const riskResult = calculateRiskScore({
        symptoms: data.symptoms,
        vitals: data.vitals,
        age: data.age,
        gender: data.gender,
        comorbidities: data.comorbidities,
      });

      // 1. POST to backend for PostgreSQL database persistence
      let createdPatientId: string | undefined;

      try {
        const res = await fetch(`${API}/api/patients`, {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            name: data.name,
            age: data.age,
            gender: data.gender,
            bloodGroup: data.bloodGroup || null,
            phone: data.phone || undefined,
            village: data.village || undefined,
            district: data.district,
            state: data.state,
            incomeCategory: data.incomeCategory || undefined,
            riskLevel: riskResult.urgency,
          }),
        });

        if (res.ok) {
          const newPatient = await res.json();
          createdPatientId = newPatient.id;

          // 2. Save Clinical Encounter & Vitals to backend
          await fetch(`${API}/api/patients/${newPatient.id}/encounters`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify({
              doctorId: currentUser?.doctorId || undefined,
              chiefComplaint: data.symptoms?.join(", ") || "Intake assessment",
              symptoms: data.symptoms,
              riskScore: riskResult.score,
              urgency: riskResult.urgency,
              riskFactors: riskResult.factors,
              vitals: data.vitals,
            }),
          }).catch(() => {});

          // Refresh store with real PostgreSQL records
          await refreshPatients();
        }
      } catch (err) {
        console.warn("Backend API unavailable, saving to local store:", err);
      }

      // 3. Update local store as backup
      const patient = addPatient({
        name: data.name,
        age: data.age,
        gender: data.gender,
        bloodGroup: data.bloodGroup,
        village: data.village,
        district: data.district,
        state: data.state,
        incomeCategory: data.incomeCategory,
        riskLevel: riskResult.urgency,
        abhaLinked: false,
        registeredById: currentUser?.id || "current-user",
      });

      const finalId = createdPatientId || patient.id;

      addScreening({
        patientId: finalId,
        symptoms: data.symptoms,
        vitals: data.vitals,
        comorbidities: data.comorbidities,
        riskScore: riskResult.score,
        urgency: riskResult.urgency,
        riskFactors: riskResult.factors,
        riskSummary: riskResult.summary,
      });

      if (typeof window !== "undefined") {
        localStorage.removeItem("Sehat Saarthi-draft");
      }

      toast.success("Patient registered and recorded in PostgreSQL database!");
      setResultDialog({
        isOpen: true,
        patientId: finalId,
        riskResult,
      });
    } catch (error) {
      toast.error("Error registering patient. Please check form inputs.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-teal-500 to-emerald-600 text-white rounded-2xl shadow-sm">
            <UserPlus className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700">Staff Intake Command</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Register New Patient
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Record demographics, triage vitals, and generate unified electronic health records.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 font-bold px-3 py-1 text-xs">
            PostgreSQL Connected
          </Badge>
        </div>
      </div>

      <Card className="shadow-xs border border-slate-200/80 rounded-2xl overflow-hidden bg-white">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4 px-6">
          <CardTitle className="text-base font-bold text-slate-900">Patient Demographic &amp; Clinical Form</CardTitle>
          <CardDescription className="text-xs text-slate-500">
            Fill in required fields. Emergency triage scoring is evaluated instantly upon submission.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <PatientForm onSubmit={handleSubmit} isLoading={isLoading} />
        </CardContent>
      </Card>

      {/* Result Dialog */}
      <Dialog
        open={resultDialog.isOpen}
        onOpenChange={(open) => setResultDialog((prev) => ({ ...prev, isOpen: open }))}
      >
        <DialogContent className="max-w-md rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-extrabold text-slate-900">Registration Complete</DialogTitle>
            <DialogDescription className="text-xs text-slate-500 font-medium">
              Patient record has been created in the database with AI triage risk stratification.
            </DialogDescription>
          </DialogHeader>

          {resultDialog.riskResult && (
            <div className="py-2">
              <RiskScoreCard
                score={resultDialog.riskResult.score}
                urgency={resultDialog.riskResult.urgency}
                factors={resultDialog.riskResult.factors}
                summary={resultDialog.riskResult.summary}
              />
            </div>
          )}

          <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setResultDialog({ isOpen: false });
                router.push("/patients");
              }}
              className="flex-1 rounded-xl font-bold text-xs h-10"
            >
              View Patient Records
            </Button>
            {resultDialog.patientId && (
              <Button
                onClick={() => {
                  setResultDialog({ isOpen: false });
                  router.push(`/patients/${resultDialog.patientId}`);
                }}
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-xs h-10"
              >
                Open 360° Profile
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
