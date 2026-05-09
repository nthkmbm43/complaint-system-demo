"use client";

import React, { useEffect, useState, useMemo } from "react";
import ModalAlert from "@/components/ModalAlert";

interface Student {
  id: string;
  studentId: string;
  name: string;
  email?: string;
  faculty?: string;
  major?: string;
  createdAt: string;
}

interface OrgUnit {
  Unit_id: number;
  Unit_name: string;
  Unit_type: string;
  Unit_icon?: string;
  Unit_parent_id?: number;
}

const EMPTY_FORM = {
  userType: "student",
  studentId: "",
  name: "",
  email: "",
  password: "",
  faculty: "",
  major: "",
};

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [units, setUnits] = useState<OrgUnit[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterFaculty, setFilterFaculty] = useState("all");

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);

  const [msg, setMsg] = useState({ type: "" as any, title: "", text: "" });
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [stuRes, unitRes] = await Promise.all([
        fetch("/api/admin/users"),
        fetch("/api/public/units")
      ]);
      const stuData = await stuRes.json();
      const unitData = await unitRes.json();
      setStudents(stuData.students || []);
      setUnits(unitData.units || []);
    } catch (err) {
      console.error("Fetch Data Error:", err);
      // Silently fail and show empty state to prevent modal spam
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const faculties = useMemo(() => units.filter((u) => u.Unit_type === "faculty"), [units]);
  const selectedFacultyId = useMemo(() => units.find((f) => f.Unit_name === form.faculty)?.Unit_id, [units, form.faculty]);
  const availableMajors = useMemo(() => units.filter(
    (u) => u.Unit_type === "major" && u.Unit_parent_id === selectedFacultyId
  ), [units, selectedFacultyId]);

  const filtered = useMemo(() => {
    return students.filter((s) => {
      const matchSearch = search === "" || s.name.toLowerCase().includes(search.toLowerCase()) || s.studentId.includes(search);
      const matchFaculty = filterFaculty === "all" || s.faculty === filterFaculty;
      return matchSearch && matchFaculty;
    });
  }, [students, search, filterFaculty]);

  const openAdd = () => { setEditingId(null); setForm({ ...EMPTY_FORM }); setShowModal(true); };

  const openEdit = (student: Student) => {
    setEditingId(student.id);
    setForm({
      userType: "student",
      studentId: student.studentId,
      name: student.name,
      email: student.email || "",
      password: "",
      faculty: student.faculty || "",
      major: student.major || "",
    });
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setEditingId(null); setForm({ ...EMPTY_FORM }); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const method = editingId ? "PATCH" : "POST";
    const body = editingId ? { ...form, id: editingId } : form;
    const res = await fetch("/api/admin/users", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setMsg({ type: "error", title: "เกิดข้อผิดพลาด", text: data.error || "ไม่สามารถบันทึกข้อมูลได้" });
    } else {
      setMsg({ type: "success", title: editingId ? "อัปเดตสำเร็จ" : "เพิ่มสำเร็จ", text: editingId ? "ข้อมูลนักศึกษาอัปเดตเรียบร้อยแล้ว" : "เพิ่มนักศึกษาใหม่เข้าระบบเรียบร้อยแล้ว" });
      closeModal();
      fetchData();
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const res = await fetch(`/api/admin/users?id=${deleteTarget.id}&type=student`, { method: "DELETE" });
    setDeleteTarget(null);
    const data = await res.json();
    if (!res.ok) {
      setMsg({ type: "error", title: "ไม่สามารถลบได้", text: data.error });
    } else {
      setMsg({ type: "success", title: "ลบสำเร็จ", text: "ข้อมูลนักศึกษาถูกนำออกจากระบบแล้ว" });
      fetchData();
    }
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-500">
      <ModalAlert isOpen={!!msg.text} type={msg.type || "info"} title={msg.title} message={msg.text} onConfirm={() => setMsg({ type: "" as any, title: "", text: "" })} />
      <ModalAlert
        isOpen={!!deleteTarget}
        type="warning"
        title="ยืนยันการลบนักศึกษา"
        message={`คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลของ "${deleteTarget?.name}" ออกจากระบบ?`}
        showCancel={true} confirmText="ยืนยันลบข้อมูล" cancelText="ยกเลิก"
        onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)}
      />

      {showModal && (
        <div className="fixed inset-0 z-[1000] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-2xl p-10 md:p-12 shadow-2xl animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center text-2xl shadow-sm">{editingId ? "✎" : "🎓"}</div>
              <div>
                <h3 className="text-2xl font-black text-slate-900">{editingId ? "แก้ไขข้อมูลนักศึกษา" : "เพิ่มนักศึกษาใหม่"}</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-0.5">{editingId ? `กำลังแก้ไข: ${form.name}` : "Student Account Setup"}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">รหัสนักศึกษา</label>
                  <input type="text" placeholder="6XXXXXXXXXX-X" value={form.studentId} onChange={(e) => setForm({ ...form, studentId: e.target.value })} disabled={!!editingId} required className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition font-mono font-bold disabled:opacity-50" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">ชื่อ-นามสกุล</label>
                  <input type="text" placeholder="ชื่อ-นามสกุล" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition font-bold" />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{editingId ? "รหัสผ่านใหม่ (ปล่อยว่างถ้าไม่เปลี่ยน)" : "รหัสผ่าน"}</label>
                  <input type="password" placeholder="••••••••" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required={!editingId} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition" />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex justify-between">
                    <span>อีเมลสำหรับรับแจ้งเตือน</span>
                    {!form.email && <span className="text-amber-500 font-bold lowercase italic text-[9px]">* จำเป็นสำหรับการแจ้งเตือนสถานะผ่านเมล</span>}
                  </label>
                  <input type="email" placeholder="example@gmail.com หรือ hotmail.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">คณะ</label>
                  <select value={form.faculty} onChange={(e) => setForm({ ...form, faculty: e.target.value, major: "" })} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition font-bold appearance-none">
                    <option value="">— ไม่ระบุ —</option>
                    {faculties.map((f) => (
                      <option key={f.Unit_id} value={f.Unit_name}>{f.Unit_icon} {f.Unit_name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">สาขา</label>
                  <select value={form.major} onChange={(e) => setForm({ ...form, major: e.target.value })} disabled={!form.faculty} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition font-bold appearance-none disabled:opacity-40">
                    <option value="">— เลือกสาขา —</option>
                    {availableMajors.map((m) => (
                      <option key={m.Unit_id} value={m.Unit_name}>{m.Unit_icon} {m.Unit_name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={closeModal} className="flex-1 py-4 bg-slate-100 text-slate-600 font-black rounded-2xl hover:bg-slate-200 transition-all uppercase text-[10px] tracking-widest">ยกเลิก</button>
                <button type="submit" disabled={saving} className="flex-1 py-4 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-2xl transition-all uppercase text-[10px] tracking-widest shadow-xl shadow-orange-500/20 disabled:opacity-50">{saving ? "กำลังบันทึก..." : editingId ? "💾 บันทึกการแก้ไข" : "🚀 เพิ่มนักศึกษา"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-1">Student Directory</p>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">จัดการข้อมูลนักศึกษา</h2>
          <p className="text-slate-500 text-sm mt-1">บริหารจัดการบัญชีนักศึกษาจากฐานข้อมูลกลาง (Real Database Integration)</p>
        </div>
        <button onClick={openAdd} className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-2xl hover:-translate-y-0.5 transition-all shadow-xl shadow-orange-500/20 flex items-center gap-2 text-sm">+ เพิ่มนักศึกษาใหม่</button>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-200 p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-grow relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
            <input type="text" placeholder="ค้นหาชื่อ, รหัสนักศึกษา..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-[1.25rem] focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-400 transition-all font-bold text-sm" />
          </div>
          <select value={filterFaculty} onChange={(e) => setFilterFaculty(e.target.value)} className="min-w-[200px] px-4 py-3 bg-slate-50 border border-slate-100 rounded-[1.25rem] text-sm font-black text-slate-600 focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-400">
            <option value="all">ทุกคณะ</option>
            {faculties.map((f) => (
              <option key={f.Unit_id} value={f.Unit_name}>{f.Unit_icon} {f.Unit_name}</option>
            ))}
          </select>
          <div className="flex items-center px-4 py-3 bg-orange-50 rounded-[1.25rem] text-sm font-black text-orange-600 whitespace-nowrap">พบ {filtered.length} คน</div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/20 overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="w-14 h-14 border-4 border-orange-50 border-t-orange-500 rounded-full animate-spin shadow-inner" />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs animate-pulse">กำลังซิงค์ฐานข้อมูล...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-32">
            <div className="text-8xl mb-6 grayscale opacity-20">🎓</div>
            <h3 className="text-xl font-black text-slate-800 tracking-tight">ไม่พบข้อมูลนักศึกษา</h3>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50/50 border-b border-slate-100">
                <tr>
                  <th className="text-left px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">นักศึกษา</th>
                  <th className="text-left px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">รหัส</th>
                  <th className="text-left px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">คณะ / สาขาวิชา</th>
                  <th className="text-left px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">ลงทะเบียน</th>
                  <th className="px-8 py-5 text-right">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((s) => {
                  const facultyUnit = units.find((u) => u.Unit_name === s.faculty);
                  const majorUnit = units.find((u) => u.Unit_name === s.major);
                  return (
                    <tr key={s.id} className="hover:bg-orange-50/30 transition-all group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center font-black text-base shadow-sm group-hover:scale-110 transition-transform">{s.name.charAt(0).toUpperCase()}</div>
                          <p className="font-black text-slate-800 group-hover:text-orange-600 transition-colors">{s.name}</p>
                        </div>
                      </td>
                      <td className="px-4 py-5"><span className="font-mono text-xs text-slate-500 bg-slate-50 border border-slate-100 px-3 py-1 rounded-lg">{s.studentId}</span></td>
                      <td className="px-4 py-5">
                        {s.faculty ? (
                          <div className="space-y-0.5">
                            <p className="text-sm font-black text-slate-700 flex items-center gap-1.5"><span>{facultyUnit?.Unit_icon || "🏛️"}</span>{s.faculty}</p>
                            {s.major && <p className="text-[10px] text-slate-400 font-bold flex items-center gap-1 pl-0.5"><span>{majorUnit?.Unit_icon || "📚"}</span>{s.major}</p>}
                          </div>
                        ) : <span className="text-slate-300 italic text-[10px] uppercase font-black tracking-widest">Not Assigned</span>}
                      </td>
                      <td className="px-4 py-5 text-slate-400 text-[10px] font-bold uppercase tracking-tighter">{new Date(s.createdAt).toLocaleDateString("th-TH")}</td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => openEdit(s)} className="w-9 h-9 flex items-center justify-center bg-slate-50 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-100 rounded-xl transition-all shadow-sm" title="แก้ไขข้อมูล"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
                          <button onClick={() => setDeleteTarget({ id: s.id, name: s.name })} className="w-9 h-9 flex items-center justify-center bg-slate-50 text-slate-300 hover:text-red-500 hover:bg-red-50 border border-slate-100 rounded-xl transition-all shadow-sm" title="ลบนักศึกษา"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
