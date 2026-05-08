export const ORGANIZATION_UNITS = [
  { id: 1, name: 'คณะครุศาสตร์อุตสาหกรรม', type: 'faculty', icon: '🎓' },
  { id: 2, name: 'คณะวิศวกรรมศาสตร์', type: 'faculty', icon: '⚙️' },
  { id: 3, name: 'คณะบริหารธุรกิจ', type: 'faculty', icon: '💼' },
  { id: 40, name: 'บริหาร', type: 'faculty', icon: '🔌' },
  
  { id: 18, name: 'ช่างโยธา (ปวส.)', type: 'major', icon: '🏗️', parentId: 1 },
  { id: 19, name: 'ช่างก่อสร้าง (ปวส.)', type: 'major', icon: '🧱', parentId: 1 },
  { id: 20, name: 'ช่างเครื่องมือกลอัตโนมัติ (ปวส.)', type: 'major', icon: '🤖', parentId: 1 },
  { id: 21, name: 'ช่างยนต์ (ปวส.)', type: 'major', icon: '🚗', parentId: 1 },
  { id: 22, name: 'ช่างกลเกษตร (ปวส.)', type: 'major', icon: '🚜', parentId: 1 },
  { id: 23, name: 'ช่างกลโรงงาน (ปวส.)', type: 'major', icon: '🏭', parentId: 1 },
  { id: 24, name: 'ช่างท่อและประสาน (ปวส.)', type: 'major', icon: '🔧', parentId: 1 },
  { id: 25, name: 'การออกแบบนวัตกรรมเครื่องจักรกล (ปวส.)', type: 'major', icon: '⚙️', parentId: 1 },
  
  { id: 26, name: 'วิศวกรรมไฟฟ้า', type: 'major', icon: '⚡', parentId: 2 },
  { id: 27, name: 'วิศวกรรมโยธา', type: 'major', icon: '🏗️', parentId: 2 },
  { id: 28, name: 'วิศวกรรมอิเล็กทรอนิกส์', type: 'major', icon: '🔟', parentId: 2 },
  { id: 29, name: 'วิศวกรรมคอมพิวเตอร์', type: 'major', icon: '💻', parentId: 2 },
  { id: 30, name: 'วิศวกรรมเมคคาทรอนิกส์', type: 'major', icon: '🤖', parentId: 2 },
  { id: 31, name: 'วิศวกรรมเครื่องกล', type: 'major', icon: '⚙️', parentId: 2 },
  { id: 32, name: 'วิศวกรรมเครื่องจักรกลเกษตร', type: 'major', icon: '🚜', parentId: 2 },
  { id: 33, name: 'วิศวกรรมอาหารและชีวภาพ', type: 'major', icon: '🧬', parentId: 2 },
  
  { id: 34, name: 'การบัญชี', type: 'major', icon: '📊', parentId: 3 },
  { id: 35, name: 'เทคโนโลยีธุรกิจดิจิทัล', type: 'major', icon: '💻', parentId: 3 },
  { id: 36, name: 'การตลาด', type: 'major', icon: '📈', parentId: 3 },
  { id: 37, name: 'โลจิสติกส์', type: 'major', icon: '📦', parentId: 3 },
  { id: 38, name: 'การจัดการ', type: 'major', icon: '👨💼', parentId: 3 },
  
  { id: 41, name: 'IT', type: 'major', icon: '🏢', parentId: 40 },
];

export const STATUS_LABELS: Record<number, string> = {
  0: "ยื่นคำร้อง",
  1: "กำลังดำเนินการ",
  2: "รอประเมิน",
  3: "เสร็จสิ้น",
  4: "ปฏิเสธ",
  5: "ยกเลิก",
};

export const COMPLAINT_TYPES = [
  { id: 1, label: "ด้านการเรียนการสอน", icon: "📚", color: "indigo", bg: "bg-indigo-50", text: "text-indigo-600", border: "border-indigo-100" },
  { id: 2, label: "ด้านหลักสูตร", icon: "📜", color: "blue", bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-100" },
  { id: 3, label: "ด้านอาจารย์ผู้สอน", icon: "👨‍🏫", color: "emerald", bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-100" },
  { id: 4, label: "ด้านสิ่งสนับสนุนการเรียนฯ", icon: "🏢", color: "amber", bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-100" },
  { id: 5, label: "ด้านการลงทะเบียน/วัดผล", icon: "📝", color: "violet", bg: "bg-violet-50", text: "text-violet-600", border: "border-violet-100" },
  { id: 6, label: "ด้านสิ่งแวดล้อมและสวัสดิการ", icon: "🌳", color: "green", bg: "bg-green-50", text: "text-green-600", border: "border-green-100" },
  { id: 7, label: "ด้านการให้บริการของบุคลากร", icon: "👥", color: "rose", bg: "bg-rose-50", text: "text-rose-600", border: "border-rose-100" },
  { id: 8, label: "ด้านอื่นๆ", icon: "✨", color: "slate", bg: "bg-slate-50", text: "text-slate-600", border: "border-slate-100" },
];

export const PRIORITY_CONFIG: Record<number, { label: string; color: string; bg: string }> = {
  1: { label: "ไม่เร่งด่วน", color: "text-slate-500", bg: "bg-slate-100" },
  2: { label: "ปกติ", color: "text-blue-600", bg: "bg-blue-50" },
  3: { label: "เร่งด่วน", color: "text-orange-600", bg: "bg-orange-50" },
  4: { label: "เร่งด่วนมาก", color: "text-red-600", bg: "bg-red-50" },
  5: { label: "วิกฤต", color: "text-white bg-red-600", bg: "bg-red-100" },
};
