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
  HeartPulse,
  ChevronRight,
  MapPin,
  Sparkles
} from "lucide-react";
import { Role } from "@/lib/types";
import { AppointmentCalendarWidget } from "@/components/appointment-calendar-widget";

export function PatientDashboard() {
  const { currentUser, facilities } = useStore();

  const currentHour = new Date().getHours();
  let greeting = "Good Evening";
  if (currentHour >= 5 && currentHour < 12) {
    greeting = "Good Morning";
  } else if (currentHour >= 12 && currentHour < 17) {
    greeting = "Good Afternoon";
  } else if (currentHour >= 17 && currentHour < 22) {
    greeting = "Good Evening";
  } else {
    greeting = "Good Night";
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-10">
      {/* 1. Personalized Header Section */}
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between mt-4">
        <div className="space-y-1.5">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            {greeting}, {currentUser?.name || 'Citizen'}!
          </h1>
          <p className="text-muted-foreground text-lg">
            Your health companion is ready to assist you.
          </p>
        </div>
        <a href="tel:108" className="inline-block shrink-0">
          <Button 
            size="lg" 
            className="rounded-full font-bold bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/25 transition-all flex items-center gap-2.5 text-base px-6 h-14"
          >
            <Siren className="h-6 w-6 animate-pulse" />
            108 Emergency
          </Button>
        </a>
      </div>

      {/* 2. ABHA Digital Health Card */}
      <div className="bg-gradient-to-r from-teal-600 to-emerald-600 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="absolute -right-10 -top-10 opacity-10">
          <HeartPulse className="w-48 h-48" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-teal-50">
              <HeartPulse className="h-5 w-5" />
              <span className="font-medium tracking-wide uppercase text-sm">Sehat Saathi Health Pass</span>
            </div>
            <h2 className="text-2xl font-bold">{currentUser?.name || 'Citizen'}</h2>
            <p className="text-teal-50/90 text-sm max-w-md">
              ABHA Status: Link your ABHA ID for unified records and seamless access to healthcare services across India.
            </p>
          </div>
          <Button 
            variant="outline" 
            className="bg-transparent border-white/40 text-white hover:bg-white/10 hover:text-white shrink-0 self-start md:self-center"
          >
            Link ABHA
          </Button>
        </div>
      </div>

      {/* 3. 4-Portal Service Command Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Link href="/hospitals" className="block group">
          <Card className="h-full transition-all duration-300 hover:scale-[1.02] hover:shadow-lg cursor-pointer border-transparent bg-teal-50/80 dark:bg-teal-950/20 hover:border-teal-200">
            <CardContent className="p-6 flex flex-col items-start space-y-4">
              <div className="p-3.5 bg-teal-100 dark:bg-teal-900/50 rounded-2xl group-hover:bg-teal-200 dark:group-hover:bg-teal-800/60 transition-colors">
                <Building2 className="h-8 w-8 text-teal-700 dark:text-teal-400" />
              </div>
              <div>
                <h3 className="font-bold text-teal-950 dark:text-teal-100 text-lg mb-1">Find Hospitals</h3>
                <p className="text-sm text-teal-800/80 dark:text-teal-300/70 leading-snug">Nearby facilities & live bed status</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/ambulance" className="block group">
          <Card className="h-full transition-all duration-300 hover:scale-[1.02] hover:shadow-lg cursor-pointer border-transparent bg-red-50/80 dark:bg-red-950/20 hover:border-red-200">
            <CardContent className="p-6 flex flex-col items-start space-y-4">
              <div className="p-3.5 bg-red-100 dark:bg-red-900/50 rounded-2xl group-hover:bg-red-200 dark:group-hover:bg-red-800/60 transition-colors">
                <Siren className="h-8 w-8 text-red-700 dark:text-red-400" />
              </div>
              <div>
                <h3 className="font-bold text-red-950 dark:text-red-100 text-lg mb-1">Emergency 108</h3>
                <p className="text-sm text-red-800/80 dark:text-red-300/70 leading-snug">Request ambulance dispatch now</p>
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
                <h3 className="font-bold text-blue-950 dark:text-blue-100 text-lg mb-1">Check Symptoms</h3>
                <p className="text-sm text-blue-800/80 dark:text-blue-300/70 leading-snug">AI-powered clinical risk assessment</p>
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
                <h3 className="font-bold text-amber-950 dark:text-amber-100 text-lg mb-1">Government Schemes</h3>
                <p className="text-sm text-amber-800/80 dark:text-amber-300/70 leading-snug">PM-JAY & state scheme eligibility</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* 4. Appointment Calendar Widget */}
      <AppointmentCalendarWidget role={Role.PATIENT} userId={currentUser?.id} userName={currentUser?.name} />

      {/* 5. Nearby Hospitals Preview */}
      <div>
        <div className="flex justify-between items-end mb-5">
          <h2 className="text-2xl font-bold tracking-tight">Nearby Hospitals</h2>
          <Link href="/hospitals">
            <Button variant="ghost" className="text-primary hover:bg-primary/5 font-medium flex items-center gap-1">
              View All <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        
        {facilities.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-5">
            {facilities.slice(0, 3).map((facility) => {
              const availableBeds = (facility.generalBeds - facility.generalBedsUsed) + (facility.icuBeds - facility.icuBedsUsed);
              return (
                <Card key={facility.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-0">
                    <div className="p-5 space-y-4">
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-start gap-3">
                          <h3 className="font-bold text-base leading-tight line-clamp-2">{facility.name}</h3>
                        </div>
                        <Badge variant="secondary" className="font-medium bg-secondary/60">
                          {facility.type}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-muted-foreground/70" /> 
                          <span className="line-clamp-1">{facility.district}, {facility.state}</span>
                        </div>
                      </div>
                      
                      <div className="pt-3 border-t flex justify-between items-center">
                        <div className="text-sm">
                          <span className="font-semibold text-foreground">{availableBeds}</span>
                          <span className="text-muted-foreground ml-1">Beds Available</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="bg-muted/30 border-dashed">
            <CardContent className="p-8 flex flex-col items-center text-center space-y-3 text-muted-foreground">
              <Building2 className="h-10 w-10 opacity-20" />
              <p>No hospitals registered in the network yet.</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* 5. Health Tip Card */}
      <Card className="bg-primary/5 border-primary/10 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
        <CardContent className="p-5 flex items-start gap-4">
          <div className="bg-primary/10 p-2.5 rounded-xl shrink-0 mt-0.5">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-foreground mb-1">Health Tip of the Day</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Stay hydrated — drink at least 8 glasses of water daily. Proper hydration supports your immune system and overall well-being.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
