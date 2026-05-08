"use client";
import React from "react";
import Link from "next/link";

export default function AdminManualPage() {
  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-500 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-slate-900 rounded-[3rem] p-10 md:p-16 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-10 opacity-5 text-9xl transform rotate-12 pointer-events-none">📖</div>
        <div className="relative z-10">
          <Link href="/admin/dashboard" className="inline-flex items-center text-slate-400 hover:text-white transition-colors mb-6 text-sm font-bold uppercase tracking-widest">
            ← กลับสู่หน้าหลัก
          </Link>
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">คู่มือการปฏิบัติงานสำหรับเจ้าหน้าที่</h1>
          <p className="text-slate-400 font-medium max-w-2xl text-lg">
            แนวทางและขั้นตอนการจัดการข้อร้องเรียนสำหรับเจ้าหน้าที่และอาจารย์ที่ปรึกษา เพื่อให้การแก้ไขปัญหาเป็นไปอย่างรวดเร็วและมีประสิทธิภาพ
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-12">
        {/* Step 1 */}
        <section className="bg-white rounded-[2.5rem] border border-slate-200 p-8 md:p-12 shadow-sm">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-3xl">📥</div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">1. การรับเรื่องและตรวจสอบงานที่ได้รับมอบหมาย</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="space-y-6 text-slate-600 leading-relaxed">
              <p>
                เมื่อมีข้อร้องเรียนใหม่ที่เกี่ยวข้องกับสาขาวิชาของคุณ แอดมินส่วนกลางจะทำการคัดกรองและส่งมอบงานมายัง <strong className="text-slate-800">"งานที่ได้รับมอบหมาย" (My Assignments)</strong> ของคุณ
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="text-indigo-500 mt-1">✓</span>
                  <span>ตรวจสอบรายการใหม่ได้จากหน้า Dashboard หรือเมนูด้านซ้าย</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-indigo-500 mt-1">✓</span>
                  <span>ข้อร้องเรียนที่ยังไม่เริ่มดำเนินการจะอยู่ในสถานะ <strong>"ยื่นคำร้อง" (Phase 0)</strong></span>
                </li>
              </ul>
            </div>
            
            {/* CSS Mockup of Dashboard Assignment */}
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 shadow-inner transform rotate-1 hover:rotate-0 transition-transform">
              <div className="flex items-center justify-between mb-4">
                <div className="text-xs font-black text-slate-800">MY ASSIGNMENTS</div>
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-bold text-sm">น้ำรั่วที่อาคารเรียน 3</div>
                  <span className="px-2 py-1 bg-slate-100 text-[10px] font-bold rounded-lg text-slate-500">รอพิจารณา</span>
                </div>
                <div className="text-[10px] text-slate-400">หมวดหมู่: อาคารสถานที่ • โดย: นักศึกษาปกปิดตัวตน</div>
              </div>
            </div>
          </div>
        </section>

        {/* Step 2 */}
        <section className="bg-white rounded-[2.5rem] border border-slate-200 p-8 md:p-12 shadow-sm">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-3xl">⚙️</div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">2. การอัปเดตสถานะและดำเนินการ</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-10 items-center">
            {/* CSS Mockup of Status Update */}
            <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl order-2 md:order-1 transform -rotate-1 hover:rotate-0 transition-transform">
              <div className="text-xs font-black text-slate-400 mb-4 uppercase tracking-widest">Update Status</div>
              <div className="space-y-3">
                <div className="bg-white/10 border border-white/20 p-3 rounded-xl flex items-center justify-between">
                  <span className="text-white text-sm font-bold">รับเรื่องและกำลังดำเนินการ</span>
                  <span className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white"></span>
                </div>
                <div className="bg-white/5 border border-white/10 p-3 rounded-xl flex items-center justify-between opacity-50">
                  <span className="text-white text-sm font-bold">ดำเนินการเสร็จสิ้น (รอประเมิน)</span>
                  <span className="w-4 h-4 rounded-full border-2 border-slate-500"></span>
                </div>
              </div>
              <button className="w-full mt-4 bg-indigo-600 text-white text-xs font-bold py-3 rounded-xl">บันทึกการเปลี่ยนแปลง</button>
            </div>

            <div className="space-y-6 text-slate-600 leading-relaxed order-1 md:order-2">
              <p>
                เมื่อคุณเริ่มเข้าไปตรวจสอบหรือส่งเรื่องต่อให้หน่วยงานที่เกี่ยวข้อง ให้กดเปลี่ยนสถานะเป็น <strong className="text-blue-600">"กำลังดำเนินการ" (Phase 1)</strong> เพื่อให้นักศึกษาทราบว่าเรื่องถึงมือเจ้าหน้าที่แล้ว
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="text-blue-500 mt-1">✓</span>
                  <span>ระบบจะส่งอีเมลแจ้งเตือนนักศึกษาโดยอัตโนมัติเมื่อมีการเปลี่ยนสถานะ</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-500 mt-1">✓</span>
                  <span>คุณสามารถพิมพ์ข้อความโต้ตอบหรือขอข้อมูลเพิ่มเติมจากนักศึกษาได้ในกล่องแชทของข้อร้องเรียนนั้น</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Step 3 */}
        <section className="bg-white rounded-[2.5rem] border border-slate-200 p-8 md:p-12 shadow-sm">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center text-3xl">✅</div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">3. การปิดงานและการรอประเมินผล</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="space-y-6 text-slate-600 leading-relaxed">
              <p>
                เมื่อดำเนินการแก้ไขปัญหาเสร็จสิ้น ให้เปลี่ยนสถานะเป็น <strong className="text-amber-600">"รอประเมิน" (Phase 2)</strong> นักศึกษาจะได้รับแจ้งเตือนให้เข้ามาประเมินผลการทำงาน
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>เมื่อนักศึกษาประเมินผลเสร็จสิ้น สถานะจะถูกปรับเป็น <strong>"เสร็จสิ้น" (Phase 3)</strong> โดยอัตโนมัติ</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>หากพบว่าข้อร้องเรียนเป็นเท็จหรือซ้ำซ้อน คุณสามารถปรับสถานะเป็น <strong>"ปฏิเสธ" (Phase 4)</strong> ได้ โดยต้องระบุเหตุผลให้ชัดเจน</span>
                </li>
              </ul>
            </div>

            {/* Evaluation Info Box */}
            <div className="bg-green-50 p-8 rounded-3xl border border-green-100 text-center">
               <div className="text-5xl mb-4">⭐</div>
               <div className="text-green-800 font-black text-xl mb-2">คะแนนการประเมิน</div>
               <p className="text-green-600/80 text-sm">
                 ผลคะแนนทั้งหมดจะถูกรวบรวมไว้ในรายงานสถิติ เพื่อนำไปใช้เป็นตัวชี้วัดคุณภาพการให้บริการของสาขาวิชาและคณะ
               </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-slate-50 rounded-[2.5rem] p-8 md:p-12">
          <h2 className="text-xl font-black text-slate-800 mb-6 text-center uppercase tracking-widest">คำถามที่พบบ่อย (FAQ)</h2>
          <div className="space-y-4 max-w-3xl mx-auto">
             <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
               <div className="font-bold text-slate-800 mb-2">Q: หากข้อร้องเรียนไม่เกี่ยวข้องกับสาขาของตนเอง ต้องทำอย่างไร?</div>
               <div className="text-slate-600 text-sm">A: ให้แจ้งในช่องแชทของข้อร้องเรียนนั้น เพื่อให้แอดมินส่วนกลางทราบ และทำการโอนย้ายความรับผิดชอบ (Re-assign) ไปยังผู้ที่เกี่ยวข้องต่อไป</div>
             </div>
             <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
               <div className="font-bold text-slate-800 mb-2">Q: สามารถดูข้อมูลนักศึกษาที่ "ปกปิดตัวตน" ได้หรือไม่?</div>
               <div className="text-slate-600 text-sm">A: ไม่ได้ ระบบออกแบบมาให้ซ่อนข้อมูลส่วนตัวของนักศึกษาอย่างสมบูรณ์เพื่อความปลอดภัย อย่างไรก็ตาม เจ้าหน้าที่ยังคงสามารถติดต่อผ่านช่องแชทในระบบได้ตามปกติ</div>
             </div>
          </div>
        </section>

      </div>
    </div>
  );
}
