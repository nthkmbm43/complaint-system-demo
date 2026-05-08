import React, { Suspense } from "react";
import PrintReportView from "@/components/PrintReportView";

export default function Page() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="font-bold text-slate-600">กำลังเตรียมข้อมูลรายงาน...</p>
        </div>
      </div>
    }>
      <PrintReportView />
    </Suspense>
  );
}
