"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { STATUS_LABELS, COMPLAINT_TYPES, PRIORITY_CONFIG } from "@/lib/constants";

export default function PrintReportView() {
  const searchParams = useSearchParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFullReport = async () => {
      const res = await fetch(`/api/admin/reports?${searchParams.toString()}`);
      const json = await res.json();
      setData(json);
      setLoading(false);
    };
    fetchFullReport();
  }, [searchParams]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
       <div className="text-center space-y-4">
         <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
         <p className="font-bold text-slate-600">กำลังจัดทำรูปแบบรายงานกระดาษ...</p>
       </div>
    </div>
  );
  
  if (!data) return <div className="p-20 text-center">ไม่พบข้อมูล</div>;

  return (
    <div className="bg-[#525659] min-h-screen flex flex-col print:bg-white print:block">
      {/* Chrome-like PDF Viewer Top Bar (Hidden when printing) */}
      <div className="bg-[#323639] h-14 flex items-center justify-between px-6 sticky top-0 z-50 shadow-lg print:hidden">
        <div className="flex items-center gap-4">
           <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center text-white font-black text-[10px] shadow-lg">PDF</div>
           <span className="text-sm font-medium text-slate-200">RMUTI_Full_Report_{new Date().getTime().toString().slice(-6)}.pdf</span>
        </div>
        <div className="flex items-center gap-2">
           <button 
             onClick={() => window.print()}
             className="p-2.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-all flex items-center gap-2"
             title="Print"
           >
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
           </button>
           <button 
             onClick={() => window.print()}
             className="p-2.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-all flex items-center gap-2"
             title="Download PDF"
           >
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
           </button>
           <div className="w-px h-6 bg-white/10 mx-2"></div>
           <button 
             onClick={() => window.close()}
             className="p-2.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-all"
             title="Close"
           >
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
           </button>
        </div>
      </div>

      {/* A4 Paper Workspace */}
      <div className="flex-grow overflow-y-auto py-12 px-4 print:p-0 print:overflow-visible flex justify-center">
        <div className="paper-container bg-white shadow-2xl p-[25mm] print:shadow-none print:p-[20mm] min-h-[297mm] w-[210mm] flex flex-col relative leading-relaxed text-black">
          
          {/* Logo Placeholder */}
          <div className="text-center mb-10">
             <img 
               src="/img/logo.png" 
               alt="University Logo" 
               className="w-28 h-28 object-contain mx-auto mb-6"
               onError={(e) => {
                 (e.target as any).style.display = 'none';
                 (e.target as any).parentElement.querySelector('.logo-fallback').style.display = 'flex';
               }}
             />
             <div className="logo-fallback hidden w-20 h-20 bg-slate-900 text-white rounded-full items-center justify-center mx-auto mb-4 font-black text-xl">RMUTI</div>
             
             <h1 className="text-[24px] font-bold leading-tight mb-2">รายงานสรุปผลการดำเนินงานระบบเรื่องร้องเรียนออนไลน์</h1>
             <h2 className="text-[20px] font-normal leading-tight">มหาวิทยาลัยเทคโนโลยีราชมงคลอีสาน (RMUTI Care)</h2>
          </div>

          <div className="flex justify-between items-baseline mb-8 text-[16px] border-b-2 border-black pb-4">
            <div className="space-y-1">
               <p><span className="font-bold">หน่วยงาน:</span> {searchParams.get("faculty") || "มหาวิทยาลัยเทคโนโลยีราชมงคลอีสาน"}</p>
               <p><span className="font-bold">สาขา/แผนก:</span> {searchParams.get("major") || "ทุกส่วนงาน"}</p>
            </div>
            <div className="text-right space-y-1">
               <p><span className="font-bold">เลขที่รายงาน:</span> {new Date().getTime().toString().slice(-8)}</p>
               <p><span className="font-bold">วันที่ออกรายงาน:</span> {new Date().toLocaleDateString("th-TH", { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="mb-12">
            <h3 className="text-[18px] font-bold mb-6">1. ข้อมูลสรุปภาพรวม (Executive Summary)</h3>
            <div className="space-y-1 ml-8">
               <div className="flex items-end text-[16px] h-9">
                  <span className="flex-none pb-0.5">• จำนวนเรื่องร้องเรียนทั้งหมด</span>
                  <div className="flex-grow border-b border-dotted border-slate-300 mb-2 mx-2"></div>
                  <span className="flex-none font-bold tabular-nums pb-0.5">{data.total} รายการ</span>
               </div>
               <div className="flex items-end text-[16px] h-9">
                  <span className="flex-none pb-0.5">• ดำเนินการเสร็จสิ้น</span>
                  <div className="flex-grow border-b border-dotted border-slate-300 mb-2 mx-2"></div>
                  <span className="flex-none font-bold tabular-nums pb-0.5 text-emerald-700">{data.statusStats[3] || 0} รายการ</span>
               </div>
               <div className="flex items-end text-[16px] h-9">
                  <span className="flex-none pb-0.5">• อยู่ระหว่างดำเนินการ</span>
                  <div className="flex-grow border-b border-dotted border-slate-300 mb-2 mx-2"></div>
                  <span className="flex-none font-bold tabular-nums pb-0.5">{data.statusStats[1] || 0} รายการ</span>
               </div>
               <div className="flex items-end text-[16px] h-9">
                  <span className="flex-none pb-0.5">• อัตราความสำเร็จ (Success Rate)</span>
                  <div className="flex-grow border-b border-dotted border-slate-300 mb-2 mx-2"></div>
                  <span className="flex-none font-bold tabular-nums pb-0.5">{data.total > 0 ? ((data.statusStats[3] || 0) / data.total * 100).toFixed(2) : 0}%</span>
               </div>
               <div className="flex items-end text-[16px] h-9">
                  <span className="flex-none pb-0.5 font-bold">• คะแนนความพึงพอใจเฉลี่ย</span>
                  <div className="flex-grow border-b border-dotted border-slate-300 mb-2 mx-2"></div>
                  <span className="flex-none font-bold text-indigo-700 tabular-nums pb-0.5">{data.avgRating} / 5.00</span>
               </div>
            </div>
          </div>

          {/* Statistical Analysis Table */}
          <div className="mb-12">
            <h3 className="text-[18px] font-bold mb-6">2. สถิติจำแนกตามประเภทเรื่องร้องเรียน</h3>
            <table className="w-full text-[16px] border-collapse border border-black">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-black px-4 py-3 text-left w-2/3">ประเภทเรื่องร้องเรียน</th>
                  <th className="border border-black px-4 py-3 text-center">จำนวน (เรื่อง)</th>
                  <th className="border border-black px-4 py-3 text-center">ร้อยละ (%)</th>
                </tr>
              </thead>
              <tbody>
                {COMPLAINT_TYPES.map(t => {
                  const count = data.typeStats[t.id] || 0;
                  const percent = data.total > 0 ? ((count / data.total) * 100).toFixed(1) : "0.0";
                  return (
                    <tr key={t.id} className="h-10">
                      <td className="border border-black px-4 py-2">{t.label}</td>
                      <td className="border border-black px-4 py-2 text-center font-bold tabular-nums">{count}</td>
                      <td className="border border-black px-4 py-2 text-center tabular-nums">{percent}</td>
                    </tr>
                  );
                })}
                <tr className="font-bold bg-gray-50 h-12 text-[17px]">
                  <td className="border border-black px-4 py-2 text-right">รวมรวมทั้งสิ้น</td>
                  <td className="border border-black px-4 py-2 text-center tabular-nums">{data.total}</td>
                  <td className="border border-black px-4 py-2 text-center tabular-nums">100.0</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Detail List Table */}
          <div className="mb-12 page-break-before">
            <h3 className="text-[18px] font-bold mb-6">3. บัญชีรายชื่อเรื่องร้องเรียน (ล่าสุด)</h3>
            <table className="w-full text-[14px] border-collapse border border-black">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-black px-2 py-3 text-center w-12">ลำดับ</th>
                  <th className="border border-black px-4 py-3 text-left">รหัสอ้างอิง</th>
                  <th className="border border-black px-4 py-3 text-center">สถานะปัจจุบัน</th>
                  <th className="border border-black px-4 py-3 text-center">ความเร่งด่วน</th>
                  <th className="border border-black px-4 py-3 text-center">วันที่ยื่นเรื่อง</th>
                </tr>
              </thead>
              <tbody>
                {data.complaints.slice(0, 25).map((c: any, index: number) => (
                  <tr key={c.id} className="h-9">
                    <td className="border border-black px-2 py-1 text-center tabular-nums">{index + 1}</td>
                    <td className="border border-black px-4 py-1 font-mono uppercase tracking-tighter text-[13px]">{c.id.slice(-8)}</td>
                    <td className="border border-black px-4 py-1 text-center">{STATUS_LABELS[c.status]}</td>
                    <td className="border border-black px-4 py-1 text-center">{PRIORITY_CONFIG[c.priority]?.label}</td>
                    <td className="border border-black px-4 py-1 text-center tabular-nums">{new Date(c.createdAt).toLocaleDateString("th-TH")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-[12px] mt-6 italic text-gray-500 font-sans">
              * รายงานฉบับนี้ประมวลผลผ่านระบบสารสนเทศโดยอัตโนมัติ ณ วันที่ {new Date().toLocaleString("th-TH")}
            </p>
          </div>

          {/* Signature Area */}
          <div className="mt-auto pt-24">
             <div className="grid grid-cols-2 gap-x-24">
                <div className="text-center space-y-2">
                   <p className="mb-20 text-[16px]">ลงชื่อ...........................................................</p>
                   <p className="text-[16px]">(...........................................................)</p>
                   <p className="text-[15px] font-bold">ผู้จัดทำรายงาน</p>
                </div>
                <div className="text-center space-y-2">
                   <p className="mb-20 text-[16px]">ลงชื่อ...........................................................</p>
                   <p className="text-[16px]">(...........................................................)</p>
                   <p className="text-[15px] font-bold">ผู้อนุมัติรายงาน (หัวหน้าหน่วยงาน)</p>
                </div>
             </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@400;700&display=swap');
        
        body {
          font-family: 'Sarabun', sans-serif !important;
          margin: 0 !important;
          padding: 0 !important;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          color: black;
        }

        .paper-container {
          min-height: 297mm;
          box-sizing: border-box;
        }

        /* Essential Fix for Thai Baseline Alignment */
        span, p, div, td, th {
           line-height: 1.4;
        }
        
        /* Ensure numbers and Thai text sit on the same line */
        .tabular-nums {
           font-variant-numeric: tabular-nums;
        }

        @media print {
          body {
            background: white !important;
          }
          .bg-[#525659], .bg-[#323639] {
            background: white !important;
          }
          .paper-container {
            margin: 0 !important;
            box-shadow: none !important;
            border: none !important;
            width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}
