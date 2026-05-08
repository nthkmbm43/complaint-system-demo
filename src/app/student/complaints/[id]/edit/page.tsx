"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import ModalAlert from "@/components/ModalAlert";
import { COMPLAINT_TYPES } from "@/lib/constants";
import { CategoryIcon } from "@/components/Icons";

export default function EditComplaintPage() {
  const router = useRouter();
  const params = useParams();
  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "",
    isAnonymous: false,
    priority: 2,
    attachment: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ type: "" as any, title: "", text: "" });
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    if (params?.id) {
      fetch(`/api/complaints/${params.id}`)
        .then(res => {
          if (!res.ok) {
            if (typeof window !== "undefined" && window.history.length > 1) router.back(); else router.replace("/student/dashboard");
            return null;
          }
          return res.json();
        })
        .then(data => {
          if (data && data.complaint) {
            if (data.complaint.status !== 0) {
              if (typeof window !== "undefined" && window.history.length > 1) router.back(); else router.replace("/student/dashboard");
              return;
            }
            setForm({
              title: data.complaint.title,
              description: data.complaint.description,
              type: String(data.complaint.type),
              isAnonymous: data.complaint.isAnonymous,
              priority: data.complaint.priority,
              attachment: data.complaint.attachment || "",
            });
            setLoading(false);
          } else if (data) {
            if (typeof window !== "undefined" && window.history.length > 1) router.back(); else router.replace("/student/dashboard");
          }
        })
        .catch(() => {
          if (typeof window !== "undefined" && window.history.length > 1) router.back(); else router.replace("/student/dashboard");
        });
    }
  }, [params, router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setMsg({ type: "error", title: "ไฟล์ใหญ่เกินไป", text: "ขนาดไฟล์ต้องไม่เกิน 5MB" });
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
    try {
      const res = await fetch(`/api/complaints/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      setSaving(false);

      if (!res.ok) {
        setMsg({ type: "error", title: "เกิดข้อผิดพลาด", text: data.error || "ไม่สามารถบันทึกการแก้ไขได้" });
        return;
      }

      setMsg({ 
        type: "success", 
        title: "แก้ไขสำเร็จ", 
        text: "ข้อมูลคำร้องเรียนของคุณได้รับการอัปเดตเรียบร้อยแล้ว" 
      });
    } catch (error) {
      setSaving(false);
      setMsg({ type: "error", title: "เกิดข้อผิดพลาดในการเชื่อมต่อ", text: "ไม่สามารถบันทึกข้อมูลได้ กรุณาตรวจสอบอินเทอร์เน็ต" });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-12 h-12 border-4 border-slate-100 border-t-orange-500 rounded-full animate-spin" />
        <p className="text-slate-400 font-bold tracking-widest text-[10px] uppercase">Retrieving Data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <ModalAlert 
        isOpen={!!msg.text}
        type={msg.type || "info"}
        title={msg.title}
        message={msg.text}
        onConfirm={() => {
          if (msg.type === "success") {
            router.push(`/student/complaints/${params.id}`);
          } else if (msg.type === "warning" && msg.title === "ไม่สามารถแก้ไขได้") {
            router.push(`/student/complaints/${params.id}`);
          } else {
            setMsg({ type: "" as any, title: "", text: "" });
          }
        }}
      />

      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">แก้ไขข้อมูลคำร้อง</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Update your existing request</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="bg-slate-900 text-white rounded-[3rem] p-10 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-10 opacity-10 transform scale-[2.5] group-hover:scale-[3] transition-transform duration-700">🔒</div>
          <div className="relative z-10 flex flex-col md:flex-row justify-between md:items-center gap-8">
            <div className="max-w-md">
              <h3 className="text-2xl font-black mb-2 text-white">แก้ไขการระบุตัวตน</h3>
              <p className="text-slate-400 font-medium leading-relaxed">
                ท่านสามารถเลือกปกปิดหรือระบุตัวตนใหม่ได้ ตราบใดที่เจ้าหน้าที่ยังไม่ได้เริ่มดำเนินการรับเรื่องเข้าสู่ระบบ
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer scale-110">
              <input 
                type="checkbox" 
                checked={form.isAnonymous}
                onChange={(e) => setForm({ ...form, isAnonymous: e.target.checked })}
                className="sr-only peer" 
              />
              <div className="w-16 h-9 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4.5px] after:left-[4.5px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-7 after:w-7 after:transition-all peer-checked:bg-orange-500 shadow-inner"></div>
              <span className="ml-4 text-xs font-black uppercase tracking-widest text-slate-300">{form.isAnonymous ? "Anonymous" : "Identified"}</span>
            </label>
          </div>
        </div>

        <div className="bg-white rounded-[3rem] border border-slate-200 p-10 sm:p-12 shadow-sm space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">หมวดหมู่ข้อร้องเรียน</label>
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
                    <div className={`w-10 h-10 rounded-xl mb-3 flex items-center justify-center transition-all ${
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
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">หัวข้อเรื่อง</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                className="w-full px-6 py-4.5 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500 transition-all font-bold text-slate-800"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">รายละเอียดปัญหา</label>
            <textarea
              rows={8}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
              className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500 transition-all font-medium text-slate-700 resize-none leading-relaxed"
            />
          </div>

          {/* Evidence Upload */}
          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">หลักฐานเพิ่มเติม (รูปภาพ/PDF - ไม่เกิน 5MB)</label>
            <div className="flex flex-col gap-6">
              <div className="relative group/file">
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] p-10 text-center transition-all group-hover/file:border-orange-500 group-hover/file:bg-orange-50/30">
                  <div className="text-4xl mb-3">📎</div>
                  <p className="text-sm font-bold text-slate-600">
                    {fileName || (form.attachment ? "มีการแนบไฟล์ไว้แล้ว (คลิกเพื่อเปลี่ยน)" : "คลิกหรือลากไฟล์มาวางที่นี่")}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-2 uppercase font-black tracking-widest">Support: PNG, JPG, PDF (Max 5MB)</p>
                </div>
              </div>

              {form.attachment && (
                <div className="relative group w-full sm:w-72 animate-in zoom-in-95 duration-500">
                  <div className="p-3 bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl overflow-hidden">
                    {form.attachment.startsWith("data:image") ? (
                      <img src={form.attachment} alt="Preview" className="w-full h-48 object-cover rounded-[1.8rem]" />
                    ) : (
                      <div className="w-full h-48 bg-slate-50 rounded-[1.8rem] flex flex-col items-center justify-center gap-3">
                        <span className="text-5xl">📄</span>
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">PDF Document</span>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => { setForm({ ...form, attachment: "" }); setFileName(""); }}
                      className="absolute -top-2 -right-2 w-10 h-10 bg-red-500 text-white rounded-full shadow-xl flex items-center justify-center hover:bg-red-600 transition-all transform hover:scale-110 active:scale-95 z-20 border-4 border-white"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                    <div className="mt-4 px-3 flex items-center justify-between">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">File Preview</span>
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse"></span>
                        <span className="w-1.5 h-1.5 bg-orange-300 rounded-full animate-pulse delay-75"></span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row justify-end gap-4">
             <button
              type="button"
              onClick={() => router.back()}
              className="px-10 py-5 bg-slate-50 text-slate-500 font-black rounded-2xl hover:bg-slate-100 transition-all text-xs uppercase tracking-widest"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-14 py-5 bg-slate-900 text-white font-black rounded-[1.5rem] shadow-2xl shadow-slate-900/20 hover:bg-slate-800 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-50 text-xs uppercase tracking-widest"
            >
              {saving ? (
                <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Save Changes</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
