"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Notification, Role } from "@/lib/types";
import { useStore } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Bell,
  CheckCheck,
  Calendar,
  Ambulance,
  FlaskConical,
  ShieldAlert,
  ShieldCheck,
  Clock,
  ArrowRight,
  Trash2,
} from "lucide-react";

export default function NotificationsPage() {
  const { role } = useStore();
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "notif-1",
      role: "DOCTOR",
      category: "EMERGENCY",
      title: "Critical Triage Alert: High Risk Patient Inbound",
      message: "Patient Ramesh Yadav (62 yrs, Male) evaluated with SpO2 88% and Acute COPD Exacerbation. Immediate ICU triage advised.",
      link: "/patients",
      urgency: "EMERGENCY",
      read: false,
      createdAt: "10 mins ago",
    },
    {
      id: "notif-2",
      role: "PATIENT",
      category: "APPOINTMENT",
      title: "Appointment Confirmed with Dr. Priya Sharma",
      message: "Your cardiac follow-up appointment has been confirmed for tomorrow at 10:30 AM at AIIMS New Delhi.",
      link: "/scheduling",
      urgency: "NORMAL",
      read: false,
      createdAt: "45 mins ago",
    },
    {
      id: "notif-3",
      role: "DOCTOR",
      category: "LAB",
      title: "Diagnostic Pathology Results Available",
      message: "HbA1c and Lipid Profile laboratory results uploaded for Amit Sharma (MRN-2025-0001). Observed HbA1c: 7.2%.",
      link: "/patients",
      urgency: "HIGH",
      read: false,
      createdAt: "2 hours ago",
    },
    {
      id: "notif-4",
      role: "HOSPITAL_STAFF",
      category: "REFERRAL",
      title: "New Incoming Referral: Safdarjung Hospital",
      message: "Emergency referral created for ICU bed transfer with ambulance dispatch en-route (ETA 12 mins).",
      link: "/referrals",
      urgency: "HIGH",
      read: true,
      createdAt: "4 hours ago",
    },
    {
      id: "notif-5",
      role: "PATIENT",
      category: "SYSTEM",
      title: "Ayushman Bharat PM-JAY Eligibility Verified",
      message: "Your ABHA Health ID has been verified with ₹5,00,000 annual health cover eligibility.",
      link: "/schemes",
      urgency: "NORMAL",
      read: true,
      createdAt: "Yesterday",
    },
    {
      id: "notif-6",
      role: "HOSPITAL_STAFF",
      category: "SYSTEM",
      title: "Ward 4 Bed Telemetry Synchronized",
      message: "8 ICU beds and 24 General ward beds are available for admissions.",
      link: "/facilities",
      urgency: "NORMAL",
      read: false,
      createdAt: "5 hours ago",
    },
  ]);

  // Strictly filter notifications by the current user's role
  const isDoctor = role === Role.DOCTOR;
  const isStaff = role === Role.HOSPITAL_STAFF;
  const targetRole = isDoctor ? "DOCTOR" : isStaff ? "HOSPITAL_STAFF" : "PATIENT";

  const roleScopedNotifications = useMemo(() => {
    return notifications.filter((n) => n.role === targetRole);
  }, [notifications, targetRole]);

  const unreadCount = roleScopedNotifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => (n.role === targetRole ? { ...n, read: true } : n)));
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const filteredNotifications = useMemo(() => {
    if (activeCategory === "ALL") return roleScopedNotifications;
    if (activeCategory === "UNREAD") return roleScopedNotifications.filter((n) => !n.read);
    return roleScopedNotifications.filter((n) => n.category === activeCategory);
  }, [roleScopedNotifications, activeCategory]);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200/80 pb-6">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-gradient-to-br from-teal-500 to-emerald-600 text-white rounded-2xl shadow-md shadow-teal-500/20">
            <Bell className="h-8 w-8" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Notification Center</h1>
              {unreadCount > 0 && (
                <Badge className="bg-rose-500 text-white font-bold px-2.5 py-0.5 text-xs">
                  {unreadCount} Unread
                </Badge>
              )}
            </div>
            <p className="text-slate-500 mt-1 font-medium text-sm">
              Clinical alerts, schedule updates, diagnostic lab releases, and emergency telemetry.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button
              variant="outline"
              onClick={markAllAsRead}
              className="rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs gap-1.5 h-11"
            >
              <CheckCheck className="w-4 h-4 text-teal-600" />
              Mark All as Read
            </Button>
          )}
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold">
        {[
          { key: "ALL", label: "All Alerts" },
          { key: "UNREAD", label: `Unread (${unreadCount})` },
          { key: "EMERGENCY", label: "Emergency & Triage" },
          { key: "APPOINTMENT", label: "Appointments" },
          { key: "LAB", label: "Lab Diagnostic Reports" },
          { key: "REFERRAL", label: "Hospital Referrals" },
          { key: "SYSTEM", label: "Schemes & ABHA" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveCategory(tab.key)}
            className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
              activeCategory === tab.key
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notification Stream */}
      {filteredNotifications.length === 0 ? (
        <Card className="border-dashed border-2 border-slate-200 shadow-sm bg-slate-50/50 rounded-3xl py-20 text-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm mb-3">
            <Bell className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="font-bold text-slate-800 text-lg">No notifications in this category</h3>
          <p className="text-xs text-slate-400 mt-1">You are all caught up!</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notif) => {
            const isEmergency = notif.urgency === "EMERGENCY";
            const isHigh = notif.urgency === "HIGH";

            return (
              <Card
                key={notif.id}
                className={`border rounded-2xl transition-all overflow-hidden ${
                  !notif.read
                    ? isEmergency
                      ? "bg-rose-50/40 border-rose-200 shadow-sm"
                      : "bg-teal-50/20 border-teal-200/80 shadow-sm"
                    : "bg-white border-slate-200/80"
                }`}
              >
                <CardContent className="p-5 flex flex-col sm:flex-row items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    {/* Category Icon */}
                    <div
                      className={`p-3 rounded-2xl shrink-0 mt-0.5 ${
                        isEmergency
                          ? "bg-rose-100 text-rose-600"
                          : notif.category === "APPOINTMENT"
                          ? "bg-purple-100 text-purple-700"
                          : notif.category === "LAB"
                          ? "bg-blue-100 text-blue-700"
                          : notif.category === "REFERRAL"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-teal-100 text-teal-700"
                      }`}
                    >
                      {isEmergency ? (
                        <ShieldAlert className="w-5 h-5 animate-pulse" />
                      ) : notif.category === "APPOINTMENT" ? (
                        <Calendar className="w-5 h-5" />
                      ) : notif.category === "LAB" ? (
                        <FlaskConical className="w-5 h-5" />
                      ) : notif.category === "REFERRAL" ? (
                        <Ambulance className="w-5 h-5" />
                      ) : (
                        <ShieldCheck className="w-5 h-5" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-extrabold text-slate-900 text-sm">{notif.title}</h4>
                        {!notif.read && (
                          <span className="w-2 h-2 rounded-full bg-teal-500 shrink-0" />
                        )}
                        <Badge
                          variant="outline"
                          className={`text-[10px] font-bold py-0 ${
                            isEmergency
                              ? "bg-rose-100 text-rose-800 border-rose-300"
                              : isHigh
                              ? "bg-amber-100 text-amber-800 border-amber-300"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {notif.category}
                        </Badge>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed font-medium">{notif.message}</p>

                      <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-400 font-medium">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {notif.createdAt}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    {notif.link && (
                      <Link href={notif.link}>
                        <Button
                          size="sm"
                          className="h-9 px-3.5 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-xl gap-1.5"
                        >
                          <span>Review</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                    )}

                    {!notif.read && (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => markAsRead(notif.id)}
                        className="h-9 w-9 text-slate-400 hover:text-teal-600 rounded-xl"
                        title="Mark as read"
                      >
                        <CheckCheck className="w-4 h-4" />
                      </Button>
                    )}

                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => deleteNotification(notif.id)}
                      className="h-9 w-9 text-slate-300 hover:text-rose-600 rounded-xl"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
