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

export default function ChatbotPage() {
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
              <h1 className="text-2xl font-black text-slate-900">Sehat Saathi AI Booking Assistant</h1>
              <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-200 font-bold text-[10px]">
                v1.0 Voice Live
              </Badge>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Voice &amp; conversational assistant for booking doctor consultations across OPD clinics &amp; hospitals.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/scheduling">
            <Button variant="outline" size="sm" className="h-9 text-xs font-bold rounded-xl border-slate-200 hover:bg-slate-50 gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-teal-600" />
              All Appointments
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
                <CardTitle className="text-sm font-bold text-slate-900">How AI Booking Works</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-5 space-y-4 text-xs text-slate-600">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-bold shrink-0 text-xs">
                  1
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Speak or Type Symptoms</h4>
                  <p className="text-slate-500 mt-0.5">Use the microphone to speak naturally or tap quick reply options.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold shrink-0 text-xs">
                  2
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Smart Specialist Matching</h4>
                  <p className="text-slate-500 mt-0.5">AI suggests the right medical department (Cardiology, Pediatrics, etc.).</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold shrink-0 text-xs">
                  3
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Audio Readback &amp; Summary</h4>
                  <p className="text-slate-500 mt-0.5">Review patient details, hospital, and preferred slot before confirmation.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0 text-xs">
                  4
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Instant Digital Token</h4>
                  <p className="text-slate-500 mt-0.5">Receive appointment ID, SMS notification, and live OPD queue status.</p>
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
                  <h4 className="font-bold text-slate-900 text-xs">Voice Commands Supported</h4>
                  <p className="text-[11px] text-teal-800 font-medium">Multilingual recognition enabled</p>
                </div>
              </div>

              <div className="space-y-1.5 pt-1 text-[11px] text-slate-600 font-medium">
                <p className="p-2 rounded-xl bg-white border border-teal-100/80">
                  🗣️ &quot;Book an appointment with a cardiologist tomorrow morning&quot;
                </p>
                <p className="p-2 rounded-xl bg-white border border-teal-100/80">
                  🗣️ &quot;I have severe fever and headache for 2 days in New Delhi&quot;
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Emergency Helpline */}
          <Card className="shadow-sm border-red-200 rounded-3xl overflow-hidden bg-red-50/40">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-extrabold text-red-600 tracking-wider">Critical Emergency</span>
                <p className="text-xs font-bold text-slate-900">Immediate Ambulance Needed?</p>
              </div>
              <a href="tel:108">
                <Button size="sm" className="h-9 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs shadow-sm">
                  <PhoneCall className="w-3.5 h-3.5 mr-1" />
                  Call 108
                </Button>
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
