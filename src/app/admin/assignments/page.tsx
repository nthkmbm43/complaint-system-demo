"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { COMPLAINT_TYPES, PRIORITY_CONFIG } from "@/lib/constants";
import { CategoryIcon } from "@/components/Icons";

const STATUS_CONFIG: Record<number, { label: string; color: string; bg: string }> = {
  0: { label: "ยื่นคำร้อง", color: "text-gray-600", bg: "bg-gray-100" },
  1: { label: "กำลังดำเนินการ", color: "text-blue-700", bg: "bg-blue-100" },
  2: { label: "รอประเมิน", color: "text-amber-700", bg: "bg-amber-100" },
  3: { label: "เสร็จสิ้น", color: "text-green-700", bg: "bg-green-100" },
  4: { label: "ปฏิเสธ", color: "text-red-700", bg: "bg-red-100" },
};

interface Complaint {
  id: string;
  title: string;
  status: number;
  priority: number;
  type: number;
  isAnonymous: boolean;
  createdAt: string;
  student?: { name: string; studentId: string };
}

export default function AdminAssignmentsPage() {
  const { data: session } = useSession();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    fetch("/api/complaints")
      .then((r) => r.json())
      .then((data) => {
        setComplaints(data.complaints || []);
        setLoading(false);
      });
  }, []);

  const filtered = complaints.filter(c => {
    const matchSearch = search === "" || 
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || c.status === Number(filterStatus);
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">งานที่ได้รับมอบหมาย</h2>
          <p className="text-slate-500 text-sm mt-1">ภารกิจและข้อร้องเรียนที่คุณได้รับมอบหมายให้ดำเนินการ</p>
        </div>
      </div>

      {/* Filters Panel */}
      <div className="bg-white rounded-[2rem] border border-slate-200 p-6 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
            <input
              type="text"
              placeholder="ค้นหาตามหัวข้อ, รหัสอ้างอิง..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-[1.25rem] focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all font-medium"
            />
          </div>
          <div className="min-w-[200px]">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-[1.25rem] text-sm font-bold text-slate-600 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500"
            >
              <option value="all">ทุกสถานะ</option>
              {Object.entries(STATUS_CONFIG).map(([val, { label }]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-6">
          <div className="w-16 h-16 border-4 border-indigo-50 border-t-indigo-600 rounded-full animate-spin shadow-inner" />
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs animate-pulse">กำลังโหลดข้อมูล...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-[3rem] border border-slate-100 text-center py-32 shadow-sm">
          <div className="text-8xl mb-8 grayscale opacity-20">🏝️</div>
          <h3 className="text-2xl font-black text-slate-800">ไม่มีงานที่ได้รับมอบหมาย</h3>
          <p className="text-slate-400 mt-2 font-medium">ขณะนี้คุณยังไม่มีข้อร้องเรียนที่ต้องดำเนินการ</p>
        </div>
      ) : (
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/20 overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50/50 border-b border-slate-100">
                <tr>
                  <th className="text-left px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">หัวข้อ / รหัสอ้างอิง</th>
                  <th className="text-left px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">ผู้ยื่นคำร้อง</th>
                  <th className="text-left px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">หมวดหมู่ / วันที่</th>
                  <th className="text-left px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">ความเร่งด่วน</th>
                  <th className="text-left px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">สถานะปัจจุบัน</th>
                  <th className="px-8 py-5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((c) => {
                  const status = STATUS_CONFIG[c.status];
                  const priority = PRIORITY_CONFIG[c.priority];
                  return (
                    <tr key={c.id} className="hover:bg-indigo-50/30 transition-all group">
                      <td className="px-8 py-5">
                        <p className="font-black text-slate-800 mb-1 group-hover:text-indigo-600 transition-colors leading-tight">{c.title}</p>
                        <p className="text-[9px] font-mono text-slate-400 uppercase tracking-[0.2em]">{c.id.substring(0, 16)}...</p>
                      </td>
                      <td className="px-4 py-5">
                        {c.isAnonymous ? (
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-slate-100 rounded-xl flex items-center justify-center text-sm">🔒</div>
                            <span className="text-xs font-bold text-slate-400 italic">ไม่ระบุตัวตน</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center font-black text-xs">
                              {c.student?.name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-slate-800 font-bold text-xs">{c.student?.name}</p>
                              <p className="text-[10px] text-slate-400 font-mono">{c.student?.studentId}</p>
                            </div>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-5">
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded flex items-center justify-center shrink-0 ${COMPLAINT_TYPES.find(t => t.id === c.type)?.bg} ${COMPLAINT_TYPES.find(t => t.id === c.type)?.text}`}>
                            <CategoryIcon typeId={c.type} className="w-3 h-3" />
                          </div>
                          <p className="text-xs text-slate-600 font-bold">
                            {COMPLAINT_TYPES.find(t => t.id === c.type)?.label}
                          </p>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1 uppercase font-black pl-8">
                          {new Date(c.createdAt).toLocaleDateString("th-TH")}
                        </p>
                      </td>
                      <td className="px-4 py-5">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${priority.color} bg-slate-50 border border-current/10`}>
                          {priority.label}
                        </span>
                      </td>
                      <td className="px-4 py-5">
                        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${status.bg} ${status.color} border border-current/5 shadow-sm`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <Link
                          href={`/admin/complaints/${c.id}`}
                          className="inline-flex items-center justify-center w-12 h-12 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-indigo-600 hover:border-indigo-600 hover:shadow-xl hover:-translate-y-1 transition-all"
                          title="ดูรายละเอียด"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden divide-y divide-slate-100">
            {filtered.map((c) => {
              const status = STATUS_CONFIG[c.status];
              const priority = PRIORITY_CONFIG[c.priority];
              return (
                <div key={c.id} className="p-6 hover:bg-slate-50 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-lg ${status.bg} ${status.color}`}>
                      {status.label}
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono tracking-tighter uppercase">ID: {c.id.substring(0, 8)}</span>
                  </div>
                  <h4 className="font-black text-slate-800 text-base mb-2 leading-tight">{c.title}</h4>
                  <div className="grid grid-cols-2 gap-4 text-[10px] font-bold text-slate-500 mb-6">
                    <span className="flex items-center gap-2">
                      <CategoryIcon typeId={c.type} className="w-3 h-3" />
                      {COMPLAINT_TYPES.find(t => t.id === c.type)?.label}
                    </span>
                    <span className={`flex items-center gap-2 ${priority.color}`}>🔥 {priority.label}</span>
                    <span className="flex items-center gap-2">👤 {c.isAnonymous ? "Anonymous" : c.student?.name}</span>
                    <span className="flex items-center gap-2">📅 {new Date(c.createdAt).toLocaleDateString("th-TH")}</span>
                  </div>
                  <Link
                    href={`/admin/complaints/${c.id}`}
                    className="flex items-center justify-center w-full py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-slate-900/10"
                  >
                    รายละเอียดงาน
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
