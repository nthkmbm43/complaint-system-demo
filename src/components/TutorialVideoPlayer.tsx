"use client";
import { useState, useEffect, useCallback } from "react";

const STEPS = [
  {
    key: "landing",
    label: "01",
    title: "หน้าแรก — RMUTI Care",
    desc: "จุดเริ่มต้นการใช้งาน พร้อมคู่มือและระเบียบการที่ครบถ้วน",
    badge: "Landing Page",
    icon: "🏠",
    color: "from-orange-500 to-red-600",
  },
  {
    key: "login",
    label: "02",
    title: "เข้าสู่ระบบนักศึกษา",
    desc: "ล็อกอินปลอดภัยด้วยรหัสนักศึกษาและรหัสผ่านส่วนตัว",
    badge: "Authentication",
    icon: "🔐",
    color: "from-indigo-500 to-blue-600",
  },
  {
    key: "dashboard",
    label: "03",
    title: "Dashboard ภาพรวม",
    desc: "ติดตามทุกความเคลื่อนไหว สถิติ และสถานะคำร้องแบบ Real-time",
    badge: "Dashboard",
    icon: "📊",
    color: "from-slate-700 to-slate-900",
  },
  {
    key: "form",
    label: "04",
    title: "ยื่นเรื่องร้องเรียน",
    desc: "แบบฟอร์มที่ใช้งานง่าย พร้อมระบบแนบหลักฐานและเลือกหมวดหมู่",
    badge: "Submission",
    icon: "📝",
    color: "from-blue-500 to-cyan-600",
  },
  {
    key: "detail",
    label: "05",
    title: "ติดตามสถานะคำร้อง",
    desc: "ตรวจสอบความคืบหน้า และแชทสอบถามเจ้าหน้าที่ได้โดยตรง",
    badge: "Tracking",
    icon: "💬",
    color: "from-green-500 to-emerald-600",
  },
];

export default function TutorialVideoPlayer() {
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [imgError, setImgError] = useState<{ [key: string]: boolean }>({});

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
      {/* Visual Display Layer */}
      <div className="relative flex-1 overflow-hidden bg-slate-950 flex items-center justify-center">
        
        {/* Attempt to load REAL Image first */}
        {!imgError[step.key] ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            key={step.key}
            src={`/api/tutorial-step/${step.key}`}
            alt={step.title}
            className="w-full h-full object-cover object-top animate-in fade-in duration-500"
            onError={() => setImgError(prev => ({ ...prev, [step.key]: true }))}
          />
        ) : (
          /* Fallback: High-Quality UI Mockup if image fails to load */
          <div className="absolute inset-0 flex items-center justify-center p-12 overflow-hidden">
             <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-20`} />
             
             {/* Decorative Background Icon */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15rem] opacity-5 pointer-events-none">
                {step.icon}
             </div>

             {/* UI Window Mockup */}
             <div className="relative z-10 w-full h-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-white/20 animate-in zoom-in-95 duration-500 flex flex-col">
                <div className="h-8 bg-slate-100 flex items-center px-4 gap-1.5 shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                </div>
                <div className="p-8 flex-1 flex flex-col gap-6">
                   <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-2xl text-white shadow-lg`}>
                        {step.icon}
                      </div>
                      <div className="space-y-2 flex-1">
                        <div className="h-4 w-1/3 bg-slate-200 rounded-full" />
                        <div className="h-3 w-1/4 bg-slate-100 rounded-full" />
                      </div>
                   </div>
                   <div className="flex-1 bg-slate-50 rounded-2xl border border-slate-100 p-6 flex flex-col gap-4">
                      <div className="h-3 w-full bg-slate-200 rounded-full" />
                      <div className="h-3 w-[90%] bg-slate-100 rounded-full" />
                      <div className="h-3 w-[95%] bg-slate-100 rounded-full" />
                      <div className="mt-auto h-12 w-40 bg-slate-900 rounded-xl" />
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent pointer-events-none" />

        <div className="absolute top-6 left-6 z-20">
          <span className="bg-white/10 backdrop-blur-md text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border border-white/20 shadow-2xl">
            {step.badge}
          </span>
        </div>

        <div className="absolute top-6 right-6 z-20">
          <span className="bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-black px-4 py-1.5 rounded-full border border-white/10">
            {current + 1} / {STEPS.length}
          </span>
        </div>

        {/* Content Area */}
        <div className="absolute bottom-16 left-0 right-0 px-10 z-20">
          <p className="text-[11px] font-black text-orange-400 uppercase tracking-[0.3em] mb-2 drop-shadow-md">
            ขั้นตอนที่ {step.label}
          </p>
          <h3 className="text-3xl font-black text-white drop-shadow-2xl">{step.title}</h3>
          <p className="text-slate-300 text-sm mt-3 leading-relaxed max-w-xl drop-shadow-lg">{step.desc}</p>
        </div>

        {/* Progress Bar Container */}
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/5 z-20">
          <div
            className={`h-full bg-gradient-to-r from-orange-500 to-red-500 shadow-[0_0_15px_rgba(249,115,22,0.5)] transition-all duration-100`}
            style={{ width: `${isPlaying ? progress : ((current + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Control Panel */}
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
