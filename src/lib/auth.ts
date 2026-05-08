import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username / Student ID", type: "text" },
        password: { label: "Password", type: "password" },
        loginType: { label: "Login Type", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("กรุณากรอกข้อมูลให้ครบถ้วน");
        }

        const isStudent = credentials.loginType === "student";

        if (isStudent) {
          const student = await prisma.student.findUnique({
            where: { studentId: credentials.username },
          });
          if (!student) throw new Error("ไม่พบรหัสนักศึกษานี้ในระบบ");

          const passwordMatch = await bcrypt.compare(credentials.password, student.password);
          if (!passwordMatch) throw new Error("รหัสผ่านไม่ถูกต้อง");

          return {
            id: student.id,
            name: student.name,
            email: student.email, // ดึงจาก DB จริงๆ
            studentId: student.studentId,
            role: 0,
            type: "student",
            faculty: student.faculty,
            major: student.major,
          };
        } else {
          const staff = await prisma.staff.findUnique({
            where: { username: credentials.username },
          });
          if (!staff) throw new Error("ไม่พบชื่อผู้ใช้งานนี้ในระบบ");

          const passwordMatch = await bcrypt.compare(credentials.password, staff.password);
          if (!passwordMatch) throw new Error("รหัสผ่านไม่ถูกต้อง");

          return {
            id: staff.id,
            name: staff.name,
            email: `${staff.username}@rmuti.ac.th`, // เจ้าหน้าที่ใช้เมล์จำลองได้ก่อน
            username: staff.username,
            role: staff.role,
            type: "staff",
            faculty: staff.faculty,
            major: staff.major,
          };
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.type = (user as any).type;
        token.role = (user as any).role;
        token.studentId = (user as any).studentId;
        token.username = (user as any).username;
        token.faculty = (user as any).faculty;
        token.major = (user as any).major;
        // email is automatically copied by NextAuth, but we can be explicit
        if (user.email) token.email = user.email;
      }
      if (trigger === "update" && session) {
        if (session.email) token.email = session.email;
        if (session.name) token.name = session.name;
        if (session.faculty) token.faculty = session.faculty;
        if (session.major) token.major = session.major;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id;
        (session.user as any).type = token.type;
        (session.user as any).role = token.role;
        (session.user as any).studentId = token.studentId;
        (session.user as any).username = token.username;
        (session.user as any).faculty = token.faculty as string;
        (session.user as any).major = token.major as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/student/login",
    error: "/student/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET || "rmuti-complaint-secret-2025",
};
