import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { studentId, name, faculty, major, password, email } = body;

    // ตรวจสอบความถูกต้องเบื้องต้น
    if (!studentId || !name || !password || !email) {
      return NextResponse.json({ error: "กรุณากรอกข้อมูลสำคัญให้ครบถ้วน" }, { status: 400 });
    }

    if (studentId.length < 13) {
      return NextResponse.json({ error: "รหัสนักศึกษาต้องมีความยาว 13 หลัก" }, { status: 400 });
    }

    // เช็คว่ามีนักศึกษาคนนี้หรืออีเมลนี้แล้วหรือยัง
    const existingStudent = await prisma.student.findFirst({
      where: {
        OR: [
          { studentId },
          { email }
        ]
      },
    });

    if (existingStudent) {
      const field = existingStudent.studentId === studentId ? "รหัสนักศึกษา" : "อีเมล";
      return NextResponse.json({ error: `${field}นี้ได้ลงทะเบียนในระบบแล้ว` }, { status: 409 });
    }

    // เข้ารหัสรหัสผ่าน
    const hashedPassword = await bcrypt.hash(password, 10);

    // บันทึกลง Database
    const newStudent = await prisma.student.create({
      data: {
        studentId,
        name,
        email,
        faculty: faculty || "",
        major: major || "",
        password: hashedPassword,
      },
    });

    return NextResponse.json({ success: true, message: "ลงทะเบียนสำเร็จ", user: { id: newStudent.id, name: newStudent.name } }, { status: 201 });

  } catch (error) {
    console.error("Register Error:", error);
    return NextResponse.json({ error: "เกิดข้อผิดพลาดในการลงทะเบียน" }, { status: 500 });
  }
}
