"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Ambulance,
  ShieldCheck,
  UserCircle,
  Siren,
  MessageSquare,
  Bell,
  FileText,
  Building2,
} from "lucide-react";
import { Role } from "@/lib/types";
import { useStore } from "@/lib/store";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();
  const { role, currentUser, t, language } = useStore();

  const getNavItems = () => {
    switch (role) {
      case Role.CITIZEN:
      case Role.PATIENT:
        return [
          { href: '/', label: t("dashboard") || "Dashboard", icon: LayoutDashboard },
          { href: '/scheduling', label: t("appointmentSchedule") || "Appointments", icon: Calendar },
          { href: currentUser?.patientId ? `/patients/${currentUser.patientId}` : '/patients', label: language === "hi" ? "स्वास्थ्य रिकॉर्ड" : "Health Records", icon: FileText },
          { href: '/messages', label: t("messages") || "Messages", icon: MessageSquare },
          { href: '/schemes', label: t("govSchemes") || "Government Schemes", icon: ShieldCheck },
          { href: '/notifications', label: t("notifications") || "Notifications", icon: Bell },
          { href: '/profile', label: t("myProfile") || "Profile", icon: UserCircle },
        ];

      case Role.DOCTOR:
        return [
          { href: '/', label: t("dashboard") || "Dashboard", icon: LayoutDashboard },
          { href: '/scheduling', label: t("appointmentSchedule") || "Appointments", icon: Calendar },
          { href: '/patients', label: t("patientRecords") || "Patients", icon: Users },
          { href: '/referrals', label: t("referrals") || "Referrals", icon: Ambulance },
          { href: '/messages', label: t("messages") || "Messages", icon: MessageSquare },
          { href: '/notifications', label: t("notifications") || "Notifications", icon: Bell },
          { href: '/profile', label: t("myProfile") || "Profile", icon: UserCircle },
        ];

      case Role.HOSPITAL_STAFF:
        return [
          { href: '/', label: t("dashboard") || "Dashboard", icon: LayoutDashboard },
          { href: '/scheduling', label: t("appointmentSchedule") || "Appointments", icon: Calendar },
          { href: '/patients', label: t("patientRecords") || "Patients", icon: Users },
          { href: '/facilities', label: language === "hi" ? "अस्पताल संचालन" : "Hospital Operations", icon: Building2 },
          { href: '/referrals', label: t("referrals") || "Referrals", icon: Ambulance },
          { href: '/messages', label: t("messages") || "Messages", icon: MessageSquare },
          { href: '/notifications', label: t("notifications") || "Notifications", icon: Bell },
          { href: '/profile', label: t("myProfile") || "Profile", icon: UserCircle },
        ];

      default:
        return [
          { href: '/', label: t("dashboard") || "Dashboard", icon: LayoutDashboard },
          { href: '/profile', label: t("myProfile") || "Profile", icon: UserCircle },
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <aside className="flex flex-col h-full bg-white w-[270px] border-r border-slate-200/80 shadow-xs relative z-10 select-none">
      
      {/* Brand Header */}
      <Link 
        href="/" 
        className="p-4.5 flex items-center gap-3 border-b border-slate-100 hover:bg-slate-50/60 transition-colors"
      >
        <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-xs border border-slate-100 shrink-0 bg-white p-1 flex items-center justify-center">
          <Image 
            src="/logo.png" 
            alt="Sehat Saathi Logo" 
            width={36} 
            height={36} 
            className="object-contain"
            priority
          />
        </div>
        <div className="flex flex-col">
          <span className="font-extrabold text-[17px] tracking-tight text-slate-900 leading-tight">
            {t("brandName") || "Sehat Saathi"}
          </span>
          <span className="text-[11px] font-semibold text-teal-700 tracking-tight">
            {language === "hi" ? "सेहत आपकी, साथ हमारा" : "Sehat Aapki, Saath Hamara"}
          </span>
        </div>
      </Link>
      
      {/* Main Navigation */}
      <nav className="flex-1 px-3.5 py-4 space-y-1 overflow-y-auto scrollbar-hide">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
          {language === "hi" ? "नेविगेशन" : "Navigation"}
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 relative group",
                isActive 
                  ? "bg-teal-50/90 text-teal-800 font-semibold shadow-xs border border-teal-100/80" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-teal-600 rounded-r-full" />
              )}
              <Icon 
                className={cn(
                  "h-4 w-4 shrink-0 transition-transform duration-150 group-hover:translate-x-0.5", 
                  isActive ? "text-teal-700" : "text-slate-400 group-hover:text-slate-600"
                )} 
              />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Visually Separated Emergency Button (Accessible from all dashboards) */}
      <div className="px-3.5 pt-2 pb-1 border-t border-slate-100">
        <Link
          href="/emergency"
          className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-rose-50 border border-rose-200/80 text-rose-700 hover:bg-rose-100 hover:border-rose-300 font-bold text-xs transition-all shadow-xs group"
        >
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-rose-600 text-white rounded-lg group-hover:scale-105 transition-transform">
              <Siren className="h-3.5 w-3.5" />
            </div>
            <span>{language === "hi" ? "आपातकालीन 108 SOS" : "Emergency 108 SOS"}</span>
          </div>
          <span className="text-[10px] uppercase font-extrabold tracking-wider bg-rose-200/80 text-rose-900 px-1.5 py-0.5 rounded-md">
            24/7
          </span>
        </Link>
      </div>

      {/* Current Authenticated User Footer */}
      {currentUser && (
        <div className="p-3.5 m-3 rounded-2xl bg-slate-50 border border-slate-200/70 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-teal-700 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
              {currentUser.name.charAt(0)}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-slate-800 truncate leading-tight">{currentUser.name}</span>
              <Badge variant="secondary" className="bg-white text-slate-600 border border-slate-200/80 font-medium px-1.5 py-0 text-[9px] uppercase w-fit mt-0.5">
                {currentUser.role.replace('_', ' ')}
              </Badge>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
