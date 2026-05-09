"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import StatusProgressBar from "@/components/StatusProgressBar";
import { useSession } from "next-auth/react";
import ModalAlert from "@/components/ModalAlert";
import { PRIORITY_CONFIG, COMPLAINT_TYPES } from "@/lib/constants";
import { CategoryIcon } from "@/components/Icons";

const STATUS_CONFIG: Record<number, { label: string; color: string; bg: string; barColor: string }> = {
  0: { label: "ยื่นคำร้อง", color: "text-gray-600", bg: "bg-gray-100", barColor: "bg-gray-400" },
  1: { label: "กำลังดำเนินการ", color: "text-blue-700", bg: "bg-blue-100", barColor: "bg-blue-500" },
  2: { label: "รอประเมิน", color: "text-amber-700", bg: "bg-amber-100", barColor: "bg-amber-500" },
  3: { label: "เสร็จสิ้น", color: "text-green-700", bg: "bg-green-100", barColor: "bg-green-500" },
  4: { label: "ปฏิเสธ", color: "text-red-700", bg: "bg-red-100", barColor: "bg-red-500" },
};

export default function AdminComplaintDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [complaint, setComplaint] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [statusUpdate, setStatusUpdate] = useState("");
  const [priorityUpdate, setPriorityUpdate] = useState("");
  const [noteUpdate, setNoteUpdate] = useState("");
  const [attachment, setAttachment] = useState("");
  const [fileName, setFileName] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [msg, setMsg] = useState({ type: "" as any, title: "", text: "" });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [assignedStaffId, setAssignedStaffId] = useState("");
  const [showAssignModal, setShowAssignModal] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setMsg({ type: "error", title: "ไฟล์มีขนาดใหญ่เกินไป", text: "ขนาดไฟล์ต้องไม่เกิน 5MB" });
        return;
      }
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => setAttachment(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const fetchComplaint = () => {
    fetch(`/api/complaints/${params.id}`)
      .then((res) => {
        if (!res.ok) {
          if (typeof window !== "undefined" && window.history.length > 1) router.back(); else router.replace("/admin/dashboard");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data && data.complaint) {
          setComplaint(data.complaint);
          setStatusUpdate(data.complaint.status.toString());
          setPriorityUpdate(data.complaint.priority.toString());
          setAssignedStaffId(data.complaint.assignedStaffId || "");
          setLoading(false);
        } else if (data) {
          if (typeof window !== "undefined" && window.history.length > 1) router.back(); else router.replace("/admin/dashboard");
        }
      })
      .catch(() => {
        if (typeof window !== "undefined" && window.history.length > 1) router.back(); else router.replace("/admin/dashboard");
      });
  };

  const fetchStaffList = () => {
    fetch("/api/admin/staff-list")
      .then(res => res.json())
      .then(data => setStaffList(data.staffMembers || []));
  };

  useEffect(() => {
    if (params?.id) {
      fetchComplaint();
      if ((session?.user as any)?.role >= 2) fetchStaffList();
    }
  }, [params, session]);

  const handleUpdate = async (e?: React.FormEvent, customData?: any) => {
    if (e) e.preventDefault();
    setIsUpdating(true);
    setMsg({ type: "", title: "", text: "" });

    const payload = customData || {
      status: Number(statusUpdate),
      priority: Number(priorityUpdate),
      note: noteUpdate,
      attachment: attachment || null,
      assignedStaffId: assignedStaffId || undefined
    };

    const res = await fetch(`/api/complaints/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setNoteUpdate("");
      setAttachment("");
      setFileName("");
      setMsg({ type: "success", title: "อัปเดตสถานะสำเร็จ", text: "ข้อมูลความคืบหน้าถูกบันทึกลงในระบบเรียบร้อยแล้ว" });
      fetchComplaint();
    } else {
      const data = await res.json();
      setMsg({ type: "error", title: "อัปเดตไม่สำเร็จ", text: data.error || "เกิดข้อผิดพลาดในการบันทึกข้อมูล" });
    }
    setIsUpdating(false);
  };

  const handleDeleteComplaint = async () => {
    setShowDeleteModal(false);
    const res = await fetch(`/api/complaints/${params.id}`, { method: "DELETE" });
    if (res.ok) {
        router.push("/admin/complaints");
    } else {
      setMsg({ type: "error", title: "ลบไม่สำเร็จ", text: "เกิดข้อผิดพลาดในการลบข้อมูล" });
    }
  };

  const [zoomImage, setZoomImage] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!complaint) return <div className="text-center py-20 text-slate-800">ไม่พบข้อร้องเรียน</div>;

  const currentStatus = STATUS_CONFIG[complaint.status] || STATUS_CONFIG[0];
  const priority = PRIORITY_CONFIG[complaint.priority] || PRIORITY_CONFIG[2];
  const isAssignedToMe = complaint.assignedStaffId === (session?.user as any)?.id;

  const isImage = (url: string) => url.startsWith("data:image") || /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(url);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 animate-in fade-in duration-500">
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
        title="ยืนยันการลบถาวร"
        message={`ต้องการลบคำร้อง "${complaint.title}" ออกจากฐานข้อมูลถาวรใช่หรือไม่? การดำเนินการนี้ไม่สามารถย้อนกลับได้`}
        showCancel={true}
        confirmText="ยืนยันลบข้อมูล"
        cancelText="ยกเลิก"
        onConfirm={handleDeleteComplaint}
        onCancel={() => setShowDeleteModal(false)}
      />

      {/* Top Action Bar */}
      <div className="bg-white rounded-3xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4 pl-4">
          <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 border border-slate-100">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
          </div>
          <div>
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Reference ID</h2>
            <p className="text-sm font-mono text-slate-600 font-bold">{complaint.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 pr-2">
          {((session?.user as any).role >= 2 && complaint.status === 0) && (
            <div className="flex gap-2">
              <button 
                onClick={() => handleUpdate(undefined, { status: 4, note: "คำร้องถูกปฏิเสธโดยผู้ดำเนินการ" })}
                className="px-6 py-3 bg-slate-50 text-slate-500 font-black rounded-2xl hover:bg-red-50 hover:text-red-600 border border-slate-100 transition-all text-[10px] uppercase tracking-widest active:scale-95"
              >
                Reject Case
              </button>
              <button 
                onClick={() => setShowAssignModal(true)}
                className="px-8 py-3 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 text-[10px] uppercase tracking-widest active:scale-95"
              >
                Accept & Assign
              </button>
            </div>
          )}

          {complaint.assignedStaffId && (
            <div className={`px-6 py-3 ${isAssignedToMe ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-50 text-slate-500 border-slate-200'} border rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3`}>
               <div className={`w-2 h-2 rounded-full ${isAssignedToMe ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`} />
               {isAssignedToMe ? "คุณเป็นผู้ดูแลเคสนี้" : `ดูแลโดย: ${complaint.assignedStaff?.name}`}
            </div>
          )}
          
          {(session?.user as any).role >= 3 && (
            <button 
              onClick={() => setShowDeleteModal(true)}
              className="w-12 h-12 flex items-center justify-center bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl border border-red-100 transition-all"
              title="Delete Case"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            </button>
          )}
        </div>
      </div>

      {/* Assignment Modal */}
      {showAssignModal && (
        <div 
          className="fixed inset-0 z-[1000] overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-end justify-center p-0 pt-20"
          onClick={() => setShowAssignModal(false)}
        >
          <div 
            className="relative bg-white rounded-t-[3rem] w-full max-w-xl p-8 md:p-12 shadow-[0_-20px_50px_-15px_rgba(0,0,0,0.3)] animate-in slide-in-from-bottom duration-500"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-indigo-600 text-white rounded-[1.5rem] flex items-center justify-center text-3xl shadow-lg">🛡️</div>
                <div>
                  <h3 className="text-3xl font-black text-slate-900 tracking-tight">รับเรื่องและมอบหมายงาน</h3>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Case Assignment Control</p>
                </div>
              </div>
              <button onClick={() => setShowAssignModal(false)} className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all flex items-center justify-center border border-slate-100">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
             
             <div className="space-y-8">
                <div className="space-y-3">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">ระดับความเร่งด่วน</label>
                   <select 
                     value={priorityUpdate} 
                     onChange={(e) => setPriorityUpdate(e.target.value)}
                     className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all appearance-none"
                   >
                     {Object.entries(PRIORITY_CONFIG).map(([v, {label}]) => <option key={v} value={v}>{label}</option>)}
                   </select>
                </div>

                <div className="space-y-3">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">มอบหมายให้เจ้าหน้าที่</label>
                   <select 
                     value={assignedStaffId} 
                     onChange={(e) => setAssignedStaffId(e.target.value)}
                     className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all appearance-none"
                   >
                     <option value="">เลือกเจ้าหน้าที่...</option>
                     {staffList.map(s => <option key={s.id} value={s.id}>{s.name} ({s.major || s.faculty})</option>)}
                   </select>
                </div>

                <div className="flex gap-4 pt-6">
                   <button onClick={() => setShowAssignModal(false)} className="flex-1 py-5 bg-white border border-slate-200 text-slate-600 font-black rounded-2xl hover:bg-slate-50 transition-all uppercase text-xs tracking-widest">ยกเลิก</button>
                   <button 
                     onClick={() => {
                       handleUpdate(undefined, { status: 1, priority: Number(priorityUpdate), assignedStaffId });
                       setShowAssignModal(false);
                     }}
                     disabled={!assignedStaffId}
                     className="flex-[2] py-5 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all uppercase text-xs tracking-widest disabled:opacity-50 shadow-2xl shadow-indigo-600/30"
                   >
                     ยืนยันและมอบหมายงาน
                   </button>
                </div>
             </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[3rem] border border-slate-200 p-10 shadow-sm relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-2.5 h-full ${currentStatus.barColor}`} />
            
            <div className="flex flex-wrap items-center gap-3 mb-8">
              <span className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${currentStatus.bg} ${currentStatus.color} border border-current/10 shadow-sm`}>
                {currentStatus.label}
              </span>
              <span className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-100 bg-slate-50 text-slate-500 flex items-center gap-2 shadow-sm`}>
                <CategoryIcon typeId={complaint.type} className="w-3.5 h-3.5" />
                {COMPLAINT_TYPES.find(t => t.id === complaint.type)?.label}
              </span>
              <span className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${priority.color} ${priority.bg} border border-current/10 shadow-sm`}>
                 {priority.label}
              </span>
            </div>

            <div className="mb-12">
              <StatusProgressBar currentStatus={complaint.status} />
            </div>

            <h1 className="text-4xl font-black text-slate-900 mb-8 leading-tight tracking-tighter">{complaint.title}</h1>
            
            <div className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100 mb-10">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                 <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                 Description
              </h3>
              <p className="text-slate-700 leading-relaxed text-xl whitespace-pre-wrap font-medium">{complaint.description}</p>
              
              {complaint.attachment && (
                <div className="mt-10 pt-10 border-t border-slate-200/50">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-3">
                     <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                     Evidence File
                  </h4>
                  <div className="p-3 bg-white rounded-3xl border border-slate-200 inline-block shadow-xl">
                    {isImage(complaint.attachment) ? (
                      <div className="relative group cursor-zoom-in" onClick={() => setZoomImage(complaint.attachment)}>
                        <img src={complaint.attachment} alt="Evidence" className="max-w-full h-auto rounded-2xl max-h-96 transition-transform group-hover:scale-[1.01]" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-2xl flex items-center justify-center">
                          <span className="bg-white/95 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 shadow-2xl">Click to Zoom</span>
                        </div>
                      </div>
                    ) : (
                      <a href={complaint.attachment} download className="px-10 py-6 flex items-center gap-4 text-indigo-600 font-black hover:bg-indigo-50 rounded-2xl transition-all uppercase tracking-widest text-[10px]">
                        <span className="text-3xl">📄</span>
                        <span>Download Evidence</span>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="p-8 bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <p className="text-slate-400 font-black uppercase tracking-widest text-[9px] mb-4">Reporter Information</p>
                {complaint.isAnonymous && (session?.user as any)?.role < 3 ? (
                  <div className="flex items-center gap-4 text-slate-400">
                    <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-3xl">🔒</div>
                    <div>
                      <p className="font-black text-slate-800">Anonymous Request</p>
                      <p className="text-[10px] font-bold uppercase tracking-widest">Identity protected</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-5">
                    <div className={`w-14 h-14 ${complaint.isAnonymous ? 'bg-amber-100 text-amber-600' : 'bg-indigo-100 text-indigo-600'} rounded-2xl flex items-center justify-center font-black text-2xl shadow-inner`}>
                      {complaint.student?.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-black text-slate-900 text-lg tracking-tight">{complaint.student?.name}</p>
                        {complaint.isAnonymous && (
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[8px] font-black uppercase rounded-md">Anonymous</span>
                        )}
                      </div>
                      <p className="text-slate-400 font-mono text-xs font-bold uppercase tracking-widest">{complaint.student?.studentId}</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-8 bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <p className="text-slate-400 font-black uppercase tracking-widest text-[9px] mb-4">Academic Context</p>
                <div className="space-y-4">
                  <p className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-black uppercase tracking-widest">Faculty</span>
                    <span className="text-slate-900 font-black">{complaint.isAnonymous && (session?.user as any)?.role < 3 ? "-" : (complaint.student?.faculty || "-")}</span>
                  </p>
                  <p className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-black uppercase tracking-widest">Department</span>
                    <span className="text-slate-900 font-black">{complaint.isAnonymous && (session?.user as any)?.role < 3 ? "-" : (complaint.student?.major || "-")}</span>
                  </p>
                  <p className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-black uppercase tracking-widest">Date Filed</span>
                    <span className="text-slate-900 font-black">{new Date(complaint.createdAt).toLocaleDateString("th-TH")}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {complaint.evaluation && (
            <div className="bg-amber-400 rounded-[3rem] p-1 shadow-xl">
              <div className="bg-white rounded-[2.9rem] p-10 flex flex-col md:flex-row items-center gap-10">
                <div className="flex-none w-24 h-24 bg-amber-100 text-amber-500 rounded-[2rem] flex items-center justify-center text-5xl shadow-inner">⭐</div>
                <div className="flex-grow text-center md:text-left">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">ความพึงพอใจของนักศึกษา</h3>
                  <p className="text-slate-500 font-medium italic mb-6 leading-relaxed">"{complaint.evaluation.comment || "ไม่มีข้อความเพิ่มเติม"}"</p>
                  <div className="inline-flex items-center gap-4 px-6 py-3 bg-slate-50 rounded-2xl border border-slate-100">
                     <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Score</span>
                     <div className="flex gap-1">
                        {[1,2,3,4,5].map(s => (
                          <span key={s} className={`text-xl ${s <= complaint.evaluation.score ? 'text-amber-400' : 'text-slate-200'}`}>★</span>
                        ))}
                     </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-[3rem] border border-slate-200 p-10 shadow-sm">
            <h3 className="text-2xl font-black text-slate-900 mb-10 flex items-center gap-4">
              <span className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-xl">💬</span> 
              ประวัติการดำเนินงาน
            </h3>
            
            <div className="space-y-10 relative before:absolute before:left-5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
              {complaint.histories?.map((h: any) => {
                const isMe = h.actionById === (session?.user as any)?.id;
                const isStaff = !!h.actionBy;
                
                return (
                  <div key={h.id} className="relative pl-12">
                    <div className={`absolute left-4 top-2 w-2.5 h-2.5 rounded-full border-4 border-white shadow-[0_0_0_4px_white] ${isStaff ? 'bg-indigo-600' : 'bg-orange-500'}`} />
                    <div className={`${isStaff ? 'bg-slate-50 border-slate-100' : 'bg-orange-50/50 border-orange-100'} border rounded-[2rem] p-8 shadow-sm`}>
                      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3">
                          <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg ${isStaff ? 'bg-indigo-100 text-indigo-700' : 'bg-orange-100 text-orange-700'}`}>
                            {isStaff ? (isMe ? 'You (Staff)' : h.actionBy.name) : 'Student'}
                          </span>
                        </div>
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                          {new Date(h.createdAt).toLocaleString("th-TH")}
                        </span>
                      </div>
                      <p className="text-slate-700 font-bold leading-relaxed">
                        {h.note || `สถานะถูกเปลี่ยนเป็น: ${STATUS_CONFIG[h.status]?.label || h.status}`}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {(isAssignedToMe || (session?.user as any)?.role >= 3) && (
            <div className="bg-slate-900 rounded-[3rem] border border-slate-800 p-10 shadow-2xl sticky top-28">
            <h3 className="text-2xl font-black text-white mb-10 flex items-center gap-4">
              <span className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-xl">🛠️</span> 
              Update Progress
            </h3>

            <form onSubmit={handleUpdate} className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Next Status</label>
                <select
                  value={statusUpdate}
                  onChange={(e) => setStatusUpdate(e.target.value)}
                  className="w-full px-6 py-5 bg-slate-800/50 border border-slate-700 rounded-3xl focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 text-white font-black transition-all appearance-none"
                >
                  {Object.entries(STATUS_CONFIG).map(([val, { label }]) => (
                    <option key={val} value={val} className="bg-slate-900">{label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Adjust Priority</label>
                <select
                  value={priorityUpdate}
                  onChange={(e) => setPriorityUpdate(e.target.value)}
                  disabled={(session?.user as any).role < 2}
                  className="w-full px-6 py-5 bg-slate-800/50 border border-slate-700 rounded-3xl focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 text-white font-black transition-all appearance-none disabled:opacity-30"
                >
                  {Object.entries(PRIORITY_CONFIG).map(([val, { label }]) => (
                    <option key={val} value={val} className="bg-slate-900">{label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Progress Note</label>
                <textarea
                  rows={5}
                  value={noteUpdate}
                  onChange={(e) => setNoteUpdate(e.target.value)}
                  placeholder="รายละเอียดความคืบหน้า..."
                  className="w-full px-6 py-6 bg-slate-800/50 border border-slate-700 rounded-3xl focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 text-white text-sm font-bold resize-none transition-all placeholder:text-slate-600"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Update Evidence</label>
                <div className="flex items-center gap-4 p-5 bg-slate-800/30 rounded-3xl border border-dashed border-slate-700 hover:border-indigo-500 transition-colors">
                  <label className="flex-none px-5 py-3 bg-slate-700 hover:bg-slate-600 text-white text-[9px] font-black rounded-xl cursor-pointer transition uppercase tracking-[0.2em]">
                    Upload
                    <input type="file" accept=".pdf,image/*" onChange={handleFileChange} className="hidden" />
                  </label>
                  <span className="text-[10px] text-slate-400 font-bold truncate">
                    {fileName || "No file selected"}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isUpdating}
                className="w-full py-6 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-3xl shadow-2xl shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:-translate-y-1 transition-all flex items-center justify-center gap-4 uppercase tracking-[0.2em] text-[10px] active:scale-95 disabled:opacity-50"
              >
                {isUpdating ? (
                  <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Commit Progress</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                  </>
                )}
              </button>
            </form>
          </div>
          )}
          
          <div className="bg-indigo-50 rounded-[3rem] p-10 border border-indigo-100">
             <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] mb-4">Quick Guide</h4>
             <p className="text-xs text-indigo-800 font-bold leading-relaxed">
               กรุณาอัปเดตสถานะและแนบไฟล์หลักฐาน (ถ้ามี) ทุกครั้งที่มีความคืบหน้า เพื่อให้นักศึกษาสามารถติดตามสถานะได้อย่างต่อเนื่อง
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
