import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Seeding for Demo...');

  // 1. Clear existing data
  await prisma.complaintHistory.deleteMany();
  await prisma.evaluation.deleteMany();
  await prisma.complaint.deleteMany();
  await prisma.student.deleteMany();
  await prisma.staff.deleteMany();

  const hashedDefaultPassword = await bcrypt.hash('12345678', 10);

  // 2. Create Staff Accounts
  console.log('👤 Creating Staff Accounts...');
  const admin = await prisma.staff.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hashedDefaultPassword,
      name: 'นายสมเกียรติ แอดมิน',
      email: 'admin@rmuti.ac.th',
      role: 3,
      faculty: 'คณะวิศวกรรมศาสตร์',
    },
  });

  const operator = await prisma.staff.upsert({
    where: { username: 'operator' },
    update: {},
    create: {
      username: 'operator',
      password: hashedDefaultPassword,
      name: 'นางสาววิมล ปฏิบัติการ',
      email: 'operator@rmuti.ac.th',
      role: 2,
      faculty: 'คณะวิศวกรรมศาสตร์',
      major: 'วิศวกรรมคอมพิวเตอร์',
    },
  });

  const teacher = await prisma.staff.upsert({
    where: { username: 'teacher' },
    update: {},
    create: {
      username: 'teacher',
      password: hashedDefaultPassword,
      name: 'ดร.สมศรี อาจารย์',
      email: 'teacher@rmuti.ac.th',
      role: 1,
      faculty: 'คณะวิศวกรรมศาสตร์',
      major: 'วิศวกรรมคอมพิวเตอร์',
    },
  });

  // 3. Create Student Account
  console.log('🎓 Creating Student Account...');
  const student = await prisma.student.upsert({
    where: { studentId: '6612345678' },
    update: {},
    create: {
      studentId: '6612345678',
      password: hashedDefaultPassword,
      name: 'นายขยัน เรียนดี',
      email: 'khayan.st@rmuti.ac.th',
      faculty: 'คณะวิศวกรรมศาสตร์',
      major: 'วิศวกรรมคอมพิวเตอร์',
    },
  });

  console.log('✅ Demo Seeding Finished!');
  console.log('-----------------------------------');
  console.log('Demo Login Accounts (Password: 12345678):');
  console.log('Admin: admin');
  console.log('Operator: operator');
  console.log('Teacher: teacher');
  console.log('Student: 6612345678');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
