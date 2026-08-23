"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HeartPulse,
  LayoutDashboard,
  UserPlus,
  Users,
  Activity,
  Hospital,
  Ambulance,
  Siren,
  ShieldCheck,
  Fingerprint,
  UserCircle,
  Calendar,
  MessageSquare,
  Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store";
import { Role } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

const getNavGroups = (role: Role) => {
  const common = { href: '/', label: 'Dashboard', icon: LayoutDashboard };
  const comms = [
    { href: '/messages', label: 'Messages', icon: MessageSquare },
    { href: '/notifications', label: 'Notifications', icon: Bell },
  ];
  
  switch (role) {
    case Role.CITIZEN:
    case Role.PATIENT:
      return [
        {
          label: "Overview",
          items: [common, ...comms, { href: '/profile', label: 'My Profile', icon: UserCircle }]
        },
        {
          label: "Health Services",
          items: [
            { href: '/scheduling', label: 'Book Appointment', icon: Calendar },
            { href: '/hospitals', label: 'Nearby Hospitals', icon: Hospital },
            { href: '/ambulance', label: 'Ambulance 108', icon: Siren },
            { href: '/assess', label: 'Symptom Checker', icon: Activity },
          ]
        },
        {
          label: "Benefits",
          items: [
            { href: '/schemes', label: 'Government Schemes', icon: ShieldCheck },
            { href: '/abha', label: 'ABHA Health ID', icon: Fingerprint },
          ]
        }
      ];
    case Role.DOCTOR:
      return [
        {
          label: "Overview",
          items: [common, ...comms]
        },
        {
          label: "Clinical",
          items: [
            { href: '/scheduling', label: 'Appointment Schedule', icon: Calendar },
            { href: '/patients', label: 'Patient Records', icon: Users },
            { href: '/assess', label: 'Risk Assessment', icon: Activity },
            { href: '/referrals', label: 'Referrals', icon: Ambulance },
          ]
        },
        {
          label: "Management",
          items: [
            { href: '/facilities', label: 'Facilities & Beds', icon: Hospital },
          ]
        }
      ];
    case Role.HOSPITAL_STAFF:
      return [
        {
          label: "Overview",
          items: [common, ...comms]
        },
        {
          label: "Operations",
          items: [
            { href: '/scheduling', label: 'Appointments & Roster', icon: Calendar },
            { href: '/facilities', label: 'Facilities & Beds', icon: Hospital },
            { href: '/referrals', label: 'Referral Mgmt', icon: Ambulance },
            { href: '/ambulance', label: 'Ambulance Fleet', icon: Siren },
          ]
        },
        {
          label: "Registry",
          items: [
            { href: '/patients', label: 'Patient Records', icon: Users },
            { href: '/register', label: 'Register Patient', icon: UserPlus },
          ]
        }
      ];

    default:
      return [
        { label: "Navigation", items: [common] }
      ];
  }
};

export function Sidebar() {
  const pathname = usePathname();
  const { role, currentUser } = useStore();
  const navGroups = getNavGroups(role);

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-slate-50 to-white w-[280px] border-r border-slate-200/60 shadow-sm relative z-10">
      <div className="p-6 flex items-center gap-3 border-b border-slate-100">
        <div className="bg-teal-500 p-2 rounded-xl shadow-sm">
          <HeartPulse className="h-6 w-6 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-xl tracking-tight text-slate-900 leading-tight">Sehat Saathi</span>
          <span className="text-[10px] font-semibold text-teal-600 uppercase tracking-wider">AI Healthcare</span>
        </div>
      </div>
      
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
