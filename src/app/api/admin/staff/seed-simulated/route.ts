import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role < 3) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const hashedPassword = await bcrypt.hash("12345678", 10);
    const units = await prisma.organizationUnit.findMany();
    
    const faculties = units.filter(u => u.Unit_type === "faculty");
    const majors = units.filter(u => u.Unit_type === "major");

    const newStaff = [];

    // 1. Create Operator for each Faculty
    for (const faculty of faculties) {
      newStaff.push({
        username: `op_fac_${faculty.Unit_id}`,
        password: hashedPassword,
        name: `ผู้ดำเนินการ (${faculty.Unit_name})`,
        role: 2,
        faculty: faculty.Unit_name,
        major: null,
        email: `op_fac_${faculty.Unit_id}@test.com`
      });
    }

    // 2. Create Teacher and Operator for each Major
    for (const major of majors) {
      const parentFaculty = faculties.find(f => f.Unit_id === major.Unit_parent_id);
      
      // Teacher
      newStaff.push({
        username: `teacher_${major.Unit_id}`,
        password: hashedPassword,
        name: `อาจารย์ ${major.Unit_name}`,
        role: 1,
        faculty: parentFaculty?.Unit_name || null,
        major: major.Unit_name,
        email: `teacher_${major.Unit_id}@test.com`
      });

      // Operator
      newStaff.push({
        username: `op_major_${major.Unit_id}`,
        password: hashedPassword,
        name: `ผู้ดำเนินการ (${major.Unit_name})`,
        role: 2,
        faculty: parentFaculty?.Unit_name || null,
        major: major.Unit_name,
        email: `op_major_${major.Unit_id}@test.com`
      });
    }

    // Upsert staff members
    for (const staff of newStaff) {
      await prisma.staff.upsert({
        where: { username: staff.username },
        update: {
          name: staff.name,
          role: staff.role,
          faculty: staff.faculty,
          major: staff.major,
          email: staff.email
        },
        create: staff
      });
    }

    return NextResponse.json({ 
      success: true, 
      message: `Successfully seeded ${newStaff.length} simulated staff members.`,
      count: newStaff.length
    });

  } catch (error: any) {
    console.error("Seeding Staff Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
