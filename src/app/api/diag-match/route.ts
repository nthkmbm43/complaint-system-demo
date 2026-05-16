import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const c = await prisma.complaint.findUnique({
    where: { id: "cmp86m3yt0001jo04f0uiyjwo" },
    include: { assignedStaff: true }
  });
  
  const s = await prisma.staff.findUnique({
    where: { username: "teacher_201" }
  });

  return NextResponse.json({
    complaint: c,
    teacher_201: s,
    match: c?.assignedStaffId === s?.id
  });
}
