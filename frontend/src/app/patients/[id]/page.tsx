"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Patient, Urgency } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Stethoscope,
  Fingerprint,
  RefreshCw,
  User,
  MapPin,
  Phone,
} from "lucide-react";
import { UrgencyBadge } from "@/components/urgency-badge";

// Tab Components
import { OverviewTab } from "@/components/patient-360/overview-tab";
import { DemographicsTab } from "@/components/patient-360/demographics-tab";
import { ConditionsTab } from "@/components/patient-360/conditions-tab";
import { AllergiesTab } from "@/components/patient-360/allergies-tab";
import { MedicationsTab } from "@/components/patient-360/medications-tab";
import { VitalsTab } from "@/components/patient-360/vitals-tab";
import { EncountersTab } from "@/components/patient-360/encounters-tab";
import { useStore } from "@/lib/store";
import { PrescriptionsTab } from "@/components/patient-360/prescriptions-tab";
import { LabReportsTab } from "@/components/patient-360/lab-reports-tab";
import { InsuranceTab } from "@/components/patient-360/insurance-tab";
import { AppointmentCalendarWidget } from "@/components/appointment-calendar-widget";

export default function PatientDetailPage() {
  const params = useParams();
  const rawId = params.id as string;
  const id = rawId ? decodeURIComponent(rawId) : "";

  const { patients: storePatients, getPatient } = useStore();
  const [patient, setPatient] = useState<Patient | null>(() => {
    return getPatient(id) || storePatients.find((p) => p.id === id || p.mrn === id) || null;
  });
  const [loading, setLoading] = useState(!patient);
  const [activeTab, setActiveTab] = useState("overview");

  const fetchPatient = async () => {
    if (!id) return;
    try {
      const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${API}/api/patients/${id}`);
      if (res.ok) {
        const data = await res.json();
        setPatient(data);
      } else {
        // Fallback to store
        const fallback = getPatient(id) || storePatients.find((p) => p.id === id || p.mrn === id);
        if (fallback) setPatient(fallback);
      }
    } catch (err) {
      console.error("Failed to fetch patient 360 data:", err);
      const fallback = getPatient(id) || storePatients.find((p) => p.id === id || p.mrn === id);
      if (fallback) setPatient(fallback);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchPatient();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, storePatients]);

  if (loading) {
    return (
      <div className="py-32 flex flex-col items-center justify-center space-y-3">
        <RefreshCw className="h-8 w-8 text-teal-600 animate-spin" />
        <p className="text-slate-500 font-medium">Assembling Patient 360° Profile...</p>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="py-24 text-center space-y-4 max-w-md mx-auto">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
          <User className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Patient Profile Not Found</h2>
        <p className="text-slate-500 text-sm">
          The requested medical record could not be loaded or may have been archived.
        </p>
        <Link href="/patients">
          <Button className="bg-teal-600 hover:bg-teal-700 font-bold rounded-xl mt-2">
            <ArrowLeft className="mr-2 h-4 w-4" /> Return to Patient Registry
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-20 animate-in fade-in duration-300">
      {/* Top Breadcrumb & Nav */}
      <div className="flex items-center justify-between">
        <Link
          href="/patients"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Patient Registry</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link href={`/patients/${patient.id}/encounter`}>
            <Button className="bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl h-11 px-5 shadow-sm gap-2">
              <Stethoscope className="w-4 h-4" />
              <span>Start Clinical Encounter</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Patient Header 360 Card */}
      <Card className="border-0 shadow-md bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white rounded-3xl overflow-hidden">
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            {/* Left: Avatar & Basic Info */}
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-slate-950 text-3xl font-black shadow-lg shadow-teal-500/20 shrink-0">
                {patient.name.charAt(0).toUpperCase()}
              </div>
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-3xl font-extrabold tracking-tight">{patient.name}</h1>
                  <Badge variant="outline" className="bg-white/10 text-white border-white/20 font-mono text-xs">
                    {patient.mrn || `MRN-${patient.id.slice(0, 6)}`}
                  </Badge>
                  <UrgencyBadge
                    urgency={(patient.riskLevel?.toUpperCase() as Urgency) || Urgency.LOW}
                    size="sm"
                  />
                </div>

                <p className="text-slate-300 text-sm flex flex-wrap items-center gap-2">
                  <span>{patient.age} yrs</span> •
                  <span className="capitalize">{patient.gender}</span> •
                  <span className="text-rose-300 font-semibold">Blood: {patient.bloodGroup || "Unknown"}</span> •
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-teal-400" />
                    {patient.district}, {patient.state}
                  </span>
                </p>

                {patient.phone && (
                  <p className="text-xs text-slate-400 flex items-center gap-1.5 pt-0.5">
                    <Phone className="w-3.5 h-3.5" />
                    {patient.phone}
                  </p>
                )}
              </div>
            </div>

            {/* Right: ABHA & Quick Badges */}
            <div className="flex flex-wrap lg:flex-col items-start lg:items-end gap-3 w-full lg:w-auto border-t lg:border-t-0 border-white/10 pt-4 lg:pt-0">
              <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10 flex items-center gap-3">
                <Fingerprint className="w-5 h-5 text-teal-400" />
                <div>
                  <span className="text-[10px] text-slate-400 font-mono block">ABHA HEALTH ID</span>
                  <span className="text-xs font-mono font-bold text-white">
                    {patient.abhaId || "Not Linked"}
                  </span>
                </div>
                <Badge
                  className={`text-[10px] font-bold ${
                    patient.abhaLinked ? "bg-emerald-500 text-white" : "bg-slate-700 text-slate-300"
                  }`}
                >
                  {patient.abhaLinked ? "VERIFIED" : "UNLINKED"}
                </Badge>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-medium">Income Tier:</span>
                <Badge variant="outline" className="bg-white/5 border-white/20 text-teal-200 text-xs">
                  {patient.incomeCategory || "General (APL)"}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabbed Clinical Workspace */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
        <div className="overflow-x-auto pb-1">
          <TabsList className="bg-white p-1.5 rounded-2xl border border-slate-200/80 shadow-sm inline-flex h-auto gap-1">
            <TabsTrigger
              value="overview"
              className="rounded-xl px-4 py-2.5 text-xs font-bold data-[state=active]:bg-teal-600 data-[state=active]:text-white transition-all"
            >
              General info
            </TabsTrigger>
            <TabsTrigger
              value="demographics"
              className="rounded-xl px-4 py-2.5 text-xs font-bold data-[state=active]:bg-teal-600 data-[state=active]:text-white transition-all"
            >
              Demographics
            </TabsTrigger>
            <TabsTrigger
              value="appointments"
              className="rounded-xl px-4 py-2.5 text-xs font-bold data-[state=active]:bg-teal-600 data-[state=active]:text-white transition-all"
            >
              Appointments ({patient.appointments?.length || 0})
            </TabsTrigger>
            <TabsTrigger
              value="prescriptions"
              className="rounded-xl px-4 py-2.5 text-xs font-bold data-[state=active]:bg-teal-600 data-[state=active]:text-white transition-all"
            >
              Prescriptions ({patient.prescriptions?.length || 0})
            </TabsTrigger>
            <TabsTrigger
              value="lab-reports"
              className="rounded-xl px-4 py-2.5 text-xs font-bold data-[state=active]:bg-teal-600 data-[state=active]:text-white transition-all"
            >
              Medical tests ({patient.labReports?.length || 0})
            </TabsTrigger>
            <TabsTrigger
              value="conditions"
              className="rounded-xl px-4 py-2.5 text-xs font-bold data-[state=active]:bg-teal-600 data-[state=active]:text-white transition-all"
            >
              Conditions ({patient.conditions?.length || 0})
            </TabsTrigger>
            <TabsTrigger
              value="allergies"
              className="rounded-xl px-4 py-2.5 text-xs font-bold data-[state=active]:bg-teal-600 data-[state=active]:text-white transition-all"
            >
              Allergies ({patient.allergies?.length || 0})
            </TabsTrigger>
            <TabsTrigger
              value="vitals"
              className="rounded-xl px-4 py-2.5 text-xs font-bold data-[state=active]:bg-teal-600 data-[state=active]:text-white transition-all"
            >
              Vitals ({patient.vitals?.length || 0})
            </TabsTrigger>
            <TabsTrigger
              value="insurance"
              className="rounded-xl px-4 py-2.5 text-xs font-bold data-[state=active]:bg-teal-600 data-[state=active]:text-white transition-all"
            >
              Insurance
            </TabsTrigger>
            <TabsTrigger
              value="encounters"
              className="rounded-xl px-4 py-2.5 text-xs font-bold data-[state=active]:bg-teal-600 data-[state=active]:text-white transition-all"
            >
              Encounters ({patient.encounters?.length || 0})
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab Contents */}
        <TabsContent value="overview" className="mt-0">
          <OverviewTab patient={patient} onTabChange={setActiveTab} />
        </TabsContent>

        <TabsContent value="demographics" className="mt-0">
          <DemographicsTab patient={patient} />
        </TabsContent>

        <TabsContent value="appointments" className="mt-0">
          <div className="max-w-2xl mx-auto">
            <AppointmentCalendarWidget patientName={patient.name} />
          </div>
        </TabsContent>

        <TabsContent value="conditions" className="mt-0">
          <ConditionsTab patient={patient} onConditionAdded={fetchPatient} />
        </TabsContent>

        <TabsContent value="allergies" className="mt-0">
          <AllergiesTab patient={patient} onAllergyAdded={fetchPatient} />
        </TabsContent>

        <TabsContent value="medications" className="mt-0">
          <MedicationsTab patient={patient} onMedicationAdded={fetchPatient} />
        </TabsContent>

        <TabsContent value="vitals" className="mt-0">
          <VitalsTab patient={patient} onVitalRecorded={fetchPatient} />
        </TabsContent>

        <TabsContent value="encounters" className="mt-0">
          <EncountersTab patient={patient} />
        </TabsContent>

        <TabsContent value="prescriptions" className="mt-0">
          <PrescriptionsTab patient={patient} />
        </TabsContent>

        <TabsContent value="lab-reports" className="mt-0">
          <LabReportsTab patient={patient} />
        </TabsContent>

        <TabsContent value="insurance" className="mt-0">
          <InsuranceTab patient={patient} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
