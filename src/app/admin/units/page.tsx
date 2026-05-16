"use client";

import React, { useState, useEffect, useMemo } from "react";
import ModalAlert from "@/components/ModalAlert";
import Swal from "sweetalert2";

interface OrgUnit {
  Unit_id: number;
  Unit_name: string;
  Unit_type: string;
  Unit_icon?: string;
  Unit_parent_id?: number;
  Unit_tel?: string;
  Unit_email?: string;
}

const TYPE_CONFIG = {
  faculty: { label: "คณะ / วิทยาลัย", icon: "🏛️", color: "text-indigo-600", bg: "bg-indigo-50" },
  major: { label: "สาขาวิชา / ภาควิชา", icon: "📚", color: "text-emerald-600", bg: "bg-emerald-50" },
  department: { label: "กอง / ฝ่ายงาน", icon: "🏢", color: "text-amber-600", bg: "bg-amber-50" },
};

const EMOJI_LIST = ["🏛️", "📚", "🏢", "⚙️", "🎨", "📊", "💻", "⚡", "🔬", "🩺", "🌱", "⚖️", "🎭", "📢", "🛠️", "🧪", "🌍", "🏥", "🍱", "🏐"];

const EMPTY_FORM = { Unit_id: "", Unit_name: "", Unit_type: "faculty", Unit_icon: "🏛️", Unit_parent_id: "", Unit_tel: "", Unit_email: "" };

export default function AdminUnitsPage() {
  const [units, setUnits] = useState<OrgUnit[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUnit, setEditingUnit] = useState<OrgUnit | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ type: "" as any, title: "", text: "" });
  const [deleteTarget, setDeleteTarget] = useState<OrgUnit | null>(null);

  const fetchUnits = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/units");
      const data = await res.json();
      setUnits(data.units || []);
    } catch (err) {
      setMsg({ type: "error", title: "ข้อผิดพลาด", text: "ไม่สามารถโหลดข้อมูลหน่วยงานได้" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUnits(); }, []);

  const stats = useMemo(() => {
    return {
      faculty: units.filter(u => u.Unit_type === 'faculty').length,
      major: units.filter(u => u.Unit_type === 'major').length,
      department: units.filter(u => u.Unit_type === 'department').length,
    };
  }, [units]);

  const faculties = useMemo(() => units.filter(u => u.Unit_type === 'faculty'), [units]);

  const openAdd = () => { setEditingUnit(null); setForm({ ...EMPTY_FORM }); setShowModal(true); };
  const openEdit = (u: OrgUnit) => {
    setEditingUnit(u);
    setForm({
      Unit_id: String(u.Unit_id),
      Unit_name: u.Unit_name,
      Unit_type: u.Unit_type,
      Unit_icon: u.Unit_icon || "🏛️",
      Unit_parent_id: u.Unit_parent_id ? String(u.Unit_parent_id) : "",
      Unit_tel: u.Unit_tel || "",
      Unit_email: u.Unit_email || "",
    });
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setEditingUnit(null); setForm({ ...EMPTY_FORM }); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await Swal.fire({
      title: `ยืนยันการ${editingUnit ? "แก้ไข" : "เพิ่ม"}ข้อมูลหน่วยงาน`,
      text: "คุณต้องการบันทึกข้อมูลใช่หรือไม่?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
      customClass: { popup: 'rounded-[2rem]', confirmButton: 'px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold mx-2 shadow-lg shadow-green-500/30 transition-all', cancelButton: 'px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold mx-2 shadow-lg shadow-red-500/30 transition-all' },
      buttonsStyling: false
    });
    if (!result.isConfirmed) return;

    setSaving(true);
    const method = editingUnit ? "PATCH" : "POST";
    
    // Ensure Unit_id is included even if the input was disabled
    const payload = { 
      ...form, 
      Unit_id: editingUnit ? editingUnit.Unit_id : Number(form.Unit_id),
      Unit_parent_id: form.Unit_parent_id ? Number(form.Unit_parent_id) : null
    };

    const res = await fetch("/api/admin/units", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    
    const data = await res.json();
    setSaving(false);

    if (res.ok) {
      setMsg({ type: "success", title: "สำเร็จ", text: editingUnit ? "อัปเดตข้อมูลหน่วยงานเรียบร้อยแล้ว" : "เพิ่มหน่วยงานใหม่เข้าระบบเรียบร้อยแล้ว" });
      closeModal();
      fetchUnits();
    } else {
      setMsg({ type: "error", title: "เกิดข้อผิดพลาด", text: data.error || "ไม่สามารถบันทึกข้อมูลได้" });
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const res = await fetch(`/api/admin/units?id=${deleteTarget.Unit_id}`, { method: "DELETE" });
    setDeleteTarget(null);
    if (res.ok) {
      setMsg({ type: "success", title: "ลบแล้ว", text: "ลบข้อมูลหน่วยงานเรียบร้อยแล้ว" });
      fetchUnits();
    } else {
      setMsg({ type: "error", title: "ผิดพลาด", text: "ไม่สามารถลบได้" });
    }
  };

  const handleRestore = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/units/seed", { method: "POST" });
    const data = await res.json();
    
    if (res.ok) {
      setMsg({ type: "success", title: "กู้คืนสำเร็จ", text: "ระบบกู้คืนข้อมูลคณะ/สาขาพื้นฐานเรียบร้อยแล้ว" });
      fetchUnits();
    } else {
      setMsg({ type: "error", title: "ผิดพลาด", text: data.error || "ไม่สามารถกู้คืนข้อมูลได้" });
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-500">
      <ModalAlert isOpen={!!msg.text} type={msg.type || "info"} title={msg.title} message={msg.text} onConfirm={() => setMsg({ type: "" as any, title: "", text: "" })} />
      <ModalAlert
        isOpen={!!deleteTarget}
        type="warning"
        title="ยืนยันการลบหน่วยงาน"
        message={`คุณต้องการลบ "${deleteTarget?.Unit_name}"? การลบข้อมูลหลักอาจส่งผลต่อข้อมูลนักศึกษาที่สังกัดหน่วยงานนี้`}
        showCancel={true} confirmText="ยืนยันลบ" cancelText="ยกเลิก"
        onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-6">
        <div>
          <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em] mb-2">Master Database Management</p>
          <h2 className="text-4xl font-black text-slate-800 tracking-tight">จัดการโครงสร้างหน่วยงาน</h2>
          <p className="text-slate-500 font-medium mt-2">กำหนดรายชื่อคณะ สาขาวิชา และหน่วยงานภายในทั้งหมดของมหาวิทยาลัย</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleRestore} className="px-6 py-4 bg-slate-100 text-slate-600 font-black rounded-2xl hover:bg-slate-200 transition-all text-xs uppercase tracking-widest shadow-sm">
            กู้คืนข้อมูลพื้นฐาน
          </button>
          <button onClick={openAdd} className="px-8 py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 hover:-translate-y-1 transition-all shadow-xl shadow-indigo-600/20 text-xs uppercase tracking-widest">
            + เพิ่มหน่วยงานใหม่
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(TYPE_CONFIG).map(([key, config]) => (
          <div key={key} className={`p-8 rounded-[2.5rem] ${config.bg} border border-white shadow-sm relative overflow-hidden group`}>
            <div className="absolute -right-4 -bottom-4 text-8xl grayscale opacity-5 group-hover:scale-110 transition-transform">{config.icon}</div>
            <p className={`text-[10px] font-black uppercase tracking-widest ${config.color} mb-1`}>{config.label}</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-slate-800">{(stats as any)[key]}</span>
              <span className="text-xs font-bold text-slate-400 uppercase">หน่วยงาน</span>
            </div>
          </div>
        ))}
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[3rem] border border-slate-200 shadow-2xl shadow-slate-200/50 overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <div className="w-16 h-16 border-4 border-indigo-50 border-t-indigo-600 rounded-full animate-spin" />
            <p className="text-slate-400 font-black uppercase tracking-widest text-xs">กำลังเข้าถึงฐานข้อมูล...</p>
          </div>
        ) : units.length === 0 ? (
          <div className="text-center py-40">
            <div className="text-9xl mb-8 grayscale opacity-10">🏢</div>
            <h3 className="text-2xl font-black text-slate-800">ยังไม่มีข้อมูลหน่วยงาน</h3>
            <p className="text-slate-400 mt-3 font-medium">กดปุ่ม "กู้คืนข้อมูลพื้นฐาน" เพื่อเริ่มต้นใช้งาน</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50/50 border-b border-slate-100">
                <tr>
                  <th className="text-left px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">รหัส & ชื่อหน่วยงาน</th>
                  <th className="text-left px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">ประเภท</th>
                  <th className="text-left px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">สังกัด</th>
                  <th className="px-10 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {units.map((u) => {
                  const config = (TYPE_CONFIG as any)[u.Unit_type] || TYPE_CONFIG.faculty;
                  const parent = units.find(p => p.Unit_id === u.Unit_parent_id);
                  return (
                    <tr key={u.Unit_id} className="hover:bg-slate-50/80 transition-all group">
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-5">
                          <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition-transform">
                            {u.Unit_icon || config.icon}
                          </div>
                          <div>
                            <p className="font-black text-slate-800 text-lg">{u.Unit_name}</p>
                            <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">ID: {u.Unit_id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${config.bg} ${config.color} border border-white shadow-sm`}>
                          {config.label}
                        </span>
                      </td>
                      <td className="px-6 py-6">
                        {parent ? (
                          <div className="flex items-center gap-2">
                            <span className="text-base">{parent.Unit_icon}</span>
                            <span className="text-sm font-bold text-slate-600">{parent.Unit_name}</span>
                          </div>
                        ) : (
                          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Root Level</span>
                        )}
                      </td>
                      <td className="px-10 py-6 text-right">
                        <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openEdit(u)} className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 rounded-xl transition-all shadow-sm">✎</button>
                          <button onClick={() => setDeleteTarget(u)} className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 rounded-xl transition-all shadow-sm">✕</button>
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

      {showModal && (
        <div 
          className="fixed inset-0 z-[1000] overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex justify-center p-4 pt-4 pb-20"
          onClick={closeModal}
        >
          <div 
            className="relative bg-white rounded-[2.5rem] w-full max-w-xl p-10 shadow-2xl h-fit mt-10 mb-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-3xl font-black text-slate-900 mb-8">{editingUnit ? "แก้ไขหน่วยงาน" : "เพิ่มหน่วยงานใหม่"}</h3>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">รหัสหน่วยงาน (ID) *</label>
                  <input type="number" value={form.Unit_id} onChange={e => setForm({...form, Unit_id: e.target.value})} disabled={!!editingUnit} required className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all disabled:opacity-50" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">ประเภทหน่วยงาน *</label>
                  <select value={form.Unit_type} onChange={e => setForm({...form, Unit_type: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold appearance-none">
                    <option value="faculty">คณะ / วิทยาลัย</option>
                    <option value="major">สาขาวิชา / ภาควิชา</option>
                    <option value="department">กอง / ฝ่ายงาน</option>
                  </select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">ชื่อหน่วยงาน (ภาษาไทย) *</label>
                  <input type="text" value={form.Unit_name} onChange={e => setForm({...form, Unit_name: e.target.value})} required className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold" />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">เลือกไอคอนสัญลักษณ์</label>
                  <div className="flex flex-wrap gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    {EMOJI_LIST.map(emoji => (
                      <button key={emoji} type="button" onClick={() => setForm({...form, Unit_icon: emoji})} className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all text-xl ${form.Unit_icon === emoji ? 'bg-indigo-600 scale-110 shadow-lg' : 'bg-white hover:bg-white/50'}`}>
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                {form.Unit_type !== 'faculty' && (
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">หน่วยงานต้นสังกัด</label>
                    <select value={form.Unit_parent_id} onChange={e => setForm({...form, Unit_parent_id: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold">
                      <option value="">— ไม่ระบุ / เป็นหน่วยงานหลัก —</option>
                      {faculties.map(f => <option key={f.Unit_id} value={f.Unit_id}>{f.Unit_icon} {f.Unit_name}</option>)}
                    </select>
                  </div>
                )}
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={closeModal} className="flex-1 py-5 bg-slate-100 text-slate-600 font-black rounded-2xl uppercase tracking-widest text-xs">ยกเลิก</button>
                <button 
                  type="submit" 
                  disabled={saving} 
                  className="flex-1 py-5 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-600/20 uppercase tracking-widest text-xs disabled:opacity-50"
                >
                  {saving ? "กำลังบันทึก..." : editingUnit ? "💾 บันทึกการแก้ไข" : "🚀 เพิ่มหน่วยงาน"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
