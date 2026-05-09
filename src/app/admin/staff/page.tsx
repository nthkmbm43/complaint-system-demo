"use client";

import React, { useState, useEffect, useMemo } from "react";
import ModalAlert from "@/components/ModalAlert";

interface OrgUnit {
  Unit_id: number;
  Unit_name: string;
  Unit_type: string;
  Unit_icon?: string;
  Unit_parent_id?: number;
}

const ROLE_CONFIG: Record<number, { label: string; color: string; bg: string; icon: string }> = {
  1: { label: "อาจารย์ที่ปรึกษา", color: "text-blue-700", bg: "bg-blue-100", icon: "🎓" },
  2: { label: "ผู้ดำเนินการ (Operator)", color: "text-purple-700", bg: "bg-purple-100", icon: "⚙️" },
  3: { label: "ผู้ดูแลระบบ (Admin)", color: "text-red-700", bg: "bg-red-100", icon: "🛡️" },
};

const EMPTY_FORM = { username: "", password: "", name: "", role: "1", faculty: "", major: "" };

export default function StaffManagementPage() {
  const [staff, setStaff] = useState<any[]>([]);
  const [units, setUnits] = useState<OrgUnit[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<any>(null);
  const [msg, setMsg] = useState({ type: "" as any, title: "", text: "" });
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({ ...EMPTY_FORM });

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/staff");
      const data = await res.json();
      setStaff(data.staff || []);
    } catch (err) {
      console.error("Fetch Staff Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnits = async () => {
    try {
      const res = await fetch("/api/admin/units"); // Fixed endpoint
      const data = await res.json();
      if (data.units && data.units.length > 0) {
        setUnits(data.units);
      } else {
        throw new Error("Empty units");
      }
    } catch (err) {
      console.warn("Using fallback units data...");
      const fallback: OrgUnit[] = [];
      const { FACULTIES } = require("@/data/units");
      FACULTIES.forEach((f: any) => {
        fallback.push({ Unit_id: f.id, Unit_name: f.name, Unit_type: 'faculty', Unit_icon: f.icon });
        f.majors.forEach((m: any, idx: number) => {
          fallback.push({ Unit_id: f.id * 100 + idx, Unit_name: m.name, Unit_type: 'major', Unit_parent_id: f.id, Unit_icon: m.icon });
        });
      });
      setUnits(fallback);
    }
  };

  useEffect(() => { 
    fetchStaff(); 
    fetchUnits();
  }, []);

  const faculties = useMemo(() => units.filter((u) => u.Unit_type === "faculty"), [units]);
  const selectedFacultyId = useMemo(() => units.find((f) => f.Unit_name === form.faculty)?.Unit_id, [units, form.faculty]);
  const availableMajors = useMemo(() => units.filter(
    (u) => u.Unit_type === "major" && u.Unit_parent_id === selectedFacultyId
  ), [units, selectedFacultyId]);

  const openAdd = () => {
    setEditingStaff(null);
    setForm({ ...EMPTY_FORM });
    setShowModal(true);
  };

  const openEdit = (s: any) => {
    setEditingStaff(s);
    setForm({ username: s.username, password: "", name: s.name, role: String(s.role), faculty: s.faculty || "", major: s.major || "" });
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setEditingStaff(null); setForm({ ...EMPTY_FORM }); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const url = editingStaff ? `/api/admin/staff/${editingStaff.id}` : "/api/admin/staff";
    const method = editingStaff ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setSaving(false);
    if (res.ok) {
      setMsg({ type: "success", title: "สำเร็จ", text: editingStaff ? "อัปเดตข้อมูลเจ้าหน้าที่เรียบร้อยแล้ว" : "เพิ่มเจ้าหน้าที่ใหม่เข้าระบบเรียบร้อยแล้ว" });
      closeModal();
      fetchStaff();
    } else {
      const data = await res.json();
      setMsg({ type: "error", title: "เกิดข้อผิดพลาด", text: data.error || "ไม่สามารถบันทึกข้อมูลได้" });
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const res = await fetch(`/api/admin/staff/${deleteTarget.id}`, { method: "DELETE" });
    setDeleteTarget(null);
    if (res.ok) {
      setMsg({ type: "success", title: "ลบสำเร็จ", text: "ข้อมูลเจ้าหน้าที่ถูกนำออกจากระบบแล้ว" });
      fetchStaff();
    } else {
      const data = await res.json();
      setMsg({ type: "error", title: "ไม่สามารถลบได้", text: data.error || "เกิดข้อผิดพลาด" });
    }
  };

  const filtered = staff.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-500">
      <ModalAlert isOpen={!!msg.text} type={msg.type || "info"} title={msg.title} message={msg.text} onConfirm={() => setMsg({ type: "" as any, title: "", text: "" })} />
      <ModalAlert
        isOpen={!!deleteTarget}
        type="warning"
        title="ยืนยันการลบเจ้าหน้าที่"
        message={`คุณแน่ใจหรือไม่ว่าต้องการลบ "${deleteTarget?.name}" ออกจากระบบ?`}
        showCancel={true} confirmText="ยืนยันลบข้อมูล" cancelText="ยกเลิก"
        onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)}
      />

      {showModal && (
        <div 
          className="fixed inset-0 z-[1000] bg-white overflow-y-auto flex justify-center animate-in fade-in slide-in-from-bottom-4 duration-500"
        >
          <div className="w-full max-w-5xl p-10 md:p-24 flex flex-col">
            {/* Minimalist Clean Header */}
            <div className="flex items-center justify-between mb-20">
              <div className="flex items-center gap-8">
                <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-[2.5rem] flex items-center justify-center text-5xl shadow-sm border border-indigo-100/50">👤</div>
                <div>
                  <h3 className="text-5xl font-black text-slate-900 tracking-tighter">{editingStaff ? "แก้ไขข้อมูลเจ้าหน้าที่" : "เพิ่มเจ้าหน้าที่ใหม่"}</h3>
                  <p className="text-base font-bold text-slate-400 uppercase tracking-[0.4em] mt-3 ml-1">Staff Access Setup</p>
                </div>
              </div>
              <button onClick={closeModal} className="group flex items-center gap-3 px-6 py-3 rounded-2xl bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all border border-slate-100">
                <span className="text-sm font-black uppercase tracking-widest">ปิดหน้านี้</span>
                <svg className="w-6 h-6 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-16">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-4">
                  <label className="text-sm font-black text-slate-900 uppercase tracking-widest ml-1">Username / ID</label>
                  <input type="text" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} disabled={!!editingStaff} required placeholder="เช่น teacher_01" className="w-full px-8 py-6 bg-white border-2 border-slate-100 rounded-3xl font-bold text-slate-700 focus:outline-none focus:ring-12 focus:ring-indigo-500/5 transition-all text-xl" />
                </div>
                <div className="space-y-4">
                  <label className="text-sm font-black text-slate-900 uppercase tracking-widest ml-1">รหัสผ่าน {editingStaff && "(ปล่อยว่างถ้าไม่เปลี่ยน)"}</label>
                  <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required={!editingStaff} placeholder="••••••••" className="w-full px-8 py-6 bg-white border-2 border-slate-100 rounded-3xl font-bold focus:outline-none focus:ring-12 focus:ring-indigo-500/5 transition-all text-xl" />
                </div>
                <div className="space-y-4 sm:col-span-2">
                  <label className="text-sm font-black text-slate-900 uppercase tracking-widest ml-1">ชื่อ-นามสกุล</label>
                  <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="กรอกชื่อและนามสกุล" className="w-full px-8 py-6 bg-white border-2 border-slate-100 rounded-3xl font-bold text-slate-700 focus:outline-none focus:ring-12 focus:ring-indigo-500/5 transition-all text-xl" />
                </div>
                <div className="space-y-4">
                  <label className="text-sm font-black text-slate-900 uppercase tracking-widest ml-1">ระดับสิทธิ์</label>
                  <div className="relative">
                    <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full px-8 py-6 bg-white border-2 border-slate-100 rounded-3xl font-bold text-slate-700 appearance-none focus:ring-12 focus:ring-indigo-500/5 transition-all text-xl">
                      <option value="1">🎓 อาจารย์ที่ปรึกษา</option>
                      <option value="2">⚙️ ผู้ดำเนินการ (Operator)</option>
                      <option value="3">🛡️ ผู้ดูแลระบบ (Admin)</option>
                    </select>
                    <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">▼</div>
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-sm font-black text-slate-900 uppercase tracking-widest ml-1">คณะ</label>
                  <div className="relative">
                    <select value={form.faculty} onChange={(e) => setForm({ ...form, faculty: e.target.value, major: "" })} className="w-full px-8 py-6 bg-white border-2 border-slate-100 rounded-3xl font-bold text-slate-700 appearance-none focus:ring-12 focus:ring-indigo-500/5 transition-all text-xl">
                      <option value="">— ส่วนกลาง / ไม่ระบุ —</option>
                      {faculties.map((f) => (
                        <option key={f.Unit_id} value={f.Unit_name}>{f.Unit_icon} {f.Unit_name}</option>
                      ))}
                    </select>
                    <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">▼</div>
                  </div>
                </div>
                {form.faculty && (
                  <div className="space-y-4 sm:col-span-2">
                    <label className="text-sm font-black text-slate-900 uppercase tracking-widest ml-1">สาขาวิชา</label>
                    <div className="relative">
                      <select value={form.major} onChange={(e) => setForm({ ...form, major: e.target.value })} className="w-full px-8 py-6 bg-white border-2 border-slate-100 rounded-3xl font-bold text-slate-700 appearance-none focus:ring-12 focus:ring-indigo-500/5 transition-all text-xl">
                        <option value="">— ทุกสาขาในคณะ —</option>
                        {availableMajors.map((m) => (
                          <option key={m.Unit_id} value={m.Unit_name}>{m.Unit_icon} {m.Unit_name}</option>
                        ))}
                      </select>
                      <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">▼</div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-8 pt-10 border-t border-slate-50">
                <button type="button" onClick={closeModal} className="flex-1 py-7 bg-white border-2 border-slate-100 text-slate-500 font-black rounded-[2.5rem] hover:bg-slate-50 hover:border-slate-200 transition-all uppercase text-sm tracking-widest">ยกเลิกและย้อนกลับ</button>
                <button type="submit" disabled={saving} className="flex-[2] py-7 bg-slate-900 hover:bg-indigo-600 text-white font-black rounded-[2.5rem] transition-all uppercase text-sm tracking-widest shadow-2xl shadow-slate-900/40 disabled:opacity-50 hover:scale-[1.02] active:scale-95">{saving ? "กำลังดำเนินการ..." : editingStaff ? "ยืนยันการบันทึกข้อมูล" : "🛡️ ยืนยันเพิ่มเจ้าหน้าที่"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">Management Console</p>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">จัดการข้อมูลเจ้าหน้าที่</h2>
          <p className="text-slate-500 text-sm mt-1">บริหารจัดการบัญชีเจ้าหน้าที่และอาจารย์ที่ปรึกษาจากฐานข้อมูลกลาง (Real Database Integration)</p>
        </div>
        <button onClick={openAdd} className="px-6 py-3 bg-slate-900 text-white font-black rounded-2xl hover:bg-indigo-700 hover:-translate-y-0.5 transition-all shadow-xl flex items-center gap-2 text-sm">+ เพิ่มเจ้าหน้าที่ใหม่</button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-[2rem] border border-slate-200 p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-grow relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
            <input type="text" placeholder="ค้นหาชื่อ หรือ username..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-[1.25rem] focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all font-bold text-sm" />
          </div>
          <div className="flex items-center px-4 py-3 bg-indigo-50 rounded-[1.25rem] text-sm font-black text-indigo-600 whitespace-nowrap">ทั้งหมด {filtered.length} คน</div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/20 overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="w-14 h-14 border-4 border-indigo-50 border-t-indigo-600 rounded-full animate-spin shadow-inner" />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs animate-pulse">กำลังซิงค์ฐานข้อมูล...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-32">
            <div className="text-8xl mb-6 grayscale opacity-20">👥</div>
            <h3 className="text-xl font-black text-slate-800 tracking-tight">ไม่พบข้อมูลเจ้าหน้าที่</h3>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50/50 border-b border-slate-100">
                <tr>
                  <th className="text-left px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">เจ้าหน้าที่</th>
                  <th className="text-left px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">ระดับสิทธิ์</th>
                  <th className="text-left px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">คณะ / สาขา</th>
                  <th className="text-left px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">งานในมือ</th>
                  <th className="px-8 py-5 text-right">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((s) => {
                  const role = ROLE_CONFIG[s.role as number];
                  const facultyUnit = units.find((u) => u.Unit_name === s.faculty);
                  const majorUnit = units.find((u) => u.Unit_name === s.major);
                  return (
                    <tr key={s.id} className="hover:bg-indigo-50/20 transition-all group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-indigo-100 text-indigo-700 rounded-xl flex items-center justify-center font-black text-base shadow-sm group-hover:rotate-12 transition-transform">{s.name.charAt(0).toUpperCase()}</div>
                          <div>
                            <p className="font-black text-slate-800 group-hover:text-indigo-600 transition-colors">{s.name}</p>
                            <p className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-tighter">{s.username}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-5">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider ${role?.bg} ${role?.color} shadow-sm border border-slate-100`}><span>{role?.icon}</span>{role?.label}</span>
                      </td>
                      <td className="px-4 py-5">
                        {s.faculty ? (
                          <div className="space-y-0.5">
                            <p className="text-sm font-black text-slate-700 flex items-center gap-1.5"><span>{facultyUnit?.Unit_icon || "🏛️"}</span>{s.faculty}</p>
                            {s.major && <p className="text-[10px] text-slate-400 font-bold flex items-center gap-1 pl-0.5"><span>{majorUnit?.Unit_icon || "📚"}</span>{s.major}</p>}
                          </div>
                        ) : <span className="text-slate-300 italic text-[10px] uppercase font-black tracking-widest">Central Admin</span>}
                      </td>
                      <td className="px-4 py-5"><span className={`px-3 py-1.5 rounded-xl text-xs font-black ${s._count?.assignedComplaints > 0 ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-400 shadow-inner"}`}>{s._count?.assignedComplaints || 0} เคส</span></td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => openEdit(s)} className="w-9 h-9 flex items-center justify-center bg-slate-50 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-100 rounded-xl transition-all shadow-sm" title="แก้ไข"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
                          <button onClick={() => setDeleteTarget({ id: s.id, name: s.name })} className="w-9 h-9 flex items-center justify-center bg-slate-50 text-slate-300 hover:text-red-500 hover:bg-red-50 border border-slate-100 rounded-xl transition-all shadow-sm" title="ลบ"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
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
