"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Siren,
  Building2,
  Activity,
  ShieldCheck,
  ChevronRight,
  MapPin,
  Sparkles,
  Bot,
  Mic,
  ArrowRight
} from "lucide-react";
import { Role } from "@/lib/types";
import { AppointmentCalendarWidget } from "@/components/appointment-calendar-widget";

export function PatientDashboard() {
  const { currentUser, facilities, t, language } = useStore();

  const currentHour = new Date().getHours();
  let greeting = t("goodEvening");
  if (currentHour >= 5 && currentHour < 12) {
    greeting = t("goodMorning");
  } else if (currentHour >= 12 && currentHour < 17) {
    greeting = t("goodAfternoon");
  } else if (currentHour >= 17 && currentHour < 22) {
    greeting = t("goodEvening");
  } else {
    greeting = t("goodNight");
  }

  return (
    <div className="relative min-h-[calc(100vh-5rem)] -m-4 sm:-m-6 p-4 sm:p-6 overflow-hidden">
      {/* Ultra-subtle Ambient Watermark */}
      <div 
        className="absolute inset-0 bg-cover bg-top bg-no-repeat opacity-[0.05] pointer-events-none -z-10 mix-blend-multiply"
        style={{ backgroundImage: "url('/patient-bg.jpg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50/40 via-background/90 to-background pointer-events-none -z-10" />

      <div className="relative space-y-8 max-w-5xl mx-auto pb-10 z-10">
        
        {/* 1. Header Section */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mt-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700">Citizen Health Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              {greeting}, {currentUser?.name || (language === "hi" ? "नागरिक" : "Citizen")}!
            </h1>
            <p className="text-slate-500 text-sm">
              {t("companionReady")}
            </p>
          </div>

          {/* Emergency 108 Action Trigger */}
          <Link href="/emergency" className="inline-block shrink-0">
            <Button 
              size="lg" 
              className="rounded-2xl font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/20 transition-all flex items-center gap-2 text-sm px-5 h-11"
            >
              <Siren className="h-4 w-4 animate-pulse" />
              {t("emergency108")}
            </Button>
          </Link>
        </div>

        {/* 2. Sehat Saathi Conversational AI Assistant Banner */}
        <Link href="/chatbot" className="block group">
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 rounded-3xl p-6 text-white shadow-md hover:shadow-lg transition-all duration-300 relative overflow-hidden border border-teal-500/20">
            <div className="absolute -right-6 -bottom-6 opacity-10">
              <Bot className="w-40 h-40 text-teal-300" />
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-teal-500/20 border border-teal-500/30 rounded-2xl text-teal-300 font-bold shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                  <Bot className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-teal-300">
                      {language === "hi" ? "सेहत साथी एआई" : "SEHAT SAATHI AI"}
                    </span>
                    <Badge className="bg-teal-400/20 text-teal-200 border-teal-400/30 text-[10px] font-bold py-0">
                      {t("voiceAndChat")}
                    </Badge>
                  </div>
                  <h3 className="text-lg font-bold text-white leading-snug">{t("bookDoctor60Sec")}</h3>
                  <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                    {language === "hi"
                      ? "अपने लक्षणों को सही विशेषज्ञ से मिलाने और तुरंत ओपीडी टोकन प्राप्त करने के लिए सेहत साथी से बात करें या चैट करें।"
                      : "Talk or chat with Sehat Saathi to match your symptoms with the right specialist and get instant OPD tokens."}
                  </p>
                </div>
              </div>

              <Button className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs h-10 px-4 rounded-xl shadow-xs gap-1.5 shrink-0 group-hover:translate-x-0.5 transition-transform">
                <Mic className="w-3.5 h-3.5 text-slate-950" />
                {t("bookWithAi")}
                <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
              </Button>
            </div>
          </div>
        </Link>

        {/* 3. 4-Portal Service Command Grid - Neutral White Cards with Accent Icons */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Find Hospitals */}
          <Link href="/hospitals" className="block group">
            <Card className="h-full bg-white border border-slate-200/80 rounded-2xl shadow-xs hover:shadow-md hover:border-teal-300 transition-all cursor-pointer">
              <CardContent className="p-5 flex flex-col items-start space-y-3">
                <div className="p-2.5 bg-teal-50 border border-teal-100 text-teal-700 rounded-xl group-hover:bg-teal-100 transition-colors">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm mb-0.5">{t("findHospitals")}</h3>
                  <p className="text-xs text-slate-500 leading-snug">
                    {language === "hi" ? "नजदीकी अस्पताल और लाइव बेड" : "Nearby facilities & live beds"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Emergency 108 */}
          <Link href="/emergency" className="block group">
            <Card className="h-full bg-white border border-slate-200/80 rounded-2xl shadow-xs hover:shadow-md hover:border-rose-300 transition-all cursor-pointer">
              <CardContent className="p-5 flex flex-col items-start space-y-3">
                <div className="p-2.5 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl group-hover:bg-rose-100 transition-colors">
                  <Siren className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm mb-0.5">{t("emergency108")}</h3>
                  <p className="text-xs text-slate-500 leading-snug">
                    {language === "hi" ? "तत्काल 108 एम्बुलेंस अनुरोध" : "Instant 108 ambulance dispatch"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Check Symptoms */}
          <Link href="/assess" className="block group">
            <Card className="h-full bg-white border border-slate-200/80 rounded-2xl shadow-xs hover:shadow-md hover:border-teal-300 transition-all cursor-pointer">
              <CardContent className="p-5 flex flex-col items-start space-y-3">
                <div className="p-2.5 bg-teal-50 border border-teal-100 text-teal-700 rounded-xl group-hover:bg-teal-100 transition-colors">
                  <Activity className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm mb-0.5">{t("riskAssessment")}</h3>
                  <p className="text-xs text-slate-500 leading-snug">
                    {language === "hi" ? "AI क्लिनिकल जोखिम जांच" : "AI clinical risk assessment"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Scheme Benefits */}
          <Link href="/schemes" className="block group">
            <Card className="h-full bg-white border border-slate-200/80 rounded-2xl shadow-xs hover:shadow-md hover:border-teal-300 transition-all cursor-pointer">
              <CardContent className="p-5 flex flex-col items-start space-y-3">
                <div className="p-2.5 bg-teal-50 border border-teal-100 text-teal-700 rounded-xl group-hover:bg-teal-100 transition-colors">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm mb-0.5">{t("govSchemes")}</h3>
                  <p className="text-xs text-slate-500 leading-snug">
                    {language === "hi" ? "PM-JAY व राज्य योजना पात्रता" : "PM-JAY & state health schemes"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* 4. Bottom Split Layout: Left Info & Right Calendar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column (7 cols): Nearby Facilities & Health Advice */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Nearby Hospitals Preview */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h2 className="text-base font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-teal-700" />
                  {t("nearbyHospitals")}
                </h2>
                <Link href="/hospitals">
                  <Button variant="ghost" size="sm" className="text-teal-700 hover:bg-teal-50 font-bold text-xs flex items-center gap-1 h-8 px-2">
                    {t("viewAll")} <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
              
              {facilities.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-3.5">
                  {facilities.slice(0, 4).map((facility) => {
                    const availableBeds = (facility.generalBeds - facility.generalBedsUsed) + (facility.icuBeds - facility.icuBedsUsed);
                    return (
                      <Card key={facility.id} className="bg-white border border-slate-200/80 rounded-2xl shadow-xs hover:shadow-sm transition-shadow">
                        <CardContent className="p-4 space-y-2.5">
                          <div className="space-y-1">
                            <h3 className="font-bold text-xs text-slate-900 line-clamp-1">{facility.name}</h3>
                            <Badge variant="outline" className="text-[10px] bg-slate-50 text-slate-600 border-slate-200">
                              {facility.type}
                            </Badge>
                          </div>
                          
                          <div className="flex items-start gap-1.5 text-xs text-slate-500">
                            <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5 text-slate-400" /> 
                            <span className="line-clamp-1">{facility.district}, {facility.state}</span>
                          </div>
                          
                          <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs">
                            <span className="text-slate-400 font-medium">{t("bedsAvailable")}:</span>
                            <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">
                              {availableBeds} Free
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <Card className="bg-white border border-dashed border-slate-200 rounded-2xl">
                  <CardContent className="p-6 flex flex-col items-center text-center space-y-2 text-slate-400">
                    <Building2 className="h-6 w-6 opacity-40" />
                    <p className="text-xs">
                      {language === "hi" ? "नेटवर्क में अभी कोई अस्पताल पंजीकृत नहीं है।" : "No hospitals registered in the network yet."}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Health Tip Card */}
            <Card className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
              <CardContent className="p-4 flex items-start gap-3.5">
                <div className="p-2 bg-teal-50 border border-teal-100 text-teal-700 rounded-xl shrink-0">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-slate-900">{t("dailyHealthTip")}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {t("healthTipText")}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column (5 cols): Appointments Calendar */}
          <div className="lg:col-span-5 space-y-6">
            <AppointmentCalendarWidget role={Role.PATIENT} userId={currentUser?.id} userName={currentUser?.name} />
          </div>
        </div>
      </div>
    </div>
  );
}
