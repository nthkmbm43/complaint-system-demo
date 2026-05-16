"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import StatusProgressBar from "@/components/StatusProgressBar";
import { useSession } from "next-auth/react";
import ModalAlert from "@/components/ModalAlert";
import Swal from "sweetalert2";
import { PRIORITY_CONFIG, COMPLAINT_TYPES } from "@/lib/constants";
import { CategoryIcon } from "@/components/Icons";

const STATUS_CONFIG: Record<number, { label: string; color: string; bg: string; barColor: string }> = {
  0: { label: "ยื่นคำร้อง", color: "text-gray-600", bg: "bg-gray-100", barColor: "bg-gray-400" },
  1: { label: "กำลังดำเนินการ", color: "text-blue-700", bg: "bg-blue-100", barColor: "bg-blue-500" },
  2: { label: "รอประเมิน", color: "text-amber-700", bg: "bg-amber-100", barColor: "bg-amber-500" },
  3: { label: "เสร็จสิ้น", color: "text-green-700", bg: "bg-green-100", barColor: "bg-green-500" },
  4: { label: "ปฏิเสธ", color: "text-red-700", bg: "bg-red-100", barColor: "bg-red-500" },
};

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
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [msg, setMsg] = useState({ type: "" as any, title: "", text: "" });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [assignedStaffId, setAssignedStaffId] = useState("");
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [facultyFilter, setFacultyFilter] = useState("");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    let validFiles = [];
    let base64s = [];
    let names = [];
    
    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        setMsg({ type: "error", title: "ไฟล์มีขนาดใหญ่เกินไป", text: "ขนาดไฟล์ต้องไม่เกิน 5MB ต่อไฟล์" });
        return;
      }
      validFiles.push(file);
      names.push(file.name);
    }
    
    setFileNames(names);
    
    for (const file of validFiles) {
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
      base64s.push(base64);
    }
    
    setAttachment(JSON.stringify(base64s));
  };

  const fetchComplaint = () => {
    const id = (params as any).id;
    if (!id) return;
    fetch(`/api/complaints/${id}`)
      .then((res) => {
        if (!res.ok) {
          setMsg({ type: "error", title: "ไม่สามารถเข้าถึงข้อมูลได้", text: "คุณอาจไม่มีสิทธิ์เข้าถึงเคสนี้ หรือเคสนี้ถูกลบไปแล้ว" });
          setLoading(false);
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

  // Handle Body Scroll Lock
  useEffect(() => {
    if (showAssignModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showAssignModal]);

  const handleUpdate = async (e?: React.FormEvent, customData?: any) => {
    if (e) e.preventDefault();

    if (!customData) {
      if (Number(statusUpdate) === 2) {
        const result = await Swal.fire({
          title: "ยืนยันการบันทึกความคืบหน้า",
          text: "ส่งให้ข้อร้องเรียนนี้เข้าสู่ขั้นตอน 'รอประเมิน' ใช่หรือไม่? (เมื่อส่งแล้วคุณจะไม่สามารถแก้ไขสถานะได้อีก)",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "ยืนยัน",
          cancelButtonText: "ยกเลิก",
          customClass: { popup: 'rounded-[2rem]', confirmButton: 'px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold mx-2 shadow-lg shadow-green-500/30 transition-all', cancelButton: 'px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold mx-2 shadow-lg shadow-red-500/30 transition-all' },
          buttonsStyling: false
        });
        if (!result.isConfirmed) return;
      } else {
        const nextLabel = STATUS_CONFIG[Number(statusUpdate)]?.label || statusUpdate;
        const result = await Swal.fire({
          title: "ยืนยันการบันทึกความคืบหน้า",
          text: `เปลี่ยนสถานะเป็น "${nextLabel}" ใช่หรือไม่?`,
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "ยืนยัน",
          cancelButtonText: "ยกเลิก",
          customClass: { popup: 'rounded-[2rem]', confirmButton: 'px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold mx-2 shadow-lg shadow-green-500/30 transition-all', cancelButton: 'px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold mx-2 shadow-lg shadow-red-500/30 transition-all' },
          buttonsStyling: false
        });
        if (!result.isConfirmed) return;
      }
    }

    setIsUpdating(true);
    setMsg({ type: "", title: "", text: "" });

    const payload = customData || {
      status: Number(statusUpdate),
      priority: Number(priorityUpdate),
      note: noteUpdate,
      attachment: attachment || null,
      assignedStaffId: assignedStaffId || undefined
    };

    const id = (params as any).id;
    if (!id) return;

    const res = await fetch(`/api/complaints/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setNoteUpdate("");
      setAttachment("");
      setFileNames([]);
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
    const id = (params as any).id;
    if (!id) return;
    const res = await fetch(`/api/complaints/${id}`, { method: "DELETE" });
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
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-0.5">Reference ID</h2>
            <p className="text-sm font-mono text-slate-600 font-bold">{complaint.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 pr-2">
          {/* Only Operators and Admins can assign/reject at intake phase (status 0) */}
          {((session?.user as any)?.role >= 2 && complaint.status === 0) && (
            <div className="flex gap-2">
              <button 
                onClick={async () => {
                  const result = await Swal.fire({ title: "คุณต้องการปฏิเสธคำร้องนี้ใช่หรือไม่?", icon: "warning", showCancelButton: true, confirmButtonText: "ยืนยัน", cancelButtonText: "ยกเลิก", customClass: { popup: 'rounded-[2rem]', confirmButton: 'px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold mx-2 shadow-lg shadow-green-500/30 transition-all', cancelButton: 'px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold mx-2 shadow-lg shadow-red-500/30 transition-all' }, buttonsStyling: false });
                  if (result.isConfirmed) {
                    handleUpdate(undefined, { status: 4, note: "คำร้องถูกปฏิเสธโดยผู้ดำเนินการ" });
                  }
                }}
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

          {/* Re-assignment: Only for Operators/Admins if already assigned and not closed */}
          {((session?.user as any)?.role >= 2 && complaint.status > 0 && complaint.status < 3) && (
            <button 
              onClick={() => setShowAssignModal(true)}
              className="px-6 py-3 bg-white text-indigo-600 font-black rounded-2xl border border-indigo-100 hover:bg-indigo-50 transition-all text-[10px] uppercase tracking-widest active:scale-95"
            >
              Re-assign Case
            </button>
          )}

          {complaint.assignedStaffId && (
            <div className={`px-6 py-3 ${isAssignedToMe ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-50 text-slate-500 border-slate-200'} border rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3`}>
               <div className={`w-2 h-2 rounded-full ${isAssignedToMe ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`} />
               {isAssignedToMe ? "คุณเป็นผู้ดูแลเคสนี้" : `ดูแลโดย: ${complaint.assignedStaff?.name}`}
            </div>
          )}
          
          {(session?.user as any)?.role >= 3 && (
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

      {/* Assignment Modal System */}
      {showAssignModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center">
          {/* Layer 1: Permanent Full-Screen Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setShowAssignModal(false)}
          />
          
          {/* Layer 2: Independent Scroll Container */}
          <div 
            className="fixed inset-0 z-[1001] overflow-y-auto flex justify-center p-4 py-12 md:py-24"
            onClick={() => setShowAssignModal(false)}
          >
            <div 
              className="relative bg-white rounded-[2.5rem] w-full max-w-lg shadow-[0_30px_100px_-20px_rgba(0,0,0,0.5)] p-8 md:p-10 my-auto animate-in zoom-in-95 duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header with Close Button top right */}
              <div className="flex items-start justify-between mb-10">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 bg-slate-50 text-slate-600 rounded-2xl flex items-center justify-center text-3xl shadow-sm border border-slate-100">🛡️</div>
                  <div>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tight">มอบหมายงาน</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1 ml-0.5">Case Assignment Control</p>
                  </div>
                </div>
                <button onClick={() => setShowAssignModal(false)} className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-400 rounded-xl transition-all border border-slate-100">
                  <span className="text-[10px] font-black uppercase tracking-widest">ปิดหน้านี้</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>
               
               <div className="space-y-8">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest ml-1">ระดับความเร่งด่วน</label>
                     <div className="relative">
                       <select 
                         value={priorityUpdate} 
                         onChange={(e) => setPriorityUpdate(e.target.value)}
                         className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-600 focus:outline-none focus:ring-4 focus:ring-slate-100 transition-all appearance-none text-sm"
                       >
                         {Object.entries(PRIORITY_CONFIG).map(([v, {label}]) => <option key={v} value={v}>{label}</option>)}
                       </select>
                       <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]">▼</div>
                     </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest ml-1">กรองตามคณะ</label>
                     <div className="relative">
                       <select 
                         value={facultyFilter}
                         onChange={(e) => {
                           setFacultyFilter(e.target.value);
                           setAssignedStaffId(""); // Reset staff when filter changes
                         }}
                         className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-600 focus:outline-none focus:ring-4 focus:ring-slate-100 transition-all appearance-none text-sm"
                       >
                         <option value="">ทั้งหมด</option>
                         {Array.from(new Set(staffList.map(s => s.faculty))).filter(Boolean).sort().map(f => (
                           <option key={f} value={f}>{f}</option>
                         ))}
                       </select>
                       <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]">▼</div>
                     </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest ml-1">มอบหมายให้เจ้าหน้าที่</label>
                     <div className="relative">
                       <select 
                         value={assignedStaffId} 
                         onChange={(e) => setAssignedStaffId(e.target.value)}
                         className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-600 focus:outline-none focus:ring-4 focus:ring-slate-100 transition-all appearance-none text-sm"
                       >
                         <option value="">เลือกเจ้าหน้าที่...</option>
                         {staffList
                           .filter(s => !facultyFilter || s.faculty === facultyFilter)
                           .map(s => (
                             <option key={s.id} value={s.id}>
                               {s.role === 2 ? '[OP] ' : ''}{s.name} ({s.major || s.faculty})
                             </option>
                           ))}
                       </select>
                       <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]">▼</div>
                     </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-6">
                     <button onClick={() => setShowAssignModal(false)} className="flex-1 py-4 bg-slate-50 text-slate-400 font-bold rounded-2xl hover:bg-slate-100 transition-all text-xs tracking-widest">ยกเลิกและย้อนกลับ</button>
                     <button 
                       onClick={async () => {
                         const staff = staffList.find(s => s.id === assignedStaffId);
                         const result = await Swal.fire({ title: `ยืนยันการมอบหมายงานให้ ${staff?.name} ใช่หรือไม่?`, icon: "question", showCancelButton: true, confirmButtonText: "ยืนยัน", cancelButtonText: "ยกเลิก", customClass: { popup: 'rounded-[2rem]', confirmButton: 'px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold mx-2 shadow-lg shadow-green-500/30 transition-all', cancelButton: 'px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold mx-2 shadow-lg shadow-red-500/30 transition-all' }, buttonsStyling: false });
                         if (result.isConfirmed) {
                           handleUpdate(undefined, { status: 1, priority: Number(priorityUpdate), assignedStaffId });
                           setShowAssignModal(false);
                         }
                       }}
                       disabled={!assignedStaffId}
                       className="flex-[2] py-4 bg-slate-900 text-white font-bold rounded-2xl transition-all text-xs tracking-widest shadow-xl shadow-slate-900/20 disabled:opacity-50 flex items-center justify-center gap-2"
                     >
                       <span>🛡️</span>
                       <span>ยืนยันและมอบหมายงาน</span>
                     </button>
                  </div>
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
              
              {complaint.attachment && parseAttachments(complaint.attachment).length > 0 && (
                <div className="mt-10 pt-10 border-t border-slate-200/50">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-3">
                     <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                     Evidence Files
                  </h4>
                  <div className="flex flex-wrap gap-4">
                    {parseAttachments(complaint.attachment).map((fileUrl: string, idx: number) => (
                      <div key={idx} className="p-3 bg-white rounded-3xl border border-slate-200 inline-block shadow-xl">
                        {isImage(fileUrl) ? (
                          <div className="relative group cursor-zoom-in" onClick={() => setZoomImage(fileUrl)}>
                            <img src={fileUrl} alt={`Evidence ${idx + 1}`} className="max-w-full w-48 object-cover rounded-2xl h-32 transition-transform group-hover:scale-[1.01]" />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-2xl flex items-center justify-center">
                              <span className="bg-white/95 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 shadow-2xl">Click to Zoom</span>
                            </div>
                          </div>
                        ) : (
                          <a href={fileUrl} download={`Evidence_${idx+1}`} className="px-10 py-6 flex flex-col items-center gap-4 text-indigo-600 font-black hover:bg-indigo-50 rounded-2xl transition-all uppercase tracking-widest text-[10px]">
                            <span className="text-4xl">📄</span>
                            <span>Download {idx+1}</span>
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {/* ผลการประเมินจากนักศึกษา (แสดงให้เจ้าหน้าที่เห็นเมื่อมีการประเมินแล้ว) */}
            {complaint.evaluation && (
              <div className="bg-white rounded-[2.5rem] border border-amber-100 p-10 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-10 opacity-10 transform scale-150 group-hover:scale-[1.8] transition-transform duration-700">⭐</div>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 bg-amber-400 text-white rounded-2xl flex items-center justify-center text-3xl shadow-lg shadow-amber-400/20">⭐</div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight">ผลการประเมินจากนักศึกษา</h3>
                    <p className="text-xs font-bold text-amber-600 uppercase tracking-widest">Student Satisfaction Score</p>
                  </div>
                </div>

                <div className="bg-amber-50/50 rounded-[2rem] p-8 border border-amber-100/50 text-center">
                  <div className="flex justify-center gap-2 mb-4">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <svg
                        key={s}
                        className={`w-10 h-10 ${s <= complaint.evaluation.score ? "text-amber-400" : "text-slate-200"}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="font-black text-slate-800 text-xl mb-2">
                    {["", "แย่มาก", "แย่", "ปานกลาง", "ดี", "ดีมาก"][complaint.evaluation.score]}
                  </p>
                  {complaint.evaluation.comment && (
                    <div className="p-4 bg-white/80 rounded-2xl italic text-slate-500 text-sm border border-slate-100 max-w-md mx-auto">
                      "{complaint.evaluation.comment}"
                    </div>
                  )}
                </div>
              </div>
            )}
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
                <p className="text-slate-400 font-black uppercase tracking-widest text-[9px] mb-4">Current Handler / Assignee</p>
                {complaint.assignedStaff ? (
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center font-black text-2xl shadow-inner">
                      {complaint.assignedStaff.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-black text-slate-900 text-lg tracking-tight">{complaint.assignedStaff.name}</p>
                      <p className="text-emerald-600 font-black text-[9px] uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded-md inline-block mt-1">
                        {complaint.assignedStaff.role === 2 ? "Operator" : "Assigned Staff"}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-4 text-slate-300">
                    <div className="w-14 h-14 bg-slate-50 border border-slate-100 border-dashed rounded-2xl flex items-center justify-center text-3xl">❓</div>
                    <div>
                      <p className="font-black text-slate-400">Unassigned</p>
                      <p className="text-[10px] font-bold uppercase tracking-widest">Awaiting action</p>
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

              <div className="p-8 bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <p className="text-slate-400 font-black uppercase tracking-widest text-[9px] mb-4">Organization Scope</p>
                <div className="space-y-4">
                  <p className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-black uppercase tracking-widest">Assigned Unit</span>
                    <span className="text-slate-900 font-black">{complaint.assignedStaff?.major || complaint.assignedStaff?.faculty || "-"}</span>
                  </p>
                  <p className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-black uppercase tracking-widest">Last Updated</span>
                    <span className="text-slate-900 font-black">{new Date(complaint.updatedAt).toLocaleDateString("th-TH")}</span>
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
            <h3 className="text-2xl font-black text-slate-800 mb-10 flex items-center gap-4">
              <span className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">💬</span> 
              Conversation History
            </h3>
            
            {(!complaint.histories || complaint.histories.length === 0) ? (
              <div className="py-24 text-center bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
                <p className="text-5xl mb-6 grayscale opacity-20">📭</p>
                <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-xs">ยังไม่มีข้อมูลการดำเนินการในส่วนนี้</p>
              </div>
            ) : (
              <div className="space-y-8">
                {complaint.histories?.map((history: any) => {
                  const hStatus = STATUS_CONFIG[history.status] || { label: "Unknown", color: "text-slate-400" };
                  const isStaffAction = !!history.actionBy;
                  
                  return (
                    <div key={history.id} className={`flex ${isStaffAction ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] ${isStaffAction ? 'bg-indigo-600 text-white shadow-indigo-200/50' : 'bg-slate-50 border-slate-200 text-slate-800'} border rounded-[2.5rem] p-8 shadow-sm relative transition-all hover:shadow-lg`}>
                        <div className="flex items-center justify-between gap-6 mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black ${isStaffAction ? 'bg-white/20 text-white' : 'bg-indigo-600 text-white'}`}>
                              {isStaffAction ? 'S' : 'U'}
                            </div>
                            <span className={`text-[11px] font-black uppercase tracking-[0.15em] ${isStaffAction ? 'text-indigo-100' : 'text-indigo-600'}`}>
                              {isStaffAction ? (history.actionBy.id === (session?.user as any).id ? 'You (Staff)' : history.actionBy.name) : 'Student'}
                            </span>
                          </div>
                          <span className={`text-[10px] font-bold ${isStaffAction ? 'text-white/40' : 'text-slate-400'}`}>
                            {new Date(history.createdAt).toLocaleString("th-TH")}
                          </span>
                        </div>
                        <p className="text-base font-bold leading-relaxed whitespace-pre-wrap">
                          {history.note || `Changed status to ${hStatus.label}`}
                        </p>
                        {history.attachment && parseAttachments(history.attachment).length > 0 && (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {parseAttachments(history.attachment).map((fileUrl: string, idx: number) => (
                              <div key={idx} className="relative group cursor-zoom-in" onClick={() => setZoomImage(fileUrl)}>
                                {isImage(fileUrl) ? (
                                  <img src={fileUrl} alt={`Staff Evidence ${idx + 1}`} className={`w-20 h-20 object-cover rounded-xl border ${isStaffAction ? 'border-white/20' : 'border-slate-200'} shadow-sm transition-transform hover:scale-105`} />
                                ) : (
                                  <a href={fileUrl} download={`Staff_Evidence_${idx+1}`} className={`w-20 h-20 ${isStaffAction ? 'bg-white/10 border border-white/20 text-white hover:bg-white/20' : 'bg-white border border-slate-200 text-indigo-600 hover:bg-indigo-50'} rounded-xl flex flex-col items-center justify-center transition-colors`}>
                                    <span className="text-2xl">📄</span>
                                  </a>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                        <div className={`mt-6 pt-4 border-t ${isStaffAction ? 'border-white/10' : 'border-black/5'}`}>
                          <span className={`text-[10px] font-black uppercase tracking-widest ${isStaffAction ? 'text-white/60' : hStatus.color}`}>
                            Phase: {hStatus.label}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Reply Interface for Staff */}
            {complaint.status < 3 && (
              <div className="mt-12 pt-12 border-t border-slate-100">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center text-xl shadow-sm">✍️</div>
                  <h4 className="text-base font-black text-slate-800 uppercase tracking-widest">ส่งข้อความโต้ตอบนักศึกษา</h4>
                </div>
                <form 
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const form = e.target as HTMLFormElement;
                    const note = (form.elements.namedItem("note") as HTMLTextAreaElement).value;
                    if (!note.trim()) return;

                    const result = await Swal.fire({
                      title: "ยืนยันการส่งข้อความตอบโต้นักศึกษา?",
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
                      fetchComplaint();
                    }
                  }}
                  className="space-y-6"
                >
                  <textarea
                    name="note"
                    placeholder="เขียนข้อความเพื่อสอบถามข้อมูลเพิ่มเติม หรือแจ้งรายละเอียดให้นักศึกษาทราบ..."
                    className="w-full px-8 py-7 bg-slate-50 border border-slate-200 rounded-[2.5rem] focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-base resize-none shadow-inner"
                    rows={4}
                    required
                  />
                  <div className="flex justify-end">
                    <button 
                      type="submit"
                      className="px-12 py-5 bg-indigo-600 text-white font-black rounded-3xl shadow-2xl shadow-indigo-600/30 hover:bg-indigo-700 hover:-translate-y-1 transition-all text-xs uppercase tracking-[0.2em] flex items-center gap-3 group"
                    >
                      <span>Send Reply</span>
                      <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-8">
          {/* Show Update Progress only if assigned to me and NOT already in evaluation/finished phase, OR if Admin/Operator */}
          {((isAssignedToMe && complaint.status < 2) || (session?.user as any)?.role >= 2) && complaint.status < 3 && (
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
                  {Object.entries(STATUS_CONFIG)
                    .filter(([val]) => {
                      const role = (session?.user as any)?.role;
                      // Use String() to be safe with types
                      if (String(role) === "1") return ["1", "2", "4"].includes(val);
                      return true;
                    })
                    .map(([val, { label }]) => (
                      <option key={val} value={val} className="bg-slate-900">{label}</option>
                    ))}
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Adjust Priority</label>
                <select
                  value={priorityUpdate}
                  onChange={(e) => setPriorityUpdate(e.target.value)}
                  disabled={(session?.user as any)?.role < 2}
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
                    <input type="file" accept=".pdf,image/*" multiple onChange={handleFileChange} className="hidden" />
                  </label>
                  <div className="flex flex-col gap-1 overflow-hidden">
                    {fileNames.length > 0 ? fileNames.map((name, i) => (
                      <span key={i} className="text-[10px] text-emerald-400 font-bold truncate">✅ {name}</span>
                    )) : (
                      <span className="text-[10px] text-slate-400 font-bold">No file selected (Max 5MB/file)</span>
                    )}
                  </div>
                </div>
                {attachment && (
                  <button
                    type="button"
                    onClick={() => { setAttachment(""); setFileNames([]); }}
                    className="mt-3 px-4 py-2 bg-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-red-500/30 transition-colors flex items-center gap-2"
                  >
                    <span>🗑️</span> Remove All Attachments
                  </button>
                )}
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
