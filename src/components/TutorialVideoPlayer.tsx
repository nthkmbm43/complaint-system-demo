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
      {/* Screenshot Display */}
      <div className="relative flex-1 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={step.key}
          src={`/api/tutorial-step/${step.key}`}
          alt={step.title}
          className="w-full h-full object-cover object-top transition-opacity duration-500"
        />

        {/* Dark overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-900/30 pointer-events-none" />

        {/* Step Badge */}
        <div className="absolute top-5 left-5">
          <span className="bg-orange-500 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
            {step.badge}
          </span>
        </div>

        {/* Step Counter */}
        <div className="absolute top-5 right-5">
          <span className="bg-white/10 backdrop-blur text-white text-[10px] font-black px-3 py-1 rounded-full border border-white/20">
            {current + 1} / {STEPS.length}
          </span>
        </div>

        {/* Title + Desc */}
        <div className="absolute bottom-16 left-0 right-0 px-8">
          <p className="text-[10px] font-black text-orange-400 uppercase tracking-[0.2em] mb-1">
            ขั้นตอนที่ {step.label}
          </p>
          <h3 className="text-xl font-black text-white drop-shadow-lg">{step.title}</h3>
          <p className="text-slate-300 text-xs mt-1 leading-relaxed">{step.desc}</p>
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
          <div
            className="h-full bg-gradient-to-r from-orange-500 to-indigo-500 transition-all duration-100"
            style={{ width: `${isPlaying ? progress : ((current + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="bg-slate-800/80 backdrop-blur px-6 py-4 flex items-center gap-4 border-t border-white/5">
        <button
          onClick={() => setIsPlaying((p) => !p)}
          className="w-10 h-10 bg-orange-500 hover:bg-orange-400 rounded-full flex items-center justify-center transition-colors shadow-lg shrink-0"
        >
          {isPlaying ? (
            <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
          ) : (
            <svg className="w-4 h-4 fill-white translate-x-0.5" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          )}
        </button>

        <button onClick={prev} className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
          <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
        </button>

        <div className="flex gap-1.5 flex-1">
          {STEPS.map((s, i) => (
            <button
              key={s.key}
              onClick={() => { setCurrent(i); setProgress(0); }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === current ? "bg-orange-400 w-8" : "bg-white/20 hover:bg-white/40 w-4"
              }`}
            />
          ))}
        </div>

        <button onClick={next} className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
          <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
        </button>

        <a
          href="/manual"
          className="px-4 py-1.5 bg-white/10 hover:bg-white/20 rounded-xl text-[9px] font-black text-white uppercase tracking-widest border border-white/5 transition-all flex items-center gap-2"
        >
          <span>OPEN MANUAL</span>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
        </a>
      </div>
    </div>
  );
}
