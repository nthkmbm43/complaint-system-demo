"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

import ModalAlert from "@/components/ModalAlert";
import { ORGANIZATION_UNITS } from "@/lib/constants";

export default function StudentProfilePage() {
  const { data: session, update } = useSession();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [msg, setMsg] = useState({ type: "" as any, title: "", text: "" });
  
  const [form, setForm] = useState({
    name: "",
    email: "",
    faculty: "",
    major: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [backupForm, setBackupForm] = useState({ ...form });

  const faculties = ORGANIZATION_UNITS.filter(u => u.type === 'faculty');
  const availableMajors = ORGANIZATION_UNITS.filter(u => u.type === 'major' && u.parentId === ORGANIZATION_UNITS.find(f => f.name === form.faculty)?.id);

  useEffect(() => {
    if (session?.user) {
      const user = session.user as any;
      const initialData = {
        ...form,
        name: user.name || "",
        email: user.email || "",
        faculty: user.faculty || "",
        major: user.major || ""
      };
      setForm(initialData);
      setBackupForm(initialData);
    }
  }, [session]);

  const handleEdit = () => {
    setBackupForm({ ...form });
    setIsEditing(true);
    setMsg({ type: "", title: "", text: "" });
  };

  const handleCancel = () => {
    setForm({ ...backupForm, currentPassword: "", newPassword: "", confirmPassword: "" });
    setIsEditing(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg({ type: "", title: "", text: "" });

    if (form.newPassword && form.newPassword !== form.confirmPassword) {
      setMsg({ type: "error", title: "รหัสผ่านไม่ตรงกัน", text: "รหัสผ่านใหม่และการยืนยันไม่ตรงกัน กรุณาตรวจสอบอีกครั้ง" });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();

      if (!res.ok) {
        setMsg({ type: "error", title: "บันทึกไม่สำเร็จ", text: data.error || "เกิดข้อผิดพลาดในการบันทึกข้อมูล" });
      } else {
        setMsg({ type: "success", title: "บันทึกสำเร็จ", text: "ข้อมูลส่วนตัวของคุณได้รับการอัปเดตเรียบร้อยแล้ว" });
        setForm(prev => ({ ...prev, currentPassword: "", newPassword: "", confirmPassword: "" }));
        setBackupForm({ ...form });
        setIsEditing(false);
        await update({ name: form.name, email: form.email, faculty: form.faculty, major: form.major });
      }
    } catch (err) {
      setMsg({ type: "error", title: "ข้อผิดพลาด", text: "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20">
      <ModalAlert 
        isOpen={!!msg.text}
        type={msg.type || "info"}
        title={msg.title}
        message={msg.text}
        onConfirm={() => setMsg({ type: "" as any, title: "", text: "" })}
      />
      
      <div className="flex items-center justify-between gap-4 mb-2">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-3xl flex items-center justify-center text-3xl font-bold shadow-sm border-2 border-white">
            {form.name?.charAt(0).toUpperCase() || "S"}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 tracking-tight">โปรไฟล์ของฉัน</h2>
            <p className="text-gray-400 text-sm">จัดการข้อมูลส่วนตัวและรหัสผ่าน</p>
          </div>
        </div>

        {!isEditing && (
          <button
            onClick={handleEdit}
            className="px-6 py-2.5 bg-white text-orange-600 border-2 border-orange-50 rounded-2xl font-bold text-sm hover:bg-orange-50 transition-all flex items-center gap-2 shadow-sm"
          >
            <span>✏️</span> แก้ไขข้อมูล
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        <div className={`bg-white rounded-3xl border transition-all duration-300 ${isEditing ? 'border-orange-200 shadow-xl shadow-orange-500/5 ring-4 ring-orange-500/5' : 'border-gray-100 shadow-sm'}`}>
          <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
            <h3 className="font-bold text-gray-700 flex items-center gap-2">
              <span className="text-orange-500">👤</span> ข้อมูลทั่วไป
            </h3>
            <span className="text-[10px] bg-orange-100 text-orange-600 px-2.5 py-1 rounded-full font-bold uppercase tracking-widest">
              Student Account
            </span>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">ชื่อ-นามสกุล</label>
                <input
                  type="text"
                  value={form.name}
                  disabled={!isEditing}
                  onChange={e => setForm({...form, name: e.target.value})}
                  className={`w-full px-4 py-3 border rounded-2xl transition-all ${
                    isEditing 
                    ? "bg-white border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" 
                    : "bg-gray-50 border-gray-50 text-gray-500 cursor-not-allowed"
                  }`}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">รหัสนักศึกษา</label>
                <input
                  type="text"
                  value={(session?.user as any)?.studentId || ""}
                  disabled
                  className="w-full px-4 py-3 bg-gray-100 border border-gray-100 rounded-2xl text-gray-400 cursor-not-allowed font-medium"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">อีเมล (Email)</label>
              <input
                type="email"
                value={form.email}
                disabled={!isEditing}
                onChange={e => setForm({...form, email: e.target.value})}
                placeholder="example@rmuti.ac.th"
                className={`w-full px-4 py-3 border rounded-2xl transition-all ${
                  isEditing 
                  ? "bg-white border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" 
                  : "bg-gray-50 border-gray-50 text-gray-500 cursor-not-allowed"
                }`}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">คณะ / วิทยาลัย</label>
                <select
                  value={form.faculty}
                  disabled={!isEditing}
                  onChange={e => setForm({...form, faculty: e.target.value, major: ""})}
                  className={`w-full px-4 py-3 border rounded-2xl transition-all appearance-none font-medium ${
                    isEditing 
                    ? "bg-white border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" 
                    : "bg-gray-50 border-gray-50 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <option value="">เลือกคณะ...</option>
                  {faculties.map(f => (
                    <option key={f.id} value={f.name}>{f.icon} {f.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">สาขาวิชา</label>
                <select
                  value={form.major}
                  disabled={!isEditing || !form.faculty}
                  onChange={e => setForm({...form, major: e.target.value})}
                  className={`w-full px-4 py-3 border rounded-2xl transition-all appearance-none font-medium ${
                    isEditing 
                    ? "bg-white border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" 
                    : "bg-gray-50 border-gray-50 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <option value="">เลือกสาขาวิชา...</option>
                  {availableMajors.map(m => (
                    <option key={m.id} value={m.name}>{m.icon} {m.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="bg-white rounded-3xl border border-orange-200 shadow-xl shadow-orange-500/5 ring-4 ring-orange-500/5 overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-orange-50 bg-orange-50/30">
              <h3 className="font-bold text-gray-700 flex items-center gap-2">
                <span className="text-orange-500">🔒</span> เปลี่ยนรหัสผ่าน
              </h3>
              <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-bold">เว้นว่างไว้หากไม่ต้องการเปลี่ยนรหัสผ่าน</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">รหัสผ่านปัจจุบัน</label>
                <input
                  type="password"
                  placeholder="ระบุรหัสผ่านเดิมเพื่อยืนยัน"
                  value={form.currentPassword}
                  onChange={e => setForm({...form, currentPassword: e.target.value})}
                  className="w-full px-4 py-3 bg-white border border-orange-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">รหัสผ่านใหม่</label>
                  <input
                    type="password"
                    value={form.newPassword}
                    onChange={e => setForm({...form, newPassword: e.target.value})}
                    className="w-full px-4 py-3 bg-white border border-orange-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">ยืนยันรหัสผ่านใหม่</label>
                  <input
                    type="password"
                    value={form.confirmPassword}
                    onChange={e => setForm({...form, confirmPassword: e.target.value})}
                    className="w-full px-4 py-3 bg-white border border-orange-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {isEditing && (
          <div className="flex items-center justify-end gap-3 pt-2 animate-in slide-in-from-bottom-2">
            <button
              type="button"
              onClick={handleCancel}
              className="px-8 py-3.5 bg-white text-gray-500 font-bold rounded-2xl border border-gray-200 hover:bg-gray-50 transition active:scale-95"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-10 py-3.5 bg-orange-500 text-white font-bold rounded-2xl shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition disabled:opacity-50 flex items-center gap-2 active:scale-95"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : "🚀 บันทึกการเปลี่ยนแปลง"}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
