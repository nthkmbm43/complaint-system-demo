"use client";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="px-4 py-2 bg-slate-800 text-white font-bold rounded-lg hover:bg-slate-700 shadow max-w-[max-content] transition"
    >
      🖨️ พิมพ์รายงาน (Print/PDF)
    </button>
  );
}
