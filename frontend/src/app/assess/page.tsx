"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Activity, MapPin, CheckCircle2, User, UserCircle, Stethoscope } from "lucide-react";
import { useStore } from "@/lib/store";
import { calculateRiskScore, inferSpecialistNeeds } from "@/lib/risk-engine";
import { matchFacilities } from "@/lib/referral-matcher";
import { RiskScoreCard } from "@/components/risk-score-card";
import { VitalsInput } from "@/components/vitals-input";
import { SymptomPicker } from "@/components/symptom-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Vitals, RiskFactor, Urgency, FacilityMatch, Comorbidities } from "@/lib/types";

// Varanasi default coords
const PATIENT_LAT = 25.3176;
const PATIENT_LNG = 82.9739;

export default function AssessPage() {
  const router = useRouter();
  const { facilities } = useStore();
  
  const [age, setAge] = useState<number>(30);
  const [gender, setGender] = useState<string>("Male");
  
  const [vitals, setVitals] = useState<Vitals>({
    bpSystolic: 120,
    bpDiastolic: 80,
    pulse: 72,
    temperature: 36.8,
    spO2: 98,
  });
  
  const [symptoms, setSymptoms] = useState<string[]>([]);
  
  const [comorbidities, setComorbidities] = useState<Comorbidities>({
    diabetes: false,
    hypertension: false,
    heartDisease: false,
    pregnancy: false,
    asthma: false,
    kidney: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    score: number;
    urgency: Urgency;
    factors: RiskFactor[];
    summary: string;
    matchedFacilities: FacilityMatch[];
  } | null>(null);

  const handleComorbidityChange = (key: keyof Comorbidities) => {
    setComorbidities((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAssess = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      const riskResult = calculateRiskScore({
        age,
        gender,
        vitals,
        symptoms,
        comorbidities,
      });

      const specialistNeeds = inferSpecialistNeeds(symptoms, comorbidities);
      
      const matches = matchFacilities(facilities, {
        urgency: riskResult.urgency,
        specialistNeeds,
        bloodGroup: null,
        patientLat: PATIENT_LAT,
        patientLng: PATIENT_LNG,
      }).slice(0, 3);

      setResult({
        score: riskResult.score,
        urgency: riskResult.urgency,
        factors: riskResult.factors,
        summary: riskResult.summary,
        matchedFacilities: matches,
      });
      setIsLoading(false);
    }, 300);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-teal-500 to-emerald-600 text-white rounded-2xl shadow-sm">
            <Activity className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900">AI Clinical Risk &amp; Triage Assessment</h1>
            <p className="text-xs text-slate-500 font-medium">
              Instant rule-based triage scoring, explainable risk factors, and optimal facility matching.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 font-bold px-3 py-1 text-xs gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            AI Decision Support Active
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form Inputs (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* 1. Demographics */}
          <Card className="border border-slate-200/80 shadow-sm rounded-2xl overflow-hidden bg-white">
            <CardHeader className="py-3.5 px-5 border-b border-slate-100 bg-slate-50/50">
              <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-lg bg-teal-100 text-teal-800 text-xs font-bold">1</span>
                Patient Demographics
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="age" className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" /> Age (Years)
                  </Label>
                  <Input 
                    id="age" 
                    type="number" 
                    min={0}
                    max={120}
                    value={age} 
                    onChange={(e) => setAge(parseInt(e.target.value) || 0)} 
                    className="h-10 rounded-xl border-slate-200 focus-visible:ring-teal-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <UserCircle className="w-3.5 h-3.5 text-slate-400" /> Gender
                  </Label>
                  <Select value={gender} onValueChange={(val) => val && setGender(val)}>
                    <SelectTrigger className="h-10 rounded-xl border-slate-200 focus:ring-teal-500">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 2. Vitals */}
          <Card className="border border-slate-200/80 shadow-sm rounded-2xl overflow-hidden bg-white">
            <CardHeader className="py-3.5 px-5 border-b border-slate-100 bg-slate-50/50">
              <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-lg bg-blue-100 text-blue-800 text-xs font-bold">2</span>
                Vital Signs Telemetry
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <VitalsInput vitals={vitals} onChange={setVitals} />
            </CardContent>
          </Card>
          
          {/* 3. Symptoms */}
          <Card className="border border-slate-200/80 shadow-sm rounded-2xl overflow-hidden bg-white">
            <CardHeader className="py-3.5 px-5 border-b border-slate-100 bg-slate-50/50">
              <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-lg bg-amber-100 text-amber-800 text-xs font-bold">3</span>
                Reported Symptoms
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <SymptomPicker selected={symptoms} onChange={setSymptoms} />
            </CardContent>
          </Card>
          
          {/* 4. Comorbidities */}
          <Card className="border border-slate-200/80 shadow-sm rounded-2xl overflow-hidden bg-white">
            <CardHeader className="py-3.5 px-5 border-b border-slate-100 bg-slate-50/50">
              <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-lg bg-rose-100 text-rose-800 text-xs font-bold">4</span>
                Pre-existing Comorbidities
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <div className="flex flex-wrap gap-2">
                {(Object.keys(comorbidities) as Array<keyof Comorbidities>).map((key) => {
                  const isSelected = comorbidities[key];
                  return (
                    <button
                      key={key}
                      onClick={() => handleComorbidityChange(key)}
                      className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all border ${
                        isSelected 
                          ? 'bg-teal-50 border-teal-300 text-teal-800 shadow-sm' 
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Button 
            className="w-full h-12 text-sm font-bold bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white shadow-md rounded-2xl transition-all" 
            onClick={handleAssess}
            disabled={isLoading}
          >
            <Activity className={`w-4 h-4 mr-2 ${isLoading ? 'animate-pulse' : ''}`} />
            {isLoading ? "Running AI Clinical Engine..." : "Run AI Triage Assessment"}
          </Button>
        </div>

        {/* Right Column: Results & Referral Recommendations (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {!result && !isLoading ? (
            <Card className="border-dashed border-2 border-slate-200 flex items-center justify-center bg-slate-50/40 min-h-[520px] rounded-3xl shadow-sm">
              <CardContent className="text-center p-8 text-slate-500 flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-4 text-slate-400">
                  <Stethoscope className="w-8 h-8 text-teal-600" />
                </div>
                <h3 className="font-extrabold text-slate-800 text-base mb-1">Ready for Assessment</h3>
                <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                  Enter patient demographics, vitals telemetry, and reported symptoms, then click &quot;Run AI Triage Assessment&quot;.
                </p>
              </CardContent>
            </Card>
          ) : result ? (
            <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
              <RiskScoreCard 
                score={result.score}
                urgency={result.urgency}
                factors={result.factors}
                summary={result.summary}
                showActions={true}
                onCreateReferral={() => {
                  router.push("/referrals");
                }}
              />

              {result.matchedFacilities.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold tracking-tight text-slate-800">Optimal Referral Facilities</h3>
                    <Badge variant="outline" className="text-xs bg-teal-50 text-teal-700 border-teal-200">Ranked by capability</Badge>
                  </div>
                  <div className="grid gap-4">
                    {result.matchedFacilities.map((match, idx) => {
                      const fac = match.facility;
                      const icuAvail = Math.max(0, fac.icuBeds - fac.icuBedsUsed);
                      const genAvail = Math.max(0, fac.generalBeds - fac.generalBedsUsed);

                      return (
                        <Card key={idx} className="hover:border-teal-200 hover:shadow-md transition-all rounded-xl overflow-hidden border-slate-200">
                          <CardContent className="p-5 flex flex-col sm:flex-row justify-between items-start gap-4">
                            <div className="space-y-2 flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-bold text-lg text-slate-900">{fac.name}</h4>
                                <Badge variant="secondary" className="text-[10px] uppercase tracking-wider bg-slate-100 text-slate-600">
                                  {fac.type.replace("_", " ")}
                                </Badge>
                              </div>
                              <div className="flex items-center text-sm text-slate-500 gap-1.5">
                                <MapPin className="w-4 h-4 text-teal-600" />
                                <span>{match.distance.toFixed(1)} km away • {fac.district}, {fac.state}</span>
                              </div>
                              {match.reasons && match.reasons.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-3">
                                  {match.reasons.map((r, rIdx) => (
                                    <span 
                                      key={rIdx} 
                                      className="inline-flex items-center text-xs bg-emerald-50 px-2.5 py-1 rounded-md text-emerald-700 border border-emerald-100"
                                    >
                                      <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-500" />
                                      {r}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col sm:items-end justify-center shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 w-full sm:w-auto">
                              <div className="text-sm font-semibold text-emerald-600 flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                ICU: {icuAvail}/{fac.icuBeds} free
                              </div>
                              <div className="text-sm text-slate-500 mt-1 flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                                Gen: {genAvail}/{fac.generalBeds} free
                              </div>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="mt-4 w-full sm:w-auto border-teal-200 text-teal-700 hover:bg-teal-50 rounded-lg"
                                onClick={() => router.push(`/facilities/${fac.id}`)}
                              >
                                View Facility
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Card className="min-h-[500px] flex items-center justify-center bg-white shadow-lg rounded-2xl border border-slate-100">
              <CardContent className="text-center p-8 text-slate-500 flex flex-col items-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-teal-100 rounded-full animate-ping opacity-75"></div>
                  <Activity className="w-12 h-12 mb-4 text-teal-600 relative z-10" />
                </div>
                <p className="font-semibold text-slate-800 text-lg mt-4">Evaluating Clinical Rules...</p>
                <p className="text-sm text-slate-500 mt-2">Cross-referencing symptoms, vitals &amp; hospital availability</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
