"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Siren,
  Phone,
  Building2,
  ChevronDown,
  ChevronUp,
  HeartPulse,
  Shield,
  Flame,
  Droplets,
  Brain,
  ArrowLeft,
} from "lucide-react";

interface HospitalDb {
  id: string;
  name: string;
  type: string;
  district: string;
  location: string;
  phone?: string;
  totalBeds: number;
  availableBeds: number;
  icuBeds: number;
  availableIcu: number;
  specialties: string;
}

const EMERGENCY_CONTACTS = [
  { name: "Ambulance (108)", number: "108", color: "bg-red-600", icon: Siren },
  { name: "Unified Emergency (112)", number: "112", color: "bg-orange-600", icon: Phone },
  { name: "Maternity Helpline (102)", number: "102", color: "bg-pink-600", icon: HeartPulse },
  { name: "Police (100)", number: "100", color: "bg-blue-700", icon: Shield },
  { name: "Fire Brigade (101)", number: "101", color: "bg-amber-600", icon: Flame },
];

const FIRST_AID_TIPS = [
  {
    title: "Heart Attack",
    icon: HeartPulse,
    color: "text-red-600 bg-red-50",
    steps: [
      "Call 108 immediately",
      "Have the person sit down and rest in a comfortable position",
      "Loosen any tight clothing",
      "Give aspirin (300mg) if available and the person is not allergic",
      "If the person becomes unconscious, begin CPR",
    ],
  },
  {
    title: "Severe Bleeding",
    icon: Droplets,
    color: "text-rose-600 bg-rose-50",
    steps: [
      "Apply firm, direct pressure to the wound with a clean cloth",
      "Do NOT remove the cloth if blood soaks through — add more layers",
      "Elevate the injured area above heart level if possible",
      "Apply a tourniquet only if bleeding is life-threatening and cannot be controlled",
      "Call 108 and keep the person calm",
    ],
  },
  {
    title: "Burns",
    icon: Flame,
    color: "text-orange-600 bg-orange-50",
    steps: [
      "Cool the burn under cool running water for at least 20 minutes",
      "Do NOT use ice, butter, or toothpaste",
      "Remove clothing and jewellery near the burn (unless stuck to skin)",
      "Cover loosely with a clean, non-stick dressing",
      "For severe burns, call 108 immediately",
    ],
  },
  {
    title: "Stroke (FAST Method)",
    icon: Brain,
    color: "text-purple-600 bg-purple-50",
    steps: [
      "F — Face: Ask the person to smile. Does one side droop?",
      "A — Arms: Ask them to raise both arms. Does one drift downward?",
      "S — Speech: Ask them to repeat a simple phrase. Is speech slurred?",
      "T — Time: If any of these signs, call 108 IMMEDIATELY",
      "Note the time symptoms began — this is critical for treatment",
    ],
  },
];

export default function EmergencyPage() {
  const [hospitals, setHospitals] = useState<HospitalDb[]>([]);
  const [expandedTip, setExpandedTip] = useState<number | null>(null);

  useEffect(() => {
    const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    fetch(`${API}/api/hospitals`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        if (Array.isArray(data)) setHospitals(data);
      })
      .catch(() => {});
  }, []);

  // Sort hospitals by available ICU beds descending
  const nearbyHospitals = [...hospitals]
    .sort((a, b) => b.availableIcu - a.availableIcu)
    .slice(0, 6);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Red Emergency Banner */}
      <div className="bg-gradient-to-r from-red-700 via-red-600 to-red-700 text-white">
        <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
          <div className="flex items-center gap-2 mb-6">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-white/80 hover:text-white hover:bg-white/10 -ml-2">
                <ArrowLeft className="h-4 w-4 mr-1" /> Back
              </Button>
            </Link>
          </div>

          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-4 bg-white/15 rounded-full">
                <Siren className="h-12 w-12 animate-pulse" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              Emergency SOS
            </h1>
            <p className="text-red-100 max-w-md mx-auto">
              No login required. Get immediate access to emergency services, ambulance dispatch, and nearby hospitals.
            </p>

            {/* Primary 108 Call Button */}
            <a href="tel:108" className="inline-block mt-4">
              <Button
                size="lg"
                className="rounded-full font-black bg-white text-red-700 hover:bg-red-50 shadow-2xl shadow-red-900/30 text-lg px-10 h-16 gap-3 transition-all hover:scale-105"
              >
                <Phone className="h-6 w-6" />
                Call 108 — Ambulance
              </Button>
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Emergency Contact Grid */}
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-4">Emergency Helpline Numbers</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {EMERGENCY_CONTACTS.map((contact) => {
              const Icon = contact.icon;
              return (
                <a key={contact.number} href={`tel:${contact.number}`} className="block group">
                  <Card className="h-full hover:shadow-md transition-all hover:scale-[1.02] cursor-pointer border-slate-200/80">
                    <CardContent className="p-4 text-center space-y-2">
                      <div className={`${contact.color} w-10 h-10 rounded-full flex items-center justify-center mx-auto text-white group-hover:scale-110 transition-transform`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="text-2xl font-black text-slate-900">{contact.number}</div>
                      <div className="text-xs text-slate-500 font-medium leading-tight">{contact.name}</div>
                    </CardContent>
                  </Card>
                </a>
              );
            })}
          </div>
        </div>

        {/* Nearby Hospitals with ER Availability */}
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-4">Nearby Emergency Hospitals</h2>
          {nearbyHospitals.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {nearbyHospitals.map((h) => (
                <Card key={h.id} className="overflow-hidden hover:shadow-md transition-shadow border-slate-200/80">
                  <CardContent className="p-5 space-y-3">
                    <div className="space-y-1">
                      <h3 className="font-bold text-sm text-slate-900 leading-tight">{h.name}</h3>
                      <Badge variant="secondary" className="text-[10px] font-bold bg-teal-50 text-teal-800 border-teal-200">
                        {h.type}
                      </Badge>
                    </div>

                    <div className="text-xs text-slate-500 space-y-1">
                      <div className="flex items-start gap-1.5">
                        <Building2 className="h-3.5 w-3.5 shrink-0 mt-0.5 text-slate-400" />
                        <span className="line-clamp-2">{h.location || `${h.district}`}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                      <div className="text-center p-2 bg-slate-50 rounded-lg">
                        <div className="text-lg font-black text-emerald-700">{h.availableBeds}</div>
                        <div className="text-[10px] text-slate-500 font-medium">General Beds</div>
                      </div>
                      <div className="text-center p-2 bg-red-50/50 rounded-lg">
                        <div className="text-lg font-black text-red-700">{h.availableIcu}</div>
                        <div className="text-[10px] text-slate-500 font-medium">ICU Beds</div>
                      </div>
                    </div>

                    {h.phone && (
                      <a href={`tel:${h.phone}`}>
                        <Button size="sm" variant="outline" className="w-full text-xs font-bold rounded-xl border-red-200 text-red-700 hover:bg-red-50 mt-1 gap-1.5">
                          <Phone className="h-3.5 w-3.5" />
                          {h.phone}
                        </Button>
                      </a>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-slate-50/50 border-dashed">
              <CardContent className="p-8 text-center text-slate-400 text-sm">
                <Building2 className="h-8 w-8 mx-auto mb-2 opacity-30" />
                Loading hospital data... Please ensure backend is running.
              </CardContent>
            </Card>
          )}
        </div>

        {/* First-Aid Quick Guide */}
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-4">Quick First-Aid Guide</h2>
          <div className="space-y-3">
            {FIRST_AID_TIPS.map((tip, idx) => {
              const Icon = tip.icon;
              const isExpanded = expandedTip === idx;
              return (
                <Card
                  key={idx}
                  className="overflow-hidden border-slate-200/80 cursor-pointer hover:shadow-sm transition-shadow"
                  onClick={() => setExpandedTip(isExpanded ? null : idx)}
                >
                  <CardContent className="p-0">
                    <div className="flex items-center justify-between p-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${tip.color}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <span className="font-bold text-slate-900">{tip.title}</span>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5 text-slate-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-slate-400" />
                      )}
                    </div>
                    {isExpanded && (
                      <div className="px-5 pb-4 border-t border-slate-100 pt-3">
                        <ol className="space-y-2">
                          {tip.steps.map((step, si) => (
                            <li key={si} className="flex items-start gap-2.5 text-sm text-slate-700">
                              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-slate-100 text-slate-600 text-xs font-bold flex items-center justify-center mt-0.5">
                                {si + 1}
                              </span>
                              {step}
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Back to Login */}
        <div className="text-center pt-4 pb-8">
          <Link href="/login">
            <Button variant="outline" className="rounded-xl h-11 px-6 gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to Login
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
