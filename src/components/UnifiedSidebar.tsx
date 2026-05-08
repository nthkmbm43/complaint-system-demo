"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

// Manual SVG Icon Mapper to avoid external dependencies
const SidebarIcons = {
  Home: (props: any) => (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
  ),
  CheckSquare: (props: any) => (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
  ),
  User: (props: any) => (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
  ),
  Zap: (props: any) => (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
  ),
  List: (props: any) => (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
  ),
  Chart: (props: any) => (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0h6m2 0h2a2 2 0 002-2v-4a2 2 0 00-2-2h-2a2 2 0 00-2 2v4a2 2 0 002 2z" /></svg>
  ),
  Shield: (props: any) => (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
  ),
  Users: (props: any) => (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
  ),
  BookOpen: (props: any) => (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
  ),
  Briefcase: (props: any) => (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
  ),
  Settings: (props: any) => (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
  ),
  LogOut: (props: any) => (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
  ),
  Plus: (props: any) => (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
  ),
};

interface NavItem {
  href: string;
  label: string;
  icon: string;
}

interface UnifiedSidebarProps {
  brand: { name: string; sub: string; color: string };
  navItems: NavItem[];
  user: { name: string; initial: string; role: string };
}

export default function UnifiedSidebar({
  brand,
  navItems,
  user,
}: UnifiedSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    setIsOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (!mounted) return false;
    if (href.endsWith("dashboard")) return pathname === href;
    return pathname.startsWith(href);
  };

  const handleLogout = async () => {
    const callbackUrl = brand.sub === "Staff Portal" ? "/admin/login" : "/";
    await signOut({ callbackUrl });
  };

  // Prevent hydration mismatch by not rendering active states until mounted
  if (!mounted) {
     return (
       <header className="flex-none h-20 bg-white border-b border-slate-100 px-8 flex items-center justify-between sticky top-0 z-40">
         <div className="flex items-center gap-4">
           <div className="w-10 h-10 bg-slate-100 animate-pulse rounded-xl" />
           <div className="w-24 h-4 bg-slate-100 animate-pulse rounded-full" />
         </div>
       </header>
     );
  }

  return (
    <>
      <header className="flex-none h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-6">
          <button
            onClick={() => setIsOpen(true)}
            className="p-3 hover:bg-slate-50 rounded-2xl transition-colors border border-slate-100 group shadow-sm active:scale-95"
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <span className="w-6 h-0.5 bg-slate-900 rounded-full transition-all group-hover:w-4" />
              <span className="w-6 h-0.5 bg-slate-900 rounded-full" />
              <span className="w-4 h-0.5 bg-slate-900 rounded-full transition-all group-hover:w-6" />
            </div>
          </button>

          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white font-black text-lg shadow-lg`}>
              {brand.name.charAt(0)}
            </div>
            <div className="hidden sm:block">
              <span className="text-lg font-black text-slate-900 tracking-tighter uppercase">
                {brand.name.substring(0, brand.name.length - 4)}
                <span className="text-indigo-500">{brand.name.substring(brand.name.length - 4)}</span>
              </span>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{brand.sub}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
           <div className="hidden md:flex flex-col items-end mr-1">
             <p className="text-xs font-black text-slate-800">{user.name}</p>
             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{user.role}</p>
           </div>
           <div className={`w-10 h-10 rounded-xl ${brand.color} flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/10`}>
             {user.initial}
           </div>
           <button
             onClick={handleLogout}
             className="p-2.5 rounded-xl bg-slate-50 text-slate-400 border border-slate-100 hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all shadow-sm active:scale-95"
             title="ออกจากระบบ"
           >
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
             </svg>
           </button>
        </div>
      </header>

      <div 
        className={`fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] transition-all duration-500 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsOpen(false)}
      />

      <aside
        className={`fixed top-0 left-0 h-full w-80 bg-[#0f172a] text-white z-[201] flex flex-col transform transition-transform duration-500 ease-out shadow-[25px_0_60px_-15px_rgba(0,0,0,0.5)] ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex-none p-8 border-b border-white/5 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black tracking-tighter uppercase">
              RMUTI<span className="text-indigo-400">Care</span>
            </h2>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-1">{brand.sub}</p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all border border-white/5"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-none px-8 py-10 flex items-center gap-4 bg-gradient-to-r from-white/[0.03] to-transparent">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center font-black text-xl shadow-2xl shadow-indigo-600/30">
            {user.initial}
          </div>
          <div className="overflow-hidden">
            <p className="text-base font-black text-white truncate">{user.name}</p>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">{user.role}</p>
          </div>
        </div>

        <nav className="flex-grow p-6 overflow-y-auto">
          <ul className="space-y-2 pb-10">
            {navItems.map((item) => {
              const active = isActive(item.href);
              const IconComp = (SidebarIcons as any)[item.icon] || SidebarIcons.Home;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold transition-all duration-300 ${
                      active
                        ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/20 translate-x-2"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <div className={`${active ? "text-white" : "text-slate-500"} transition-colors`}>
                      <IconComp className="w-5 h-5" />
                    </div>
                    {item.label}
                  </Link>
                </li>
              );
            })}
            
            <li className="pt-6 mt-6 border-t border-white/10">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-black text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all uppercase tracking-[0.15em] active:scale-95"
              >
                <SidebarIcons.LogOut className="w-6 h-6" />
                <span>Sign Out</span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
}
