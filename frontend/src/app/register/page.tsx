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
  const { addPatient, addScreening, currentUser } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const [resultDialog, setResultDialog] = useState<{
    isOpen: boolean;
    patientId?: string;
    riskResult?: RiskResult;
  }>({ isOpen: false });

  const handleSubmit = async (data: PatientRegistrationInput) => {
    setIsLoading(true);
    try {
      // POST to backend first for database persistence
      const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      try {
        await fetch(`${API}/api/patients`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: data.name,
            age: data.age,
            gender: data.gender,
            bloodGroup: data.bloodGroup,
            phone: data.phone || undefined,
            village: data.village,
            district: data.district,
            state: data.state,
            incomeCategory: data.incomeCategory,
          }),
        });
      } catch (err) {
        console.warn("Backend unavailable, saving to local store only:", err);
      }

      // Add to frontend store (use backend ID if available)
      const patient = addPatient({
        name: data.name,
        age: data.age,
        gender: data.gender,
        bloodGroup: data.bloodGroup,
        village: data.village,
        district: data.district,
        state: data.state,
        incomeCategory: data.incomeCategory,
        abhaLinked: false,
        registeredById: currentUser?.id || "current-user",
      });

      const riskResult = calculateRiskScore({
        symptoms: data.symptoms,
        vitals: data.vitals,
        age: data.age,
        gender: data.gender,
        comorbidities: data.comorbidities,
      });

      addScreening({
        patientId: patient.id,
        symptoms: data.symptoms,
        vitals: data.vitals,
        comorbidities: data.comorbidities,
        riskScore: riskResult.score,
        urgency: riskResult.urgency,
        riskFactors: riskResult.factors,
        riskSummary: riskResult.summary,
      });

      if (typeof window !== "undefined") {
        localStorage.removeItem("Sehat Saathi-draft");
      }

      toast.success("Patient registered and risk evaluated successfully!");
      setResultDialog({
        isOpen: true,
        patientId: patient.id,
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
            <h1 className="text-2xl font-black text-slate-900">Register New Citizen</h1>
            <p className="text-xs text-slate-500 font-medium">
              EHR patient intake with instant rule-based AI clinical risk triage.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-200 font-bold px-3 py-1 text-xs gap-1.5">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
            EHR Intake Active
          </Badge>
        </div>
      </div>

      <Card className="shadow-sm rounded-3xl border-slate-200/80 overflow-hidden bg-white">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6">
          <CardTitle className="text-base font-bold text-slate-900">
            Citizen Clinical Intake Record
          </CardTitle>
          <CardDescription className="text-xs text-slate-500 font-medium">
            Enter demographics, baseline vitals, reported symptoms, and pre-existing medical history.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
          <PatientForm onSubmit={handleSubmit} isLoading={isLoading} />
        </CardContent>
      </Card>

      <Dialog 
        open={resultDialog.isOpen} 
        onOpenChange={(open) => {
          if (!open && resultDialog.patientId) {
            router.push(`/patients/${resultDialog.patientId}`);
          }
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-slate-800">AI Risk &amp; Triage Assessment</DialogTitle>
            <DialogDescription className="text-base text-slate-600">
              Patient intake successfully recorded. Review the automated risk analysis below.
            </DialogDescription>
          </DialogHeader>
          
          {resultDialog.riskResult && (
            <div className="py-4">
              <RiskScoreCard
                score={resultDialog.riskResult.score}
                urgency={resultDialog.riskResult.urgency}
                factors={resultDialog.riskResult.factors}
                summary={resultDialog.riskResult.summary}
                showActions={true}
                onCreateReferral={() => {
                  router.push(`/referrals?patientId=${resultDialog.patientId}`);
                }}
              />
            </div>
          )}
          
          <DialogFooter className="flex gap-3 sm:justify-end border-t pt-4 mt-4">
            <Button variant="outline" onClick={() => setResultDialog({ isOpen: false })} className="h-11 rounded-lg">
              Close
            </Button>
            {resultDialog.patientId && (
              <Button onClick={() => router.push(`/patients/${resultDialog.patientId}`)} className="h-11 rounded-lg bg-teal-600 hover:bg-teal-700">
                View Patient Record
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
