import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { STATUS_LABELS } from "@/lib/constants";
import { sendStatusEmail } from "@/lib/mail";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const isStaff = (session.user as any).type === "staff";
  const userId = (session.user as any).id;
  const userRole = (session.user as any).role || 0;

  const current = await prisma.complaint.findUnique({ 
    where: { id },
    include: { student: { select: { name: true, studentId: true, email: true, faculty: true, major: true } } }
  });
  if (!current) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // เช็คสิทธิ์การแก้ไข (Enforcement)
  if (isStaff) {
     if (userRole === 3) { /* Admin: OK */ }
     else if (userRole === 2) {
        // Operator: ต้องอยู่คณะเดียวกัน และถ้าลงสาขาต้องตรงกัน
        const { faculty, major } = session.user as any;
        if (faculty && current.student.faculty !== faculty) return NextResponse.json({ error: "Forbidden: Different Faculty" }, { status: 403 });
        if (major && current.student.major !== major) return NextResponse.json({ error: "Forbidden: Different Major" }, { status: 403 });
     } else if (userRole === 1) {
        // Staff: ต้องเป็นผู้ได้รับมอบหมาย
        if (current.assignedStaffId !== userId) return NextResponse.json({ error: "Forbidden: Not your assigned case" }, { status: 403 });
     }
  } else {
     // Student: ต้องเป็นเจ้าของ
     if (current.studentId !== userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const { status, priority, note, attachment, assignedStaffId, title, description, type, isAnonymous } = body;

  const isOperatorOrAdmin = userRole >= 2;

  const complaint = await prisma.complaint.update({
    where: { id },
    data: {
      ...(status !== undefined && isStaff && { status: Number(status) }),
      ...(priority !== undefined && isStaff && isOperatorOrAdmin && { priority: Number(priority) }),
      ...(assignedStaffId && isStaff && isOperatorOrAdmin && { assignedStaffId }),
      
      ...(title && !isStaff && current.status === 0 && { title }),
      ...(description && !isStaff && current.status === 0 && { description }),
      ...(type && !isStaff && current.status === 0 && { type: Number(type) }),
      ...(isAnonymous !== undefined && !isStaff && current.status === 0 && { isAnonymous }),
      ...(attachment !== undefined && !isStaff && current.status === 0 && { attachment }),
      ...(status !== undefined && !isStaff && current.status === 0 && Number(status) === 5 && { status: 5 }),
    },
  });

  await prisma.complaintHistory.create({
    data: {
      complaintId: id,
      status: complaint.status,
      note: note || null,
      actionById: isStaff ? userId : null,
    },
  });

  if (isStaff) {
    await prisma.notification.create({
      data: {
        userId: current.studentId,
        userType: "student",
        title: "📄 มีการอัปเดตในคำร้องของคุณ",
        message: note || `เจ้าหน้าที่ได้อัปเดตสถานะเป็น ${STATUS_LABELS[complaint.status]}`,
        link: `/student/complaints/${id}`
      }
    });

      const studentEmail = current.student.email;
      if (studentEmail) {
        await sendStatusEmail(
          studentEmail,
          current.student.name,
          complaint.title,
          STATUS_LABELS[complaint.status],
          note,
          complaint.status, // ส่ง status ไปเพื่อเลือกคำอธิบาย
          id, // ส่ง id ไปเพื่อทำลิงก์ตรงเข้าสู่ระบบ
          attachment // ส่งภาพหลักฐานจากฝั่ง Staff ไปโชว์ในอีเมล
        );
      }
  }

  return NextResponse.json({ success: true, complaint });
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const isStaff = (session.user as any).type === "staff";
  const userRole = (session.user as any).role || 0;
  const userId = (session.user as any).id;
  const { faculty, major } = session.user as any;

  const complaint = await prisma.complaint.findUnique({
    where: { id },
    include: {
      student: { select: { name: true, studentId: true, faculty: true, major: true, email: true } },
      assignedStaff: { select: { name: true, role: true } },
      histories: {
        include: { actionBy: { select: { name: true } } },
        orderBy: { createdAt: "asc" },
      },
      evaluation: true,
    },
  });

  if (!complaint) return NextResponse.json({ error: "ไม่พบข้อร้องเรียนนี้" }, { status: 404 });

  // Data Scoping Logic
  if (isStaff) {
    if (userRole === 3) { /* Admin: All */ }
    else if (userRole === 2) {
      if (faculty && complaint.student.faculty !== faculty) return NextResponse.json({ error: "Forbidden: Different Faculty" }, { status: 403 });
      if (major && complaint.student.major !== major) return NextResponse.json({ error: "Forbidden: Different Major" }, { status: 403 });
    } else if (userRole === 1) {
      if (complaint.assignedStaffId !== userId) return NextResponse.json({ error: "Forbidden: Not Assigned" }, { status: 403 });
    }
  } else {
    if (complaint.studentId !== userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json({ complaint });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const isStaff = (session.user as any).type === "staff";
  const userRole = (session.user as any).role || 0;
  const userId = (session.user as any).id;

  const complaint = await prisma.complaint.findUnique({ where: { id } });
  if (!complaint) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const isOwner = complaint.studentId === userId;
  const isAdmin = isStaff && userRole >= 3;

  if (!isOwner && !isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  if (!isAdmin && complaint.status !== 0) {
    return NextResponse.json({ error: "ไม่สามารถลบคำร้องที่อยู่ระหว่างดำเนินการได้" }, { status: 400 });
  }

  await prisma.complaint.delete({ where: { id } });
  return NextResponse.json({ success: true, message: "ลบคำร้องเรียบร้อยแล้ว" });
}
