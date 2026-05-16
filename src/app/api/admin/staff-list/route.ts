import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).type !== "staff") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { role, faculty, major } = session.user as any;

  // ถ้าเป็น Operator (2) หรือ Admin (3) ให้เห็นทุกคน เพื่อโยนงานข้ามคณะได้
  // ถ้าเป็น Teacher (1) ให้เห็นเฉพาะในสาขาตัวเอง (หรือตามที่ระบบเดิมวางไว้)
  const whereClause: any = {};
  
  if (role < 2) {
    if (faculty) whereClause.faculty = faculty;
    if (major) whereClause.major = major;
    whereClause.role = 1; // อาจารย์ทั่วไปเห็นเฉพาะอาจารย์
  } else {
    // Operator/Admin เห็น Role 1 (อาจารย์) และ Role 2 (ผู้ดำเนินการคนอื่น)
    whereClause.role = { in: [1, 2] };
  }

  const staffMembers = await prisma.staff.findMany({
    where: whereClause,
    select: {
      id: true,
      name: true,
      faculty: true,
      major: true,
      role: true,
    },
    orderBy: [
      { faculty: 'asc' },
      { major: 'asc' },
      { name: 'asc' }
    ]
  });

  return NextResponse.json({ staffMembers });
}
