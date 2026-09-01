"use client";

import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { Menu, Bell, User as UserIcon, LogOut, ChevronDown, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/lib/store";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, logout, language, setLanguage, t } = useStore();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const handleLogout = () => {
    setProfileMenuOpen(false);
    logout();
    router.push('/login');
  };
  
  const getPageTitle = (path: string) => {
    if (path === "/") return t("dashboardOverview");
    const segment = path.split("/")[1] || "";
    return segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
  };

  const getUserInitials = (name?: string) => {
    if (!name || typeof name !== "string") return "SS";
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "SS";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const getRoleBadgeClasses = (role?: string) => {
    if (role === "DOCTOR") return "bg-blue-50 text-blue-700 border-blue-200";
    if (role === "HOSPITAL_STAFF") return "bg-indigo-50 text-indigo-700 border-indigo-200";
    return "bg-teal-50 text-teal-700 border-teal-200";
  };

  const navigateFromProfileMenu = (path: string) => {
    setProfileMenuOpen(false);
    router.push(path);
  };

  return (
    <header className="h-16 flex items-center justify-between px-4 sm:px-8 bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-30 shadow-xs transition-all">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          aria-label="Open navigation menu"
          className="md:hidden text-slate-500 hover:bg-slate-100 rounded-xl h-10 w-10" 
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="hidden md:flex flex-col">
          <h1 className="font-bold text-lg text-slate-800 leading-tight">
            {getPageTitle(pathname)}
          </h1>
          <div className="flex items-center text-xs font-medium text-slate-400 gap-1.5">
            <span>{t("brandName")}</span>
            <span>/</span>
            <span className="text-teal-600">{getPageTitle(pathname)}</span>
          </div>
        </div>
        <div className="flex items-center gap-2.5 md:hidden ml-1">
          <Image src="/logo.png" alt="Sehat Saarthi Logo" width={32} height={32} className="rounded-xl object-contain" />
          <span className="font-bold text-lg text-slate-800 tracking-tight">
            {t("brandName")}
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Bilingual Language Switcher Toggle */}
        <div className="flex items-center bg-slate-100/80 p-1 rounded-2xl border border-slate-200/80 shadow-2xs">
          <button
            type="button"
            onClick={() => setLanguage("en")}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
              language === "en"
                ? "bg-white text-teal-900 shadow-xs border border-slate-200/50"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            English
          </button>
          <button
            type="button"
            onClick={() => setLanguage("hi")}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
              language === "hi"
                ? "bg-teal-600 text-white shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            हिंदी
          </button>
        </div>

        {/* Notifications */}
        <Button
          variant="outline"
          size="icon"
          aria-label="View notifications"
          onClick={() => router.push('/notifications')}
          className="relative text-slate-500 bg-white border-slate-200 hover:bg-slate-50 hover:text-teal-600 rounded-xl h-10 w-10 shadow-xs transition-colors"
          title={t("notifications")}
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
        </Button>

        <div className="w-px h-6 bg-slate-200 mx-0.5 hidden sm:block"></div>
        
        {currentUser && (
          <DropdownMenu open={profileMenuOpen} onOpenChange={setProfileMenuOpen}>
            <DropdownMenuTrigger
              type="button"
              aria-label="Open profile menu"
              aria-haspopup="menu"
              className="h-10 pl-2 pr-2 sm:pr-3 gap-2.5 rounded-xl hover:bg-slate-50 transition-colors flex items-center border border-slate-200/80 bg-white shadow-2xs outline-none cursor-pointer focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white font-bold text-xs shadow-xs shrink-0">
                {getUserInitials(currentUser.name)}
              </div>
              <div className="hidden sm:flex flex-col items-start text-left max-w-[130px]">
                <span className="font-semibold text-slate-800 text-xs truncate leading-tight w-full">
                  {currentUser.name || "User"}
                </span>
                <span className="text-[10px] text-slate-400 font-medium capitalize">
                  {(currentUser.role || "Patient").toLowerCase().replace(/_/g, " ")}
                </span>
              </div>
              <ChevronDown className={`h-3.5 w-3.5 text-slate-400 shrink-0 transition-transform duration-150 ${profileMenuOpen ? "rotate-180" : ""}`} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={8} className="w-64 rounded-2xl p-2 shadow-xl border-slate-200 bg-white z-[100]">
              <DropdownMenuLabel className="p-3 bg-slate-50/80 rounded-xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow-xs shrink-0">
                    {getUserInitials(currentUser.name)}
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <p className="text-sm font-bold text-slate-900 leading-snug truncate">{currentUser.name || "User"}</p>
                    <p className="text-xs font-medium text-slate-500 truncate">{currentUser.email || currentUser.phone}</p>
                    <div className="mt-1">
                      <Badge variant="secondary" className={`text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase ${getRoleBadgeClasses(currentUser.role)}`}>
                        {(currentUser.role || "PATIENT").replace(/_/g, " ")}
                      </Badge>
                    </div>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-100 my-1.5" />
              <DropdownMenuItem 
                onClick={() => navigateFromProfileMenu('/profile')} 
                className="cursor-pointer text-slate-700 font-semibold p-2.5 rounded-xl hover:bg-teal-50 hover:text-teal-900 focus:bg-teal-50 focus:text-teal-900 transition-colors"
              >
                <UserIcon className="mr-2.5 h-4 w-4 text-teal-600" />
                <span>{t("myProfile")}</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => navigateFromProfileMenu('/profile#settings')} 
                className="cursor-pointer text-slate-700 font-semibold p-2.5 rounded-xl hover:bg-slate-50 hover:text-slate-900 focus:bg-slate-50 focus:text-slate-900 transition-colors"
              >
                <Settings className="mr-2.5 h-4 w-4 text-slate-400" />
                <span>Settings &amp; Preferences</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => navigateFromProfileMenu('/login')} 
                className="cursor-pointer text-slate-700 font-semibold p-2.5 rounded-xl hover:bg-slate-50 hover:text-slate-900 focus:bg-slate-50 focus:text-slate-900 transition-colors"
              >
                <UserIcon className="mr-2.5 h-4 w-4 text-slate-400" />
                <span>{t("switchAccount")}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-slate-100 my-1.5" />
              <DropdownMenuItem 
                onClick={handleLogout} 
                className="cursor-pointer text-rose-600 font-semibold p-2.5 rounded-xl hover:bg-rose-50 hover:text-rose-700 focus:bg-rose-50 focus:text-rose-700 transition-colors"
              >
                <LogOut className="mr-2.5 h-4 w-4" />
                <span>{t("logout")}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
