export interface NavItem {
  label: string;
  href: string;
  icon: string;
}

export const ADMIN_NAV_ITEMS: NavItem[] = [
  { label: "แดชบอร์ดสรุปผล", href: "/admin/dashboard", icon: "Chart" },
  { label: "จัดการข้อร้องเรียน", href: "/admin/complaints", icon: "Briefcase" },
  { label: "การมอบหมายงาน", href: "/admin/assignments", icon: "CheckSquare" },
  { label: "รายงานสถิติ", href: "/admin/reports", icon: "Chart" },
  { label: "จัดการเจ้าหน้าที่", href: "/admin/staff", icon: "Users" },
  { label: "จัดการนักศึกษา", href: "/admin/students", icon: "User" },
  { label: "ตั้งค่าหน่วยงาน", href: "/admin/units", icon: "Shield" },
  { label: "ตั้งค่าระบบ", href: "/admin/settings", icon: "Settings" },
];

export const OPERATOR_NAV_ITEMS: NavItem[] = [
  { label: "แดชบอร์ด", href: "/admin/dashboard", icon: "Chart" },
  { label: "จัดการเรื่องร้องเรียน", href: "/admin/complaints", icon: "Briefcase" },
  { label: "รายงานสถิติ", href: "/admin/reports", icon: "Chart" },
  { label: "คู่มือการใช้งาน", href: "/admin/manual", icon: "BookOpen" },
  { label: "โปรไฟล์ของฉัน", href: "/admin/profile", icon: "User" },
];

export const TEACHER_NAV_ITEMS: NavItem[] = [
  { label: "หน้าหลัก", href: "/admin/dashboard", icon: "Home" },
  { label: "เรื่องที่ได้รับมอบหมาย", href: "/admin/complaints", icon: "Briefcase" },
  { label: "คู่มืออาจารย์", href: "/admin/manual", icon: "BookOpen" },
  { label: "โปรไฟล์", href: "/admin/profile", icon: "User" },
];

export function getNavItemsByRole(role: number): NavItem[] {
  switch (role) {
    case 3:
      return ADMIN_NAV_ITEMS;
    case 2:
      return OPERATOR_NAV_ITEMS;
    case 1:
      return TEACHER_NAV_ITEMS;
    default:
      return [];
  }
}
