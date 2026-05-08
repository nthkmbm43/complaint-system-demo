import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";
import prisma from "@/lib/prisma";
import ReportDashboard from "@/components/ReportDashboard";

export default async function AdminReportsPage() {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role < 2) {
    redirect("/admin/login");
  }

  const userRole = (session.user as any).role || 0;
  
  // Fetch units for filtering options (especially for Admins)
  const units = await prisma.organizationUnit.findMany({
    orderBy: { Unit_name: "asc" }
  });

  return (
    <div className="pb-20">
      <ReportDashboard 
        initialUnits={units} 
        userRole={userRole}
      />
    </div>
  );
}
