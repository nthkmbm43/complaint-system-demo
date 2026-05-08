import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const units = [
    { Unit_id: 1, Unit_name: 'คณะครุศาสตร์อุตสาหกรรม', Unit_type: 'faculty', Unit_icon: '🎓' },
    { Unit_id: 2, Unit_name: 'คณะวิศวกรรมศาสตร์', Unit_type: 'faculty', Unit_icon: '⚙️' },
    { Unit_id: 3, Unit_name: 'คณะบริหารธุรกิจ', Unit_type: 'faculty', Unit_icon: '💼' },
    { Unit_id: 4, Unit_name: 'งานทะเบียนและประมวลผล', Unit_type: 'department', Unit_icon: '📋' },
    { Unit_id: 5, Unit_name: 'งานกิจการนักศึกษา', Unit_type: 'department', Unit_icon: '👥' },
    { Unit_id: 6, Unit_name: 'งานอาคารสถานที่', Unit_type: 'department', Unit_icon: '🏢' },
    { Unit_id: 7, Unit_name: 'งานเทคโนโลยีสารสนเทศ', Unit_type: 'department', Unit_icon: '💻' },
    { Unit_id: 8, Unit_name: 'งานการเงินและบัญชี', Unit_type: 'department', Unit_icon: '💰' },
    { Unit_id: 9, Unit_name: 'งานบุคลากร', Unit_type: 'department', Unit_icon: '👔' },
    { Unit_id: 10, Unit_name: 'งานประชาสัมพันธ์', Unit_type: 'department', Unit_icon: '📢' },
    { Unit_id: 11, Unit_name: 'งานวิเทศสัมพันธ์', Unit_type: 'department', Unit_icon: '🌍' },
    { Unit_id: 12, Unit_name: 'งานประกันคุณภาพการศึกษา', Unit_type: 'department', Unit_icon: '✅' },
    { Unit_id: 13, Unit_name: 'ศูนย์คอมพิวเตอร์', Unit_type: 'department', Unit_icon: '🖥️' },
    { Unit_id: 14, Unit_name: 'หอสมุดกลาง', Unit_type: 'department', Unit_icon: '📚' },
    { Unit_id: 15, Unit_name: 'งานรักษาความปลอดภัย', Unit_type: 'department', Unit_icon: '🔒' },
    { Unit_id: 16, Unit_name: 'งานยานพาหนะ', Unit_type: 'department', Unit_icon: '🚗' },
    { Unit_id: 17, Unit_name: 'งานสวัสดิการ', Unit_type: 'department', Unit_icon: '🏥' },
    { Unit_id: 18, Unit_name: 'ช่างโยธา (ปวส.)', Unit_type: 'major', Unit_icon: '🏗️', Unit_parent_id: 1 },
    { Unit_id: 19, Unit_name: 'ช่างก่อสร้าง (ปวส.)', Unit_type: 'major', Unit_icon: '🧱', Unit_parent_id: 1 },
    { Unit_id: 20, Unit_name: 'ช่างเครื่องมือกลอัตโนมัติ (ปวส.)', Unit_type: 'major', Unit_icon: '🤖', Unit_parent_id: 1 },
    { Unit_id: 21, Unit_name: 'ช่างยนต์ (ปวส.)', Unit_type: 'major', Unit_icon: '🚗', Unit_parent_id: 1 },
    { Unit_id: 22, Unit_name: 'ช่างกลเกษตร (ปวส.)', Unit_type: 'major', Unit_icon: '🚜', Unit_parent_id: 1 },
    { Unit_id: 23, Unit_name: 'ช่างกลโรงงาน (ปวส.)', Unit_type: 'major', Unit_icon: '🏭', Unit_parent_id: 1 },
    { Unit_id: 24, Unit_name: 'ช่างท่อและประสาน (ปวส.)', Unit_type: 'major', Unit_icon: '🔧', Unit_parent_id: 1 },
    { Unit_id: 25, Unit_name: 'การออกแบบนวัตกรรมเครื่องจักรกล (ปวส.)', Unit_type: 'major', Unit_icon: '⚙️', Unit_parent_id: 1 },
    { Unit_id: 26, Unit_name: 'วิศวกรรมไฟฟ้า', Unit_type: 'major', Unit_icon: '⚡', Unit_parent_id: 2 },
    { Unit_id: 27, Unit_name: 'วิศวกรรมโยธา', Unit_type: 'major', Unit_icon: '🏗️', Unit_parent_id: 2 },
    { Unit_id: 28, Unit_name: 'วิศวกรรมอิเล็กทรอนิกส์', Unit_type: 'major', Unit_icon: '🔟', Unit_parent_id: 2 },
    { Unit_id: 29, Unit_name: 'วิศวกรรมคอมพิวเตอร์', Unit_type: 'major', Unit_icon: '💻', Unit_parent_id: 2 },
    { Unit_id: 30, Unit_name: 'วิศวกรรมเมคคาทรอนิกส์', Unit_type: 'major', Unit_icon: '🤖', Unit_parent_id: 2 },
    { Unit_id: 31, Unit_name: 'วิศวกรรมเครื่องกล', Unit_type: 'major', Unit_icon: '⚙️', Unit_parent_id: 2 },
    { Unit_id: 32, Unit_name: 'วิศวกรรมเครื่องจักรกลเกษตร', Unit_type: 'major', Unit_icon: '🚜', Unit_parent_id: 2 },
    { Unit_id: 33, Unit_name: 'วิศวกรรมอาหารและชีวภาพ', Unit_type: 'major', Unit_icon: '🧬', Unit_parent_id: 2 },
    { Unit_id: 34, Unit_name: 'การบัญชี', Unit_type: 'major', Unit_icon: '📊', Unit_parent_id: 3 },
    { Unit_id: 35, Unit_name: 'เทคโนโลยีธุรกิจดิจิทัล', Unit_type: 'major', Unit_icon: '💻', Unit_parent_id: 3 },
    { Unit_id: 36, Unit_name: 'การตลาด', Unit_type: 'major', Unit_icon: '📈', Unit_parent_id: 3 },
    { Unit_id: 37, Unit_name: 'โลจิสติกส์', Unit_type: 'major', Unit_icon: '📦', Unit_parent_id: 3 },
    { Unit_id: 38, Unit_name: 'การจัดการ', Unit_type: 'major', Unit_icon: '👨💼', Unit_parent_id: 3 },
    { Unit_id: 40, Unit_name: 'บริหาร', Unit_type: 'faculty', Unit_icon: '🔌' },
    { Unit_id: 41, Unit_name: 'IT', Unit_type: 'major', Unit_icon: '🏢', Unit_parent_id: 40 },
  ];

  for (const unit of units) {
    await prisma.organizationUnit.upsert({
      where: { Unit_id: unit.Unit_id },
      update: unit,
      create: unit as any,
    });
  }
  console.log('Seeded organization units');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
