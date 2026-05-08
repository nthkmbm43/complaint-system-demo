"use client";

import React, { useState, useEffect } from "react";
import UnifiedSidebar from "@/components/UnifiedSidebar";
import NotificationBell from "@/components/NotificationBell";
import BackButton from "@/components/BackButton";
import ToastHandler from "@/components/ToastHandler";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

const NAV_ITEMS: any[] = [
  { href: "/student/dashboard", label: "ภาพรวมระบบ (Dashboard)", icon: "Home" },
  { href: "/student/complaints/new", label: "สร้างแบบคำร้องใหม่", icon: "Plus" },
  { href: "/student/complaints", label: "ประวัติคำร้องของฉัน", icon: "List" },
  { href: "/student/profile", label: "โปรไฟล์ส่วนตัว", icon: "User" },
];

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isLoginPage = pathname === "/student/login" || pathname === "/student/register";
  const user = session?.user as any;
  const userName = user?.name || "นักศึกษา";
  const userInitial = String(userName).charAt(0).toUpperCase() || "S";

  // 1. Hide navbar on login/register pages
  if (isLoginPage) {
    return (
      <div className="min-h-screen bg-slate-50">
        <ToastHandler />
        {children}
      </div>
    );
  }

  // 2. Prevent hydration mismatch
  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <ToastHandler />
      
      <UnifiedSidebar 
        brand={{ name: "RMUTICare", sub: "Student Portal", color: "bg-indigo-600" }}
        navItems={NAV_ITEMS}
        user={{
          name: userName,
          initial: userInitial,
          role: "นักศึกษา"
        }}
      />

      <main className="flex-grow pt-20 flex flex-col h-screen overflow-hidden">
        {/* Sub Header */}
        <div className="bg-white/50 backdrop-blur-md px-8 py-3 border-b border-slate-100 hidden md:flex items-center justify-between">
           <div className="flex items-center gap-4">
             <BackButton />
             <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
               <span>Portal</span>
               <span className="text-slate-300">/</span>
               <span className="text-indigo-600">Dashboard</span>
             </div>
           </div>
           {session && <NotificationBell userType="student" />}
        </div>

        {/* Content Area */}
        <div className="flex-grow p-4 md:p-10 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
