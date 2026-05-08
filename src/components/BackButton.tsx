"use client";

import { useRouter, usePathname } from "next/navigation";

export default function BackButton() {
  const router = useRouter();
  const pathname = usePathname();

  if (pathname.endsWith("/dashboard")) {
    return null;
  }

  return (
    <button 
      onClick={() => router.back()} 
      className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-600 bg-white hover:bg-gradient-to-r hover:from-indigo-50 hover:to-indigo-100 hover:text-indigo-700 hover:border-indigo-200 rounded-xl transition-all duration-300 border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
    >
      <svg className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
      ย้อนกลับ
    </button>
  );
}
