import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { FACULTIES } from "@/data/units";

// POST /api/admin/units/seed — กู้คืนข้อมูลพื้นฐานเข้าสู่ Database
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role < 3) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const operations = [];

    for (const faculty of FACULTIES) {
      // 1. Create or Update Faculty
      operations.push(
        prisma.organizationUnit.upsert({
          where: { Unit_id: faculty.id },
          update: {
            Unit_name: faculty.name,
            Unit_icon: faculty.icon,
            Unit_type: "faculty",
          },
          create: {
            Unit_id: faculty.id,
            Unit_name: faculty.name,
            Unit_icon: faculty.icon,
            Unit_type: "faculty",
          },
        })
      );

      // 2. Create or Update Majors
      let majorIdCounter = faculty.id * 100 + 1;
      for (const major of faculty.majors) {
        operations.push(
          prisma.organizationUnit.upsert({
            where: { Unit_id: majorIdCounter },
            update: {
              Unit_name: major.name,
              Unit_icon: major.icon,
              Unit_type: "major",
              Unit_parent_id: faculty.id,
            },
            create: {
              Unit_id: majorIdCounter,
              Unit_name: major.name,
              Unit_icon: major.icon,
              Unit_type: "major",
              Unit_parent_id: faculty.id,
            },
          })
        );
        majorIdCounter++;
      }
    }

    await Promise.all(operations);

    return NextResponse.json({ success: true, message: "Data restored successfully" });
  } catch (error) {
    console.error("Seeding Error:", error);
    return NextResponse.json({ error: "Failed to restore data" }, { status: 500 });
  }
}
