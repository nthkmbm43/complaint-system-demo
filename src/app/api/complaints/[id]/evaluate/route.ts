import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// POST /api/complaints/[id]/evaluate — ให้คะแนนประเมินผล (เฉพาะนักศึกษาเจ้าของ)
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).type !== "student") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const { score, comment } = body;

  if (!score || score < 1 || score > 5) {
    return NextResponse.json(
      { error: "กรุณาให้คะแนน 1-5 ดาว" },
      { status: 400 }
    );
  }

  // ตรวจสอบว่าคำร้องนี้เป็นของนักศึกษาคนนี้
  const complaint = await prisma.complaint.findUnique({
    where: { id },
    include: { evaluation: true },
  });

  if (!complaint) {
    return NextResponse.json({ error: "ไม่พบคำร้อง" }, { status: 404 });
  }

  if (complaint.studentId !== (session.user as any).id) {
    return NextResponse.json(
      { error: "ไม่มีสิทธิ์ประเมินผลคำร้องนี้" },
      { status: 403 }
    );
  }

  if (complaint.status !== 2) {
    return NextResponse.json(
      { error: "สามารถประเมินผลได้เฉพาะคำร้องที่อยู่ระหว่างรอประเมินเท่านั้น" },
      { status: 400 }
    );
  }

  if (complaint.evaluation) {
    return NextResponse.json(
      { error: "คำร้องนี้ได้รับการประเมินผลแล้ว" },
      { status: 400 }
    );
  }

  // Transaction to create evaluation and update complaint status
  const [evaluation] = await prisma.$transaction([
    prisma.evaluation.create({
      data: {
        complaintId: id,
        score: Number(score),
        comment: comment || null,
      },
    }),
    prisma.complaint.update({
      where: { id },
      data: { status: 3 },
    }),
    prisma.complaintHistory.create({
      data: {
        complaintId: id,
        status: 3,
        note: `ปิดงานอัตโนมัติ: นักศึกษาทำการประเมินผลความพึงพอใจ (คะแนน: ${score})`,
      }
    })
  ]);

  return NextResponse.json({ success: true, evaluation }, { status: 201 });
}

// GET /api/complaints/[id]/evaluate — ดูผลประเมิน
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const evaluation = await prisma.evaluation.findUnique({
    where: { complaintId: id },
  });

  return NextResponse.json({ evaluation });
}
