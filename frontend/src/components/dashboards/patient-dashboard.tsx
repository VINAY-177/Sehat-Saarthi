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
      {/* Ambient Healthcare Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-top bg-no-repeat opacity-[0.14] pointer-events-none -z-10 mix-blend-multiply"
        style={{ backgroundImage: "url('/patient-bg.jpg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-teal-50/50 via-background/80 to-background pointer-events-none -z-10" />

      <div className="relative space-y-8 max-w-5xl mx-auto pb-10 z-10">
        {/* 1. Personalized Header Section */}
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between mt-4">
        <div className="space-y-1.5">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            {greeting}, {currentUser?.name || (language === "hi" ? "नागरिक" : "Citizen")}!
          </h1>
          <p className="text-muted-foreground text-lg">
            {t("companionReady")}
          </p>
        </div>
        <Link href="/emergency" className="inline-block shrink-0">
          <Button 
            size="lg" 
            className="rounded-2xl font-bold bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/25 transition-all flex items-center gap-2.5 text-base px-6 h-13"
          >
            <Siren className="h-5 w-5 animate-pulse" />
            {t("emergency108")}
          </Button>
        </Link>
      </div>

      {/* Voice & Chat AI Booking Assistant Promo */}
      <Link href="/chatbot" className="block group">
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden border border-blue-500/20">
          <div className="absolute -right-6 -bottom-6 opacity-10">
            <Bot className="w-44 h-44 text-white" />
          </div>
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="p-3.5 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-2xl text-slate-950 font-black shadow-lg shrink-0 group-hover:scale-105 transition-transform">
                <Bot className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-teal-400">
                    {language === "hi" ? "सेहत साथी एआई" : "SEHAT SAATHI AI"}
                  </span>
                  <Badge className="bg-teal-400/20 text-teal-300 border-teal-400/30 text-[10px] font-bold">{t("voiceAndChat")}</Badge>
                </div>
                <h3 className="text-xl font-black text-white">{t("bookDoctor60Sec")}</h3>
                <p className="text-xs text-slate-300 max-w-xl">
                  {language === "hi"
                    ? "अपने लक्षणों को सही विशेषज्ञ से मिलाने और तुरंत ओपीडी टोकन प्राप्त करने के लिए सेहत साथी से बात करें या चैट करें।"
                    : "Talk or chat with Sehat Saathi to match your symptoms with the right specialist and get instant OPD tokens."}
                </p>
              </div>
            </div>

            <Button className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-xs h-11 px-5 rounded-2xl shadow-md gap-1.5 shrink-0 group-hover:translate-x-0.5 transition-transform">
              <Mic className="w-4 h-4 text-slate-950" />
              {t("bookWithAi")}
              <ArrowRight className="w-4 h-4 ml-0.5" />
            </Button>
          </div>
        </div>
      </Link>

      {/* 3. 4-Portal Service Command Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Link href="/hospitals" className="block group">
          <Card className="h-full transition-all duration-300 hover:scale-[1.02] hover:shadow-lg cursor-pointer border-transparent bg-teal-50/80 dark:bg-teal-950/20 hover:border-teal-200">
            <CardContent className="p-6 flex flex-col items-start space-y-4">
              <div className="p-3.5 bg-teal-100 dark:bg-teal-900/50 rounded-2xl group-hover:bg-teal-200 dark:group-hover:bg-teal-800/60 transition-colors">
                <Building2 className="h-8 w-8 text-teal-700 dark:text-teal-400" />
              </div>
              <div>
                <h3 className="font-bold text-teal-950 dark:text-teal-100 text-lg mb-1">{t("findHospitals")}</h3>
                <p className="text-sm text-teal-800/80 dark:text-teal-300/70 leading-snug">
                  {language === "hi" ? "नजदीकी सुविधाएं और लाइव बेड स्थिति" : "Nearby facilities & live bed status"}
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/emergency" className="block group">
          <Card className="h-full transition-all duration-300 hover:scale-[1.02] hover:shadow-lg cursor-pointer border-transparent bg-red-50/80 dark:bg-red-950/20 hover:border-red-200">
            <CardContent className="p-6 flex flex-col items-start space-y-4">
              <div className="p-3.5 bg-red-100 dark:bg-red-900/50 rounded-2xl group-hover:bg-red-200 dark:group-hover:bg-red-800/60 transition-colors">
                <Siren className="h-8 w-8 text-red-700 dark:text-red-400" />
              </div>
              <div>
                <h3 className="font-bold text-red-950 dark:text-red-100 text-lg mb-1">{t("emergency108")}</h3>
                <p className="text-sm text-red-800/80 dark:text-red-300/70 leading-snug">
                  {language === "hi" ? "आपातकालीन एम्बुलेंस अनुरोध करें" : "Request ambulance dispatch now"}
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/assess" className="block group">
          <Card className="h-full transition-all duration-300 hover:scale-[1.02] hover:shadow-lg cursor-pointer border-transparent bg-blue-50/80 dark:bg-blue-950/20 hover:border-blue-200">
            <CardContent className="p-6 flex flex-col items-start space-y-4">
              <div className="p-3.5 bg-blue-100 dark:bg-blue-900/50 rounded-2xl group-hover:bg-blue-200 dark:group-hover:bg-blue-800/60 transition-colors">
                <Activity className="h-8 w-8 text-blue-700 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-bold text-blue-950 dark:text-blue-100 text-lg mb-1">{t("riskAssessment")}</h3>
                <p className="text-sm text-blue-800/80 dark:text-blue-300/70 leading-snug">
                  {language === "hi" ? "AI-आधारित क्लिनिकल जोखिम जांच" : "AI-powered clinical risk assessment"}
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/schemes" className="block group">
          <Card className="h-full transition-all duration-300 hover:scale-[1.02] hover:shadow-lg cursor-pointer border-transparent bg-amber-50/80 dark:bg-amber-950/20 hover:border-amber-200">
            <CardContent className="p-6 flex flex-col items-start space-y-4">
              <div className="p-3.5 bg-amber-100 dark:bg-amber-900/50 rounded-2xl group-hover:bg-amber-200 dark:group-hover:bg-amber-800/60 transition-colors">
                <ShieldCheck className="h-8 w-8 text-amber-700 dark:text-amber-400" />
              </div>
              <div>
                <h3 className="font-bold text-amber-950 dark:text-amber-100 text-lg mb-1">{t("govSchemes")}</h3>
                <p className="text-sm text-amber-800/80 dark:text-amber-300/70 leading-snug">
                  {language === "hi" ? "पीएम-जय एवं राज्य योजना पात्रता" : "PM-JAY & state scheme eligibility"}
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* 4. Bottom Split Layout: Left Info & Right Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (7 cols): Nearby Hospitals & Health Tips */}
        <div className="lg:col-span-7 space-y-6">
          {/* Nearby Hospitals Preview */}
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <h2 className="text-xl font-bold tracking-tight text-slate-900">{t("nearbyHospitals")}</h2>
              <Link href="/hospitals">
                <Button variant="ghost" size="sm" className="text-teal-700 hover:bg-teal-50 font-bold text-xs flex items-center gap-1">
                  {t("viewAll")} <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            
            {facilities.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {facilities.slice(0, 4).map((facility) => {
                  const availableBeds = (facility.generalBeds - facility.generalBedsUsed) + (facility.icuBeds - facility.icuBedsUsed);
                  return (
                    <Card key={facility.id} className="overflow-hidden hover:shadow-md transition-shadow rounded-2xl border-slate-200/80 bg-white">
                      <CardContent className="p-4 space-y-3">
                        <div className="space-y-1">
                          <h3 className="font-bold text-sm leading-tight text-slate-900 line-clamp-1">{facility.name}</h3>
                          <Badge variant="secondary" className="font-bold text-[10px] bg-teal-50 text-teal-800 border-teal-200">
                            {facility.type}
                          </Badge>
                        </div>
                        
                        <div className="space-y-1.5 text-xs text-slate-500">
                          <div className="flex items-start gap-1.5">
                            <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5 text-slate-400" /> 
                            <span className="line-clamp-1">{facility.district}, {facility.state}</span>
                          </div>
                        </div>
                        
                        <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs">
                          <span className="text-slate-500">{t("bedsAvailable")}:</span>
                          <span className="font-extrabold text-emerald-700">{availableBeds}</span>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card className="bg-slate-50/50 border-dashed rounded-2xl">
                <CardContent className="p-6 flex flex-col items-center text-center space-y-2 text-slate-400">
                  <Building2 className="h-8 w-8 opacity-30" />
                  <p className="text-xs">
                    {language === "hi" ? "नेटवर्क में अभी कोई अस्पताल पंजीकृत नहीं है।" : "No hospitals registered in the network yet."}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Health Tip Card */}
          <Card className="bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200/80 rounded-3xl overflow-hidden relative shadow-sm">
            <CardContent className="p-5 flex items-start gap-4">
              <div className="bg-teal-600 p-2.5 rounded-2xl shrink-0 text-white shadow-sm">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-extrabold text-teal-950">{t("dailyHealthTip")}</h4>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
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
