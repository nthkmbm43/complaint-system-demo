import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function GET(req: NextRequest) {
  try {
    const hashedPassword = await bcrypt.hash("password123", 10);

    // 1. Reset Staff
    const staffData = [
      { username: "admin", name: "Administrator", role: 3 },
      { username: "operator", name: "Operator System", role: 2 },
      { username: "teacher", name: "Teacher Staff", role: 1 }
    ];

    for (const s of staffData) {
      await prisma.staff.upsert({
        where: { username: s.username },
        update: { password: hashedPassword, role: s.role },
        create: {
          username: s.username,
          password: hashedPassword,
          name: s.name,
          role: s.role,
          faculty: "",
          major: ""
        }
      });
    }

    // 2. Reset Test Student
    await prisma.student.upsert({
      where: { studentId: "1234567890123" },
      update: { password: hashedPassword, email: "test@student.rmuti.ac.th" },
      create: {
        studentId: "1234567890123",
        password: hashedPassword,
        name: "Test Student",
        email: "test@student.rmuti.ac.th",
        faculty: "วิศวกรรมศาสตร์",
        major: "วิศวกรรมคอมพิวเตอร์"
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: "Database default accounts reset to password 'password123'",
      accounts: ["admin", "operator", "teacher", "1234567890123"]
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
