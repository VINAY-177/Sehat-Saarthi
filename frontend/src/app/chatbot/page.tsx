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
                {isHindi ? "v1.0 वॉयस लाइव" : "v1.0 Voice Live"}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              {isHindi
                ? "ओपीडी क्लीनिक और अस्पतालों में डॉक्टर परामर्श बुक करने के लिए वॉयस एवं चैट सहायक।"
                : "Voice & conversational assistant for booking doctor consultations across OPD clinics & hospitals."}
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
          <Card className="shadow-sm border-slate-200/80 rounded-3xl overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-3.5 px-5">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-teal-600" />
                <CardTitle className="text-sm font-bold text-slate-900">
                  {isHindi ? "AI बुकिंग कैसे काम करता है" : "How AI Booking Works"}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-5 space-y-4 text-xs text-slate-600">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-bold shrink-0 text-xs">
                  1
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">
                    {isHindi ? "लक्षण बोलें या लिखें" : "Speak or Type Symptoms"}
                  </h4>
                  <p className="text-slate-500 mt-0.5">
                    {isHindi ? "स्वाभाविक रूप से बोलने के लिए माइक का उपयोग करें या त्वरित उत्तर चुनें।" : "Use the microphone to speak naturally or tap quick reply options."}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold shrink-0 text-xs">
                  2
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">
                    {isHindi ? "स्मार्ट विशेषज्ञ डॉक्टर मिलान" : "Smart Specialist Matching"}
                  </h4>
                  <p className="text-slate-500 mt-0.5">
                    {isHindi ? "AI सही चिकित्सा विभाग (हृदय रोग, बाल रोग आदि) सुझाता है।" : "AI suggests the right medical department (Cardiology, Pediatrics, etc.)."}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold shrink-0 text-xs">
                  3
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">
                    {isHindi ? "ऑडियो वाचन एवं सारांश" : "Audio Readback & Summary"}
                  </h4>
                  <p className="text-slate-500 mt-0.5">
                    {isHindi ? "पुष्टि करने से पहले मरीज के विवरण, अस्पताल और समय स्लॉट की समीक्षा करें।" : "Review patient details, hospital, and preferred slot before confirmation."}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0 text-xs">
                  4
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">
                    {isHindi ? "तत्काल डिजिटल टोकन" : "Instant Digital Token"}
                  </h4>
                  <p className="text-slate-500 mt-0.5">
                    {isHindi ? "अपॉइंटमेंट आईडी और लाइव ओपीडी कतार स्थिति प्राप्त करें।" : "Receive appointment ID, SMS notification, and live OPD queue status."}
                  </p>
                </div>
              </div>
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
