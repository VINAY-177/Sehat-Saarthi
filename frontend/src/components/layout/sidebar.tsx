"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  UserPlus,
  Users,
  Calendar,
  Activity,
  Ambulance,
  Hospital,
  ShieldCheck,
  Fingerprint,
  UserCircle,
  Siren,
  MessageSquare,
  Bell,
  Bot
} from "lucide-react";
import { Role } from "@/lib/types";
import { useStore } from "@/lib/store";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();
  const { role, currentUser, t } = useStore();

  const common = { href: '/', label: t("dashboard"), icon: LayoutDashboard };
  const comms = [
    { href: '/messages', label: t("messages"), icon: MessageSquare },
    { href: '/notifications', label: t("notifications"), icon: Bell },
  ];

  const getNavGroups = () => {
    switch (role) {
      case Role.CITIZEN:
      case Role.PATIENT:
        return [
          {
            label: t("overview"),
            items: [common, ...comms, { href: '/profile', label: t("myProfile"), icon: UserCircle }]
          },
          {
            label: t("healthServices"),
            items: [
              { href: '/chatbot', label: t("aiBookingBot"), icon: Bot },
              { href: '/scheduling', label: t("appointmentSchedule"), icon: Calendar },
              { href: '/hospitals', label: t("findHospitals"), icon: Hospital },
              { href: '/ambulance', label: t("emergencyAmbulance"), icon: Siren },
              { href: '/assess', label: t("riskAssessment"), icon: Activity },
            ]
          },
          {
            label: t("management"),
            items: [
              { href: '/schemes', label: t("govSchemes"), icon: ShieldCheck },
              { href: '/abha', label: t("abhaId"), icon: Fingerprint },
            ]
          }
        ];
      case Role.DOCTOR:
        return [
          {
            label: t("overview"),
            items: [common, ...comms]
          },
          {
            label: t("clinical"),
            items: [
              { href: '/scheduling', label: t("appointmentSchedule"), icon: Calendar },
              { href: '/patients', label: t("patientRecords"), icon: Users },
              { href: '/assess', label: t("riskAssessment"), icon: Activity },
              { href: '/referrals', label: t("referrals"), icon: Ambulance },
            ]
          },
          {
            label: t("management"),
            items: [
              { href: '/facilities', label: t("facilitiesBeds"), icon: Hospital },
            ]
          }
        ];
      case Role.HOSPITAL_STAFF:
        return [
          {
            label: t("overview"),
            items: [common, ...comms]
          },
          {
            label: t("operations"),
            items: [
              { href: '/scheduling', label: t("appointmentSchedule"), icon: Calendar },
              { href: '/facilities', label: t("facilitiesBeds"), icon: Hospital },
              { href: '/referrals', label: t("referrals"), icon: Ambulance },
              { href: '/ambulance', label: t("ambulanceFleetDispatch"), icon: Siren },
            ]
          },
          {
            label: t("registry"),
            items: [
              { href: '/patients', label: t("patientRecords"), icon: Users },
              { href: '/register', label: t("registerPatient"), icon: UserPlus },
            ]
          }
        ];

      default:
        return [
          { label: t("overview"), items: [common] }
        ];
    }
  };

  const navGroups = getNavGroups();

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-slate-50 to-white w-[280px] border-r border-slate-200/60 shadow-sm relative z-10">
      <Link href="/" className="p-4 flex items-center gap-3 border-b border-slate-100/80 hover:bg-slate-50/50 transition-colors">
        <div className="relative w-11 h-11 rounded-2xl overflow-hidden shadow-sm border border-slate-100 shrink-0 bg-white p-1 flex items-center justify-center">
          <Image 
            src="/logo.png" 
            alt="Sehat Saathi Official Logo" 
            width={40} 
            height={40} 
            className="object-contain"
            priority
          />
        </div>
        <div className="flex flex-col">
          <span className="font-black text-lg tracking-tight text-slate-900 leading-tight">{t("brandName")}</span>
          <span className="text-[10px] font-bold text-teal-600 tracking-tight">{t("tagline")}</span>
        </div>
      </Link>
      
      <nav className="flex-1 px-4 py-6 space-y-6 overflow-y-auto scrollbar-hide">
        {navGroups.map((group, i) => (
          <div key={i} className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">{group.label}</h4>
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 h-11 rounded-xl transition-all duration-200 relative group overflow-hidden",
                      isActive 
                        ? "bg-teal-50 text-teal-700 font-semibold shadow-sm border border-teal-100/50" 
                        : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                    )}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-teal-500 rounded-r-full" />
                    )}
                    <Icon className={cn("h-5 w-5 transition-colors", isActive ? "text-teal-600" : "text-slate-400 group-hover:text-slate-600")} />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
      
      {currentUser && (
        <div className="p-4 border-t border-slate-100 bg-white/50 backdrop-blur-sm m-4 rounded-2xl shadow-sm border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold border border-teal-200 shrink-0">
              {currentUser.name.charAt(0)}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold text-slate-800 truncate">{currentUser.name}</span>
              <Badge variant="secondary" className="bg-slate-100 text-slate-500 hover:bg-slate-200 border-none font-medium px-1.5 py-0 text-[10px] uppercase w-fit mt-0.5">
                {currentUser.role.replace('_', ' ')}
              </Badge>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
