import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role < 2) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const userRole = (session.user as any).role;
  const { faculty: userFaculty, major: userMajor } = session.user as any;

  // Filters from query params
  const faculty = searchParams.get("faculty");
  const major = searchParams.get("major");
  const type = searchParams.get("type");
  const priority = searchParams.get("priority");
  const status = searchParams.get("status");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  // Build Scoping & Filter Object
  const where: any = {};
  
  // 1. Force Scoping based on Role
  if (userRole === 2) {
    where.student = {};
    if (userFaculty) where.student.faculty = userFaculty;
    if (userMajor) where.student.major = userMajor;
  }

  // 2. Apply Optional Filters (only if within scope)
  if (userRole === 3) {
    // Admin can filter anything
    if (faculty) {
      if (!where.student) where.student = {};
      where.student.faculty = faculty;
    }
    if (major) {
      if (!where.student) where.student = {};
      where.student.major = major;
    }
  } else {
    // Operator (Role 2) can only filter within their faculty if they are at faculty level
    if (!userMajor && major) {
      if (!where.student) where.student = {};
      where.student.major = major;
    }
  }

  if (type) where.type = Number(type);
  if (priority) where.priority = Number(priority);
  if (status) where.status = Number(status);
  
  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt.gte = new Date(startDate);
    if (endDate) {
      const d = new Date(endDate);
      d.setHours(23, 59, 59, 999);
      where.createdAt.lte = d;
    }
  }

  // Fetch Data
  const [complaints, evaluationStats] = await Promise.all([
    prisma.complaint.findMany({
      where,
      include: {
        student: { select: { faculty: true, major: true } },
        evaluation: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.evaluation.findMany({
      where: { complaint: where },
      select: { score: true }
    })
  ]);

  // Aggregations
  const total = complaints.length;
  const statusStats = complaints.reduce((acc: any, c) => {
    acc[c.status] = (acc[c.status] || 0) + 1;
    return acc;
  }, {});

  const typeStats = complaints.reduce((acc: any, c) => {
    acc[c.type] = (acc[c.type] || 0) + 1;
    return acc;
  }, {});

  const priorityStats = complaints.reduce((acc: any, c) => {
    acc[c.priority] = (acc[c.priority] || 0) + 1;
    return acc;
  }, {});

  const avgRating = evaluationStats.length > 0
    ? (evaluationStats.reduce((sum, e) => sum + e.score, 0) / evaluationStats.length).toFixed(1)
    : "0.0";

  return NextResponse.json({
    total,
    statusStats,
    typeStats,
    priorityStats,
    avgRating,
    evaluationCount: evaluationStats.length,
    // Return a summary of the filtered complaints for list view or charts
    complaints: complaints.map(c => ({
      id: c.id,
      status: c.status,
      type: c.type,
      priority: c.priority,
      createdAt: c.createdAt,
      rating: c.evaluation?.score || null
    }))
  });
}
