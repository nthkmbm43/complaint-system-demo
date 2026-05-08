"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import ModalAlert from "@/components/ModalAlert";

export default function ProfileCompletePage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: "" as any, title: "", text: "" });
  const router = useRouter();
  const { update } = useSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/student/update-email", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (res.ok) {
      setMsg({ 
        type: "success", 
        title: "อัปเดตข้อมูลสำเร็จ", 
        text: "ข้อมูลอีเมลของคุณถูกบันทึกแล้ว ระบบกำลังนำคุณไปยังหน้าแดชบอร์ด" 
      });
    } else {
      const data = await res.json();
      setMsg({ type: "error", title: "ไม่สามารถอัปเดตได้", text: data.error || "เกิดข้อผิดพลาด" });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600 rounded-full blur-[150px]" />
      </div>

      <ModalAlert 
        isOpen={!!msg.text}
        type={msg.type || "info"}
        title={msg.title}
        message={msg.text}
        onConfirm={async () => {
          if (msg.type === "success") {
             await update({ email });
             router.push("/student/dashboard");
          } else {
             setMsg({ type: "" as any, title: "", text: "" });
          }
        }}
      />

      <div className="w-full max-w-md bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-12 shadow-2xl relative z-10 animate-in zoom-in-95 duration-500">
        <div className="text-center mb-10">
           <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-3xl mx-auto mb-6 shadow-2xl shadow-indigo-600/40">📧</div>
           <h1 className="text-2xl font-black text-white tracking-tight mb-2">ยืนยันข้อมูลอีเมล</h1>
           <p className="text-slate-400 text-sm leading-relaxed">เพื่อให้สอดคล้องกับมาตรการความปลอดภัยใหม่ กรุณาระบุอีเมลสำหรับการแจ้งเตือนความคืบหน้าของคำร้อง</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Email Address</label>
              <input 
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="example@rmuti.ac.th"
                className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-2xl text-white font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-700"
              />
           </div>

           <button 
             type="submit"
             disabled={loading}
             className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl shadow-xl shadow-indigo-600/20 transition-all uppercase text-xs tracking-widest active:scale-95 disabled:opacity-50"
           >
             {loading ? "กำลังบันทึก..." : "อัปเดตและเริ่มใช้งาน"}
           </button>

           <button 
             type="button"
             onClick={() => signOut({ callbackUrl: "/student/login" })}
             className="w-full py-2 text-slate-500 font-bold text-xs uppercase tracking-widest hover:text-white transition-colors"
           >
             Logout
           </button>
        </form>
      </div>
    </div>
  );
}
