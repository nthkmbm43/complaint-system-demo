"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import ModalAlert from "@/components/ModalAlert";
import { ORGANIZATION_UNITS } from "@/lib/constants";

interface Staff {
  id: string;
  username: string;
  name: string;
  role: number;
  createdAt: string;
}

interface Student {
  id: string;
  studentId: string;
  name: string;
  faculty?: string;
  major?: string;
  createdAt: string;
}

const ROLE_LABELS: Record<number, { label: string; color: string; bg: string }> = {
  1: { label: "อาจารย์ที่ปรึกษา", color: "text-blue-700", bg: "bg-blue-100" },
  2: { label: "ผู้ดำเนินการ", color: "text-purple-700", bg: "bg-purple-100" },
  3: { label: "ผู้ดูแลระบบ (Admin)", color: "text-red-700", bg: "bg-red-100" },
};

export default function AdminUsersPage() {
  const { data: session } = useSession();
  const [staff, setStaff] = useState<Staff[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [tab, setTab] = useState<"staff" | "students">("staff");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    userType: "staff",
    username: "",
    studentId: "",
    name: "",
    password: "",
    role: "1",
    faculty: "",
    major: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ type: "" as any, title: "", text: "" });
  const [deleteTarget, setDeleteTarget] = useState<{ id: string, name: string, type: "staff" | "student" } | null>(null);
  
  const faculties = ORGANIZATION_UNITS.filter(u => u.type === 'faculty');
  const selectedFacultyId = ORGANIZATION_UNITS.find(f => f.name === form.faculty)?.id;
  const availableMajors = ORGANIZATION_UNITS.filter(u => u.type === 'major' && u.parentId === selectedFacultyId);

  const fetchData = () => {
    fetch("/api/admin/users")
      .then((r) => r.json())
      .then((data) => {
        setStaff(data.staff || []);
        setStudents(data.students || []);
        setLoading(false);
      })
      .catch(() => setMsg({ type: "error", title: "ข้อผิดพลาดการโหลด", text: "ไม่สามารถโหลดข้อมูลผู้ใช้งานจากระบบได้" }));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg({ type: "", title: "", text: "" });

    const method = editingId ? "PATCH" : "POST";
    const res = await fetch("/api/admin/users", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingId ? { ...form, id: editingId } : form),
    });

    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setMsg({ type: "error", title: "เกิดข้อผิดพลาด", text: data.error });
    } else {
      setMsg({ 
        type: "success", 
        title: editingId ? "อัปเดตสำเร็จ" : "สร้างสำเร็จ", 
        text: editingId ? "ข้อมูลผู้ใช้งานอัปเดตเรียบร้อยแล้ว" : "ผู้ใช้งานใหม่พร้อมเข้าสู่ระบบแล้ว" 
      });
      setShowForm(false);
      setEditingId(null);
      setTab(form.userType === "student" ? "students" : "staff");
      setForm({ userType: "staff", username: "", studentId: "", name: "", password: "", role: "1", faculty: "", major: "" });
      fetchData();
    }
  };

  const startEdit = (type: string, user: any) => {
    setEditingId(user.id);
    setForm({
      userType: type === "student" ? "student" : "staff",
      username: user.username || "",
      studentId: user.studentId || "",
      name: user.name,
      password: "",
      role: String(user.role || "1"),
      faculty: user.faculty || "",
      major: user.major || "",
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const { id, type } = deleteTarget;
    setDeleteTarget(null);

    try {
      const res = await fetch(`/api/admin/users?id=${id}&type=${type}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        setMsg({ type: "error", title: "ไม่สามารถลบได้", text: data.error });
      } else {
        setMsg({ type: "success", title: "ลบสำเร็จ", text: "ข้อมูลผู้ใช้งานถูกนำออกจากระบบถาวรแล้ว" });
        fetchData();
      }
    } catch (err) {
      setMsg({ type: "error", title: "ข้อผิดพลาดระบบ", text: "ไม่สามารถเชื่อมต่อเพื่อลบข้อมูลได้" });
    }
  };

  const filteredStaff = useMemo(() => {
    return staff.filter(s => 
      s.name.toLowerCase().includes(search.toLowerCase()) || 
      s.username.toLowerCase().includes(search.toLowerCase())
    );
  }, [staff, search]);

  const filteredStudents = useMemo(() => {
    return students.filter(s => 
      s.name.toLowerCase().includes(search.toLowerCase()) || 
      s.studentId.includes(search)
    );
  }, [students, search]);

  return (
    <div className="space-y-6 pb-12">
      <ModalAlert 
        isOpen={!!msg.text}
        type={msg.type || "info"}
        title={msg.title}
        message={msg.text}
        onConfirm={() => setMsg({ type: "" as any, title: "", text: "" })}
      />

      <ModalAlert
        isOpen={!!deleteTarget}
        type="warning"
        title="ยืนยันการลบผู้ใช้งาน"
        message={`คุณแน่ใจหรือไม่ว่าต้องการลบ "${deleteTarget?.name}" ออกจากระบบ? การดำเนินการนี้ไม่สามารถย้อนกลับได้`}
        showCancel={true}
        confirmText="ยืนยันลบข้อมูล"
        cancelText="ยกเลิก"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">จัดการข้อมูลผู้ใช้งาน</h2>
          <p className="text-slate-500 text-sm mt-1">บริหารจัดการบัญชีนักศึกษาและเจ้าหน้าที่ในระบบ</p>
        </div>
        <button
          onClick={() => {
            if (showForm) {
              setEditingId(null);
              setForm({ userType: "staff", username: "", studentId: "", name: "", password: "", role: "1", faculty: "", major: "" });
            }
            setShowForm(!showForm);
          }}
          className={`px-6 py-3 font-bold rounded-2xl shadow-lg transition-all flex items-center gap-2 ${
            showForm ? "bg-white text-slate-600 border border-slate-200" : "bg-slate-900 text-white hover:bg-slate-800 hover:-translate-y-0.5"
          }`}
        >
          {showForm ? "✕ ยกเลิก" : "+ เพิ่มผู้ใช้ใหม่"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-xl animate-in zoom-in-95 duration-200">
          <h3 className="text-xl font-bold text-slate-800 mb-6">
            {editingId ? `แก้ไขข้อมูล: ${form.name}` : "ระบุข้อมูลผู้ใช้ใหม่"}
          </h3>
          <form onSubmit={handleCreateOrUpdate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">ประเภทผู้ใช้</label>
                <select
                  value={form.userType}
                  onChange={(e) => setForm({ ...form, userType: e.target.value })}
                  disabled={!!editingId}
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-bold disabled:opacity-50"
                >
                  <option value="staff">เจ้าหน้าที่ / อาจารย์</option>
                  <option value="student">นักศึกษา</option>
                </select>
              </div>

              {form.userType === "staff" ? (
                <>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Username</label>
                    <input
                      type="text"
                      placeholder="เช่น admin_01"
                      value={form.username}
                      onChange={(e) => setForm({ ...form, username: e.target.value })}
                      disabled={!!editingId}
                      required
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">ระดับสิทธิ์</label>
                    <select
                      value={form.role}
                      onChange={(e) => setForm({ ...form, role: e.target.value })}
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-bold"
                    >
                      <option value="1">1 — อาจารย์ที่ปรึกษา</option>
                      <option value="2">2 — ผู้ดำเนินการ (Staff)</option>
                      <option value="3">3 — ผู้ดูแลระบบ (Admin)</option>
                    </select>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">รหัสนักศึกษา</label>
                    <input
                      type="text"
                      placeholder="เช่น 1234567890123"
                      value={form.studentId}
                      onChange={(e) => setForm({ ...form, studentId: e.target.value })}
                      disabled={!!editingId}
                      required
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">คณะ</label>
                    <select
                      value={form.faculty}
                      onChange={(e) => setForm({ ...form, faculty: e.target.value, major: "" })}
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-bold"
                    >
                      <option value="">เลือกคณะ...</option>
                      {faculties.map(f => (
                        <option key={f.id} value={f.name}>{f.icon} {f.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">สาขาวิชา</label>
                    <select
                      value={form.major}
                      onChange={(e) => setForm({ ...form, major: e.target.value })}
                      disabled={!form.faculty}
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-bold disabled:opacity-50"
                    >
                      <option value="">เลือกสาขาวิชา...</option>
                      {availableMajors.map(m => (
                        <option key={m.id} value={m.name}>{m.icon} {m.name}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">ชื่อ-นามสกุล</label>
                <input
                  type="text"
                  placeholder="กรอกชื่อและนามสกุล"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                  {editingId ? "รหัสผ่านใหม่ (ปล่อยว่างถ้าไม่เปลี่ยน)" : "รหัสผ่าน"}
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required={!editingId}
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="px-10 py-4 bg-indigo-600 text-white font-extrabold rounded-2xl shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition disabled:opacity-50 flex items-center gap-2"
              >
                {saving ? "กำลังบันทึก..." : (editingId ? "💾 บันทึกการแก้ไข" : "🚀 สร้างผู้ใช้งานใหม่")}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-4 justify-between lg:items-end">
        <div className="flex bg-slate-100 p-1.5 rounded-2xl w-fit">
          <button
            onClick={() => setTab("staff")}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
              tab === "staff" ? "bg-white text-slate-900 shadow-md" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            เจ้าหน้าที่ / Staff ({staff.length})
          </button>
          <button
            onClick={() => setTab("students")}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
              tab === "students" ? "bg-white text-slate-900 shadow-md" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            นักศึกษา ({students.length})
          </button>
        </div>

        <div className="relative max-w-sm w-full">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
          <input
            type="text"
            placeholder="ค้นหาชื่อ, รหัสนักศึกษา หรือ username..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition shadow-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-12 h-12 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin" />
            <p className="text-slate-400 font-medium tracking-wide">กำลังรวบรวมข้อมูลรายชื่อ...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-8 py-4 font-bold text-slate-700">ข้อมูลพื้นฐาน</th>
                  <th className="px-4 py-4 font-bold text-slate-700">ID / Username</th>
                  <th className="px-4 py-4 font-bold text-slate-700">{tab === "staff" ? "ระดับสิทธิ์" : "คณะ/วิทยาลัย"}</th>
                  {tab === "staff" && <th className="px-4 py-4 font-bold text-slate-700">งานในมือ</th>}
                  <th className="px-4 py-4 font-bold text-slate-700">วันที่ลงทะเบียน</th>
                  <th className="px-8 py-4 text-right">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {(tab === "staff" ? filteredStaff : filteredStudents).map((u: any) => (
                  <tr key={u.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold shadow-sm ${
                          tab === "staff" ? "bg-indigo-100 text-indigo-700" : "bg-orange-100 text-orange-700"
                        }`}>
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-bold text-slate-800">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-5 font-mono text-xs text-slate-500">
                      {tab === "staff" ? u.username : u.studentId}
                    </td>
                    <td className="px-4 py-5">
                      {tab === "staff" ? (
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${ROLE_LABELS[u.role as number].bg} ${ROLE_LABELS[u.role as number].color}`}>
                          {ROLE_LABELS[u.role as number].label}
                        </span>
                      ) : (
                        <span className="text-slate-500 font-medium">{u.faculty || "-"}</span>
                      )}
                    </td>
                    {tab === "staff" && (
                      <td className="px-4 py-5">
                        <span className={`px-3 py-1 rounded-full text-xs font-black ${u._count?.assignedComplaints > 0 ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-400"}`}>
                          {u._count?.assignedComplaints || 0} เคส
                        </span>
                      </td>
                    )}
                    <td className="px-4 py-5 text-slate-400">
                      {new Date(u.createdAt).toLocaleDateString("th-TH")}
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => startEdit(tab === "staff" ? "staff" : "student", u)}
                          className="p-2 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                          title="แก้ไขข้อมูล"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        {u.id !== (session?.user as any)?.id && (
                          <button
                            onClick={() => setDeleteTarget({ id: u.id, name: u.name, type: tab === "staff" ? "staff" : "student" })}
                            className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                            title="ลบผู้ใช้งาน"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {(tab === "staff" ? filteredStaff : filteredStudents).length === 0 && (
              <div className="text-center py-20">
                <p className="text-4xl mb-4 grayscale opacity-20">🔎</p>
                <p className="text-slate-400 font-medium">ไม่พบรายชื่อที่ท่านค้นหา</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
