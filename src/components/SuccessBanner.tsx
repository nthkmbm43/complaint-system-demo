"use client";

import { useState, useEffect } from "react";

export default function SuccessBanner() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 6000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="relative bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl p-5 shadow-lg flex items-center gap-4 animate-in slide-in-from-top-2">
      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl backdrop-blur-sm flex-shrink-0">
        🎉
      </div>
      <div className="flex-grow">
        <h4 className="font-bold text-lg">ส่งคำร้องเรียบร้อยแล้ว!</h4>
        <p className="text-green-100 text-sm">คำร้องของคุณถูกส่งเข้าระบบเรียบร้อยแล้ว เจ้าหน้าที่จะพิจารณาและดำเนินการโดยเร็วที่สุด</p>
      </div>
      <button
        onClick={() => setVisible(false)}
        className="p-2 rounded-lg hover:bg-white/20 transition flex-shrink-0"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
