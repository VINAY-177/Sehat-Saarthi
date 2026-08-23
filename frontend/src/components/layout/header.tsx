"use client";

import { usePathname, useRouter } from "next/navigation";
import { Menu, Bell, User as UserIcon, LogOut, ChevronDown } from "lucide-react";
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
  const { currentUser, logout } = useStore();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };
  
  const getPageTitle = (path: string) => {
    if (path === "/") return "Dashboard Overview";
    const segment = path.split("/")[1];
    return segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
  };

  return (
    <header className="h-16 flex items-center justify-between px-4 sm:px-8 bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-30 shadow-sm transition-all">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden text-slate-500 hover:bg-slate-100 rounded-xl" 
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="hidden md:flex flex-col">
          <h1 className="font-bold text-lg text-slate-800 leading-tight">
            {getPageTitle(pathname)}
          </h1>
          <div className="flex items-center text-xs font-medium text-slate-400 gap-1.5">
            <span>Sehat Saathi</span>
            <span>/</span>
            <span className="text-teal-600">{getPageTitle(pathname)}</span>
          </div>
        </div>
        <span className="font-bold text-xl md:hidden ml-1 text-slate-800 tracking-tight">
          Sehat Saathi
        </span>
      </div>
      
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" className="relative text-slate-500 bg-white border-slate-200 hover:bg-slate-50 hover:text-teal-600 rounded-xl h-10 w-10 shadow-sm transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
        </Button>

        <div className="w-px h-6 bg-slate-200 mx-1 hidden sm:block"></div>
        
        {currentUser && (
          <DropdownMenu>
            <DropdownMenuTrigger className="h-10 pl-2 pr-3 gap-3 rounded-xl hover:bg-slate-50 transition-colors hidden sm:flex items-center border border-transparent hover:border-slate-200 outline-none">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-teal-400 to-emerald-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="flex flex-col items-start text-sm">
                  <span className="font-semibold text-slate-700 leading-none mb-1">{currentUser.name}</span>
                </div>
                <ChevronDown className="h-4 w-4 text-slate-400" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60 rounded-xl p-2 shadow-lg border-slate-100">
              <DropdownMenuLabel className="p-2">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-bold text-slate-800 leading-none">{currentUser.name}</p>
                  <p className="text-xs font-medium leading-none text-slate-500">{currentUser.email}</p>
                  <div className="mt-2 inline-flex">
                    <Badge variant="secondary" className="bg-teal-50 text-teal-700 font-semibold px-2 text-[10px] uppercase">
                      {currentUser.role.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-100 my-1" />
              <DropdownMenuItem onClick={() => router.push('/profile')} className="cursor-pointer text-slate-600 font-medium p-2.5 rounded-lg focus:bg-slate-50 focus:text-slate-900">
                <UserIcon className="mr-2.5 h-4 w-4 text-slate-400" />
                <span>My Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/login')} className="cursor-pointer text-slate-600 font-medium p-2.5 rounded-lg focus:bg-slate-50 focus:text-slate-900">
                <UserIcon className="mr-2.5 h-4 w-4 text-slate-400" />
                <span>Switch Account</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-slate-100 my-1" />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-rose-600 font-medium p-2.5 rounded-lg focus:bg-rose-50 focus:text-rose-700">
                <LogOut className="mr-2.5 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
