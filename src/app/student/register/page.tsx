"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import ModalAlert from "@/components/ModalAlert";

interface OrgUnit {
  Unit_id: number;
  Unit_name: string;
  Unit_type: string;
  Unit_icon?: string;
  Unit_parent_id?: number;
}

export default function StudentRegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [unitsLoading, setUnitsLoading] = useState(true);
  const [units, setUnits] = useState<OrgUnit[]>([]);
  const [msg, setMsg] = useState({ type: "" as any, title: "", text: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [form, setForm] = useState({
    studentId: "",
    name: "",
    faculty: "",
    major: "",
    password: "",
    confirmPassword: "",
    email: "",
  });

  useEffect(() => {
    fetch("/api/public/units")
      .then(r => r.json())
      .then(data => {
        setUnits(data.units || []);
        setUnitsLoading(false);
      })
      .catch(() => {
        setMsg({ type: "error", title: "ข้อผิดพลาด", text: "ไม่สามารถโหลดข้อมูลคณะ/สาขาได้" });
        setUnitsLoading(false);
      });
  }, []);

  const faculties = useMemo(() => units.filter(u => u.Unit_type === 'faculty'), [units]);
  const selectedFacultyId = useMemo(() => units.find(f => f.Unit_name === form.faculty)?.Unit_id, [units, form.faculty]);
  const availableMajors = useMemo(() => units.filter(u => u.Unit_type === 'major' && u.Unit_parent_id === selectedFacultyId), [units, selectedFacultyId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg({ type: "", title: "", text: "" });

    if (form.password !== form.confirmPassword) {
      setMsg({ type: "warning", title: "รหัสผ่านไม่ตรงกัน", text: "กรุณาตรวจสอบรหัสผ่านและการยืนยันรหัสผ่านอีกครั้ง" });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setMsg({ type: "error", title: "ไม่สามารถลงทะเบียนได้", text: data.error || "เกิดข้อผิดพลาดในการลงทะเบียน" });
        setLoading(false);
        return;
      }

      setMsg({ type: "success", title: "ลงทะเบียนสำเร็จ", text: "บัญชีนักศึกษาของคุณพร้อมใช้งานแล้ว ระบบกำลังนำคุณไปยังแดชบอร์ด" });
      
      const loginResult = await signIn("credentials", {
        username: form.studentId,
        password: form.password,
        loginType: "student",
        redirect: false,
      });

      if (loginResult?.error) {
        router.push("/student/login");
      } else {
        router.push("/student/dashboard");
      }
    } catch (err) {
      setMsg({ type: "error", title: "เกิดข้อผิดพลาด", text: "ไม่สามารถติดต่อเซิร์ฟเวอร์ได้" });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col lg:flex-row font-sans relative overflow-hidden">
      <ModalAlert isOpen={!!msg.text} type={msg.type || "info"} title={msg.title} message={msg.text} onConfirm={() => { if (msg.type === "success") { router.push("/student/dashboard"); } else { setMsg({ type: "" as any, title: "", text: "" }); } }} />
      
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-orange-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="hidden lg:flex lg:w-1/3 flex-col justify-center p-16 relative z-10 border-r border-white/5 bg-slate-900/50 backdrop-blur-sm">
        <div className="space-y-8">
          <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-white font-black text-2xl backdrop-blur-sm shadow-2xl">RC</div>
          <h1 className="text-5xl font-black text-white leading-tight">Join the <br /><span className="text-indigo-400 font-black italic">Community.</span></h1>
          <p className="text-slate-400 font-medium leading-relaxed max-w-sm">เริ่มต้นใช้งานระบบเพื่อเป็นส่วนหนึ่งในการขับเคลื่อนมหาวิทยาลัยให้น่าอยู่ยิ่งขึ้น ข้อมูลของคุณจะถูกเก็บเป็นความลับสูงสุด</p>
          <div className="space-y-6 pt-8">
            <div className="flex items-center gap-4 group cursor-default">
               <div className="w-10 h-10 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center font-bold border border-indigo-500/20 group-hover:scale-110 transition-transform">✓</div>
               <p className="text-slate-300 font-bold text-sm tracking-wide">ยื่นคำร้องได้ทันทีหลังสมัคร</p>
            </div>
            <div className="flex items-center gap-4 group cursor-default">
               <div className="w-10 h-10 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center font-bold border border-indigo-500/20 group-hover:scale-110 transition-transform">✓</div>
               <p className="text-slate-300 font-bold text-sm tracking-wide">ติดตามสถานะแบบ Real-time</p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-2/3 flex items-center justify-center p-6 sm:p-12 relative z-10 overflow-y-auto">
        <div className="w-full max-w-2xl animate-in fade-in slide-in-from-right-8 duration-700">
          <div className="bg-white rounded-[3rem] p-8 sm:p-16 shadow-2xl relative overflow-hidden border border-slate-100">
            <div className="mb-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
              <div>
                <h2 className="text-4xl font-black text-slate-800 tracking-tight">Create Account</h2>
                <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] mt-2">Registration Form for Students</p>
              </div>
              <Link href="/student/login" className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline px-4 py-2 bg-indigo-50 rounded-xl transition-colors">Log In Instead</Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {unitsLoading ? (
                <div className="py-20 text-center space-y-4">
                  <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mx-auto" />
                  <p className="text-slate-400 text-xs font-black uppercase tracking-widest">กำลังซิงค์ข้อมูลหน่วยงาน...</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Student ID *</label>
                      <input type="text" value={form.studentId} onChange={(e) => setForm({ ...form, studentId: e.target.value })} placeholder="67XXXXXXXXX-X" required className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all font-bold text-slate-700 placeholder:text-slate-300" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name *</label>
                      <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="ชื่อ-นามสกุล" required className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all font-bold text-slate-700 placeholder:text-slate-300" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address *</label>
                    <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="example@rmuti.ac.th" required className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all font-bold text-slate-700 placeholder:text-slate-300" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Faculty *</label>
                      <div className="relative">
                        <select value={form.faculty} onChange={(e) => setForm({ ...form, faculty: e.target.value, major: "" })} required className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all font-bold text-slate-700 appearance-none">
                          <option value="">เลือกคณะ...</option>
                          {faculties.map(f => <option key={f.Unit_id} value={f.Unit_name}>{f.Unit_icon} {f.Unit_name}</option>)}
                        </select>
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">▼</div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Major *</label>
                      <div className="relative">
                        <select value={form.major} onChange={(e) => setForm({ ...form, major: e.target.value })} required disabled={!form.faculty} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all font-bold text-slate-700 appearance-none disabled:opacity-40">
                          <option value="">เลือกสาขาวิชา...</option>
                          {availableMajors.map(m => <option key={m.Unit_id} value={m.Unit_name}>{m.Unit_icon} {m.Unit_name}</option>)}
                        </select>
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">▼</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Create Password *</label>
                      <div className="relative">
                        <input type={showPassword ? "text" : "password"} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" required className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all font-bold text-slate-700 pr-14 placeholder:text-slate-300" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-slate-300 hover:text-indigo-600"> {showPassword ? "👁️" : "🕶️"} </button>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirm Password *</label>
                      <div className="relative">
                        <input type={showConfirmPassword ? "text" : "password"} value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} placeholder="••••••••" required className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all font-bold text-slate-700 pr-14 placeholder:text-slate-300" />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-slate-300 hover:text-indigo-600"> {showConfirmPassword ? "👁️" : "🕶️"} </button>
                      </div>
                    </div>
                  </div>

                  <button type="submit" disabled={loading} className="w-full py-6 bg-slate-900 text-white font-black rounded-[2rem] shadow-2xl shadow-slate-900/30 hover:bg-slate-800 disabled:opacity-50 transition-all flex items-center justify-center gap-4 uppercase tracking-[0.2em] text-[11px] mt-12">
                    {loading ? <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" /> : <><span>Complete Registration</span><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg></>}
                  </button>
                </>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
