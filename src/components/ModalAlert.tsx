"use client";

import React, { useEffect, useState } from "react";

interface ModalAlertProps {
  isOpen: boolean;
  type: "success" | "error" | "warning" | "info" | "question";
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  showCancel?: boolean;
}

export default function ModalAlert({
  isOpen,
  type,
  title,
  message,
  confirmText = "ตกลง",
  cancelText = "ยกเลิก",
  onConfirm,
  onCancel,
  showCancel = false,
}: ModalAlertProps) {
  const [shouldRender, setShouldRender] = useState(isOpen);

  useEffect(() => {
    if (isOpen) setShouldRender(true);
  }, [isOpen]);

  if (!shouldRender) return null;

  const icons = {
    success: (
      <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center text-4xl animate-bounce">
        ✅
      </div>
    ),
    error: (
      <div className="w-20 h-20 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center text-4xl animate-shake">
        ❌
      </div>
    ),
    warning: (
      <div className="w-20 h-20 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center text-4xl">
        ⚠️
      </div>
    ),
    info: (
      <div className="w-20 h-20 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center text-4xl">
        ℹ️
      </div>
    ),
    question: (
      <div className="w-20 h-20 bg-indigo-100 text-indigo-500 rounded-full flex items-center justify-center text-4xl">
        ❓
      </div>
    ),
  };

  return (
    <div 
      className={`fixed inset-0 z-[9999] overflow-y-auto flex justify-center p-4 transition-all duration-300 ${
        isOpen ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
      onTransitionEnd={() => !isOpen && setShouldRender(false)}
    >
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={() => !showCancel && onConfirm?.()}
      />

      {/* Modal Content */}
      <div 
        className={`relative bg-white/90 backdrop-blur-xl w-full max-w-sm rounded-[2.5rem] shadow-2xl border border-white/20 p-8 text-center my-auto h-fit transform transition-all duration-500 ${
          isOpen ? "scale-100 translate-y-0" : "scale-90 translate-y-10"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center mb-6">
          {icons[type] || icons.info}
        </div>

        <h3 className="text-2xl font-black text-slate-800 mb-2 tracking-tight">
          {title}
        </h3>
        
        <p className="text-slate-500 font-medium mb-8 leading-relaxed break-words">
          {message}
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          {showCancel && (
            <button
              onClick={onCancel}
              className="flex-1 px-6 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all active:scale-95"
            >
              {cancelText}
            </button>
          )}
          <button
            onClick={onConfirm}
            className={`flex-1 px-6 py-4 font-bold rounded-2xl shadow-lg transition-all active:scale-95 ${
              type === 'success' ? 'bg-emerald-500 text-white shadow-emerald-500/20 hover:bg-emerald-600' :
              type === 'error' ? 'bg-rose-500 text-white shadow-rose-500/20 hover:bg-rose-600' :
              type === 'warning' ? 'bg-amber-500 text-white shadow-amber-500/20 hover:bg-amber-600' :
              'bg-indigo-600 text-white shadow-indigo-500/20 hover:bg-indigo-700'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>

      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 0s 2;
        }
      `}</style>
    </div>
  );
}
