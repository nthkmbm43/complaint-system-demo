import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/admin/units
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role < 3) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const units = await prisma.organizationUnit.findMany({
    orderBy: [{ Unit_type: "asc" }, { Unit_id: "asc" }],
  });

  return NextResponse.json({ units });
}

// POST /api/admin/units
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role < 3) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const { Unit_id, Unit_name, Unit_type, Unit_icon, Unit_parent_id, Unit_tel, Unit_email } = body;

  if (!Unit_id || !Unit_name || !Unit_type) {
    return NextResponse.json({ error: "กรุณากรอกข้อมูลที่จำเป็น (ID, ชื่อ, ประเภท)" }, { status: 400 });
  }

  const existing = await prisma.organizationUnit.findUnique({ where: { Unit_id: Number(Unit_id) } });
  if (existing) return NextResponse.json({ error: "Unit ID นี้มีอยู่แล้วในระบบ" }, { status: 400 });

  const unit = await prisma.organizationUnit.create({
    data: {
      Unit_id: Number(Unit_id),
      Unit_name,
      Unit_type,
      Unit_icon: Unit_icon || null,
      Unit_parent_id: Unit_parent_id ? Number(Unit_parent_id) : null,
      Unit_tel: Unit_tel || null,
      Unit_email: Unit_email || null,
    },
  });

  return NextResponse.json({ success: true, unit }, { status: 201 });
}

// PATCH /api/admin/units
export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role < 3) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const { Unit_id, Unit_name, Unit_type, Unit_icon, Unit_parent_id, Unit_tel, Unit_email } = body;

  if (!Unit_id) return NextResponse.json({ error: "Missing Unit ID" }, { status: 400 });

  const unit = await prisma.organizationUnit.update({
    where: { Unit_id: Number(Unit_id) },
    data: {
      Unit_name,
      Unit_type,
      Unit_icon: Unit_icon || null,
      Unit_parent_id: Unit_parent_id ? Number(Unit_parent_id) : null,
      Unit_tel: Unit_tel || null,
      Unit_email: Unit_email || null,
    },
  });

  return NextResponse.json({ success: true, unit });
}

// DELETE /api/admin/units?id=...
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role < 3) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

  await prisma.organizationUnit.delete({ where: { Unit_id: Number(id) } });
  return NextResponse.json({ success: true });
}
