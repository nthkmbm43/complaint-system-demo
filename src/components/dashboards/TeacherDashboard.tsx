"use client";
import React from "react";
import Link from "next/link";
import { COMPLAINT_TYPES } from "@/lib/constants";
import { CategoryIcon } from "@/components/Icons";

export default function TeacherDashboard({ stats, recentComplaints = [] }: any) {
  if (!stats) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-indigo-900 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-10 opacity-10 text-9xl transform rotate-12">🎓</div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <h2 className="text-3xl font-black mb-2 tracking-tight">ยินดีต้อนรับ อาจารย์ที่ปรึกษา</h2>
            <p className="text-indigo-200 font-medium">ภารกิจและข้อร้องเรียนที่คุณได้รับมอบหมายให้ดำเนินการ</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-white/10 backdrop-blur-xl p-6 rounded-3xl border border-white/20 text-center min-w-[120px]">
              <div className="text-3xl font-black mb-1">{stats.myCases}</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-indigo-300">My Tasks</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black text-slate-800 flex items-center gap-3">
                <span className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center text-sm italic">T</span>
                งานที่ได้รับมอบหมายล่าสุด
              </h3>
              <Link href="/admin/assignments" className="text-xs font-black text-indigo-600 uppercase tracking-widest hover:underline">View All</Link>
            </div>

            <div className="space-y-4">
              {recentComplaints.map((c: any) => (
                <Link key={c.id} href={`/admin/complaints/${c.id}`}>
                  <div className="flex items-center justify-between p-5 bg-slate-50 hover:bg-white border border-transparent hover:border-slate-200 rounded-3xl transition-all group">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${COMPLAINT_TYPES.find(t => t.id === c.type)?.bg} ${COMPLAINT_TYPES.find(t => t.id === c.type)?.text}`}>
                        <CategoryIcon typeId={c.type} className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{c.title}</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{c.student?.name} • {new Date(c.createdAt).toLocaleDateString("th-TH")}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-white border border-slate-100`}>
                        Phase {c.status}
                      </span>
                      <span className="text-slate-300">→</span>
                    </div>
                  </div>
                </Link>
              ))}
              {recentComplaints.length === 0 && (
                <div className="text-center py-10 text-slate-400 font-bold uppercase tracking-widest text-xs">No active cases</div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-8">
           <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl">
             <div className="relative z-10">
               <h4 className="font-black mb-4 text-xl">คู่มือการใช้งาน</h4>
               <p className="text-xs text-slate-400 leading-relaxed mb-6">คุณสามารถดูคู่มือและขั้นตอนการดำเนินงานแก้ไขข้อร้องเรียนที่ได้รับมอบหมายได้ที่นี่</p>
               <Link href="/admin/manual">
                 <button className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl text-[10px] uppercase tracking-widest transition-all">อ่านคู่มือ</button>
               </Link>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
