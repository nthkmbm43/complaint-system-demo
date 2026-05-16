const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const students = await prisma.student.findMany();
  console.log("Students:", students.map(s => ({ id: s.id, studentId: s.studentId, name: s.name, email: s.email })));
}

check().catch(console.error).finally(() => prisma.$disconnect());
