"use client";

import React from "react";
import { BookingChatbot } from "@/components/booking-chatbot";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Bot, Sparkles, Mic, Calendar, PhoneCall, Compass, ShieldCheck
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";

export default function ChatbotPage() {
  const { t, language } = useStore();
  const isHindi = language === "hi";

  const WORKFLOW_HIGHLIGHTS = [
    { icon: "👤", titleEn: "Patient Verification", titleHi: "मरीज सत्यापन", descEn: "Name & mobile number validation", descHi: "नाम व मोबाइल सत्यापन" },
    { icon: "🩺", titleEn: "Symptom Assessment", titleHi: "लक्षण विश्लेषण", descEn: "Clinical triage & duration tracking", descHi: "क्लिनिकल ट्रायज व अवधि" },
    { icon: "📍", titleEn: "GPS Hospital Locator", titleHi: "जीपीएस अस्पताल खोज", descEn: "Finds closest Delhi-NCR facility", descHi: "निकटतम अस्पताल की दूरी" },
    { icon: "👨‍⚕️", titleEn: "Doctor & Time Slot", titleHi: "डॉक्टर व समय चयन", descEn: "Verified specialists & live slots", descHi: "सत्यापित डॉक्टर व स्लॉट" },
    { icon: "🎫", titleEn: "Digital OPD Token", titleHi: "डिजिटल ओपीडी टोकन", descEn: "Instant pass & queue sync", descHi: "तत्काल पर्ची व कतार सिंक" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16 animate-in fade-in duration-300">
      {/* Page Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-teal-600 to-emerald-600 text-white rounded-2xl shadow-sm">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900">{t("botTitle")}</h1>
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 font-bold text-[10px]">
                <ShieldCheck className="w-3 h-3 mr-1 text-emerald-600" />
                {isHindi ? "Gemini AI सत्यापित" : "Gemini AI Verified"}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              {isHindi
                ? "ओपीडी क्लीनिक और अस्पतालों में डॉक्टर परामर्श बुक करने के लिए जीपीएस-सक्षम वॉयस एवं चैट सहायक।"
                : "GPS-enabled voice & conversational AI assistant for booking specialist OPD consultations."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/scheduling">
            <Button variant="outline" size="sm" className="h-9 text-xs font-bold rounded-xl border-slate-200 hover:bg-slate-50 gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-teal-600" />
              {t("appointmentSchedule")}
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column - Main Interactive Chatbot (8 Cols) */}
        <div className="lg:col-span-8">
          <BookingChatbot />
        </div>

        {/* Right Column - Features & Quick Help (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Workflow Card */}
          <Card className="shadow-sm border-slate-200/80 rounded-3xl overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-3.5 px-5">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-teal-600" />
                <CardTitle className="text-sm font-bold text-slate-900">
                  {isHindi ? "स्मार्ट एआई क्षमताएं" : "Smart AI Capabilities"}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-2.5 text-xs text-slate-600">
              {WORKFLOW_HIGHLIGHTS.map((s, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-slate-50 transition-colors border border-slate-100/80">
                  <span className="text-base shrink-0">{s.icon}</span>
                  <div className="min-w-0">
                    <h4 className="font-bold text-slate-900 text-xs truncate">
                      {isHindi ? s.titleHi : s.titleEn}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                      {isHindi ? s.descHi : s.descEn}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* GPS Live Locator Highlight */}
          <Card className="shadow-sm border-emerald-200/80 rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-50/60 to-teal-50/40">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-600 text-white rounded-xl shadow-sm">
                  <Compass className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">
                    {isHindi ? "जीपीएस निकटतम अस्पताल ट्रैकर" : "GPS Nearest Hospital Tracker"}
                  </h4>
                  <p className="text-[11px] text-emerald-800 font-medium">
                    {isHindi ? "एक टैप में अपनी दूरी के अनुसार अस्पताल खोजें" : "Calculates exact km distance in 1-tap"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Voice Command Tips */}
          <Card className="shadow-sm border-teal-200/80 rounded-3xl overflow-hidden bg-gradient-to-br from-teal-50/60 to-emerald-50/30">
            <CardContent className="p-4 space-y-2.5">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-teal-600 text-white rounded-xl shadow-sm">
                  <Mic className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">
                    {isHindi ? "वॉयस व चैट बहुभाषी पहचान" : "Voice & Chat Multilingual"}
                  </h4>
                  <p className="text-[11px] text-teal-800 font-medium">
                    {isHindi ? "हिंदी, हिंग्लिश एवं अंग्रेजी समर्थित" : "Supports Hindi, Hinglish & English"}
                  </p>
                </div>
              </div>

              <div className="space-y-1.5 pt-1 text-[11px] text-slate-600 font-medium">
                <p className="p-2 rounded-xl bg-white border border-teal-100/80">
                  🗣️ {isHindi ? "कल सुबह एम्स में हृदय रोग डॉक्टर से मिलना है" : `"Book cardiologist consultation at AIIMS tomorrow"`}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Emergency Helpline */}
          <Card className="shadow-sm border-red-200 rounded-3xl overflow-hidden bg-red-50/40">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-extrabold text-red-600 tracking-wider">
                  {t("emergency108")}
                </span>
                <p className="text-xs font-bold text-slate-900">
                  {isHindi ? "तत्काल एम्बुलेंस सहायता" : "Immediate Ambulance 108"}
                </p>
              </div>
              <a href="tel:108">
                <Button size="sm" className="h-9 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs shadow-sm">
                  <PhoneCall className="w-3.5 h-3.5 mr-1" />
                  {isHindi ? "108 कॉल करें" : "Call 108"}
                </Button>
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
