import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST() {
  // Temporarily disabled for one-off cleanup
  /*
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role < 3) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  */

  try {
    await prisma.$transaction([
      prisma.evaluation.deleteMany(),
      prisma.complaintHistory.deleteMany(),
      prisma.notification.deleteMany(),
      prisma.complaint.deleteMany(),
    ]);

    return NextResponse.json({ success: true, message: "All complaint data cleared successfully." });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
