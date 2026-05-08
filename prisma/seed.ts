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

  // 4. Create Organization Units (Faculties & Majors)
  console.log('🏛️ Creating Organization Units...');
  const units = [
    { id: 1, name: 'คณะวิศวกรรมศาสตร์', type: 'faculty' },
    { id: 2, name: 'วิศวกรรมคอมพิวเตอร์', type: 'major', parent: 1 },
    { id: 3, name: 'วิศวกรรมไฟฟ้า', type: 'major', parent: 1 },
    { id: 4, name: 'วิศวกรรมเครื่องกล', type: 'major', parent: 1 },
    { id: 5, name: 'คณะบริหารธุรกิจและเทคโนโลยีสารสนเทศ', type: 'faculty' },
    { id: 6, name: 'ระบบสารสนเทศทางธุรกิจ', type: 'major', parent: 5 },
    { id: 7, name: 'การบัญชี', type: 'major', parent: 5 },
    { id: 8, name: 'คณะครุศาสตร์อุตสาหกรรม', type: 'faculty' },
    { id: 9, name: 'ครุศาสตร์โยธา', type: 'major', parent: 8 },
  ];

  for (const unit of units) {
    await prisma.organizationUnit.upsert({
      where: { Unit_id: unit.id },
      update: {
        Unit_name: unit.name,
        Unit_type: unit.type,
        Unit_parent_id: unit.parent || null
      },
      create: {
        Unit_id: unit.id,
        Unit_name: unit.name,
        Unit_type: unit.type,
        Unit_parent_id: unit.parent || null
      }
    });
  }

  // 5. Create Complaint Categories
  console.log('📁 Creating Complaint Categories...');
  const categories = [
    { id: 1, label: 'ด้านการเรียนการสอน', icon: '📚', color: 'indigo' },
    { id: 2, label: 'ด้านอาคารสถานที่', icon: '🏢', color: 'orange' },
    { id: 3, label: 'ด้านสวัสดิการและทุนการศึกษา', icon: '💰', color: 'green' },
    { id: 4, label: 'ด้านพฤติกรรมและการคุกคาม', icon: '🛡️', color: 'red' },
    { id: 5, label: 'ด้านเทคโนโลยีและอินเทอร์เน็ต', icon: '💻', color: 'blue' },
    { id: 6, label: 'ด้านการลงทะเบียนและเกรด', icon: '📝', color: 'amber' },
    { id: 7, label: 'ด้านความปลอดภัยและจราจร', icon: '🚦', color: 'slate' },
    { id: 8, label: 'ด้านอื่นๆ', icon: '✨', color: 'pink' }
  ];

  for (const cat of categories) {
    await prisma.complaintCategory.upsert({
      where: { id: cat.id },
      update: { label: cat.label, icon: cat.icon, color: cat.color },
      create: { id: cat.id, label: cat.label, icon: cat.icon, color: cat.color }
    });
  }

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
