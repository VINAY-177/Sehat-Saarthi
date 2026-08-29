"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Notification, Role } from "@/lib/types";
import { useStore } from "@/lib/store";
import { Badge } from "@/components/ui/badge";
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
  const { role, currentUser } = useStore();
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Strictly filter notifications by the current user's role
  const isDoctor = role === Role.DOCTOR;
  const isStaff = role === Role.HOSPITAL_STAFF;
  const targetRole = isDoctor ? "DOCTOR" : isStaff ? "HOSPITAL_STAFF" : "PATIENT";

  useEffect(() => {
    async function loadNotifications() {
      if (!currentUser?.id) return;
      try {
        setIsLoading(true);
        const { apiGet } = await import("@/lib/api");
        const data = await apiGet<Notification[]>(`/api/notifications?userId=${currentUser.id}&role=${targetRole}`);
        setNotifications(data);
      } catch (error) {
        console.error("Failed to load notifications", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadNotifications();
  }, [currentUser?.id, targetRole]);

  const roleScopedNotifications = useMemo(() => {
    return notifications.filter((n) => n.role === targetRole);
  }, [notifications, targetRole]);

  const unreadCount = roleScopedNotifications.filter((n) => !n.read).length;

  const markAllAsRead = async () => {
    try {
      const { apiPut } = await import("@/lib/api");
      await apiPut("/api/notifications/read-all", {});
      setNotifications((prev) => prev.map((n) => (n.role === targetRole ? { ...n, read: true } : n)));
    } catch (error) {
      console.error("Failed to mark all as read", error);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const { apiPut } = await import("@/lib/api");
      await apiPut(`/api/notifications/${id}/read`, { read: true });
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    } catch (error) {
      console.error("Failed to mark notification as read", error);
    }
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
    <div className="max-w-5xl mx-auto space-y-6 pb-20 page-enter">
      {/* Header Glass Card */}
      <div className="glass-card-auth p-6 sm:p-7 rounded-[28px] border border-white/80 shadow-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/92 backdrop-blur-2xl section-enter">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-gradient-to-br from-teal-500 to-emerald-600 text-white rounded-2xl shadow-md shadow-teal-500/20">
            <Bell className="h-8 w-8" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">Notification Center</h1>
              {unreadCount > 0 && (
                <Badge className="bg-rose-500 text-white font-extrabold px-2.5 py-0.5 text-xs shadow-xs">
                  {unreadCount} Unread
                </Badge>
              )}
            </div>
            <p className="text-slate-500 mt-1 font-semibold text-xs sm:text-sm">
              Clinical alerts, schedule updates, diagnostic lab releases, and emergency telemetry.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllAsRead}
              className="btn-3d-glass h-11 px-4 text-xs font-extrabold text-slate-800 border-slate-200 gap-2 rounded-2xl"
            >
              <CheckCheck className="w-4 h-4 text-teal-600" />
              <span>Mark All as Read</span>
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="glass-panel p-2 rounded-[22px] border border-white/80 bg-white/90 shadow-md flex items-center gap-1.5 overflow-x-auto text-xs font-bold scrollbar-hide">
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
            className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap text-xs font-bold ${
              activeCategory === tab.key
                ? "bg-teal-700 text-white shadow-xs"
                : "bg-white/80 text-slate-600 hover:bg-white hover:text-slate-900 border border-slate-200/60"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notification Stream */}
      {isLoading ? (
        <div className="glass-panel border border-white/80 shadow-xl bg-white/90 rounded-[28px] py-20 text-center">
          <h3 className="font-extrabold text-slate-800 text-base animate-pulse">Loading notifications...</h3>
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className="glass-panel border-dashed border-2 border-white/80 shadow-xl bg-white/90 rounded-[28px] py-20 text-center">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-xs mb-3 border border-slate-100">
            <Bell className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="font-extrabold text-slate-800 text-lg">No notifications in this category</h3>
          <p className="text-xs text-slate-500 mt-1 font-medium">You are all caught up!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notif) => {
            const isEmergency = notif.urgency === "EMERGENCY";
            const isHigh = notif.urgency === "HIGH";

            return (
              <div
                key={notif.id}
                className={`glass-panel border border-white/80 shadow-lg rounded-[24px] transition-all overflow-hidden bg-white/92 backdrop-blur-2xl card-hover p-5 flex flex-col sm:flex-row items-start justify-between gap-4 ${
                  !notif.read
                    ? isEmergency
                      ? "border-rose-300 ring-2 ring-rose-200/50"
                      : "border-teal-300 ring-2 ring-teal-200/50"
                    : ""
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Category Icon */}
                  <div
                    className={`p-3 rounded-2xl shrink-0 mt-0.5 shadow-2xs ${
                      isEmergency
                        ? "bg-rose-100 text-rose-600 border border-rose-200"
                        : notif.category === "APPOINTMENT"
                        ? "bg-purple-100 text-purple-700 border border-purple-200"
                        : notif.category === "LAB"
                        ? "bg-blue-100 text-blue-700 border border-blue-200"
                        : notif.category === "REFERRAL"
                        ? "bg-amber-100 text-amber-800 border border-amber-200"
                        : "bg-teal-100 text-teal-700 border border-teal-200"
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
                      <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">{notif.title}</h4>
                      {!notif.read && (
                        <span className="w-2.5 h-2.5 rounded-full bg-teal-600 shrink-0 shadow-xs" />
                      )}
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-extrabold py-0.5 px-2 rounded-md ${
                          isEmergency
                            ? "bg-rose-100 text-rose-800 border-rose-300"
                            : isHigh
                            ? "bg-amber-100 text-amber-800 border-amber-300"
                            : "bg-slate-100 text-slate-700 border-slate-200"
                        }`}
                      >
                        {notif.category}
                      </Badge>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-semibold">{notif.message}</p>

                    <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-500 font-bold">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-teal-600" />
                        {notif.createdAt}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  {notif.link && (
                    <Link href={notif.link}>
                      <button
                        type="button"
                        className="btn-3d-primary h-9 px-4 text-xs font-extrabold rounded-xl gap-1.5"
                      >
                        <span>Review</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </Link>
                  )}

                  {!notif.read && (
                    <button
                      type="button"
                      onClick={() => markAsRead(notif.id)}
                      className="btn-3d-glass h-9 w-9 rounded-xl p-0 flex items-center justify-center text-slate-600 hover:text-teal-700"
                      title="Mark as read"
                    >
                      <CheckCheck className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => deleteNotification(notif.id)}
                    className="btn-3d-glass h-9 w-9 rounded-xl p-0 flex items-center justify-center text-slate-400 hover:text-rose-600"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
