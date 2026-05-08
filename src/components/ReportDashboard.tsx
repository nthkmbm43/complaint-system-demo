"use client";

import React, { useState, useEffect, useMemo } from "react";
import { STATUS_LABELS, COMPLAINT_TYPES, PRIORITY_CONFIG } from "@/lib/constants";

interface ReportData {
  total: number;
  statusStats: Record<number, number>;
  typeStats: Record<number, number>;
  priorityStats: Record<number, number>;
  avgRating: string;
  evaluationCount: number;
  complaints: any[];
}

export default function ReportDashboard({ initialUnits = [], userRole = 1 }: { initialUnits: any[], userRole: number }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ReportData | null>(null);
  
  // Filter States
  const [filters, setFilters] = useState({
    faculty: "",
    major: "",
    type: "",
    priority: "",
    status: "",
    startDate: "",
    endDate: "",
  });

  const faculties = useMemo(() => initialUnits.filter(u => u.Unit_type === "faculty"), [initialUnits]);
  const selectedFacultyId = useMemo(() => initialUnits.find(u => u.Unit_name === filters.faculty)?.Unit_id, [initialUnits, filters.faculty]);
  const availableMajors = useMemo(() => initialUnits.filter(u => u.Unit_type === "major" && u.Unit_parent_id === selectedFacultyId), [initialUnits, selectedFacultyId]);

  const fetchReports = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, val]) => {
      if (val) params.append(key, val);
    });

    try {
      const res = await fetch(`/api/admin/reports?${params.toString()}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Failed to fetch reports", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [filters]);

  const resetFilters = () => {
    setFilters({
      faculty: "",
      major: "",
      type: "",
      priority: "",
      status: "",
      startDate: "",
      endDate: "",
    });
  };

  const handleExportPDF = () => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, val]) => {
      if (val) params.append(key, val);
    });
    window.open(`/print-report?${params.toString()}`, "_blank");
  };

  // Custom Chart Components
  const DonutChart = ({ stats, config, total }: { stats: Record<number, number>, config: any[], total: number }) => {
    let cumulativePercent = 0;
    const slices = config.map(item => {
      const count = stats[item.id] || 0;
      const percent = total > 0 ? (count / total) * 100 : 0;
      const startPercent = cumulativePercent;
      cumulativePercent += percent;
      return { ...item, count, percent, startPercent };
    });

    return (
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="relative w-40 h-40">
          <svg viewBox="0 0 32 32" className="w-full h-full -rotate-90">
            {slices.map((slice, i) => (
              <circle
                key={i}
                r="16"
                cx="16"
                cy="16"
                fill="transparent"
                stroke={slice.percent > 0 ? (slice.hexColor || "#6366f1") : "transparent"}
                strokeWidth="8"
                strokeDasharray={`${slice.percent} 100`}
                strokeDashoffset={-slice.startPercent}
                className="transition-all duration-1000"
              />
            ))}
            <circle r="12" cx="16" cy="16" fill="white" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-black text-slate-900">{total}</span>
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Total</span>
          </div>
        </div>
        <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
          {slices.filter(s => s.count > 0 || total === 0).map((slice, i) => (
            <div key={i} className="flex items-center justify-between group">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: slice.hexColor || "#6366f1" }} />
                <span className="text-[10px] font-bold text-slate-600 truncate max-w-[120px]">{slice.label}</span>
              </div>
              <span className="text-[10px] font-black text-slate-900">{slice.count}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const BarChart = ({ stats, config, total }: { stats: Record<number, number>, config: Record<number, any>, total: number }) => {
    const maxVal = Math.max(...Object.values(stats), 1);
    return (
      <div className="space-y-4">
        {Object.entries(config).map(([key, item]: [string, any]) => {
          const count = stats[Number(key)] || 0;
          const percent = (count / maxVal) * 100;
          return (
            <div key={key} className="space-y-1">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                <span>{item.label}</span>
                <span>{count}</span>
              </div>
              <div className="h-2 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                <div 
                  className={`h-full transition-all duration-1000 rounded-full ${item.bg || 'bg-indigo-500'}`}
                  style={{ width: `${percent}%`, backgroundColor: item.hexColor }}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-2">Analytics Console</p>
           <h2 className="text-4xl font-black text-slate-900 tracking-tighter">รายงานและสถิติอัจฉริยะ</h2>
        </div>
        <div className="flex gap-3">
           <button onClick={handleExportPDF} className="px-6 py-3 bg-indigo-600 text-white font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-xl shadow-indigo-600/20 active:scale-95">
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
             ออกรายงานฉบับสมบูรณ์ (PDF)
           </button>
           <button onClick={resetFilters} className="px-6 py-3 bg-white border border-slate-200 text-slate-600 font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
             รีเซ็ตตัวกรอง
           </button>
        </div>
      </div>

      {/* Filters Card */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {userRole === 3 && (
            <>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">คณะ</label>
                <select value={filters.faculty} onChange={(e) => setFilters({...filters, faculty: e.target.value, major: ""})} className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700 outline-none focus:border-indigo-500">
                  <option value="">ทุกคณะ</option>
                  {faculties.map(f => <option key={f.Unit_id} value={f.Unit_name}>{f.Unit_name}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">สาขา</label>
                <select value={filters.major} onChange={(e) => setFilters({...filters, major: e.target.value})} disabled={!filters.faculty} className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700 outline-none focus:border-indigo-500 disabled:opacity-50">
                  <option value="">ทุกสาขา</option>
                  {availableMajors.map(m => <option key={m.Unit_id} value={m.Unit_name}>{m.Unit_name}</option>)}
                </select>
              </div>
            </>
          )}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">ประเภทเรื่อง</label>
            <select value={filters.type} onChange={(e) => setFilters({...filters, type: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700 outline-none focus:border-indigo-500">
              <option value="">ทุกประเภท</option>
              {COMPLAINT_TYPES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">ความเร่งด่วน</label>
            <select value={filters.priority} onChange={(e) => setFilters({...filters, priority: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700 outline-none focus:border-indigo-500">
              <option value="">ทุกระดับ</option>
              {Object.entries(PRIORITY_CONFIG).map(([v, {label}]) => <option key={v} value={v}>{label}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">สถานะ</label>
            <select value={filters.status} onChange={(e) => setFilters({...filters, status: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700 outline-none focus:border-indigo-500">
              <option value="">ทุกสถานะ</option>
              {Object.entries(STATUS_LABELS).map(([v, label]) => <option key={v} value={v}>{label}</option>)}
            </select>
          </div>
          <div className="space-y-2 lg:col-span-1">
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">ตั้งแต่วันที่</label>
             <input type="date" value={filters.startDate} onChange={(e) => setFilters({...filters, startDate: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700 outline-none focus:border-indigo-500" />
          </div>
          <div className="space-y-2 lg:col-span-1">
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">ถึงวันที่</label>
             <input type="date" value={filters.endDate} onChange={(e) => setFilters({...filters, endDate: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700 outline-none focus:border-indigo-500" />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
           <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
           <p className="text-xs font-black text-slate-400 uppercase tracking-widest animate-pulse">Analyzing Records...</p>
        </div>
      ) : data ? (
        <div className="space-y-8 animate-in fade-in duration-700">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-indigo-600 p-8 rounded-[2.5rem] text-white shadow-xl">
               <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-4">Total Cases</p>
               <div className="text-5xl font-black">{data.total}</div>
               <p className="text-[10px] font-bold text-indigo-300 mt-4 uppercase">Across all categories</p>
            </div>
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Avg. Satisfaction</p>
               <div className="text-5xl font-black text-amber-500">{data.avgRating}</div>
               <p className="text-[10px] font-bold text-slate-400 mt-4 uppercase">From {data.evaluationCount} reviews</p>
            </div>
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Resolution Rate</p>
               <div className="text-5xl font-black text-emerald-500">
                 {data.total > 0 ? Math.round(((data.statusStats[3] || 0) / data.total) * 100) : 0}%
               </div>
               <p className="text-[10px] font-bold text-slate-400 mt-4 uppercase">Success closed</p>
            </div>
            <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl">
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Urgent Attention</p>
               <div className="text-5xl font-black text-orange-500">{data.priorityStats[4] || 0 + (data.priorityStats[5] || 0)}</div>
               <p className="text-[10px] font-bold text-slate-500 mt-4 uppercase">Priority 4 & 5</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Category Analysis */}
            <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm">
              <h3 className="text-xl font-black text-slate-900 mb-10 flex items-center gap-3">
                <span className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center text-lg">📊</span>
                วิเคราะห์ตามประเภทเรื่อง
              </h3>
              <DonutChart 
                total={data.total} 
                stats={data.typeStats} 
                config={COMPLAINT_TYPES.map(t => ({
                  id: t.id,
                  label: t.label,
                  hexColor: t.color === 'indigo' ? '#6366f1' : 
                            t.color === 'blue' ? '#3b82f6' : 
                            t.color === 'emerald' ? '#10b981' : 
                            t.color === 'amber' ? '#f59e0b' : 
                            t.color === 'violet' ? '#8b5cf6' : 
                            t.color === 'green' ? '#22c55e' : 
                            t.color === 'rose' ? '#f43f5e' : '#64748b'
                }))} 
              />
            </div>

            {/* Status & Priority Analysis */}
            <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-12">
               <div>
                  <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
                    <span className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center text-lg">🔄</span>
                    ความคืบหน้าการดำเนินงาน
                  </h3>
                  <BarChart 
                    total={data.total}
                    stats={data.statusStats}
                    config={Object.entries(STATUS_LABELS).reduce((acc: any, [v, label]) => {
                      acc[v] = { 
                        label, 
                        bg: v === '3' ? 'bg-emerald-500' : v === '4' ? 'bg-red-500' : v === '0' ? 'bg-slate-300' : 'bg-indigo-500' 
                      };
                      return acc;
                    }, {})}
                  />
               </div>
               <div>
                  <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
                    <span className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center text-lg">⚠️</span>
                    การวิเคราะห์ระดับความสำคัญ
                  </h3>
                  <BarChart 
                    total={data.total}
                    stats={data.priorityStats}
                    config={Object.entries(PRIORITY_CONFIG).reduce((acc: any, [v, {label}]) => {
                      acc[v] = { 
                        label, 
                        hexColor: v === '5' ? '#dc2626' : v === '4' ? '#ef4444' : v === '3' ? '#f97316' : v === '2' ? '#3b82f6' : '#94a3b8'
                      };
                      return acc;
                    }, {})}
                  />
               </div>
            </div>
          </div>

          {/* Export Full Report Section */}
          <div className="bg-slate-900 text-white p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-12 opacity-10 transform scale-150 group-hover:scale-[2] transition-transform duration-700">📜</div>
            <div className="relative z-10">
              <div className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Export Service</div>
              <h4 className="text-3xl font-black mb-4 tracking-tighter">ออกรายงานฉบับสมบูรณ์ (A4 PDF)</h4>
              <p className="text-slate-400 text-sm mb-10 leading-relaxed max-w-2xl">
                ระบบจะทำการจัดเรียงข้อมูลทั้งหมดตามตัวกรองที่คุณเลือกให้อยู่ในรูปแบบรายงานทางการ 
                โดยจะเปิดเป็นหน้าพรีวิวแบบ PDF ให้คุณตรวจสอบและบันทึกไฟล์ได้ทันที
              </p>
              <button 
                onClick={handleExportPDF}
                className="px-10 py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl text-xs uppercase tracking-widest transition-all shadow-xl shadow-indigo-600/20 active:scale-95 flex items-center gap-3"
              >
                <span>Generate Official PDF</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-20 rounded-[3rem] border border-slate-200 text-center">
           <div className="text-6xl mb-6 grayscale opacity-20">🗂️</div>
           <h3 className="text-xl font-black text-slate-800">ไม่พบข้อมูลตามเงื่อนไขที่เลือก</h3>
           <button onClick={resetFilters} className="mt-6 text-indigo-600 font-bold hover:underline">Reset Filters</button>
        </div>
      )}
    </div>
  );
}
