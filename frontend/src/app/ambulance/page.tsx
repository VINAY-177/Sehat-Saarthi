"use client";

import { useState } from "react";
import { Ambulance, AmbulanceStatus, Role } from "@/lib/types";
import { useStore } from "@/lib/store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import AmbulanceMapWrapper from "@/components/ambulance-map-wrapper";
import { Siren, MapPin, Activity, Navigation } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Ambulance fleet across Delhi/NCR
const initialAmbulances: Ambulance[] = [
  { id: "amb-101", vehicleNo: "DL-01-EA-1081 (ALS Unit - AIIMS)", lat: 28.5672, lng: 77.2100, status: AmbulanceStatus.AVAILABLE },
  { id: "amb-102", vehicleNo: "DL-02-EA-1082 (ICU Mobile - Safdarjung)", lat: 28.5700, lng: 77.2070, status: AmbulanceStatus.AVAILABLE },
  { id: "amb-103", vehicleNo: "DL-03-EA-1083 (BLS Unit - Max Saket)", lat: 28.5280, lng: 77.2120, status: AmbulanceStatus.DISPATCHED },
  { id: "amb-104", vehicleNo: "DL-04-EA-1084 (Cardiac Response - Fortis Okhla)", lat: 28.5600, lng: 77.2800, status: AmbulanceStatus.AVAILABLE },
];

export default function AmbulancePage() {
  const { role } = useStore();
  const [ambulances, setAmbulances] = useState<Ambulance[]>(initialAmbulances);

  const handleDispatch = (id: string) => {
    setAmbulances(prev => prev.map(amb => 
      amb.id === id ? { ...amb, status: AmbulanceStatus.DISPATCHED } : amb
    ));
    toast.success("Ambulance Dispatched successfully.");
  };

  const getStatusBadge = (status: AmbulanceStatus) => {
    switch (status) {
      case AmbulanceStatus.AVAILABLE:
        return <Badge className="bg-emerald-500 hover:bg-emerald-600 border-none">Available</Badge>;
      case AmbulanceStatus.DISPATCHED:
        return <Badge className="bg-amber-500 text-white hover:bg-amber-600 border-none">Dispatched</Badge>;
      case AmbulanceStatus.EN_ROUTE:
        return <Badge className="bg-red-500 hover:bg-red-600 border-none">En Route</Badge>;
    }
  };

  const getBorderColor = (status: AmbulanceStatus) => {
    switch (status) {
      case AmbulanceStatus.AVAILABLE: return "border-l-emerald-500";
      case AmbulanceStatus.DISPATCHED: return "border-l-amber-500";
      case AmbulanceStatus.EN_ROUTE: return "border-l-red-500";
      default: return "border-l-border";
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-red-500 to-rose-600 text-white rounded-2xl shadow-sm">
            <Siren className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900">Emergency Ambulance Dispatch</h1>
            <p className="text-xs text-slate-500 font-medium">
              National 108 Emergency Response network &amp; live GPS fleet telemetry.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 font-bold px-3 py-1 text-xs gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            108 Response Unit Active
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Dispatch Request & Logs (4.5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="border border-slate-200/80 shadow-sm rounded-3xl overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 pb-3.5 pt-4 px-5 border-b border-slate-100">
              <CardTitle className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <Activity className="h-4 w-4 text-teal-600" />
                Request Emergency Unit
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-3.5">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700">Pickup Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input placeholder="Enter patient address / landmark..." className="pl-9 h-10 rounded-xl border-slate-200" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700">Emergency Type</Label>
                <Input placeholder="e.g. Cardiac Arrest, Trauma, Maternal..." className="h-10 rounded-xl border-slate-200" />
              </div>
              <Button className="w-full h-11 text-xs font-bold bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white shadow-sm rounded-xl">
                Locate Nearest 108 Ambulance
              </Button>
            </CardContent>
          </Card>

          <Card className="border border-slate-200/80 shadow-sm rounded-3xl overflow-hidden bg-white">
            <CardHeader className="py-3.5 px-5 border-b border-slate-100 bg-slate-50/50">
              <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Navigation className="h-4 w-4 text-slate-500" />
                Live Dispatch Log
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="max-h-[220px] overflow-y-auto pr-1">
                {ambulances.length === 0 ? (
                  <div className="text-center py-6 text-slate-400 text-xs font-medium">
                    No active dispatches.
                  </div>
                ) : (
                  <div className="space-y-2.5 relative before:absolute before:inset-0 before:left-3 before:h-full before:w-0.5 before:bg-slate-200">
                    {ambulances.map((amb, idx) => (
                      <div key={idx} className="relative pl-7 text-xs">
                        <div className="absolute left-[9px] top-2 h-2.5 w-2.5 rounded-full bg-teal-500 ring-4 ring-white" />
                        <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100">
                          <p className="font-bold text-slate-900">{amb.vehicleNo}</p>
                          <p className="text-[11px] text-slate-500 mt-0.5 font-medium">{amb.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Fleet Grid & Map (7.5 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ambulances.map(amb => (
              <Card 
                key={amb.id} 
                className={`border-l-4 ${getBorderColor(amb.status)} shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group`}
              >
                <CardHeader className="pb-3 bg-slate-50/40 group-hover:bg-slate-50/80 transition-colors">
                  <div className="flex justify-between items-center mb-2">
                    <Badge variant="outline" className="text-[10px] font-bold text-teal-700 bg-teal-50/60 border-teal-200">
                      {amb.vehicleNo.includes("ALS") ? "Advanced Life Support (ALS)" : "Basic Life Support (BLS)"}
                    </Badge>
                    {getStatusBadge(amb.status)}
                  </div>
                  <CardTitle className="text-base font-bold text-slate-800 leading-snug">
                    {amb.vehicleNo}
                  </CardTitle>
                </CardHeader>
                <CardContent className="py-4">
                  <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 p-2 rounded-md">
                    <MapPin className="h-4 w-4 text-slate-400" />
                    <span>Lat: {amb.lat.toFixed(4)}, Lng: {amb.lng.toFixed(4)}</span>
                  </div>
                </CardContent>
                {role === Role.HOSPITAL_STAFF && amb.status === AmbulanceStatus.AVAILABLE && (
                  <CardFooter className="pt-0 pb-4 border-t border-dashed mt-4 pt-4">
                    <Button 
                      className="w-full bg-slate-900 hover:bg-teal-700 text-white transition-colors" 
                      onClick={() => handleDispatch(amb.id)}
                    >
                      Dispatch Now
                    </Button>
                  </CardFooter>
                )}
              </Card>
            ))}
            {ambulances.length === 0 && (
              <div className="col-span-2 text-center py-12 border-2 border-dashed rounded-xl text-slate-400 bg-slate-50">
                <Siren className="h-8 w-8 mx-auto mb-3 opacity-20" />
                No ambulances registered in the fleet yet.
              </div>
            )}
          </div>

          <Card className="shadow-md border-slate-200/60 overflow-hidden">
            <CardHeader className="bg-slate-50/80 border-b">
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5 text-teal-600" />
                Live Fleet Tracking
              </CardTitle>
              <CardDescription>Real-time locations of active units</CardDescription>
            </CardHeader>
            <CardContent className="p-0 h-[400px]">
              <AmbulanceMapWrapper ambulances={ambulances} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
