"use client";
import { useState, useEffect, useCallback } from "react";

const STEPS = [
  {
    key: "landing",
    label: "01",
    title: "หน้าแรก — RMUTI Care",
    desc: "จุดเริ่มต้นการใช้งาน พร้อมคู่มือและระเบียบการที่ครบถ้วน",
    badge: "Landing Page",
  },
  {
    key: "login",
    label: "02",
    title: "เข้าสู่ระบบนักศึกษา",
    desc: "ล็อกอินปลอดภัยด้วยรหัสนักศึกษาและรหัสผ่านส่วนตัว",
    badge: "Authentication",
  },
  {
    key: "dashboard",
    label: "03",
    title: "Dashboard ภาพรวม",
    desc: "ติดตามทุกความเคลื่อนไหว สถิติ และสถานะคำร้องแบบ Real-time",
    badge: "Dashboard",
  },
  {
    key: "form",
    label: "04",
    title: "ยื่นเรื่องร้องเรียน",
    desc: "แบบฟอร์มที่ใช้งานง่าย พร้อมระบบแนบหลักฐานและเลือกหมวดหมู่",
    badge: "Submission",
  },
  {
    key: "detail",
    label: "05",
    title: "ติดตามสถานะคำร้อง",
    desc: "ตรวจสอบความคืบหน้า และแชทสอบถามเจ้าหน้าที่ได้โดยตรง",
    badge: "Tracking",
  },
];

export default function TutorialVideoPlayer() {
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % STEPS.length);
    setProgress(0);
  }, []);

  const prev = () => {
    setCurrent((c) => (c - 1 + STEPS.length) % STEPS.length);
    setProgress(0);
  };

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          next();
          return 0;
        }
        return p + 2;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [isPlaying, next]);

  const step = STEPS[current];

  return (
    <div className="lg:col-span-2 bg-slate-900 rounded-[3rem] overflow-hidden relative group aspect-video flex flex-col shadow-2xl">
      <div className="relative flex-1 overflow-hidden bg-slate-950 flex items-center justify-center">
        
        {/* Force display REAL Image only */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={step.key}
          src={`/tutorial/${step.key}.png`}
          alt={step.title}
          className="w-full h-full object-cover object-top animate-in fade-in duration-500"
        />

        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent pointer-events-none" />

        <div className="absolute top-6 left-6 z-20">
          <span className="bg-orange-500 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-2xl">
            {step.badge}
          </span>
        </div>

        <div className="absolute top-6 right-6 z-20">
          <span className="bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-black px-4 py-1.5 rounded-full border border-white/10">
            {current + 1} / {STEPS.length}
          </span>
        </div>

        <div className="absolute bottom-16 left-0 right-0 px-10 z-20">
          <p className="text-[11px] font-black text-orange-400 uppercase tracking-[0.3em] mb-2 drop-shadow-md">
            ขั้นตอนที่ {step.label}
          </p>
          <h3 className="text-3xl font-black text-white drop-shadow-2xl">{step.title}</h3>
          <p className="text-slate-300 text-sm mt-3 leading-relaxed max-w-xl drop-shadow-lg">{step.desc}</p>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/5 z-20">
          <div
            className={`h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-100`}
            style={{ width: `${isPlaying ? progress : ((current + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="bg-slate-900/95 backdrop-blur-xl px-8 py-6 flex items-center gap-6 border-t border-white/5 relative z-30">
        <button
          onClick={() => setIsPlaying((p) => !p)}
          className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-2xl active:scale-90 ${
             isPlaying ? "bg-white text-slate-900" : "bg-orange-500 text-white hover:bg-orange-400"
          }`}
        >
          {isPlaying ? (
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
          ) : (
            <svg className="w-6 h-6 fill-current translate-x-0.5" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          )}
        </button>

        <div className="flex items-center gap-3">
          <button onClick={prev} className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center transition-colors border border-white/5 text-white active:scale-90">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"/></svg>
          </button>
          
          <div className="flex gap-2.5 px-4">
            {STEPS.map((s, i) => (
              <button
                key={s.key}
                onClick={() => { setCurrent(i); setProgress(0); }}
                className={`h-2 rounded-full transition-all duration-500 ${
                  i === current ? "bg-orange-500 w-12 shadow-[0_0_10px_rgba(249,115,22,0.3)]" : "bg-white/10 w-2 hover:bg-white/30"
                }`}
              />
            ))}
          </div>

          <button onClick={next} className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center transition-colors border border-white/5 text-white active:scale-90">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"/></svg>
          </button>
        </div>

        <div className="flex-1" />

        <a
          href="/manual"
          className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-[11px] font-black text-white uppercase tracking-widest border border-white/5 transition-all flex items-center gap-3 group"
        >
          <span>Read Manual</span>
          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
        </a>
      </div>
    </div>
  );
}
