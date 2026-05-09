"use client";

import React, { useEffect, useState } from "react";
import UnifiedSidebar from "@/components/UnifiedSidebar";
import SecondaryAdminBar from "@/components/SecondaryAdminBar";
import ToastHandler from "@/components/ToastHandler";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

/**
 * Admin Layout (Client Side)
 * Fixed: Uses pathname to intelligently show/hide navbar, 
 * avoiding the session-lag issue that hid navbar for Operators.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isLoginPage = pathname === "/admin/login";
  const user = session?.user as any;
  const userRole = user ? Number(user.role) : 0;
  const userName = user?.name || user?.username || "Staff User";
  const userInitial = String(userName || "S").charAt(0).toUpperCase();

  const roleName = 
    userRole === 3 ? "ผู้ดูแลระบบ (Admin)" : 
    userRole === 2 ? "ผู้ดำเนินการ (Operator)" : 
    userRole === 1 ? "อาจารย์ที่ปรึกษา" : "Staff";

  const navItems = (() => {
    switch (userRole) {
      case 3: // Admin
        return [
          { label: "แดชบอร์ดสรุปผล", href: "/admin/dashboard", icon: "Chart" },
          { label: "จัดการข้อร้องเรียน", href: "/admin/complaints", icon: "Briefcase" },
          { label: "การมอบหมายงาน", href: "/admin/assignments", icon: "CheckSquare" },
          { label: "จัดการผู้ใช้งาน", href: "/admin/users", icon: "Users" },
          { label: "จัดการเจ้าหน้าที่", href: "/admin/staff", icon: "Users" },
          { label: "จัดการนักศึกษา", href: "/admin/students", icon: "User" },
          { label: "รายงานสถิติ", href: "/admin/reports", icon: "Chart" },
          { label: "ตั้งค่าหน่วยงาน", href: "/admin/units", icon: "Shield" },
          { label: "ตั้งค่าระบบ", href: "/admin/settings", icon: "Settings" },
        ];
      case 2: // Operator
        return [
          { label: "แดชบอร์ด", href: "/admin/dashboard", icon: "Chart" },
          { label: "จัดการเรื่องร้องเรียน", href: "/admin/complaints", icon: "Briefcase" },
          { label: "งานที่รับผิดชอบ", href: "/admin/assignments", icon: "CheckSquare" },
          { label: "รายงานสถิติ", href: "/admin/reports", icon: "Chart" },
          { label: "คู่มือการใช้งาน", href: "/admin/manual", icon: "BookOpen" },
          { label: "โปรไฟล์ของฉัน", href: "/admin/profile", icon: "User" },
        ];
      default: // Teacher/Staff
        return [
          { label: "หน้าหลัก", href: "/admin/dashboard", icon: "Home" },
          { label: "งานที่ได้รับมอบหมาย", href: "/admin/assignments", icon: "CheckSquare" },
          { label: "คู่มืออาจารย์", href: "/admin/manual", icon: "BookOpen" },
          { label: "โปรไฟล์", href: "/admin/profile", icon: "User" },
        ];
    }
  })();

  // 1. If we are on the login page, hide everything except content
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
        brand={{ name: "RMUTI Complaint System", sub: "Staff Portal", color: userRole === 3 ? "bg-slate-900" : "bg-indigo-600" }}
        navItems={navItems}
        user={{
          name: userName,
          initial: userInitial,
          role: roleName
        }}
      />

      <main className="flex-grow flex flex-col">
        <SecondaryAdminBar 
          userData={{
            name: userName,
            role: userRole,
            faculty: user?.faculty,
            major: user?.major
          }} 
        />

        <div className="flex-grow p-4 md:p-10">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
