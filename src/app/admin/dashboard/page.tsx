import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";
import prisma from "@/lib/prisma";
import TeacherDashboard from "@/components/dashboards/TeacherDashboard";
import OperatorDashboard from "@/components/dashboards/OperatorDashboard";
import FullAdminDashboard from "@/components/dashboards/FullAdminDashboard";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).type !== "staff") {
    redirect("/admin/login");
  }

  const userRole = (session.user as any).role;
  const adminId = (session.user as any).id;
  const { faculty, major } = session.user as any;

  // Build Scoping Filter (Must match the API logic)
  const baseWhere: any = {};
  if (userRole === 1) {
    baseWhere.assignedStaffId = adminId;
  } else if (userRole === 2) {
    baseWhere.student = {};
    if (faculty) baseWhere.student.faculty = faculty;
    if (major) baseWhere.student.major = major; // If major is set, filter by it. If null, show whole faculty.
  }

  // กำหนดเวลาต้นเดือนถึงสิ้นเดือนนี้
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // ดึงข้อมูลสถิติ
  const [newCases, criticalCases, myCases, completedThisMonth, recentComplaints, typeStats] =
    await Promise.all([
      prisma.complaint.count({ where: { ...baseWhere, status: 0 } }),
      prisma.complaint.count({
        where: { ...baseWhere, priority: { gte: 4 }, status: { not: 3 } },
      }),
      prisma.complaint.count({
        where: { ...baseWhere, assignedStaffId: adminId, status: { not: 3 } },
      }),
      prisma.complaint.count({
        where: { ...baseWhere, status: 3, updatedAt: { gte: startOfMonth } },
      }),

      // ดึง 5 รายการล่าสุดมาแสดงโชว์
      prisma.complaint.findMany({
        where: baseWhere,
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { student: { select: { name: true } } },
      }),

      // ดึงสถิติตามหมวดหมู่
      prisma.complaint.groupBy({
        where: baseWhere,
        by: ['type'],
        _count: { _all: true }
      })
    ]);

  const stats = { newCases, criticalCases, myCases, completedThisMonth };

  // Serialize dates for Client Components
  const serializedComplaints = JSON.parse(JSON.stringify(recentComplaints));
  const serializedTypeStats = JSON.parse(JSON.stringify(typeStats));

  return (
    <div className="pb-20">
      {userRole === 3 && (
        <FullAdminDashboard 
          stats={stats} 
          recentComplaints={serializedComplaints} 
          typeStats={serializedTypeStats}
        />
      )}
      
      {userRole === 2 && (
        <OperatorDashboard 
          stats={stats} 
          recentComplaints={serializedComplaints} 
        />
      )}

      {userRole === 1 && (
        <TeacherDashboard 
          stats={stats} 
          recentComplaints={serializedComplaints} 
        />
      )}
    </div>
  );
}
