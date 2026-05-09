"use client";
import React from "react";
import Link from "next/link";
import { COMPLAINT_TYPES } from "@/lib/constants";
import { CategoryIcon } from "@/components/Icons";

export default function FullAdminDashboard({ stats, recentComplaints = [], typeStats = [] }: any) {
  if (!stats) return null;

  const totalCount = typeStats.reduce((acc: number, curr: any) => acc + curr._count._all, 0);

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
           <div className="flex items-center gap-2 mb-2">
             <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">System Administrator Console</p>
           </div>
           <h2 className="text-5xl font-black text-slate-900 tracking-tighter">RMUTI Care Control</h2>
        </div>
        <div className="flex flex-wrap gap-4">
           <Link href="/admin/students" className="px-6 py-3.5 bg-orange-500 text-white font-black rounded-2xl hover:bg-orange-600 transition-all text-[10px] uppercase tracking-widest shadow-xl shadow-orange-500/20">Manage Students</Link>
           <Link href="/admin/staff" className="px-6 py-3.5 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all text-[10px] uppercase tracking-widest shadow-xl">Manage Staff</Link>
           <Link href="/admin/settings" className="px-6 py-3.5 bg-white border-2 border-slate-200 text-slate-900 font-black rounded-2xl hover:border-slate-400 transition-all text-[10px] uppercase tracking-widest shadow-sm">System Settings</Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Tickets</p>
           <p className="text-4xl font-black text-slate-900">{totalCount}</p>
        </div>
        <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">New/Pending</p>
           <p className="text-4xl font-black text-indigo-600">{stats.newCases}</p>
        </div>
        <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Urgent Action</p>
           <p className="text-4xl font-black text-orange-500">{stats.criticalCases}</p>
        </div>
        <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">MTD Success</p>
           <p className="text-4xl font-black text-green-600">{stats.completedThisMonth}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">System-wide Activity</h3>
            <Link href="/admin/reports" className="text-[10px] font-black text-indigo-600 uppercase tracking-widest border-b-2 border-indigo-500 pb-0.5">Advanced Reports</Link>
          </div>
          <div className="p-8">
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {COMPLAINT_TYPES.map((type) => {
                  const stat = typeStats.find((s: any) => s.type === type.id);
                  const count = stat?._count._all || 0;
                  const percent = totalCount > 0 ? (count / totalCount) * 100 : 0;
                  return (
                    <div key={type.id} className="space-y-3">
                      <div className="flex justify-between items-center">
                         <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${type.bg} ${type.text}`}>
                               <CategoryIcon typeId={type.id} className="w-4 h-4" />
                            </div>
                            <span className="text-xs font-black text-slate-700 uppercase tracking-tight">{type.label}</span>
                         </div>
                         <span className="text-xs font-black text-slate-400">{count}</span>
                      </div>
                      <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                        <div className={`h-full bg-${type.color}-500 rounded-full transition-all duration-1000`} style={{ width: `${percent}%` }}></div>
                      </div>
                    </div>
                  );
                })}
             </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-10 text-8xl transform -rotate-12">🛡️</div>
             <div className="relative z-10">
               <h4 className="text-xl font-black mb-4 uppercase tracking-tight leading-tight">Admin<br/>Quick Access</h4>
               <ul className="space-y-4">
                  <li>
                    <Link href="/admin/students" className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/5 group">
                      <span className="text-[10px] font-black uppercase tracking-widest">Student Accounts</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/admin/staff" className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/5 group">
                      <span className="text-[10px] font-black uppercase tracking-widest">Staff / Admin List</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/admin/settings" className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/5 group">
                      <span className="text-[10px] font-black uppercase tracking-widest">System Config</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                  </li>
               </ul>
             </div>
          </div>

          <div className="bg-white rounded-[3rem] border border-slate-200 p-8 shadow-sm">
             <div className="flex justify-between items-center mb-6">
               <h4 className="font-black text-slate-800 tracking-tight uppercase text-sm">Recent Complaints</h4>
               <Link href="/admin/complaints" className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">View All</Link>
             </div>
             
             <div className="space-y-4">
                {recentComplaints.slice(0, 4).map((c: any) => (
                  <Link key={c.id} href={`/admin/complaints/${c.id}`} className="block group">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors">
                       <div>
                          <p className="text-xs font-black text-slate-800 group-hover:text-indigo-600 transition-colors mb-1 truncate max-w-[150px] sm:max-w-[200px]">{c.title}</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{new Date(c.createdAt).toLocaleDateString("th-TH")} • {c.student?.name || "Anonymous"}</p>
                       </div>
                       <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-slate-400 group-hover:text-indigo-600 shadow-sm border border-slate-100">
                          <span className="text-xs font-bold">→</span>
                       </div>
                    </div>
                  </Link>
                ))}
                {recentComplaints.length === 0 && (
                  <div className="text-center py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">No Recent Tickets</div>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
