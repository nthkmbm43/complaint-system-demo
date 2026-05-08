import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).type !== "student") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { email } = await req.json();
  const studentId = (session.user as any).id;

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "กรุณาระบุอีเมลที่ถูกต้อง" }, { status: 400 });
  }

  try {
    // Check uniqueness strictly for OTHER users
    const existing = await prisma.student.findFirst({ 
      where: { 
        email,
        id: { not: studentId }
      } 
    });
    if (existing) {
      return NextResponse.json({ error: "อีเมลนี้มีผู้ใช้งานอื่นในระบบแล้ว ไม่สามารถใช้ซ้ำได้" }, { status: 409 });
    }

    await prisma.student.update({
      where: { id: studentId },
      data: { email }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Update Email Error:", error);
    return NextResponse.json({ error: `System Error: ${error.message}` }, { status: 500 });
  }
}
