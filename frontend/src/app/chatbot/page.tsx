"use client";

import React from "react";
import { BookingChatbot } from "@/components/booking-chatbot";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Bot, Sparkles, Mic, Calendar, PhoneCall 
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";

export default function ChatbotPage() {
  const { t, language } = useStore();
  const isHindi = language === "hi";

  const TEN_STEPS = [
    { num: 1, titleEn: "Name", titleHi: "नाम", descEn: "Patient's full name", descHi: "मरीज का पूरा नाम" },
    { num: 2, titleEn: "Phone", titleHi: "फोन नंबर", descEn: "10-digit mobile number", descHi: "10 अंकों का मोबाइल" },
    { num: 3, titleEn: "Symptoms", titleHi: "लक्षण", descEn: "Reported health complaints", descHi: "स्वास्थ्य संबंधी परेशानी" },
    { num: 4, titleEn: "Duration", titleHi: "अवधि", descEn: "How long symptoms lasted", descHi: "लक्षणों का समयकाल" },
    { num: 5, titleEn: "Hospital", titleHi: "अस्पताल", descEn: "Preferred Delhi-NCR facility", descHi: "दिल्ली-एनसीआर अस्पताल" },
    { num: 6, titleEn: "Suggestion", titleHi: "एआई सुझाव", descEn: "Clinical triage & advice", descHi: "क्लिनिकल ट्रायज व सलाह" },
    { num: 7, titleEn: "Doctor Selection", titleHi: "डॉक्टर चयन", descEn: "Specialist clinician choice", descHi: "विशेषज्ञ डॉक्टर का चयन" },
    { num: 8, titleEn: "Timing", titleHi: "समय व तारीख", descEn: "Preferred date & time slot", descHi: "तारीख व समय स्लॉट" },
    { num: 9, titleEn: "Doctor Availability", titleHi: "डॉक्टर उपलब्धता", descEn: "Live schedule verification", descHi: "लाइव शेड्यूल सत्यापन" },
    { num: 10, titleEn: "Confirm Appointment", titleHi: "अपॉइंटमेंट पुष्टि", descEn: "OPD token generation", descHi: "ओपीडी टोकन प्राप्ति" },
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
              <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-200 font-bold text-[10px]">
                {isHindi ? "10-चरणीय वॉयस लाइव" : "10-Step Voice Live"}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              {isHindi
                ? "ओपीडी क्लीनिक और अस्पतालों में डॉक्टर परामर्श बुक करने के लिए 10-चरणीय वॉयस एवं चैट सहायक।"
                : "10-step intelligent voice & conversational assistant for booking doctor consultations across Delhi-NCR."}
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

        {/* Right Column - Features & 10-Step Guide (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="shadow-sm border-slate-200/80 rounded-3xl overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-3.5 px-5">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-teal-600" />
                <CardTitle className="text-sm font-bold text-slate-900">
                  {isHindi ? "10-चरणीय बुकिंग प्रवाह" : "10-Step Booking Workflow"}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-2.5 max-h-[380px] overflow-y-auto scrollbar-hide text-xs text-slate-600">
              {TEN_STEPS.map((s) => (
                <div key={s.num} className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-slate-50 transition-colors border border-slate-100/80">
                  <div className="w-5 h-5 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-black shrink-0 text-[10px]">
                    {s.num}
                  </div>
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

          {/* Voice Command Tips */}
          <Card className="shadow-sm border-teal-200/80 rounded-3xl overflow-hidden bg-gradient-to-br from-teal-50/60 to-emerald-50/30">
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-teal-600 text-white rounded-xl shadow-sm">
                  <Mic className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">
                    {isHindi ? "वॉयस कमांड समर्थित" : "Voice Commands Supported"}
                  </h4>
                  <p className="text-[11px] text-teal-800 font-medium">
                    {isHindi ? "हिंदी और अंग्रेजी बहुभाषी पहचान" : "Multilingual recognition enabled"}
                  </p>
                </div>
              </div>

              <div className="space-y-1.5 pt-1 text-[11px] text-slate-600 font-medium">
                <p className="p-2 rounded-xl bg-white border border-teal-100/80">
                  🗣️ {isHindi ? "कल सुबह हृदय रोग विशेषज्ञ से परामर्श बुक करें" : `"Book an appointment with a cardiologist tomorrow morning"`}
                </p>
                <p className="p-2 rounded-xl bg-white border border-teal-100/80">
                  🗣️ {isHindi ? "मुझे 2 दिनों से तेज बुखार और सिरदर्द है" : `"I have severe fever and headache for 2 days in New Delhi"`}
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
                  {isHindi ? "तत्काल एम्बुलेंस की आवश्यकता है?" : "Immediate Ambulance Needed?"}
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
