"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function AdminProfilePage() {
  const { data: session, update } = useSession();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });
  
  const [form, setForm] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [backupForm, setBackupForm] = useState({ ...form });

  useEffect(() => {
    if (session?.user) {
      const user = session.user as any;
      const initialData = {
        ...form,
        name: user.name || "",
        email: user.email || "",
      };
      setForm(initialData);
      setBackupForm(initialData);
    }
  }, [session]);

  const handleEdit = () => {
    setBackupForm({ ...form });
    setIsEditing(true);
    setMsg({ type: "", text: "" });
  };

  const handleCancel = () => {
    setForm({ ...backupForm, currentPassword: "", newPassword: "", confirmPassword: "" });
    setIsEditing(false);
    setMsg({ type: "", text: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg({ type: "", text: "" });

    if (form.newPassword && form.newPassword !== form.confirmPassword) {
      setMsg({ type: "error", text: "รหัสผ่านใหม่และการยืนยันไม่ตรงกัน" });
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
        setMsg({ type: "error", text: data.error || "เกิดข้อผิดพลาด" });
      } else {
        setMsg({ type: "success", text: "อัปเดตข้อมูลสำเร็จ" });
        setForm(prev => ({ ...prev, currentPassword: "", newPassword: "", confirmPassword: "" }));
        setBackupForm({ ...form });
        setIsEditing(false);
        await update();
      }
    } catch (err) {
      setMsg({ type: "error", text: "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between gap-4 mb-2">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-indigo-100 text-indigo-700 rounded-3xl flex items-center justify-center text-3xl font-bold shadow-sm border-2 border-white">
            {form.name?.charAt(0).toUpperCase() || "A"}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">ข้อมูลส่วนตัวเจ้าหน้าที่</h2>
            <p className="text-slate-400 text-sm">จัดการข้อมูลผู้ใช้งานและรหัสผ่าน</p>
          </div>
        </div>

        {!isEditing && (
          <button
            onClick={handleEdit}
            className="px-6 py-2.5 bg-white text-indigo-600 border-2 border-indigo-50 rounded-2xl font-bold text-sm hover:bg-indigo-50 transition-all flex items-center gap-2 shadow-sm"
          >
            <span>✏️</span> แก้ไขข้อมูล
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {msg.text && (
          <div className={`p-4 rounded-2xl text-sm font-bold flex items-center gap-2 animate-in slide-in-from-top-1 duration-300 ${
            msg.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
          }`}>
            {msg.type === "success" ? "✅" : "⚠️"} {msg.text}
          </div>
        )}

        <div className={`bg-white rounded-3xl border transition-all duration-300 ${isEditing ? 'border-indigo-200 shadow-xl shadow-indigo-500/5 ring-4 ring-indigo-500/5' : 'border-slate-200 shadow-sm'}`}>
          <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
            <h3 className="font-bold text-slate-700 flex items-center gap-2">
              <span className="text-indigo-600">👤</span> ข้อมูลทั่วไป
            </h3>
            <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-full font-bold uppercase tracking-widest">
              Staff Account
            </span>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">ชื่อ-นามสกุล</label>
                <input
                  type="text"
                  value={form.name}
                  disabled={!isEditing}
                  onChange={e => setForm({...form, name: e.target.value})}
                  className={`w-full px-4 py-3 border rounded-2xl transition-all ${
                    isEditing 
                    ? "bg-white border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" 
                    : "bg-slate-50 border-slate-100 text-slate-500 cursor-not-allowed"
                  }`}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">อีเมล (Email)</label>
                <input
                  type="email"
                  value={form.email}
                  disabled={!isEditing}
                  onChange={e => setForm({...form, email: e.target.value})}
                  placeholder="example@rmuti.ac.th"
                  className={`w-full px-4 py-3 border rounded-2xl transition-all ${
                    isEditing 
                    ? "bg-white border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" 
                    : "bg-slate-50 border-slate-100 text-slate-500 cursor-not-allowed"
                  }`}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Username</label>
                <input
                  type="text"
                  value={(session?.user as any)?.username || ""}
                  disabled
                  className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-2xl text-slate-400 cursor-not-allowed font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">สิทธิ์การใช้งาน (Role)</label>
                <div className="inline-block px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold">
                  { (session?.user as any)?.role === 3 ? "ผู้ดูแลระบบ (Admin)" : (session?.user as any)?.role === 2 ? "ผู้ดำเนินการ (Operator)" : "เจ้าหน้าที่ (Staff)" }
                </div>
              </div>
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="bg-white rounded-3xl border border-indigo-200 shadow-xl shadow-indigo-500/5 ring-4 ring-indigo-500/5 overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-indigo-50 bg-indigo-50/30">
              <h3 className="font-bold text-slate-700 flex items-center gap-2">
                <span className="text-indigo-600">🔒</span> เปลี่ยนรหัสผ่าน
              </h3>
              <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider font-bold">เว้นว่างไว้หากไม่ต้องการเปลี่ยนรหัสผ่าน</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">รหัสผ่านปัจจุบัน</label>
                <input
                  type="password"
                  placeholder="ระบุรหัสผ่านเดิมเพื่อยืนยัน"
                  value={form.currentPassword}
                  onChange={e => setForm({...form, currentPassword: e.target.value})}
                  className="w-full px-4 py-3 bg-white border border-indigo-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">รหัสผ่านใหม่</label>
                  <input
                    type="password"
                    value={form.newPassword}
                    onChange={e => setForm({...form, newPassword: e.target.value})}
                    className="w-full px-4 py-3 bg-white border border-indigo-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">ยืนยันรหัสผ่านใหม่</label>
                  <input
                    type="password"
                    value={form.confirmPassword}
                    onChange={e => setForm({...form, confirmPassword: e.target.value})}
                    className="w-full px-4 py-3 bg-white border border-indigo-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
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
              className="px-8 py-3.5 bg-white text-slate-500 font-bold rounded-2xl border border-slate-200 hover:bg-slate-50 transition active:scale-95"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-10 py-3.5 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition disabled:opacity-50 flex items-center gap-2 active:scale-95"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : "💾 บันทึกการเปลี่ยนแปลง"}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
