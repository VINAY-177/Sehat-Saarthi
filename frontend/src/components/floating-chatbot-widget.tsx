"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { useStore } from "@/lib/store";
import { Role } from "@/lib/types";
import { BookingChatbot } from "@/components/booking-chatbot";
import { Bot, Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function FloatingChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { role, t } = useStore();

  // The appointment booking assistant is strictly for Patients / Citizens.
  // Hide completely for Doctor and Hospital Staff, as well as on auth and chatbot pages.
  if (
    role !== Role.PATIENT &&
    role !== Role.CITIZEN
  ) {
    return null;
  }

  if (pathname === "/chatbot" || pathname === "/login" || pathname === "/signup") {
    return null;
  }

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white pl-4 pr-5 py-3.5 rounded-full shadow-xl shadow-teal-700/25 hover:shadow-2xl hover:shadow-teal-700/35 hover:scale-105 transition-all duration-300 border-2 border-white/20"
        >
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-300 border-2 border-teal-700 animate-ping" />
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-teal-700" />
          </div>

          <div className="text-left">
            <div className="flex items-center gap-1">
              <span className="text-xs font-black tracking-tight leading-none text-white">{t("bookWithAi")}</span>
              <Sparkles className="w-3 h-3 text-amber-300" />
            </div>
            <span className="text-[10px] text-teal-100 font-medium leading-tight block">{t("voiceAndChat")}</span>
          </div>
        </button>
      </div>

      {/* Floating Chat Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden rounded-3xl border-0 shadow-2xl bg-transparent">
          <DialogHeader className="sr-only">
            <DialogTitle>Sehat Saathi AI Voice Assistant</DialogTitle>
          </DialogHeader>
          <BookingChatbot onBackToDashboard={() => setIsOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}
