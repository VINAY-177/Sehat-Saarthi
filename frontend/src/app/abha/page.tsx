"use client";

import { useStore } from "@/lib/store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Fingerprint, CheckCircle2, Clock, ShieldCheck, Activity, Smartphone } from "lucide-react";

import { Urgency } from "@/lib/types";
import { toast } from "sonner";

export default function AbhaPage() {
  const { patients, getScreeningsForPatient, currentUser } = useStore();
  
  // Look up the logged-in user's patient record, if available
  const patient = patients.find(p => p.name === currentUser?.name) || (patients.length > 0 ? patients[0] : null);
  const screenings = patient ? getScreeningsForPatient(patient.id) : [];

  const handleLinkAbha = () => {
    toast.success("ABHA Linking Initiated successfully.");
  };

  const getUrgencyBadge = (urgency: Urgency) => {
    switch (urgency) {
      case Urgency.EMERGENCY: return <Badge variant="destructive">Emergency</Badge>;
      case Urgency.HIGH: return <Badge variant="destructive" className="bg-orange-500">High</Badge>;
      case Urgency.MODERATE: return <Badge variant="secondary" className="bg-amber-500 text-white">Moderate</Badge>;
      case Urgency.LOW: return <Badge variant="default" className="bg-green-500">Low</Badge>;
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-10">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-white border shadow-sm p-8 flex items-center justify-between">
        <div className="absolute right-0 top-0 w-64 h-64 bg-gradient-to-br from-teal-50 to-emerald-50 rounded-full blur-3xl opacity-50 pointer-events-none -translate-y-1/2 translate-x-1/2" />
        <div className="flex items-center gap-5 relative z-10">
          <div className="bg-gradient-to-br from-teal-400 to-emerald-600 p-4 rounded-full text-white shadow-lg shadow-teal-500/30">
            <Fingerprint size={36} strokeWidth={2} />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">ABHA Health ID</h1>
            <p className="text-slate-500 mt-1 font-medium">Ayushman Bharat Health Account</p>
          </div>
        </div>
      </div>

      {!patient ? (
        <Card className="border-dashed border-2 bg-slate-50/50 shadow-none">
          <CardContent className="p-16 text-center space-y-4">
            <div className="bg-white p-4 rounded-full inline-block shadow-sm">
              <Fingerprint className="h-12 w-12 text-slate-300 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-slate-700">No Patient Profile</h3>
            <p className="text-slate-500 max-w-md mx-auto">Please register or select a patient to view and manage their ABHA digital identity details.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-5 space-y-8">
            {/* Digital Card Preview */}
            <Card className="overflow-hidden shadow-lg border-0 bg-gradient-to-br from-teal-600 to-emerald-700 text-white">
              <div className="p-6 relative z-10">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <p className="text-teal-100 text-sm font-medium uppercase tracking-wider mb-1">Digital Health Card</p>
                    <h2 className="text-2xl font-bold">{patient.name}</h2>
                  </div>
                  <Fingerprint className="text-teal-300 opacity-50 h-10 w-10" />
                </div>
                
                <div className="space-y-4">
                  <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/20">
                    <p className="text-teal-100 text-xs uppercase mb-1">ABHA Number</p>
                    <p className="text-xl font-mono tracking-widest font-semibold text-white">
                      {Math.floor(1000 + Math.random() * 9000)}-{Math.floor(1000 + Math.random() * 9000)}-{Math.floor(1000 + Math.random() * 9000)}-{Math.floor(1000 + Math.random() * 9000)}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-teal-100 text-xs uppercase mb-0.5">Year of Birth</p>
                      <p className="font-medium">{new Date().getFullYear() - patient.age}</p>
                    </div>
                    <div>
                      <p className="text-teal-100 text-xs uppercase mb-0.5">Gender</p>
                      <p className="font-medium capitalize">{patient.gender.toLowerCase()}</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Background Decoration */}
              <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white opacity-5 rounded-full blur-2xl" />
              <div className="absolute -top-24 -left-24 w-48 h-48 bg-teal-300 opacity-20 rounded-full blur-2xl" />
            </Card>

            <Card className="shadow-md border-slate-200/60 overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-teal-500 to-emerald-500" />
              <CardHeader className="bg-slate-50/50 pb-4 border-b">
                <CardTitle className="text-lg">Link Health Records</CardTitle>
                <CardDescription>Connect physical records to your digital ABHA</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {[
                    "Visit nearest SEHAT Mandir or PHC",
                    "Authenticate via Aadhaar OTP or biometric",
                    "Health worker syncs existing records",
                    "Future consultations are automatically linked"
                  ].map((step, idx) => (
                    <div key={idx} className="flex items-start gap-4">
                      <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-teal-100 text-teal-700 font-bold text-sm">
                        {idx + 1}
                      </div>
                      <p className="text-slate-600 text-sm pt-1.5">{step}</p>
                    </div>
                  ))}
                  
                  <Button 
                    className="w-full bg-slate-900 hover:bg-teal-700 text-white shadow-md mt-6" 
                    onClick={handleLinkAbha}
                  >
                    <Fingerprint className="mr-2 h-5 w-5" />
                    Initiate ABHA Linking
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-7 space-y-8">
            {/* Benefits Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-slate-50 border-slate-100 shadow-sm">
                <CardContent className="p-5 flex flex-col items-center text-center space-y-3">
                  <div className="bg-white p-3 rounded-full shadow-sm text-teal-600">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h4 className="font-semibold text-slate-800 text-sm">Secure Data</h4>
                  <p className="text-xs text-slate-500">Encrypted health records accessible only with your consent.</p>
                </CardContent>
              </Card>
              <Card className="bg-slate-50 border-slate-100 shadow-sm">
                <CardContent className="p-5 flex flex-col items-center text-center space-y-3">
                  <div className="bg-white p-3 rounded-full shadow-sm text-emerald-600">
                    <Activity className="w-6 h-6" />
                  </div>
                  <h4 className="font-semibold text-slate-800 text-sm">Unified History</h4>
                  <p className="text-xs text-slate-500">All medical history, tests, and prescriptions in one place.</p>
                </CardContent>
              </Card>
              <Card className="bg-slate-50 border-slate-100 shadow-sm">
                <CardContent className="p-5 flex flex-col items-center text-center space-y-3">
                  <div className="bg-white p-3 rounded-full shadow-sm text-blue-600">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <h4 className="font-semibold text-slate-800 text-sm">Easy Access</h4>
                  <p className="text-xs text-slate-500">Share data instantly with doctors via mobile app.</p>
                </CardContent>
              </Card>
            </div>

            {/* Timeline */}
            <Card className="shadow-md border-slate-200/60 h-full">
              <CardHeader className="bg-slate-50/50 border-b">
                <CardTitle className="text-lg">Digital Health Timeline</CardTitle>
                <CardDescription>Encounters and screenings linked to this ABHA</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {screenings.length === 0 ? (
                  <div className="text-center p-12 border-2 border-dashed rounded-xl bg-slate-50/50">
                    <Clock className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500 font-medium">No linked records found.</p>
                  </div>
                ) : (
                  <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[11px] before:h-full before:w-[2px] before:bg-slate-200">
                    {screenings.map((screening) => (
                      <div key={screening.id} className="relative pl-8">
                        <div className="absolute left-0 top-1.5 bg-white rounded-full p-0.5 border-2 border-teal-500 z-10">
                          <CheckCircle2 className="h-4 w-4 text-teal-500" />
                        </div>
                        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                            <div className="flex items-center text-sm font-medium text-slate-600 gap-2 bg-slate-50 px-3 py-1.5 rounded-lg">
                              <Clock className="h-4 w-4 text-teal-600" />
                              {new Date(screening.createdAt).toLocaleDateString('en-US', { 
                                year: 'numeric', month: 'long', day: 'numeric'
                              })}
                            </div>
                            {getUrgencyBadge(screening.urgency)}
                          </div>
                          
                          <div className="space-y-3">
                            <div className="flex items-center justify-between bg-slate-50/80 p-3 rounded-lg border border-slate-100">
                              <span className="text-sm font-semibold text-slate-700">Calculated Risk Score</span>
                              <span className="text-lg font-bold text-teal-700">{screening.riskScore}/100</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {screening.symptoms.map(sym => (
                                <Badge key={sym} variant="outline" className="text-xs bg-white text-slate-600 border-slate-200">
                                  {sym}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
