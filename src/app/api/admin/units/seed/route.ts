import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

const DEFAULT_UNITS = [
  { Unit_id: 100, Unit_name: "คณะวิศวกรรมศาสตร์และเทคโนโลยี", Unit_type: "faculty", Unit_icon: "⚙️" },
  { Unit_id: 200, Unit_name: "คณะศิลปกรรมและออกแบบอุตสาหกรรม", Unit_type: "faculty", Unit_icon: "🎨" },
  { Unit_id: 300, Unit_name: "คณะบริหารธุรกิจ", Unit_type: "faculty", Unit_icon: "📊" },
  { Unit_id: 101, Unit_name: "สาขาวิศวกรรมคอมพิวเตอร์", Unit_type: "major", Unit_icon: "💻", Unit_parent_id: 100 },
  { Unit_id: 102, Unit_name: "สาขาวิศวกรรมไฟฟ้า", Unit_type: "major", Unit_icon: "⚡", Unit_parent_id: 100 },
  { Unit_id: 301, Unit_name: "สาขาการจัดการทั่วไป", Unit_type: "major", Unit_icon: "🏢", Unit_parent_id: 300 },
];

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role < 3) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    for (const unit of DEFAULT_UNITS) {
      await prisma.organizationUnit.upsert({
        where: { Unit_id: unit.Unit_id },
        update: {
          Unit_name: unit.Unit_name,
          Unit_type: unit.Unit_type,
          Unit_icon: unit.Unit_icon,
          Unit_parent_id: unit.Unit_parent_id || null,
        },
        create: {
          Unit_id: unit.Unit_id,
          Unit_name: unit.Unit_name,
          Unit_type: unit.Unit_type,
          Unit_icon: unit.Unit_icon,
          Unit_parent_id: unit.Unit_parent_id || null,
        },
      });
    }
    return NextResponse.json({ success: true, message: "Restored default units" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to seed units" }, { status: 500 });
  }
}
