"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import StatusProgressBar from "@/components/StatusProgressBar";
import Link from "next/link";
import ModalAlert from "@/components/ModalAlert";
import Swal from "sweetalert2";
import { COMPLAINT_TYPES } from "@/lib/constants";

const STATUS_CONFIG: Record<number, { label: string; color: string; bg: string; barColor: string }> = {
  0: { label: "ยื่นคำร้อง", color: "text-gray-600", bg: "bg-gray-100", barColor: "bg-gray-400" },
  1: { label: "กำลังดำเนินการ", color: "text-blue-700", bg: "bg-blue-100", barColor: "bg-blue-500" },
  2: { label: "รอประเมิน", color: "text-amber-700", bg: "bg-amber-100", barColor: "bg-amber-500" },
  3: { label: "เสร็จสิ้น", color: "text-green-700", bg: "bg-green-100", barColor: "bg-green-500" },
  4: { label: "ปฏิเสธ", color: "text-red-700", bg: "bg-red-100", barColor: "bg-red-500" },
  5: { label: "ยกเลิก", color: "text-slate-500", bg: "bg-slate-100", barColor: "bg-slate-400" },
};

const PRIORITY_CONFIG: Record<number, { label: string; color: string }> = {
  1: { label: "ไม่เร่งด่วน", color: "text-gray-500" },
  2: { label: "ปกติ", color: "text-blue-500" },
  3: { label: "เร่งด่วน", color: "text-orange-500" },
  4: { label: "เร่งด่วนมาก", color: "text-red-500" },
  5: { label: "วิกฤต 🚨", color: "text-red-700 font-bold" },
};

function StarRating({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="transition-transform hover:scale-125 focus:outline-none"
        >
          <svg
            className={`w-9 h-9 transition-colors ${
              (hovered || value) >= star
                ? "text-amber-400"
                : "text-slate-200"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      ))}
      {value > 0 && (
        <span className="ml-2 text-sm font-bold text-amber-600">
          {["", "แย่มาก", "แย่", "ปานกลาง", "ดี", "ดีมาก"][value]}
        </span>
      )}
    </div>
  );
}

export default function StudentComplaintDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [complaint, setComplaint] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Evaluation State
  const [evalScore, setEvalScore] = useState(0);
  const [evalComment, setEvalComment] = useState("");
  const [evalSaving, setEvalSaving] = useState(false);
  const [evalDone, setEvalDone] = useState(false);
  const [msg, setMsg] = useState({ type: "" as any, title: "", text: "" });
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (params?.id) {
      fetch(`/api/complaints/${params.id}`)
        .then((res) => {
          if (!res.ok) {
            if (typeof window !== "undefined" && window.history.length > 1) {
              router.back();
            } else {
              router.replace("/student/dashboard");
            }
            return null;
          }
          return res.json();
        })
        .then((data) => {
          if (data && data.complaint) {
            setComplaint(data.complaint);
            if (data.complaint?.evaluation) {
              setEvalDone(true);
              setEvalScore(data.complaint.evaluation.score);
              setEvalComment(data.complaint.evaluation.comment || "");
            }
            setLoading(false);
          } else if (data) {
            if (typeof window !== "undefined" && window.history.length > 1) {
              router.back();
            } else {
              router.replace("/student/dashboard");
            }
          }
        })
        .catch(() => {
          if (typeof window !== "undefined" && window.history.length > 1) {
            router.back();
          } else {
            router.replace("/student/dashboard");
          }
        });
    }
  }, [params]);

  const handleEvaluate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!evalScore) return setMsg({ type: "warning", title: "กรุณาเลือกคะแนน", text: "กรุณาเลือกคะแนน 1-5 ดาวเพื่อส่งการประเมิน" });

    const result = await Swal.fire({
      title: "ยืนยันการส่งผลการประเมิน?",
      text: "คุณไม่สามารถกลับมาแก้ไขได้",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ส่งผลประเมิน",
      cancelButtonText: "ยกเลิก",
      customClass: { popup: 'rounded-[2rem]', confirmButton: 'px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold mx-2 shadow-lg shadow-green-500/30 transition-all', cancelButton: 'px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold mx-2 shadow-lg shadow-red-500/30 transition-all' },
      buttonsStyling: false
    });
    if (!result.isConfirmed) return;

    setEvalSaving(true);

    const res = await fetch(`/api/complaints/${params.id}/evaluate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ score: evalScore, comment: evalComment }),
    });

    const data = await res.json();
    setEvalSaving(false);

    if (!res.ok) {
      setMsg({ type: "error", title: "ไม่สามารถประเมินได้", text: data.error || "เกิดข้อผิดพลาด" });
    } else {
      setMsg({ type: "success", title: "ประเมินผลสำเร็จ", text: "ขอบคุณสำหรับข้อเสนอแนะเพื่อการพัฒนาบริการของเรา" });
      setEvalDone(true);
    }
  };

  const handleCancel = async () => {
    setShowDeleteModal(false);
    const res = await fetch(`/api/complaints/${complaint.id}`, { 
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: 5, note: "ยกเลิกโดยนักศึกษา" }),
    });
    if (res.ok) {
      window.location.reload();
    } else {
      setMsg({ type: "error", title: "ไม่สามารถยกเลิกคำร้องได้", text: "เกิดข้อผิดพลาดในการอัปเดตข้อมูล" });
    }
  };

  const [zoomImage, setZoomImage] = useState<string | null>(null);
  const isImage = (url: string) => url.startsWith("data:image") || /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(url);
  
  const parseAttachments = (attachment: string | null) => {
    if (!attachment) return [];
    try {
      const parsed = JSON.parse(attachment);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // Legacy single file
    }
    return [attachment];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-12 h-12 border-4 border-orange-100 border-t-orange-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">ไม่พบข้อร้องเรียน</h2>
        <button onClick={() => router.back()} className="text-orange-600 hover:underline">
          กลับไปหน้ารายการ
        </button>
      </div>
    );
  }

  const status = STATUS_CONFIG[complaint.status];
  const priority = PRIORITY_CONFIG[complaint.priority];
  const cType = COMPLAINT_TYPES.find(t => t.id === complaint.type);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Lightbox Modal */}
      {zoomImage && (
        <div 
          className="fixed inset-0 z-[10000] bg-slate-900/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-10 cursor-zoom-out animate-in fade-in duration-300"
          onClick={() => setZoomImage(null)}
        >
          <img src={zoomImage} alt="Zoomed Evidence" className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl animate-in zoom-in-95 duration-300" />
          <button className="absolute top-10 right-10 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
      )}
      <ModalAlert 
        isOpen={!!msg.text}
        type={msg.type || "info"}
        title={msg.title}
        message={msg.text}
        onConfirm={() => setMsg({ type: "" as any, title: "", text: "" })}
      />

      <ModalAlert
        isOpen={showDeleteModal}
        type="warning"
        title="ยกเลิกคำร้องเรียน"
        message={`ต้องการยกเลิกคำร้อง "${complaint.title}" ใช่หรือไม่? หลังจากยกเลิกแล้วจะไม่สามารถดำเนินการต่อได้`}
        showCancel={true}
        confirmText="ยืนยันยกเลิกคำร้อง"
        cancelText="กลับ"
        onConfirm={handleCancel}
        onCancel={() => setShowDeleteModal(false)}
      />

      {/* ส่วนหัวแสดงสถานะ */}
      <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm relative overflow-hidden">
        <div className={`absolute top-0 left-0 w-1.5 h-full ${status.barColor}`} />
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {complaint.status === 2 && (
                <span className="flex items-center gap-2 text-[9px] font-black text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200 animate-pulse uppercase tracking-widest">
                  ⭐ กรุณาประเมินผล
                </span>
              )}
              <span className={`text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest ${status.bg} ${status.color} border border-current/10`}>
                {status.label}
              </span>
              <span className="text-[10px] font-black text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 uppercase tracking-widest">
                {cType?.icon} {cType?.label}
              </span>
              <span className={`text-[10px] font-black uppercase tracking-widest ${priority.color}`}>
                Priority: {priority.label}
              </span>
            </div>
            <h1 className="text-3xl font-black text-slate-800 leading-tight mb-2">
              {complaint.title}
            </h1>
            <p className="text-xs font-medium text-slate-400">
              Ref ID: <span className="font-mono text-slate-500 select-all">{complaint.id}</span> • {new Date(complaint.createdAt).toLocaleString("th-TH")}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {complaint.status === 0 && (
              <>
                <Link
                  href={`/student/complaints/${complaint.id}/edit`}
                  className="px-6 py-3 bg-orange-50 text-orange-600 font-bold rounded-2xl border border-orange-100 hover:bg-orange-100 transition text-sm flex items-center gap-2"
                >
                  <span>✏️</span> แก้ไข
                </Link>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="px-6 py-3 bg-red-50 text-red-600 font-bold rounded-2xl border border-red-100 hover:bg-red-600 hover:text-white transition text-sm"
                >
                  ยกเลิกคำร้อง
                </button>
              </>
            )}
          </div>
        </div>

        <div className="mb-10">
          <StatusProgressBar currentStatus={complaint.status} />
        </div>

        <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 mb-8">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Description</h3>
          <p className="text-slate-700 leading-relaxed text-lg whitespace-pre-wrap">
            {complaint.description}
          </p>
          {complaint.attachment && parseAttachments(complaint.attachment).length > 0 && (
            <div className="mt-8 pt-8 border-t border-slate-200/50">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Attachments</h4>
              <div className="flex flex-wrap gap-4">
                {parseAttachments(complaint.attachment).map((fileUrl: string, idx: number) => (
                  <div key={idx} className="p-2 bg-white rounded-2xl border border-slate-200 inline-block shadow-sm">
                    {isImage(fileUrl) ? (
                      <div className="relative group cursor-zoom-in" onClick={() => setZoomImage(fileUrl)}>
                        <img src={fileUrl} alt={`Evidence ${idx + 1}`} className="max-w-full w-48 object-cover rounded-xl h-32 shadow-sm transition-transform group-hover:scale-[1.02]" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-xl flex items-center justify-center">
                          <span className="bg-white/90 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity shadow-xl">Click to Zoom</span>
                        </div>
                      </div>
                    ) : (
                      <a href={fileUrl} download={`Evidence_${idx+1}`} className="px-6 py-4 flex flex-col items-center gap-2 text-indigo-600 font-bold hover:bg-indigo-50 rounded-xl transition-all">
                        <span className="text-4xl">📄</span>
                        <span className="text-[10px] uppercase tracking-widest">Document {idx+1}</span>
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ประวัติการดำเนินการ (Chat Interface) */}
      <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
        <h3 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-3">
          <span className="text-indigo-600">💬</span> Conversation History
        </h3>
        {(!complaint.histories || complaint.histories.length === 0) ? (
          <div className="py-16 text-center bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
             <p className="text-4xl mb-4 grayscale opacity-20">📭</p>
             <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">ยังไม่มีข้อมูลการดำเนินการ</p>
          </div>
        ) : (
          <div className="space-y-6">
            {complaint.histories?.map((history: any) => {
              const hStatus = STATUS_CONFIG[history.status];
              const isStaff = !!history.actionBy;
              
              return (
                <div key={history.id} className={`flex ${isStaff ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[85%] ${isStaff ? 'bg-slate-50 border-slate-100' : 'bg-orange-50 border-orange-100'} border rounded-[1.8rem] p-6 shadow-sm relative transition-all hover:shadow-md`}>
                    <div className="flex items-center justify-between gap-4 mb-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black ${isStaff ? 'bg-indigo-600 text-white' : 'bg-orange-500 text-white'}`}>
                          {isStaff ? 'S' : 'U'}
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${isStaff ? 'text-indigo-600' : 'text-orange-600'}`}>
                          {isStaff ? history.actionBy.name : 'You'}
                        </span>
                      </div>
                      <span className="text-[9px] font-bold text-slate-300">
                        {new Date(history.createdAt).toLocaleString("th-TH")}
                      </span>
                    </div>
                    <p className="text-sm text-slate-700 font-medium leading-relaxed">
                      {history.note || `Changed status to ${hStatus.label}`}
                    </p>
                    {history.attachment && parseAttachments(history.attachment).length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {parseAttachments(history.attachment).map((fileUrl: string, idx: number) => (
                          <div key={idx} className="relative group cursor-zoom-in" onClick={() => setZoomImage(fileUrl)}>
                            {isImage(fileUrl) ? (
                              <img src={fileUrl} alt={`Staff Evidence ${idx + 1}`} className="w-16 h-16 object-cover rounded-lg border border-slate-200 shadow-sm transition-transform hover:scale-105" />
                            ) : (
                              <a href={fileUrl} download={`Staff_Evidence_${idx+1}`} className="w-16 h-16 bg-white border border-slate-200 rounded-lg flex flex-col items-center justify-center text-indigo-600 hover:bg-indigo-50 transition-colors">
                                <span className="text-xl">📄</span>
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="mt-4 pt-3 border-t border-black/5">
                      <span className={`text-[9px] font-black uppercase tracking-widest ${hStatus.color} opacity-60`}>
                        Phase: {hStatus.label}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ส่วนโต้ตอบสำหรับนักศึกษา */}
        {complaint.status < 3 && (
          <div className="mt-10 pt-10 border-t border-slate-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center text-sm">✍️</div>
              <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest">ส่งข้อความโต้ตอบ</h4>
            </div>
            <form 
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const note = (form.elements.namedItem("note") as HTMLTextAreaElement).value;
                if (!note.trim()) return;

                const result = await Swal.fire({
                  title: "ยืนยันการส่งข้อความตอบโต้?",
                  icon: "question",
                  showCancelButton: true,
                  confirmButtonText: "ส่งข้อความ",
                  cancelButtonText: "ยกเลิก",
                  customClass: { popup: 'rounded-[2rem]', confirmButton: 'px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold mx-2 shadow-lg shadow-green-500/30 transition-all', cancelButton: 'px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold mx-2 shadow-lg shadow-red-500/30 transition-all' },
                  buttonsStyling: false
                });
                if (!result.isConfirmed) return;

                const res = await fetch(`/api/complaints/${complaint.id}`, {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ note })
                });

                if (res.ok) {
                  form.reset();
                  window.location.reload();
                }
              }}
              className="space-y-4"
            >
              <textarea
                name="note"
                placeholder="เขียนข้อความเพื่อสอบถามหรือแจ้งข้อมูลเพิ่มเติมกับเจ้าหน้าที่..."
                className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-medium text-sm resize-none shadow-inner"
                rows={3}
                required
              />
              <div className="flex justify-end">
                <button 
                  type="submit"
                  className="px-10 py-4 bg-orange-500 text-white font-black rounded-2xl shadow-xl shadow-orange-500/20 hover:bg-orange-600 hover:-translate-y-1 transition-all text-[10px] uppercase tracking-[0.2em] flex items-center gap-2"
                >
                  <span>Send Reply</span>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* ส่วนประเมินผลการบริการ (แสดงเมื่อสถานะ = รอประเมิน หรือ เสร็จสิ้น) */}
      {(complaint.status === 2 || complaint.status === 3) && (
        <div className={`rounded-[2.5rem] border p-10 shadow-sm relative overflow-hidden group transition-all duration-500 ${
          complaint.status === 2 
            ? "bg-gradient-to-br from-amber-50 via-white to-orange-50 border-amber-200 shadow-xl shadow-amber-200/20 ring-4 ring-amber-500/5 scale-[1.02]" 
            : "bg-white border-slate-100 opacity-80"
        }`}>
          {complaint.status === 2 && (
             <div className="absolute top-4 right-10 flex gap-1">
                <span className="w-2 h-2 bg-amber-400 rounded-full animate-bounce delay-0" />
                <span className="w-2 h-2 bg-amber-400 rounded-full animate-bounce delay-150" />
                <span className="w-2 h-2 bg-amber-400 rounded-full animate-bounce delay-300" />
             </div>
          )}
          <div className="absolute top-0 right-0 p-10 opacity-10 transform scale-150 group-hover:scale-[1.8] transition-transform duration-700">⭐</div>
          <div className="flex items-center gap-4 mb-8">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-lg transition-transform group-hover:rotate-12 ${
              complaint.status === 2 ? "bg-amber-400 text-white shadow-amber-400/30" : "bg-slate-100 text-slate-400 shadow-none"
            }`}>⭐</div>
            <div>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                {complaint.status === 2 ? "ช่วยประเมินความพึงพอใจให้เราหน่อย" : "ผลการประเมินความพึงพอใจ"}
              </h3>
              <p className={`text-xs font-bold uppercase tracking-widest ${complaint.status === 2 ? "text-amber-600" : "text-slate-400"}`}>
                {complaint.status === 2 ? "How was our service? Your feedback matters!" : "Thank you for your feedback"}
              </p>
            </div>
          </div>

          {evalDone ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-[2rem] p-8 text-center border border-white shadow-inner">
              <div className="text-5xl mb-4">🎉</div>
              <p className="font-black text-slate-800 text-xl mb-1">ขอบคุณสำหรับการประเมิน!</p>
              <p className="text-amber-600 text-[10px] font-black uppercase tracking-widest mb-6">Your rating is highly appreciated</p>
              <div className="flex justify-center gap-2 mb-6">
                {[1, 2, 3, 4, 5].map((s) => (
                  <svg
                    key={s}
                    className={`w-10 h-10 ${s <= evalScore ? "text-amber-400" : "text-slate-200"}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              {evalComment && (
                <div className="p-4 bg-slate-50 rounded-2xl italic text-slate-500 text-sm border border-slate-100">
                  "{evalComment}"
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleEvaluate} className="space-y-6">
              <div className="bg-white/50 p-6 rounded-2xl border border-white">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
                  Rate your experience <span className="text-red-500">*</span>
                </label>
                <StarRating value={evalScore} onChange={setEvalScore} />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">
                  Additional Suggestions
                </label>
                <textarea
                  rows={4}
                  value={evalComment}
                  onChange={(e) => setEvalComment(e.target.value)}
                  placeholder="ช่วยแนะนำเราว่าควรปรับปรุงจุดไหนเพิ่มเติม..."
                  className="w-full px-6 py-5 bg-white border border-slate-100 rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-amber-400/10 focus:border-amber-400 transition-all font-medium text-sm resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={evalSaving || evalScore === 0}
                className="w-full sm:w-auto px-12 py-4 bg-amber-500 text-white font-black rounded-2xl shadow-xl shadow-amber-500/20 hover:bg-amber-600 hover:-translate-y-1 transition-all disabled:opacity-50 flex items-center justify-center gap-3 text-xs uppercase tracking-widest"
              >
                {evalSaving ? (
                  <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Submit Evaluation</>
                )}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
