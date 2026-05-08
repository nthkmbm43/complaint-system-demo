"use client";

import React from "react";
import { usePathname } from "next/navigation";
import BackButton from "@/components/BackButton";
import NotificationBell from "@/components/NotificationBell";

export default function SecondaryAdminBar({ userData }: { userData: any }) {
  const pathname = usePathname();
  
  // Don't show back button on dashboard pages
  const isDashboard = pathname.endsWith("/admin/dashboard") || pathname === "/admin";

  return (
    <div className="flex-none bg-white border-b border-slate-200 px-8 py-3 hidden md:flex items-center justify-between shadow-sm z-10">
      <div className="flex items-center gap-4">
        {!isDashboard && <BackButton />}
        <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
          <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg border border-slate-200">RMUTI CARE</span>
          <span className="text-slate-200 text-xs font-normal">/</span>
          <span className="text-slate-900">{userData?.faculty || "ADMINISTRATION"}</span>
          {userData?.major && (
            <>
              <span className="text-slate-200 text-xs font-normal">/</span>
              <span className="text-indigo-600">{userData.major}</span>
            </>
          )}
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="text-right">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Authenticated as</p>
          <p className="text-[11px] font-black text-slate-800 leading-none">{userData?.role === 3 ? 'Master Admin' : userData?.role === 2 ? 'Operator' : 'Staff'}</p>
        </div>
        <NotificationBell userType="staff" />
      </div>
    </div>
  );
}
