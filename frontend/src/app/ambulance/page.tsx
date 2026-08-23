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
    <div className="space-y-8 max-w-6xl mx-auto pb-10">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-white border shadow-sm p-8">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-red-500 to-rose-600" />
        <div className="flex items-center gap-4">
          <div className="bg-red-50 p-3 rounded-xl text-red-500 shadow-sm border border-red-100">
            <Siren size={32} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Emergency Ambulance Dispatch</h1>
            <p className="text-slate-500 mt-1">Integrated 108 Emergency Response Fleet Management</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Fleet Status & Form Column */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="shadow-md hover:shadow-lg transition-all duration-300 border-slate-200/60 overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-teal-500 to-emerald-500" />
            <CardHeader className="bg-slate-50/50 pb-4 border-b">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Activity className="h-5 w-5 text-teal-600" />
                Request Emergency Unit
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label>Pickup Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input placeholder="Enter patient location..." className="pl-9" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Emergency Type</Label>
                <Input placeholder="e.g. Cardiac Arrest, Trauma..." />
              </div>
              <Button className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white shadow-md">
                Find Nearest Ambulance
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-md border-slate-200/60">
            <CardHeader className="pb-3 border-b bg-slate-50/50">
              <CardTitle className="text-lg flex items-center gap-2">
                <Navigation className="h-5 w-5 text-slate-500" />
                Dispatch Log
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-[300px] overflow-y-auto p-4">
                {ambulances.length === 0 ? (
                  <div className="text-center py-6 text-slate-400 text-sm">
                    No recent dispatches.
                  </div>
                ) : (
                  <div className="space-y-4 relative before:absolute before:inset-0 before:ml-4 before:h-full before:w-0.5 before:bg-slate-200">
                    {ambulances.map((amb, idx) => (
                      <div key={idx} className="relative pl-10">
                        <div className="absolute left-[11px] top-1.5 h-3 w-3 rounded-full bg-teal-500 ring-4 ring-white" />
                        <div className="bg-slate-50 rounded p-3 text-sm border border-slate-100">
                          <p className="font-medium text-slate-900">{amb.vehicleNo}</p>
                          <p className="text-slate-500 mt-0.5">{amb.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Fleet Grid & Map Column */}
        <div className="lg:col-span-2 space-y-6">
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
