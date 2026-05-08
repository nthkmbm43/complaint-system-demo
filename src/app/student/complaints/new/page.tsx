"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import ModalAlert from "@/components/ModalAlert";
import { COMPLAINT_TYPES } from "@/lib/constants";
import { CategoryIcon } from "@/components/Icons";

export default function NewComplaintPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "",
    isAnonymous: false,
    priority: 2,
    attachment: "",
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: "" as any, title: "", text: "" });
  const [fileName, setFileName] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setMsg({ type: "error", title: "ไฟล์มีขนาดใหญ่เกินไป", text: "ขนาดไฟล์ต้องไม่เกิน 5MB" });
        return;
      }
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({ ...form, attachment: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg({ type: "", title: "", text: "" });

    if (!form.type) {
      setMsg({ type: "warning", title: "ข้อมูลไม่ครบถ้วน", text: "กรุณาเลือกหมวดหมู่ข้อร้องเรียน" });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setMsg({ 
          type: "error", 
          title: "ไม่สามารถส่งเรื่องได้", 
          text: data.error || "เกิดข้อผิดพลาดจากทางเซิร์ฟเวอร์ กรุณาลองใหม่อีกครั้ง" 
        });
        return;
      }

      setMsg({ 
        type: "success", 
        title: "ส่งเรื่องร้องเรียนสำเร็จ", 
        text: "เรื่องร้องเรียนของท่านเข้าสู่ระบบแล้ว เจ้าหน้าที่จะดำเนินการโดยเร็วที่สุด" 
      });
    } catch (error) {
      setLoading(false);
      setMsg({ 
        type: "error", 
        title: "เกิดข้อผิดพลาดในการเชื่อมต่อ", 
        text: "ไม่สามารถติดต่อเซิร์ฟเวอร์ได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ตของท่าน" 
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <ModalAlert 
        isOpen={!!msg.text}
        type={msg.type || "info"}
        title={msg.title}
        message={msg.text}
        onConfirm={() => {
          if (msg.type === "success") {
            router.push("/student/dashboard");
          } else {
            setMsg({ type: "" as any, title: "", text: "" });
          }
        }}
      />
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-slate-800">ยื่นเรื่องร้องเรียนใหม่</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Top Section: Anonymous Toggle */}
        <div className="bg-indigo-900 text-white rounded-[2rem] p-8 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 transform scale-[2.5] group-hover:scale-[3] transition-transform duration-700">🔒</div>
          <div className="relative z-10 flex flex-col md:flex-row justify-between md:items-center gap-6">
            <div className="max-w-md">
              <h3 className="text-xl font-bold mb-2">ต้องการปกปิดตัวตน?</h3>
              <p className="text-indigo-200 text-sm leading-relaxed">
                หากท่านเลือก "ไม่ระบุตัวตน" เจ้าหน้าที่จะไม่ทราบข้อมูลส่วนตัวของท่านในขั้นตอนการพิจารณา เพื่อความเป็นส่วนตัวสูงสุด
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={form.isAnonymous}
                onChange={(e) => setForm({ ...form, isAnonymous: e.target.checked })}
                className="sr-only peer" 
              />
              <div className="w-14 h-8 bg-indigo-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-orange-500 shadow-inner"></div>
              <span className="ml-3 text-sm font-bold text-white">{form.isAnonymous ? "เปิดใช้งาน" : "ปิดใช้งาน"}</span>
            </label>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">หมวดหมู่ข้อร้องเรียน <span className="text-red-500">*</span></label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {COMPLAINT_TYPES.map(t => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setForm({ ...form, type: t.id.toString() })}
                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all group ${
                      form.type === t.id.toString()
                        ? `border-${t.color}-500 ${t.bg} ring-4 ring-${t.color}-500/10`
                        : "border-slate-100 bg-slate-50/50 hover:border-slate-200 hover:bg-white"
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl mb-3 flex items-center justify-center transition-all ${
                      form.type === t.id.toString() ? `${t.text}` : "text-slate-400 group-hover:text-slate-600"
                    }`}>
                      <CategoryIcon typeId={t.id} />
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-tight text-center leading-tight ${
                      form.type === t.id.toString() ? `${t.text}` : "text-slate-500"
                    }`}>
                      {t.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">หัวข้อเรื่อง <span className="text-red-500">*</span></label>
              <input
                type="text"
                placeholder="สรุปปัญหาพอสังเขป..."
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">รายละเอียดปัญหา <span className="text-red-500">*</span></label>
            <textarea
              rows={6}
              placeholder="ระบุรายละเอียดปัญหา สถานที่ เวลา และข้อมูลที่เกี่ยวข้อง..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
              className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium resize-none"
            />
          </div>

          <div className="space-y-4">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">แนบหลักฐานเพิ่มเติม (ถ้ามี)</label>
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-4 p-6 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 hover:border-indigo-300 transition-colors">
                <label className="px-6 py-3 bg-white text-indigo-600 font-bold rounded-xl shadow-sm cursor-pointer hover:bg-indigo-50 transition flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                  อัปโหลดไฟล์
                  <input type="file" accept=".pdf,image/*" onChange={handleFileChange} className="hidden" />
                </label>
                {fileName ? (
                  <div className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm font-bold">
                    ✅ {fileName}
                  </div>
                ) : (
                  <span className="text-slate-400 text-sm">ไม่เกิน 5MB (PDF, JPG, PNG)</span>
                )}
              </div>

              {form.attachment && (
                <div className="relative group w-full sm:w-64 animate-in zoom-in-95 duration-300">
                  <div className="p-3 bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
                    {form.attachment.startsWith("data:image") ? (
                      <img src={form.attachment} alt="Preview" className="w-full h-40 object-cover rounded-2xl" />
                    ) : (
                      <div className="w-full h-40 bg-slate-50 rounded-2xl flex flex-col items-center justify-center gap-2">
                        <span className="text-4xl">📄</span>
                        <span className="text-[10px] font-black text-slate-400 uppercase">PDF Document</span>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => { setForm({ ...form, attachment: "" }); setFileName(""); }}
                      className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-red-600 transition-all transform hover:scale-110 active:scale-95 z-20"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                    <div className="mt-3 px-2 flex items-center justify-between">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Attachment Preview</span>
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="pt-6 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-12 py-4 bg-slate-900 text-white font-extrabold rounded-[1.5rem] shadow-xl hover:bg-slate-800 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  🚀 ส่งเรื่องร้องเรียน
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
