"use client";
import React from "react";
import Link from "next/link";

export default function StudentManualPage() {
  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-500 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-slate-900 rounded-[3rem] p-10 md:p-16 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-10 opacity-5 text-9xl transform rotate-12 pointer-events-none">📖</div>
        <div className="relative z-10">
          <Link href="/student/dashboard" className="inline-flex items-center text-slate-400 hover:text-white transition-colors mb-6 text-sm font-bold uppercase tracking-widest">
            ← กลับสู่หน้าหลัก
          </Link>
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">คู่มือและระเบียบการใช้งาน</h1>
          <p className="text-slate-400 font-medium max-w-2xl text-lg">
            แนวทาง ขั้นตอน และระเบียบปฏิบัติในการแจ้งเรื่องร้องเรียนผ่านระบบ RMUTI Care เพื่อรักษาสิทธิและแก้ไขปัญหาของคุณอย่างเป็นระบบ
          </p>
        </div>
      </div>

      {/* Rules Section */}
      <section className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-200">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center text-3xl">⚖️</div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">ระเบียบการใช้งานระบบ</h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 text-slate-600 leading-relaxed">
          <div className="space-y-6">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <div className="font-black text-slate-900 mb-2">1. ข้อมูลการลงทะเบียน</div>
              <p className="text-sm">ต้องใช้รหัสนักศึกษา 13 หลักที่ถูกต้องเท่านั้น เพื่อความถูกต้องในการประสานงานกับหน่วยงานต้นสังกัด</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <div className="font-black text-slate-900 mb-2">2. การปกปิดตัวตน</div>
              <p className="text-sm">คุณสามารถเลือก "ไม่ระบุตัวตน" ได้ ระบบจะซ่อนชื่อและข้อมูลติดต่อของคุณจากเจ้าหน้าที่ แต่คุณยังสื่อสารผ่านแชทได้ปกติ</p>
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <div className="font-black text-slate-900 mb-2">3. ข้อมูลที่เป็นจริง</div>
              <p className="text-sm">การแจ้งข้อมูลต้องเป็นความจริงและไม่ใช้ถ้อยคำหยาบคาย ข้อมูลที่เป็นเท็จอาจส่งผลต่อการพิจารณาในอนาคต</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <div className="font-black text-slate-900 mb-2">4. การแจ้งเตือน</div>
              <p className="text-sm">ระบบจะส่งแจ้งเตือนผ่านอีเมลทุกครั้งที่มีการเปลี่ยนสถานะ โปรดตรวจสอบกล่องจดหมายของคุณอย่างสม่ำเสมอ</p>
            </div>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <div className="space-y-8">
        <h2 className="text-xl font-black text-slate-800 uppercase tracking-[0.2em] text-center py-4">5 ขั้นตอนการแจ้งเรื่อง</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            { step: 1, title: "เข้าสู่ระบบ", desc: "ด้วยรหัสนักศึกษา", color: "bg-indigo-500" },
            { step: 2, title: "ยื่นเรื่อง", desc: "เลือกหมวดหมู่ที่ชัดเจน", color: "bg-orange-500" },
            { step: 3, title: "แนบหลักฐาน", desc: "รูปถ่ายประกอบปัญหา", color: "bg-blue-500" },
            { step: 4, title: "ติดตามงาน", desc: "คุยกับเจ้าหน้าที่ผ่านแชท", color: "bg-amber-500" },
            { step: 5, title: "ประเมินผล", desc: "เมื่อได้รับคำตอบแล้ว", color: "bg-green-500" }
          ].map((item) => (
            <div key={item.step} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col items-center text-center group hover:border-indigo-200 transition-colors">
              <div className={`w-12 h-12 ${item.color} text-white rounded-xl flex items-center justify-center text-xl font-black mb-4 shadow-lg shadow-${item.color.split('-')[1]}-500/20`}>
                {item.step}
              </div>
              <div className="font-black text-slate-800 text-sm mb-1">{item.title}</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Status Guide */}
      <section className="bg-slate-900 rounded-[2.5rem] p-8 md:p-12 text-white overflow-hidden relative shadow-2xl">
        <div className="absolute bottom-0 right-0 p-10 opacity-10 text-9xl transform -rotate-12 pointer-events-none">📊</div>
        <h2 className="text-2xl font-black mb-8 relative z-10 tracking-tight">ความหมายของสถานะคำร้อง</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 relative z-10">
          {[
            { id: 0, label: "รอพิจารณา", color: "bg-slate-500", text: "เรื่องกำลังรอแอดมินส่งต่อ" },
            { id: 1, label: "ดำเนินการ", color: "bg-blue-500", text: "เจ้าหน้าที่รับเรื่องแล้ว" },
            { id: 2, label: "รอประเมิน", color: "bg-orange-500", text: "แก้ไขเสร็จแล้ว รอคุณยืนยัน" },
            { id: 3, label: "เสร็จสิ้น", color: "bg-green-500", text: "ปิดเรื่องสมบูรณ์" },
            { id: 4, label: "ปฏิเสธ", color: "bg-red-500", text: "ข้อมูลไม่ครบหรือยกเลิก" }
          ].map((status) => (
            <div key={status.id} className="bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-sm">
              <div className={`w-2 h-8 ${status.color} rounded-full mb-3`}></div>
              <div className="font-bold text-sm mb-1">{status.label}</div>
              <div className="text-[10px] text-slate-400">{status.text}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Download Section */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 bg-indigo-600 rounded-[2rem] p-8 text-white flex justify-between items-center group cursor-pointer hover:bg-indigo-500 transition-colors">
          <div>
            <div className="font-black text-xl mb-1">ดาวน์โหลดระเบียบการ (PDF)</div>
            <p className="text-indigo-200 text-sm">ประกาศมหาวิทยาลัยเทคโนโลยีราชมงคลอีสาน</p>
          </div>
          <div className="text-3xl group-hover:translate-y-1 transition-transform">📥</div>
        </div>
        <button 
          onClick={() => window.print()}
          className="flex-1 bg-white rounded-[2rem] p-8 border border-slate-200 text-slate-800 flex justify-between items-center hover:bg-slate-50 transition-colors font-black"
        >
          <div>
            <div className="text-xl mb-1 text-left">พิมพ์คู่มือนี้</div>
            <p className="text-slate-400 text-sm text-left font-normal">บันทึกเป็นไฟล์ไว้ดูภายหลัง</p>
          </div>
          <div className="text-3xl">🖨️</div>
        </button>
      </div>
    </div>
  );
}
