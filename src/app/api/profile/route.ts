import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, email, faculty, major, currentPassword, newPassword } = body;
    const user = session.user as any;
    const userId = user.id;
    const userType = user.type; // 'student' or 'staff'

    // If changing password, verify current password
    let hashedPassword = undefined;
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ error: "กรุณาระบุรหัสผ่านปัจจุบัน" }, { status: 400 });
      }

      // Fetch user from DB to get current hash
      let dbUser;
      if (userType === "student") {
        dbUser = await prisma.student.findUnique({ where: { id: userId } });
      } else {
        dbUser = await prisma.staff.findUnique({ where: { id: userId } });
      }

      if (!dbUser) {
        return NextResponse.json({ error: "ไม่พบข้อมูลผู้ใช้" }, { status: 404 });
      }

      const isMatch = await bcrypt.compare(currentPassword, dbUser.password);
      if (!isMatch) {
        return NextResponse.json({ error: "รหัสผ่านปัจจุบันไม่ถูกต้อง" }, { status: 400 });
      }

      hashedPassword = await bcrypt.hash(newPassword, 10);
    }

    // Update DB
    if (userType === "student") {
      await prisma.student.update({
        where: { id: userId },
        data: {
          name: name || undefined,
          email: email || undefined,
          faculty: faculty || undefined,
          major: major || undefined,
          password: hashedPassword,
        },
      });
    } else {
      await prisma.staff.update({
        where: { id: userId },
        data: {
          name: name || undefined,
          email: email || undefined,
          password: hashedPassword,
        },
      });
    }

    return NextResponse.json({ success: true, message: "อัปเดตข้อมูลสำเร็จ" });

  } catch (error) {
    console.error("Profile Update Error:", error);
    return NextResponse.json({ error: "เกิดข้อผิดพลาดในการอัปเดตข้อมูล" }, { status: 500 });
  }
}
