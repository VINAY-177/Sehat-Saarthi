"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { DataProvider, useStore } from "@/lib/store";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Toaster } from "@/components/ui/sonner";
import { FloatingChatbotWidget } from "@/components/floating-chatbot-widget";

interface AppShellProps {
  children: React.ReactNode;
}

function AppContent({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isPublicRoute = pathname === '/login' || pathname === '/signup' || pathname === '/emergency';

  useEffect(() => {
    if (!isAuthenticated && !isPublicRoute) {
      router.replace('/login');
    }
  }, [isAuthenticated, isPublicRoute, router]);

  if (!isAuthenticated && !isPublicRoute) {
    return null; // Avoid flicker before redirect
  }

  if (isPublicRoute) {
    return (
      <>
        {children}
        <Toaster position="top-right" richColors />
      </>
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden md:block h-full relative z-40">
        <Sidebar />
      </div>

      {/* Mobile Sidebar (Sheet) */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <Sidebar />
        </SheetContent>
      </Sheet>

      {/* Main Content Area with Global Background */}
      <div className="flex flex-col flex-1 h-full overflow-hidden w-full relative">
        
        {/* Global Background Image for ALL authenticated pages */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <Image
            src="/backgrounds/patient-dashboard.jpg"
            alt="Healthcare background"
            fill
            priority
            className="object-cover object-center scale-105"
          />
          {/* Atmospheric overlay veil */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950/70 via-slate-900/55 to-teal-950/70 backdrop-blur-[3px]" />
        </div>

        {/* Ambient floating color orbs */}
        <div className="absolute top-10 right-10 w-[500px] h-[500px] bg-teal-500/15 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <Header onMenuClick={() => setIsMobileMenuOpen(true)} />
        <main className="flex-1 overflow-y-auto w-full relative z-10">
          {children}
        </main>
      </div>
      <FloatingChatbotWidget />
      <Toaster position="top-right" richColors />
    </div>
  );
}

export function AppShell({ children }: AppShellProps) {
  return (
    <DataProvider>
      <TooltipProvider>
        <AppContent>{children}</AppContent>
      </TooltipProvider>
    </DataProvider>
  );
}
