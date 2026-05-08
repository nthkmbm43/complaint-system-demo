"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import ModalAlert from "@/components/ModalAlert";

export default function AdminSettingsPage() {
  const { data: session } = useSession();
  const [msg, setMsg] = useState({ type: "" as any, title: "", text: "" });
  const [loading, setLoading] = useState(false);

  if (!session || (session.user as any).role < 3) {
    // redirect("/admin/login"); // Next.js 13+ client component redirect behavior
  }

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setMsg({ type: "success", title: "บันทึกสำเร็จ", text: "การตั้งค่าระบบได้รับการอัปเดตเรียบร้อยแล้ว (Simulated)" });
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <ModalAlert 
        isOpen={!!msg.text}
        type={msg.type || "info"}
        title={msg.title}
        message={msg.text}
        onConfirm={() => setMsg({ type: "" as any, title: "", text: "" })}
      />

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">ตั้งค่าระบบ (System Settings)</h2>
          <p className="text-slate-500 font-medium mt-1">จัดการพารามิเตอร์พื้นฐานและสถานะของระบบ</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          {/* General Settings */}
          <div className="bg-white rounded-[2.5rem] border border-slate-200 p-10 shadow-sm space-y-8">
             <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3">
               <span className="text-indigo-600">⚙️</span> การตั้งค่าทั่วไป
             </h3>
             <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">ชื่อระบบ (System Name)</label>
                  <input 
                    type="text" 
                    defaultValue="RMUTI Care - Student Complaint System" 
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all font-bold text-slate-700"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">หน่วยงานเจ้าของระบบ</label>
                  <input 
                    type="text" 
                    defaultValue="กองพัฒนานักศึกษา วิทยาเขตขอนแก่น" 
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all font-bold text-slate-700"
                  />
                </div>
             </div>
          </div>

          {/* Maintenance Mode */}
          <div className="bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-10 opacity-10 transform scale-150 group-hover:scale-[1.8] transition-transform duration-700 text-6xl">🚧</div>
            <div className="relative z-10 flex flex-col md:flex-row justify-between md:items-center gap-8">
              <div className="max-w-md">
                <h3 className="text-2xl font-black mb-2">โหมดปิดปรับปรุงระบบ</h3>
                <p className="text-slate-400 font-medium leading-relaxed">
                  หากเปิดใช้งาน นักศึกษาจะไม่สามารถยื่นคำร้องใหม่ได้จนกว่าจะปิดโหมดนี้ แต่เจ้าหน้าที่จะยังคงเข้าใช้งานได้ตามปกติ
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer scale-110">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-16 h-9 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4.5px] after:left-[4.5px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-7 after:w-7 after:transition-all peer-checked:bg-orange-500 shadow-inner"></div>
                <span className="ml-4 text-xs font-black uppercase tracking-widest text-slate-400">Offline</span>
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-8">
           {/* System Info Card */}
           <div className="bg-indigo-50 rounded-[2.5rem] border border-indigo-100 p-8">
              <h4 className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-6">System Info</h4>
              <div className="space-y-4">
                 <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-500">Core Version</span>
                    <span className="text-xs font-black text-indigo-600">v2.5.0-stable</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-500">Environment</span>
                    <span className="px-2 py-0.5 bg-green-100 text-green-600 rounded text-[9px] font-black uppercase">Production</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-500">Database Type</span>
                    <span className="text-xs font-black text-slate-700">SQLite (Local)</span>
                 </div>
                 <div className="pt-4 border-t border-indigo-100">
                    <p className="text-[10px] text-indigo-400 font-medium leading-relaxed">
                       ระบบทำงานบน Next.js 15 และ Prisma ORM มั่นใจได้ในเรื่องประสิทธิภาพและความปลอดภัยของข้อมูล
                    </p>
                 </div>
              </div>
           </div>

           {/* Quick Actions */}
           <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Quick Actions</h4>
              <div className="space-y-3">
                 <button className="w-full py-4 px-6 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold text-xs rounded-2xl transition-all flex items-center gap-3">
                    <span>🧹</span> ล้างแคชระบบ (Clear Cache)
                 </button>
                 <button className="w-full py-4 px-6 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold text-xs rounded-2xl transition-all flex items-center gap-3">
                    <span>📊</span> ส่งออกข้อมูลดิบ (JSON Export)
                 </button>
                 <button className="w-full py-4 px-6 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs rounded-2xl transition-all flex items-center gap-3">
                    <span>⚠️</span> รีเซ็ตสถิติรายเดือน
                 </button>
              </div>
           </div>
        </div>
      </div>

      <div className="pt-10 flex justify-end border-t border-slate-100">
         <button 
           onClick={handleSave}
           disabled={loading}
           className="px-12 py-5 bg-indigo-600 text-white font-black rounded-[2rem] shadow-2xl shadow-indigo-600/20 hover:bg-indigo-700 hover:-translate-y-1 transition-all flex items-center gap-3 disabled:opacity-50 text-sm uppercase tracking-widest"
         >
           {loading ? (
             <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
           ) : (
             <>
               <span>💾 Save Configuration</span>
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
             </>
           )}
         </button>
      </div>
    </div>
  );
}
