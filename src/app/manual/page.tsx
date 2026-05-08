"use client";
import React from "react";
import Link from "next/link";

export default function ManualPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      {/* Header */}
      <header className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-6 max-w-4xl relative">
          <Link href="/" className="inline-flex items-center text-slate-400 hover:text-white transition-colors mb-6 text-sm font-bold uppercase tracking-widest">
            ← กลับสู่หน้าหลัก
          </Link>
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">คู่มือและระเบียบการ</h1>
              <p className="text-slate-400">ระบบรับข้อร้องเรียนนักศึกษา RMUTI Care</p>
            </div>
            <button 
              onClick={() => window.print()}
              className="hidden md:flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-black text-sm uppercase tracking-widest transition-all print:hidden shadow-lg shadow-indigo-600/30"
            >
              <span>🖨️</span> บันทึกเป็น PDF
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 max-w-4xl mt-12 space-y-16 print:mt-8 print:space-y-8">
        
        {/* Section 1: Rules */}
        <section className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-200 print:shadow-none print:border-none print:p-0">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center text-3xl">⚖️</div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">ระเบียบการใช้งานระบบ (สำหรับนักศึกษา)</h2>
          </div>
          
          <div className="space-y-8 text-slate-600 leading-relaxed">
            <div className="space-y-2">
              <div className="font-black text-slate-900">1. ข้อมูลการลงทะเบียน:</div>
              <p>นักศึกษาต้องใช้รหัสนักศึกษา 13 หลัก (สามารถใช้ตัวเลขและเครื่องหมาย - รวมกันได้ เช่น <span className="text-orange-600 font-bold">67000000000-0</span>) ในการลงทะเบียนเข้าสู่ระบบ</p>
            </div>

            <div className="space-y-2">
              <div className="font-black text-slate-900">2. การแก้ไขข้อมูล:</div>
              <p>นักศึกษาสามารถแก้ไขข้อมูลส่วนตัวและรหัสผ่านได้ด้วยตนเองผ่านระบบ แต่จะไม่สามารถแก้ไข <span className="text-red-600 font-bold">"รหัสนักศึกษา"</span> ได้ หลังจากลงทะเบียนสำเร็จแล้ว</p>
            </div>

            <div className="space-y-2">
              <div className="font-black text-slate-900">3. การปกปิดตัวตน:</div>
              <p>นักศึกษาสามารถเลือกใช้งานฟังก์ชัน "การร้องเรียนแบบไม่ระบุตัวตน" ได้ หากไม่ต้องการเปิดเผยข้อมูลส่วนบุคคลให้ผู้รับผิดชอบทราบ ข้อมูลส่วนตัวจะถูกซ่อนไว้ในกระบวนการพิจารณา</p>
            </div>

            <div className="space-y-2">
              <div className="font-black text-slate-900">4. การกรอกข้อมูลข้อร้องเรียน:</div>
              <p>นักศึกษาต้องกรอกข้อมูลที่จำเป็นให้ครบถ้วน โดยเฉพาะประเภทข้อร้องเรียนและรายละเอียดของปัญหา เพื่อให้เจ้าหน้าที่เข้าใจและดำเนินการแก้ไขได้อย่างมีประสิทธิภาพ</p>
            </div>

            <div className="space-y-2">
              <div className="font-black text-slate-900">5. การแนบไฟล์หลักฐาน:</div>
              <p>ระบบรองรับการแนบไฟล์หลักฐานเพื่อประกอบการพิจารณา โดยรองรับไฟล์ประเภทภาพ ได้แก่ <code className="bg-slate-100 px-2 py-1 rounded text-xs font-bold text-slate-800 uppercase">jpg, jpeg, png, และ gif</code></p>
            </div>
            
            <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
              <div className="font-black text-slate-900 mb-6 flex items-center gap-2">
                <span className="w-2 h-6 bg-orange-500 rounded-full"></span>
                6. สถานะของข้อร้องเรียน (ติดตามได้ตลอดเวลา):
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                  <span className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center font-black">0</span>
                  <span className="font-bold">รอพิจารณา</span>
                </div>
                <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                  <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center font-black">1</span>
                  <span className="font-bold">กำลังดำเนินการ</span>
                </div>
                <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                  <span className="w-8 h-8 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center font-black">2</span>
                  <span className="font-bold">รอประเมินผลความพึงพอใจ</span>
                </div>
                <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                  <span className="w-8 h-8 rounded-lg bg-green-50 text-green-500 flex items-center justify-center font-black">3</span>
                  <span className="font-bold">เสร็จสิ้น</span>
                </div>
                <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-100 shadow-sm sm:col-span-2">
                  <span className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center font-black">4</span>
                  <span className="font-bold">ปฏิเสธคำร้อง / ยกเลิกคำร้อง</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4 items-center bg-indigo-50 text-indigo-700 p-8 rounded-[2rem] border border-indigo-100/50">
              <div className="text-4xl">📧</div>
              <div className="text-sm">
                <strong className="block text-base mb-1">การแจ้งเตือนแบบ Real-time:</strong>
                ระบบจะมีการส่งข้อความแจ้งเตือนความคืบหน้าของข้อร้องเรียนไปยังอีเมลที่นักศึกษาได้ลงทะเบียนไว้ทันทีเมื่อมีการอัปเดตสถานะ
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Manual */}
        <section className="bg-slate-900 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden print:bg-white print:text-slate-900 print:shadow-none print:border print:p-0">
          <div className="absolute top-0 right-0 p-12 opacity-10 text-9xl transform rotate-12 pointer-events-none">📖</div>
          
          <div className="flex items-center gap-4 mb-12 relative z-10">
            <div className="w-16 h-16 bg-white/10 text-white rounded-2xl flex items-center justify-center text-3xl backdrop-blur-xl border border-white/20 shadow-inner">📖</div>
            <h2 className="text-3xl font-black text-white tracking-tight print:text-slate-900">ขั้นตอนการแจ้งเรื่องร้องเรียน</h2>
          </div>

          <div className="space-y-16 relative z-10">
            {/* Step 1 */}
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-14 h-14 bg-indigo-500 text-white rounded-2xl flex items-center justify-center text-2xl font-black shrink-0 shadow-xl shadow-indigo-500/20">1</div>
              <div className="flex-1">
                <h3 className="text-xl font-black text-white mb-3 print:text-slate-900 uppercase tracking-tight">เข้าสู่ระบบ / ลงทะเบียน</h3>
                <p className="text-slate-400 print:text-slate-600 leading-relaxed">
                  นักศึกษาเข้าสู่ระบบด้วยรหัสนักศึกษาและรหัสผ่าน หากยังไม่มีบัญชีให้ลงทะเบียนใหม่โดยใช้รหัส 13 หลัก ตัวอย่างเช่น <code className="text-orange-400 bg-white/5 px-2 py-1 rounded">67000000000-0</code>
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-14 h-14 bg-orange-500 text-white rounded-2xl flex items-center justify-center text-2xl font-black shrink-0 shadow-xl shadow-orange-500/20">2</div>
              <div className="flex-1">
                <h3 className="text-xl font-black text-white mb-3 print:text-slate-900 uppercase tracking-tight">ยื่นเรื่องร้องเรียน</h3>
                <p className="text-slate-400 print:text-slate-600 leading-relaxed">
                  กดปุ่ม <span className="text-white font-bold">"ยื่นเรื่องร้องเรียนใหม่"</span> เลือกหมวดหมู่ที่ต้องการ (เช่น สวัสดิการ, อาคารสถานที่, การเรียน) กรอกรายละเอียด และสามารถเลือก "ปกปิดตัวตน" ได้ในขั้นตอนนี้
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-14 h-14 bg-blue-500 text-white rounded-2xl flex items-center justify-center text-2xl font-black shrink-0 shadow-xl shadow-blue-500/20">3</div>
              <div className="flex-1">
                <h3 className="text-xl font-black text-white mb-3 print:text-slate-900 uppercase tracking-tight">แนบหลักฐาน</h3>
                <p className="text-slate-400 print:text-slate-600 leading-relaxed">
                  ถ่ายภาพหรือแนบไฟล์หลักฐานที่เกี่ยวข้องเพื่อให้เจ้าหน้าที่ตรวจสอบได้รวดเร็วขึ้น ระบบรองรับไฟล์ภาพหลายประเภท
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-14 h-14 bg-amber-500 text-white rounded-2xl flex items-center justify-center text-2xl font-black shrink-0 shadow-xl shadow-amber-500/20">4</div>
              <div className="flex-1">
                <h3 className="text-xl font-black text-white mb-3 print:text-slate-900 uppercase tracking-tight">ติดตามสถานะ</h3>
                <p className="text-slate-400 print:text-slate-600 leading-relaxed">
                  ตรวจสอบสถานะได้ที่เมนู "ประวัติการร้องเรียน" หากเจ้าหน้าที่ต้องการข้อมูลเพิ่มเติม สามารถโต้ตอบผ่านระบบแชทในหน้ารายละเอียดคำร้องได้ทันที
                </p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-14 h-14 bg-green-500 text-white rounded-2xl flex items-center justify-center text-2xl font-black shrink-0 shadow-xl shadow-green-500/20">5</div>
              <div className="flex-1">
                <h3 className="text-xl font-black text-white mb-3 print:text-slate-900 uppercase tracking-tight">ประเมินผล</h3>
                <p className="text-slate-400 print:text-slate-600 leading-relaxed">
                  เมื่อเจ้าหน้าที่ดำเนินการเสร็จสิ้น สถานะจะเปลี่ยนเป็น "เสร็จสิ้น" นักศึกษาสามารถให้คะแนนความพึงพอใจเพื่อนำไปพัฒนาบริการต่อไป
                </p>
                <div className="mt-6 bg-white/5 border border-white/10 p-6 rounded-2xl">
                   <p className="text-xs font-black text-green-400 uppercase tracking-[0.2em] mb-4">Evaluation Rating</p>
                   <p className="text-[10px] text-green-600 font-bold uppercase tracking-widest pt-2">(5: ดีมาก, 4: ดี, 3: ปานกลาง, 2: น้อย, 1: ไม่พอใจ)</p>
                </div>
              </div>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
}
