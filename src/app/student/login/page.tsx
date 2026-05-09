"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import React, { useState } from "react";

export default function StudentLoginPage() {
  const router = useRouter();
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      username: studentId,
      password: password,
      loginType: "student",
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("รหัสนักศึกษาหรือรหัสผ่านไม่ถูกต้อง");
    } else {
      router.push("/student/dashboard");
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Background Shapes */}
      <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-orange-100 rounded-full blur-[150px] opacity-60" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-50 rounded-full blur-[120px] opacity-60" />

      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center p-24 relative z-10">
        <div className="space-y-8 max-w-lg">
          <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-2xl border border-slate-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/img/logo.png" alt="RMUTI Logo" className="w-14 h-14 object-contain" />
          </div>
          <h1 className="text-6xl font-black text-slate-800 leading-tight">
            RMUTI <br /><span className="text-orange-500">Complaint System</span>
          </h1>
          <p className="text-slate-500 text-lg font-medium leading-relaxed">
            ระบบรับเรื่องร้องเรียนและข้อเสนอแนะ มทร.อีสาน วิทยาเขตขอนแก่น <br />
            <span className="text-sm font-bold text-slate-400">Digital Experience Portal for Students</span>
          </p>
          <div className="flex flex-wrap gap-8 pt-6">
            <div>
              <p className="text-3xl font-black text-slate-800">8+</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Categories</p>
            </div>
            <div className="h-10 w-[1px] bg-slate-200" />
            <div>
              <p className="text-3xl font-black text-slate-800">24h</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Online Support</p>
            </div>
            <div className="h-10 w-[1px] bg-slate-200" />
            <div>
              <p className="text-3xl font-black text-slate-800">Encrypted</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Privacy Protection</p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-[3rem] p-12 shadow-2xl shadow-slate-200/50 border border-slate-100">
            <div className="mb-10 text-center lg:text-left">
              <h2 className="text-4xl font-black text-slate-800 tracking-tight">Student Portal</h2>
              <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] mt-2">Sign in to your account</p>
            </div>

            {error && (
              <div className="mb-8 p-5 bg-orange-50 border border-orange-100 text-orange-700 rounded-2xl text-xs font-bold flex items-center gap-3 animate-in fade-in zoom-in-95">
                <span className="text-lg">📢</span> {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Student ID</label>
                <input
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="กรอกชื่อผู้ใช้งาน"
                  required
                  className="w-full px-6 py-4.5 bg-slate-50 border border-slate-50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500 transition-all font-bold text-slate-700 placeholder:text-slate-300"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full px-6 py-4.5 bg-slate-50 border border-slate-50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500 transition-all font-bold text-slate-700 pr-14 placeholder:text-slate-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-slate-300 hover:text-orange-500 transition-colors"
                  >
                    {showPassword ? "👁️" : "🕶️"}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-orange-500 text-white font-black rounded-[1.5rem] shadow-2xl shadow-orange-500/30 hover:bg-orange-600 disabled:opacity-50 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs mt-8"
              >
                {loading ? (
                  <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Enter Dashboard</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                  </>
                )}
              </button>
            </form>

            <div className="mt-12 pt-10 border-t border-slate-50 text-center space-y-4">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">New Student?</span>
                <Link href="/student/register" className="ml-2 text-[10px] font-black text-orange-600 uppercase tracking-widest hover:underline">
                  Create Account
                </Link>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
