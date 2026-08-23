"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
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

  const isPublicRoute = pathname === '/login' || pathname === '/signup';

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
    <div className="flex h-screen w-full bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden md:block h-full">
        <Sidebar />
      </div>

      {/* Mobile Sidebar (Sheet) */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <Sidebar />
        </SheetContent>
      </Sheet>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 h-full overflow-hidden w-full">
        <Header onMenuClick={() => setIsMobileMenuOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 w-full">
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
