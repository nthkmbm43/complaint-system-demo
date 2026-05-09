"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import React, { useState } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      username,
      password,
      loginType: "staff",
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง");
    } else {
      router.push("/admin/dashboard");
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-900 overflow-hidden relative">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-slate-500 rounded-full blur-[120px]" />
      </div>

      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center p-20 relative z-10">
        <div className="space-y-8 max-w-lg">
          <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/img/logo.png" alt="RMUTI Logo" className="w-14 h-14 object-contain" />
          </div>
          <h1 className="text-6xl font-black text-white leading-tight">
            RMUTI <br /><span className="text-indigo-400">Staff Portal.</span>
          </h1>
          <p className="text-slate-400 text-lg font-medium leading-relaxed">
            ระบบจัดการเรื่องร้องเรียน RMUTI Complaint System สำหรับเจ้าหน้าที่ <br />
            <span className="text-sm font-bold text-slate-500 italic">Advanced Administrative Experience</span>
          </p>
          <div className="flex gap-4 pt-10">
            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm">
              <p className="text-2xl font-black text-white">100%</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Data Security</p>
            </div>
            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm">
              <p className="text-2xl font-black text-white">24/7</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Service Access</p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
             {/* Progress Bar Top */}
             <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-100">
               <div className={`h-full bg-indigo-600 transition-all duration-500 ${loading ? 'w-full' : 'w-0'}`} />
             </div>

            <div className="mb-10 text-center lg:text-left">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-xl border border-slate-100 mx-auto lg:mx-0">
                <img src="/img/logo.png" alt="RMUTI Logo" className="w-12 h-12 object-contain" />
              </div>
              <h2 className="text-3xl font-black text-slate-800 tracking-tight">Staff Portal</h2>
              <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] mt-2">Administrative Login</p>
            </div>

            {error && (
              <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-xs font-black flex items-center gap-3 animate-in slide-in-from-top-2">
                <span className="text-lg">⚠️</span> {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="กรอกชื่อผู้ใช้งาน"
                  required
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all font-bold text-slate-700"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all font-bold text-slate-700 pr-14"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? "👁️" : "🕶️"}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-slate-900 text-white font-black rounded-2xl shadow-2xl shadow-slate-900/30 hover:bg-slate-800 disabled:opacity-50 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs mt-8"
              >
                {loading ? (
                  <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Authorized Entry</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                  </>
                )}
              </button>
            </form>


          </div>

        </div>
      </div>
    </div>
  );
}
