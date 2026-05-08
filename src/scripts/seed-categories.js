const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const COMPLAINT_TYPES = [
  { id: 1, label: "ด้านการเรียนการสอน", icon: "📚", color: "indigo", bg: "bg-indigo-50", text: "text-indigo-600", border: "border-indigo-100" },
  { id: 2, label: "ด้านหลักสูตร", icon: "📜", color: "blue", bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-100" },
  { id: 3, label: "ด้านอาจารย์ผู้สอน", icon: "👨‍🏫", color: "emerald", bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-100" },
  { id: 4, label: "ด้านสิ่งสนับสนุนการเรียนฯ", icon: "🏢", color: "amber", bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-100" },
  { id: 5, label: "ด้านการลงทะเบียน/วัดผล", icon: "📝", color: "violet", bg: "bg-violet-50", text: "text-violet-600", border: "border-violet-100" },
  { id: 6, label: "ด้านสิ่งแวดล้อมและสวัสดิการ", icon: "🌳", color: "green", bg: "bg-green-50", text: "text-green-600", border: "border-green-100" },
  { id: 7, label: "ด้านการให้บริการของบุคลากร", icon: "👥", color: "rose", bg: "bg-rose-50", text: "text-rose-600", border: "border-rose-100" },
  { id: 8, label: "ด้านอื่นๆ", icon: "✨", color: "slate", bg: "bg-slate-50", text: "text-slate-600", border: "border-slate-100" },
];

async function main() {
  console.log("Seeding complaint categories...");
  for (const type of COMPLAINT_TYPES) {
    await prisma.complaintCategory.upsert({
      where: { id: type.id },
      update: type,
      create: type,
    });
  }
  console.log("Seeding completed.");
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
