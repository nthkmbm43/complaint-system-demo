import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// POST /api/complaints — ยื่นข้อร้องเรียนใหม่ (เฉพาะนักศึกษา)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = session.user as any;
  const body = await req.json();
  const { title, description, type, isAnonymous, attachment } = body;
  let { studentId } = body;

  // หากเป็น Admin/Staff ให้สิทธิ์ยื่นเรื่องได้ (เพื่อการทดสอบ)
  if (user.type !== "student" && user.role < 2) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // หากไม่มี studentId (เช่น แอดมินยื่นทดสอบ) ให้หา นศ. คนล่าสุดมาผูกไว้
  if (!studentId && user.type === "student") {
    studentId = user.id;
  } else if (!studentId) {
    const lastStudent = await prisma.student.findFirst({ orderBy: { createdAt: "desc" } });
    if (!lastStudent) return NextResponse.json({ error: "No students found to link test case" }, { status: 400 });
    studentId = lastStudent.id;
  }

  if (!title || !description || !type) {
    return NextResponse.json({ error: "กรุณากรอกข้อมูลให้ครบถ้วน" }, { status: 400 });
  }

  const complaint = await prisma.complaint.create({
    data: {
      title,
      description,
      type: Number(type),
      priority: 2, 
      isAnonymous: Boolean(isAnonymous),
      attachment: attachment || null,
      studentId: studentId,
      status: 0,
    },
  });

  // บันทึกประวัติสถานะเริ่มต้น
  await prisma.complaintHistory.create({
    data: {
      complaintId: complaint.id,
      status: 0,
      note: "ยื่นข้อร้องเรียนเข้าสู่ระบบ",
    },
  });
  
  const studentInfo = await prisma.student.findUnique({
    where: { id: studentId },
    select: { faculty: true, major: true }
  });

  // แจ้งเตือนเจ้าหน้าที่ในหน่วยงานที่เกี่ยวข้อง
  const staffs = await prisma.staff.findMany({
    where: {
      OR: [
        { role: 3 }, 
        {
          role: { gte: 1 },
          faculty: studentInfo?.faculty,
          // หากพนักงานมี Major ให้กรองเฉพาะ Major นั้น หากไม่มี (null) ให้แจ้งเตือนทุกคนในคณะ
          OR: [
             { major: studentInfo?.major },
             { major: null }
          ]
        }
      ]
    },
    select: { id: true }
  });

  if (staffs.length > 0) {
    await prisma.notification.createMany({
      data: staffs.map(s => ({
        userId: s.id,
        userType: "staff",
        title: "🆕 มีข้อร้องเรียนใหม่ในหน่วยงานของคุณ",
        message: `หัวข้อ: ${title}`,
        link: `/admin/complaints/${complaint.id}`
      }))
    });
  }

  return NextResponse.json({ success: true, complaint }, { status: 201 });
}

// GET /api/complaints — ดึงรายการคำร้อง (Scoped)
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = session.user as any;
  const isStudent = user.type === "student";

  const where: any = {};
  if (isStudent) {
    where.studentId = user.id;
  } else {
    const role = user.role || 0;
    const { faculty, major } = user;

    if (role === 3) {
      // แอดมิน (Role 3): เห็นทั้งหมด (where ว่าง)
      console.log("Admin Access: Fetching all complaints");
    } else if (role === 1) {
      // อาจารย์: ดูได้เฉพาะที่ได้รับมอบหมาย
      where.assignedStaffId = user.id;
    } else if (role === 2) {
      // เจ้าหน้าที่คณะ/สาขา: กรองตามสังกัด
      where.student = {};
      if (faculty) where.student.faculty = faculty;
      if (major) where.student.major = major;
    }
  }

  const complaints = await prisma.complaint.findMany({
    where,
    include: {
      student: {
        select: { name: true, studentId: true, faculty: true, major: true },
      },
      assignedStaff: {
        select: { name: true, role: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ complaints });
}
