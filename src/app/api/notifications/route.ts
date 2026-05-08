import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id;
  const isStudent = (session.user as any).type === "student";

  // ดึงประวัติการอัปเดตล่าสุดที่เกี่ยวข้อง
  // สำหรับนักศึกษา: ดึง History ของคำร้องตัวเอง (ที่สถานะไม่ใช่ 0)
  // สำหรับ Staff: ดึง History ของเคสที่ตัวเองดูแล หรือเคสใหม่ (แล้วแต่จะเลือก)
  
  if (isStudent) {
    const notifications = await prisma.complaintHistory.findMany({
      where: {
        complaint: { studentId: userId },
        status: { not: 0 } // ไม่เอาตอนยื่นเรื่องครั้งแรก
      },
      include: {
        complaint: { select: { title: true, id: true } },
        actionBy: { select: { name: true } }
      },
      orderBy: { createdAt: "desc" },
      take: 10
    });

    return NextResponse.json({ notifications });
  } else {
    // สำหรับ Staff: แจ้งเตือนเมื่อมีเคสใหม่ยื่นเข้ามา (Status 0)
    const notifications = await prisma.complaint.findMany({
      where: { status: 0 },
      orderBy: { createdAt: "desc" },
      take: 10
    });
    
    // แปลงให้รูปแบบใกล้เคียงกัน
    const formatted = notifications.map(n => ({
      id: n.id,
      createdAt: n.createdAt,
      complaint: { title: n.title, id: n.id },
      note: "มีข้อร้องเรียนใหม่ยื่นเข้าสู่ระบบ",
      isNewCase: true
    }));

    return NextResponse.json({ notifications: formatted });
  }
}
