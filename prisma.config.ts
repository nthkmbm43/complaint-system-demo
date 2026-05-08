import { defineConfig } from "prisma/config";
import "dotenv/config"; // สำคัญ: เพื่อให้อ่านค่าจาก .env ได้

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  // ลบส่วน datasource เก่าออก เพื่อให้ Prisma ไปใช้ค่าจาก schema.prisma และ .env โดยตรงครับ
});
