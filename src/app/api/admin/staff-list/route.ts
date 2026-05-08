import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).type !== "staff") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { faculty, major } = session.user as any;

  // ดึงรายชื่อเจ้าหน้าที่ (Role 1) ในสังกัดเดียวกัน
  const staffMembers = await prisma.staff.findMany({
    where: {
      role: 1,
      faculty: faculty || undefined,
      major: major || undefined,
    },
    select: {
      id: true,
      name: true,
      faculty: true,
      major: true,
    }
  });

  return NextResponse.json({ staffMembers });
}
