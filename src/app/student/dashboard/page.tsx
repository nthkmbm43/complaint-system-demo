import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import React from "react";
import prisma from "@/lib/prisma";
import SuccessBanner from "@/components/SuccessBanner";
import { COMPLAINT_TYPES } from "@/lib/constants";
import { CategoryIcon } from "@/components/Icons";

export default async function StudentDashboard({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).type !== "student") {
    redirect("/student/login");
  }

  const studentId = (session.user as any).id;
  const params = await searchParams;
  const showSuccess = params?.submitted === "true";

  // ดึงข้อมูลสถิติของตัวเอง
  const [total, inProgress, completed, rejected] = await Promise.all([
    prisma.complaint.count({ where: { studentId } }),
    prisma.complaint.count({ where: { studentId, status: { in: [1, 2] } } }),
    prisma.complaint.count({ where: { studentId, status: 3 } }),
    prisma.complaint.count({ where: { studentId, status: 4 } }),
  ]);

  // ดึง 5 รายการล่าสุด
  const recentComplaints = await prisma.complaint.findMany({
    where: { studentId },
    take: 5,
    orderBy: { createdAt: "desc" },
  });

  const STATUS_LABELS: Record<number, string> = {
    0: "ยื่นคำร้อง",
    1: "กำลังดำเนินการ",
    2: "รอประเมิน",
    3: "เสร็จสิ้น",
    4: "ปฏิเสธ",
  };
  const STATUS_STYLES: Record<number, string> = {
    0: "bg-slate-100 text-slate-700",
    1: "bg-blue-100 text-blue-700",
    2: "bg-amber-100 text-amber-700",
    3: "bg-green-100 text-green-700",
    4: "bg-red-100 text-red-700",
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Success Banner (dismissible) */}
      {showSuccess && <SuccessBanner />}

      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">ภาพรวมคำร้อง</h2>
          <p className="text-slate-400 font-medium">ติดตามสถานะและประวัติการร้องเรียนของคุณ</p>
        </div>
        <Link href="/student/complaints/new">
          <button className="px-8 py-3.5 bg-slate-900 text-white font-black rounded-2xl shadow-xl shadow-slate-900/10 hover:bg-slate-800 hover:-translate-y-1 transition-all flex items-center gap-2">
            <span>✍️</span> สร้างคำร้องใหม่
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card Summary */}
        <div className="lg:col-span-1 bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 transform scale-150 group-hover:scale-[1.8] transition-transform duration-700">🎓</div>
          <div className="relative z-10">
            <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-3xl flex items-center justify-center font-black text-2xl shadow-sm mb-6">
              {(session.user as any).name?.charAt(0)}
            </div>
            <h3 className="text-xl font-black text-slate-800 mb-1">{(session.user as any).name}</h3>
            <p className="text-slate-400 font-mono text-sm mb-6 tracking-widest uppercase">{(session.user as any).studentId}</p>
            
            <div className="space-y-4 pt-6 border-t border-slate-50">
               <div className="flex justify-between items-center">
                 <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">สถานะปัจจุบัน</span>
                 <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-black uppercase tracking-widest">Normal Student</span>
               </div>
               <div className="flex justify-between items-center">
                 <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">คำร้องที่เสร็จสิ้น</span>
                 <span className="font-black text-slate-800 text-xl">{completed}</span>
               </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:border-indigo-100 transition-colors">
            <div className="w-10 h-10 bg-indigo-50 text-indigo-400 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            </div>
            <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Total Cases</div>
            <div className="text-3xl font-black text-slate-800">{total}</div>
          </div>
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:border-blue-100 transition-colors">
            <div className="w-10 h-10 bg-blue-50 text-blue-400 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">In Progress</div>
            <div className="text-3xl font-black text-blue-600">{inProgress}</div>
          </div>
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:border-green-100 transition-colors">
            <div className="w-10 h-10 bg-green-50 text-green-400 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
            </div>
            <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Success</div>
            <div className="text-3xl font-black text-green-500">{completed}</div>
          </div>
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:border-red-100 transition-colors">
            <div className="w-10 h-10 bg-red-50 text-red-400 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Rejected</div>
            <div className="text-3xl font-black text-red-400">{rejected}</div>
          </div>
        </div>
      </div>

      {/* Recent Complaints List */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
          <h3 className="text-lg font-black text-slate-800 flex items-center gap-3">
            <span className="text-indigo-600">📋</span> คำร้องล่าสุด
          </h3>
          <Link href="/student/complaints" className="text-xs font-black text-indigo-600 uppercase tracking-widest hover:underline">
            ดูประวัติทั้งหมด →
          </Link>
        </div>

        {recentComplaints.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-6xl mb-6 grayscale opacity-20">📭</p>
            <h4 className="text-xl font-bold text-slate-400">ยังไม่เคยมีประวัติการร้องเรียน</h4>
            <p className="text-slate-300 mt-2">หากท่านพบปัญหา สามารถเริ่มสร้างคำร้องใหม่ได้ทันที</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {recentComplaints.map((c) => (
              <Link
                key={c.id}
                href={`/student/complaints/${c.id}`}
                className="flex items-center justify-between px-8 py-5 hover:bg-slate-50 transition-all group"
              >
                <div className="flex items-center gap-6">
                   <div className="hidden sm:flex flex-col items-center">
                     <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">{new Date(c.createdAt).toLocaleDateString("th-TH", { month: "short" })}</span>
                     <span className="text-xl font-black text-slate-700 leading-none">{new Date(c.createdAt).getDate()}</span>
                   </div>
                   <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="flex items-center gap-2 text-[9px] bg-slate-50 text-slate-500 px-2 py-0.5 rounded-md font-black uppercase tracking-wider border border-slate-100">
                          <CategoryIcon typeId={c.type} className="w-3 h-3" />
                          {COMPLAINT_TYPES.find(t => t.id === c.type)?.label}
                        </span>
                      </div>
                      <p className="font-bold text-slate-800 line-clamp-1 group-hover:text-indigo-600 transition-colors">{c.title}</p>
                      <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mt-0.5">REF: {c.id.substring(0, 8)}</p>
                   </div>
                </div>
                <div className="flex items-center gap-6">
                  <span className={`hidden sm:inline-block px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${STATUS_STYLES[c.status]} border border-current/10 shadow-sm`}>
                    {STATUS_LABELS[c.status]}
                  </span>
                  <div className="text-slate-300 group-hover:translate-x-1 transition-transform">→</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
