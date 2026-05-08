"use client";

import React from "react";

const STEPS = [
  { label: "ยื่นคำร้อง", status: 0, icon: "📝" },
  { label: "กำลังดำเนินการ", status: 1, icon: "⏳" },
  { label: "รอประเมิน", status: 2, icon: "⭐" },
  { label: "เสร็จสิ้น", status: 3, icon: "✅" },
];

export default function StatusProgressBar({ currentStatus }: { currentStatus: number }) {
  // หากถูกปฏิเสธ (4) จะแสดงผลแบบพิเศษ
  const isRejected = currentStatus === 4;

  if (isRejected) {
    return (
      <div className="bg-red-50 border border-red-100 rounded-3xl p-6 flex items-center gap-4">
        <div className="w-12 h-12 bg-red-500 text-white rounded-2xl flex items-center justify-center text-2xl shadow-lg">❌</div>
        <div>
          <h4 className="text-red-700 font-black uppercase tracking-widest text-xs">Complaint Rejected</h4>
          <p className="text-red-600 text-sm font-medium">คำร้องนี้ถูกปฏิเสธการดำเนินการ กรุณาตรวจสอบบันทึกจากเจ้าหน้าที่</p>
        </div>
      </div>
    );
  }

  if (currentStatus === 5) {
    return (
      <div className="bg-slate-100 border border-slate-200 rounded-3xl p-6 flex items-center gap-4">
        <div className="w-12 h-12 bg-slate-400 text-white rounded-2xl flex items-center justify-center text-2xl shadow-lg">🗑️</div>
        <div>
          <h4 className="text-slate-600 font-black uppercase tracking-widest text-xs">Complaint Cancelled</h4>
          <p className="text-slate-500 text-sm font-medium">คำร้องนี้ถูกยกเลิกโดยนักศึกษาแล้ว</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="relative flex justify-between">
        {/* Background Line */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 z-0 rounded-full" />
        
        {/* Active Progress Line */}
        <div 
          className="absolute top-1/2 left-0 h-1 bg-indigo-500 -translate-y-1/2 z-0 rounded-full transition-all duration-1000" 
          style={{ width: `${(currentStatus / 3) * 100}%` }}
        />

        {STEPS.map((step, index) => {
          const isActive = currentStatus >= step.status;
          const isCurrent = currentStatus === step.status;

          return (
            <div key={step.status} className="relative z-10 flex flex-col items-center group">
              <div 
                className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg transition-all duration-500 shadow-sm ${
                  isActive 
                  ? "bg-indigo-600 text-white shadow-indigo-200" 
                  : "bg-white text-slate-300 border border-slate-100"
                } ${isCurrent ? "ring-4 ring-indigo-50 animate-bounce" : ""}`}
              >
                {isActive ? step.icon : index + 1}
              </div>
              <div className="absolute -bottom-8 whitespace-nowrap text-center hidden md:block">
                <p className={`text-[10px] font-black uppercase tracking-widest transition-colors ${
                  isActive ? "text-slate-800" : "text-slate-300"
                }`}>
                  {step.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
