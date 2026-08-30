"use client";

import { useState } from "react";
import { Ambulance, AmbulanceStatus, Role } from "@/lib/types";
import { useStore } from "@/lib/store";
import { Badge } from "@/components/ui/badge";
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
  const { role, language } = useStore();
  const isHindi = language === "hi";

  const [ambulances, setAmbulances] = useState<Ambulance[]>(initialAmbulances);

  const handleDispatch = (id: string) => {
    setAmbulances(prev => prev.map(amb => 
      amb.id === id ? { ...amb, status: AmbulanceStatus.DISPATCHED } : amb
    ));
    toast.success(isHindi ? "एम्बुलेंस सफलतापूर्वक रवाना की गई।" : "Ambulance Dispatched successfully.");
  };

  const getStatusBadge = (status: AmbulanceStatus) => {
    switch (status) {
      case AmbulanceStatus.AVAILABLE:
        return <Badge className="bg-emerald-500 hover:bg-emerald-600 border-none">{isHindi ? "उपलब्ध" : "Available"}</Badge>;
      case AmbulanceStatus.DISPATCHED:
        return <Badge className="bg-amber-500 text-white hover:bg-amber-600 border-none">{isHindi ? "रवाना" : "Dispatched"}</Badge>;
      case AmbulanceStatus.EN_ROUTE:
        return <Badge className="bg-red-500 hover:bg-red-600 border-none">{isHindi ? "रास्ते में" : "En Route"}</Badge>;
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
    <div className="max-w-7xl mx-auto space-y-6 pb-16 page-enter">
      {/* Page Header */}
      <div className="glass-card-auth p-6 sm:p-7 rounded-[28px] border border-white/80 shadow-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/92 backdrop-blur-2xl section-enter">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-gradient-to-br from-red-500 to-rose-600 text-white rounded-2xl shadow-md shadow-red-500/20">
            <Siren className="h-7 w-7 animate-pulse" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
              {isHindi ? "आपातकालीन एम्बुलेंस प्रेषण" : "Emergency Ambulance Dispatch"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-1">
              {isHindi
                ? "राष्ट्रीय 108 आपातकालीन प्रतिक्रिया नेटवर्क एवं लाइव जीपीएस बेड़ा ट्रैकिंग।"
                : "National 108 Emergency Response network & live GPS fleet telemetry."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-red-100/80 text-red-800 border-red-300 font-extrabold px-3 py-1 text-xs gap-1.5 shadow-2xs">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
            {isHindi ? "108 प्रतिक्रिया यूनिट सक्रिय" : "108 Response Unit Active"}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Dispatch Request & Logs (4.5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel border border-white/80 shadow-2xl rounded-[28px] overflow-hidden bg-white/92 backdrop-blur-2xl">
            <div className="bg-slate-50/80 pb-3.5 pt-4 px-5 border-b border-slate-200/80">
              <h2 className="flex items-center gap-2 text-sm font-black text-slate-900">
                <Activity className="h-4 w-4 text-teal-600" />
                {isHindi ? "आपातकालीन यूनिट का अनुरोध करें" : "Request Emergency Unit"}
              </h2>
            </div>
            <div className="p-5 space-y-3.5">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-800">{isHindi ? "पिकअप स्थान" : "Pickup Location"}</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder={isHindi ? "मरीज का पता / लैंडमार्क दर्ज करें..." : "Enter patient address / landmark..."}
                    className="pl-9 h-10 rounded-xl border-slate-200 bg-white font-medium text-xs"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-800">{isHindi ? "आपातकाल का प्रकार" : "Emergency Type"}</Label>
                <Input
                  placeholder={isHindi ? "जैसे: दिल का दौरा, दुर्घटना, प्रसव..." : "e.g. Cardiac Arrest, Trauma, Maternal..."}
                  className="h-10 rounded-xl border-slate-200 bg-white font-medium text-xs"
                />
              </div>
              <button type="button" className="btn-3d-emergency w-full h-11 text-xs font-black rounded-xl">
                {isHindi ? "निकटतम 108 एम्बुलेंस खोजें" : "Locate Nearest 108 Ambulance"}
              </button>
            </div>
          </div>

          <div className="glass-panel border border-white/80 shadow-xl rounded-[28px] overflow-hidden bg-white/92 backdrop-blur-2xl">
            <div className="py-3.5 px-5 border-b border-slate-200/80 bg-slate-50/80">
              <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Navigation className="h-4 w-4 text-slate-500" />
                {isHindi ? "लाइव प्रेषण लॉग" : "Live Dispatch Log"}
              </h2>
            </div>
            <div className="p-4">
              <div className="max-h-[220px] overflow-y-auto pr-1">
                {ambulances.length === 0 ? (
                  <div className="text-center py-6 text-slate-400 text-xs font-medium">
                    {isHindi ? "कोई सक्रिय प्रेषण नहीं।" : "No active dispatches."}
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
            </div>
          </div>
        </div>

        {/* Right Column: Fleet Grid & Map (7.5 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ambulances.map(amb => (
              <div 
                key={amb.id} 
                className={`glass-panel border-l-4 ${getBorderColor(amb.status)} border border-white/80 shadow-xl bg-white/92 backdrop-blur-2xl hover:shadow-2xl transition-all overflow-hidden group rounded-[24px]`}
              >
                <div className="p-4 bg-slate-50/80 border-b border-slate-200/80">
                  <div className="flex justify-between items-center mb-2">
                    <Badge variant="outline" className="text-[10px] font-extrabold text-teal-800 bg-teal-50 border-teal-200">
                      {amb.vehicleNo.includes("ALS")
                        ? isHindi
                          ? "एडवांस्ड लाइफ सपोर्ट (ALS)"
                          : "Advanced Life Support (ALS)"
                        : isHindi
                        ? "बेसिक लाइफ सपोर्ट (BLS)"
                        : "Basic Life Support (BLS)"}
                    </Badge>
                    {getStatusBadge(amb.status)}
                  </div>
                  <h3 className="text-sm font-black text-slate-900 leading-snug">
                    {amb.vehicleNo}
                  </h3>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-center gap-2 text-xs text-slate-700 font-semibold bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <MapPin className="h-4 w-4 text-teal-600 shrink-0" />
                    <span>Lat: {amb.lat.toFixed(4)}, Lng: {amb.lng.toFixed(4)}</span>
                  </div>

                  {role === Role.HOSPITAL_STAFF && amb.status === AmbulanceStatus.AVAILABLE && (
                    <button 
                      type="button"
                      className="btn-3d-primary w-full h-9 text-xs font-black rounded-xl" 
                      onClick={() => handleDispatch(amb.id)}
                    >
                      {isHindi ? "अभी रवाना करें" : "Dispatch Now"}
                    </button>
                  )}
                </div>
              </div>
            ))}
            {ambulances.length === 0 && (
              <div className="col-span-2 text-center py-12 glass-panel rounded-[24px] text-slate-500 bg-white/90 font-bold text-xs">
                <Siren className="h-8 w-8 mx-auto mb-3 opacity-20" />
                {isHindi ? "बेड़े में अभी कोई एम्बुलेंस पंजीकृत नहीं है।" : "No ambulances registered in the fleet yet."}
              </div>
            )}
          </div>

          <div className="glass-panel shadow-2xl border border-white/80 overflow-hidden rounded-[28px] bg-white/92 backdrop-blur-2xl">
            <div className="bg-slate-50/80 border-b border-slate-200/80 p-4 sm:p-5">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-teal-600" />
                {isHindi ? "लाइव बेड़ा ट्रैकिंग" : "Live Fleet Tracking"}
              </h3>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                {isHindi ? "सक्रिय प्रतिक्रिया यूनिटों की वास्तविक समय जीपीएस टेलीमेट्री" : "Real-time GPS telemetry of active response units"}
              </p>
            </div>
            <div className="p-0 h-[400px]">
              <AmbulanceMapWrapper ambulances={ambulances} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
