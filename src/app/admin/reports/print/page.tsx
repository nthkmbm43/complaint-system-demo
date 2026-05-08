import React, { Suspense } from "react";
import PrintReportView from "@/components/PrintReportView";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-20 text-center font-bold">กำลังเตรียมข้อมูลรายงาน...</div>}>
      <PrintReportView />
    </Suspense>
  );
}
