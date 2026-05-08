"use client";

import React, { useEffect } from "react";

interface ToastProps {
  message: string;
  type: "success" | "error" | "info" | string;
  onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const isSuccess = type === "success";

  return (
    <div className="fixed top-6 right-6 z-[9999] animate-in slide-in-from-right-10 fade-in duration-500">
      <div className={`
        flex items-center gap-4 px-6 py-4 rounded-[1.5rem] shadow-2xl border backdrop-blur-md
        ${isSuccess 
          ? "bg-green-500/90 border-green-400 text-white" 
          : "bg-red-500/90 border-red-400 text-white"}
      `}>
        <div className={`
          w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-inner
          ${isSuccess ? "bg-white/20" : "bg-white/20"}
        `}>
          {isSuccess ? "✅" : "⚠️"}
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest opacity-70">
            {isSuccess ? "System Success" : "Action Required"}
          </p>
          <p className="font-bold text-sm tracking-wide">{message}</p>
        </div>
        <button 
          onClick={onClose}
          className="ml-4 p-1 hover:bg-white/10 rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
