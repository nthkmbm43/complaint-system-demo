"use client";
import React from "react";
import Link from "next/link";
import { COMPLAINT_TYPES } from "@/lib/constants";
import { CategoryIcon } from "@/components/Icons";

export default function OperatorDashboard({ stats, recentComplaints = [] }: any) {
  if (!stats) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
           <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-2">Service Center Overview</p>
           <h2 className="text-4xl font-black text-slate-900 tracking-tighter">แดชบอร์ดฝ่ายปฏิบัติการ</h2>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-xl text-xs font-black uppercase tracking-widest border border-green-100">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            System Live
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm group hover:shadow-2xl transition-all">
          <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">รอรับเรื่อง</div>
          <div className="text-5xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{stats.newCases}</div>
          <p className="text-[10px] font-bold text-slate-400 mt-4 uppercase">Pending Approval</p>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm group hover:shadow-2xl transition-all">
          <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">เคสในมือคุณ</div>
          <div className="text-5xl font-black text-indigo-600">{stats.myCases}</div>
          <p className="text-[10px] font-bold text-slate-400 mt-4 uppercase">In Progress</p>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm group hover:shadow-2xl transition-all">
          <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">ความเร่งด่วนสูง</div>
          <div className="text-5xl font-black text-orange-500">{stats.criticalCases}</div>
          <p className="text-[10px] font-bold text-slate-400 mt-4 uppercase">Requires Attention</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="font-black text-slate-800 uppercase tracking-tight flex items-center gap-3 text-lg">
              <span className="w-8 h-8 bg-indigo-600 text-white rounded-xl flex items-center justify-center text-xs">A</span>
              Active Workflow Log
            </h3>
            <Link href="/admin/complaints" className="text-xs font-black text-indigo-600 uppercase tracking-widest">Manage All Case</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                <tr>
                  <th className="px-8 py-5">Complaint Info</th>
                  <th className="px-6 py-5 text-center">Priority</th>
                  <th className="px-6 py-5 text-right pr-8">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentComplaints.map((c: any) => (
                  <tr key={c.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${COMPLAINT_TYPES.find(t => t.id === c.type)?.bg} ${COMPLAINT_TYPES.find(t => t.id === c.type)?.text}`}>
                          <CategoryIcon typeId={c.type} className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-black text-slate-800 mb-0.5 line-clamp-1">{c.title}</p>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{new Date(c.createdAt).toLocaleString("th-TH")}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-center">
                       <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${c.priority >= 4 ? 'bg-orange-100 text-orange-600 border border-orange-200' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                         {c.priority >= 4 ? 'Urgent' : 'Normal'}
                       </span>
                    </td>
                    <td className="px-6 py-6 text-right pr-8">
                       <Link href={`/admin/complaints/${c.id}`} className="inline-block px-5 py-2.5 bg-slate-900 hover:bg-indigo-600 text-white font-black rounded-xl text-[9px] uppercase tracking-widest transition-all">Detail</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl">
            <h4 className="font-black text-lg mb-6 tracking-tight">สรุปยอดวันนี้</h4>
            <div className="space-y-6">
               <div className="flex justify-between items-center">
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Completed Today</span>
                 <span className="text-2xl font-black text-green-400">0</span>
               </div>
               <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                 <div className="h-full bg-green-500 w-0"></div>
               </div>
               <div className="flex justify-between items-center">
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Average Response</span>
                 <span className="text-sm font-black text-white italic">2.4 Hours</span>
               </div>
            </div>
          </div>

          <div className="bg-orange-500 rounded-[2.5rem] p-8 text-white shadow-xl group">
             <h4 className="font-black text-lg mb-2">คู่มือดำเนินการ</h4>
             <p className="text-xs text-orange-100 mb-6 leading-relaxed">ดูระเบียบและขั้นตอนการรับเรื่องร้องเรียนสำหรับฝ่ายปฏิบัติการ</p>
             <button className="w-full py-4 bg-white/20 hover:bg-white/30 backdrop-blur-xl border border-white/30 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">Open Manual</button>
          </div>
        </div>
      </div>
    </div>
  );
}
