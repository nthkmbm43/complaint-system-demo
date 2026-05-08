"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";

import { COMPLAINT_TYPES, ORGANIZATION_UNITS } from "@/lib/constants";
import { CategoryIcon } from "@/components/Icons";

const STATUS_CONFIG: Record<number, { label: string; color: string; bg: string; icon: string }> = {
  0: { label: "ยื่นคำร้อง", color: "text-gray-600", bg: "bg-gray-100", icon: "📝" },
  1: { label: "กำลังดำเนินการ", color: "text-blue-700", bg: "bg-blue-100", icon: "⏳" },
  2: { label: "รอประเมิน", color: "text-amber-700", bg: "bg-amber-100", icon: "⭐" },
  3: { label: "เสร็จสิ้น", color: "text-green-700", bg: "bg-green-100", icon: "✅" },
  4: { label: "ปฏิเสธ", color: "text-red-700", bg: "bg-red-100", icon: "❌" },
  5: { label: "ยกเลิก", color: "text-slate-500", bg: "bg-slate-100", icon: "🗑️" },
};

const TYPE_CONFIG = COMPLAINT_TYPES;

interface Complaint {
  id: string;
  title: string;
  status: number;
  priority: number;
  type: number;
  isAnonymous: boolean;
  createdAt: string;
}

export default function StudentComplaintsPage() {
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

  const filtered = useMemo(() => {
    return complaints.filter((c) => {
      const matchSearch = search === "" || 
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.id.toLowerCase().includes(search.toLowerCase());
      const matchStatus = filterStatus === "all" || c.status === Number(filterStatus);
      return matchSearch && matchStatus;
    });
  }, [complaints, search, filterStatus]);

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">ประวัติคำร้องของฉัน</h2>
          <p className="text-gray-500 text-sm mt-1">ติดตามสถานะและตรวจสอบความคืบหน้าของคำร้องที่ยื่นไว้</p>
        </div>
        <Link
          href="/student/complaints/new"
          className="flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 text-white font-bold rounded-2xl shadow-lg hover:bg-orange-600 transition hover:-translate-y-0.5 active:translate-y-0"
        >
          <span>✍️</span> ยื่นคำร้องใหม่
        </Link>
      </div>

      {/* Search & Simple Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-grow relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="ค้นหาตามหัวข้อหรือรหัสอ้างอิง..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition shadow-sm"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500/20 shadow-sm min-w-[150px]"
        >
          <option value="all">ทุกสถานะ</option>
          {Object.entries(STATUS_CONFIG).map(([val, { label }]) => (
            <option key={val} value={val}>{label}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm animate-pulse">
              <div className="h-4 w-1/4 bg-gray-100 rounded mb-4" />
              <div className="h-6 w-3/4 bg-gray-200 rounded mb-2" />
              <div className="h-3 w-1/2 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-[2rem] border border-gray-100 text-center py-24 shadow-sm">
          <div className="text-7xl mb-6">🏜️</div>
          <h3 className="text-xl font-bold text-gray-800">ไม่พบประวัติคำร้อง</h3>
          <p className="text-gray-400 mt-2">
            {search || filterStatus !== "all" 
              ? "ลองค้นหาด้วยคำอื่นหรือเปลี่ยนสถานะการกรอง" 
              : "ดูเหมือนคุณจะยังไม่เคยยื่นคำร้องใดๆ"}
          </p>
          {!search && filterStatus === "all" && (
            <Link 
              href="/student/complaints/new" 
              className="inline-block mt-6 text-orange-600 font-bold hover:underline"
            >
              เริ่มต้นยื่นคำร้องครั้งแรกที่นี่ →
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filtered.map((c) => {
            const status = STATUS_CONFIG[c.status];
            return (
              <Link 
                key={c.id} 
                href={`/student/complaints/${c.id}`}
                className="group bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-xl hover:border-orange-200 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
              >
                {/* Status bar on left */}
                <div className={`absolute top-0 left-0 bottom-0 w-1.5 ${status.bg.replace('bg-', 'bg-')}`} />
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex-grow">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full ${status.bg} ${status.color}`}>
                        <span>{status.icon}</span> {status.label}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-gray-500 bg-gray-50 px-3 py-1 rounded-full border border-gray-200/50">
                        <CategoryIcon typeId={c.type} className="w-3 h-3" />
                        {TYPE_CONFIG.find(t => t.id === c.type)?.label}
                      </span>
                      <span className="text-[10px] font-mono text-gray-300 tracking-tighter">
                        ID: {c.id.substring(0, 8)}...
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-orange-600 transition-colors leading-tight">
                      {c.title}
                    </h3>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        📅 {new Date(c.createdAt).toLocaleDateString("th-TH", {
                          year: "numeric", month: "short", day: "numeric"
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        ⏰ {new Date(c.createdAt).toLocaleTimeString("th-TH", {
                          hour: "2-digit", minute: "2-digit"
                        })} น.
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-none pt-4 md:pt-0">
                    <div className="md:hidden text-[10px] font-bold text-orange-600">กดเพื่อดูรายละเอียด</div>
                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300 group-hover:bg-orange-50 group-hover:text-orange-500 transition-all transform group-hover:translate-x-1">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
