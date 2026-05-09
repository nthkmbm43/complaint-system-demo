import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

// GET /api/admin/users — ดึงรายชื่อผู้ใช้งานทั้งหมด (Admin เท่านั้น)
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role < 3) {
    return NextResponse.json({ error: "Forbidden: Admin only" }, { status: 403 });
  }

  let staffList: any[] = [];
  let studentList: any[] = [];

  try {
    const results = await Promise.all([
      prisma.staff.findMany({
        select: { 
          id: true, 
          username: true, 
          name: true, 
          role: true, 
          faculty: true,
          major: true,
          createdAt: true,
          _count: {
            select: { assignedComplaints: { where: { status: { not: 3 } } } }
          }
        },
        orderBy: { role: "desc" },
      }),
      prisma.student.findMany({
        select: { id: true, studentId: true, name: true, faculty: true, major: true, createdAt: true, email: true },
        orderBy: { createdAt: "desc" },
      }),
    ]);
    staffList = results[0];
    studentList = results[1];
  } catch (error) {
    console.error("Fetch Users API Error:", error);
    // Return empty lists if DB is not ready to prevent frontend crash
  }

  return NextResponse.json({ staff: staffList, students: studentList });
}

// POST /api/admin/users — สร้างผู้ใช้งานใหม่ (Admin เท่านั้น)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role < 3) {
    return NextResponse.json({ error: "Forbidden: Admin only" }, { status: 403 });
  }

  const body = await req.json();
  const { userType, username, name, password, role, studentId, faculty, major } = body;

  const hashedPassword = await bcrypt.hash(password, 10);

  if (userType === "staff") {
    const staff = await prisma.staff.create({
      data: { username, name, password: hashedPassword, role: Number(role) || 1 },
    });
    return NextResponse.json({ success: true, user: staff }, { status: 201 });
  } else {
    const student = await prisma.student.create({
      data: { studentId, name, password: hashedPassword, faculty, major },
    });
    return NextResponse.json({ success: true, user: student }, { status: 201 });
  }
}

// PATCH /api/admin/users — แก้ไขผู้ใช้งาน (Admin เท่านั้น)
export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role < 3) {
    return NextResponse.json({ error: "Forbidden: Admin only" }, { status: 403 });
  }

  const body = await req.json();
  const { id, userType, name, password, role, faculty, major, email } = body;

  if (!id || !userType) {
    return NextResponse.json({ error: "Missing ID or Type" }, { status: 400 });
  }

  const data: any = { name };
  if (password) {
    data.password = await bcrypt.hash(password, 10);
  }

  if (userType === "staff") {
    data.role = Number(role);
    await prisma.staff.update({ where: { id }, data });
  } else {
    data.faculty = faculty;
    data.major = major;
    if (email !== undefined) data.email = email || null;
    await prisma.student.update({ where: { id }, data });
  }

  return NextResponse.json({ success: true, message: "อัปเดตผู้ใช้งานเรียบร้อยแล้ว" });
}

// DELETE /api/admin/users — ลบผู้ใช้งาน (Admin เท่านั้น)
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role < 3) {
    return NextResponse.json({ error: "Forbidden: Admin only" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const id = searchParams.get("id");

  if (!id || !type) {
    return NextResponse.json({ error: "Missing ID or Type" }, { status: 400 });
  }

  try {
    if (type === "staff") {
      // 1. ป้องกันการลบตัวเอง
      if (id === (session.user as any).id) {
        return NextResponse.json({ error: "ไม่สามารถลบบัญชีตัวเองได้" }, { status: 400 });
      }

      // 2. เช็คว่าเป็น Admin หรือไม่
      const targetUser = await prisma.staff.findUnique({ where: { id } });
      if (targetUser?.role === 3) {
        // 3. ป้องกันการลบ Admin จนหมด (ต้องมีอย่างน้อย 1 คนในระบบ)
        const adminCount = await prisma.staff.count({ where: { role: 3 } });
        if (adminCount <= 1) {
          return NextResponse.json({ error: "ไม่สามารถลบ Admin คนสุดท้ายของระบบได้" }, { status: 400 });
        }
      }

      await prisma.staff.delete({ where: { id } });
    } else {
      await prisma.student.delete({ where: { id } });
    }

    return NextResponse.json({ success: true, message: "ลบผู้ใช้งานเรียบร้อยแล้ว" });
  } catch (error) {
    console.error("Delete User Error:", error);
    return NextResponse.json({ 
      error: "ไม่สามารถลบผู้ใช้งานได้ เนื่องจากมีข้อมูลที่เกี่ยวข้องอยู่ในระบบ (เช่น ประวัติการจัดการคำร้อง)" 
    }, { status: 400 });
  }
}
