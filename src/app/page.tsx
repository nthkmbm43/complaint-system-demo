import React from "react";
import Link from "next/link";
import TutorialVideoPlayer from "@/components/TutorialVideoPlayer";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-orange-100 rounded-full blur-[120px] opacity-40"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[800px] h-[800px] bg-indigo-100 rounded-full blur-[150px] opacity-40"></div>
      </div>

      {/* Modern Header */}
      <header className="relative z-20 container mx-auto px-6 py-10 flex justify-between items-center">
        <div className="flex items-center gap-4 group">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg border border-slate-100 group-hover:scale-110 transition-transform">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://upload.wikimedia.org/wikipedia/th/thumb/a/a2/Logo_RMUTI.png/220px-Logo_RMUTI.png" alt="RMUTI Logo" className="w-10 h-10 object-contain" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black text-slate-800 tracking-tighter uppercase leading-none">RMUTI</span>
            <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest mt-1">Complaint System</span>
          </div>
        </div>
        <div className="hidden md:flex gap-10 text-xs font-black text-slate-500 uppercase tracking-widest">
          <a href="#news" className="hover:text-slate-900 transition-all">ข่าวสาร</a>
          <a href="#guide" className="hover:text-slate-900 transition-all">คู่มือการใช้งาน</a>
          <Link href="/admin/login" className="text-indigo-600 hover:text-indigo-800 transition-all flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-pulse"></span>
            สำหรับเจ้าหน้าที่
          </Link>
        </div>
        <Link href="/student/login">
          <button className="px-8 py-3.5 bg-slate-900 text-white font-black rounded-2xl shadow-xl shadow-slate-900/10 hover:bg-slate-800 hover:-translate-y-1 transition-all text-xs uppercase tracking-widest">
            เข้าสู่ระบบนักศึกษา
          </button>
        </Link>
      </header>

      {/* Hero Section: News & Info Focus */}
      <section className="relative z-10 container mx-auto px-6 pt-16 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-10 animate-in fade-in slide-in-from-left duration-700">
            <div className="inline-block px-4 py-2 bg-orange-500 text-white rounded-xl shadow-lg shadow-orange-500/20">
              <span className="text-xs font-black uppercase tracking-widest">Latest Update</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] tracking-tighter">
              ระบบร้องเรียนโฉมใหม่ <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">เพื่อคุณภาพชีวิตที่ดีกว่า</span>
            </h1>
            <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-xl">
              เราพร้อมรับฟังทุกปัญหาและข้อเสนอแนะของนักศึกษา เพื่อพัฒนาวิทยาเขตขอนแก่นให้เป็นพื้นที่แห่งการเรียนรู้ที่สมบูรณ์แบบที่สุด
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <Link href="/student/login" className="flex-grow max-w-xs">
                <button className="w-full px-10 py-5 bg-indigo-600 text-white font-black rounded-[1.8rem] shadow-2xl shadow-indigo-600/30 hover:bg-indigo-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 group">
                  <span>🚀 เริ่มต้นใช้งาน</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                </button>
              </Link>
              <Link href="/student/register" className="flex-grow max-w-xs">
                <button className="w-full px-10 py-5 bg-white text-slate-900 border-2 border-slate-200 font-black rounded-[1.8rem] hover:border-slate-400 hover:bg-slate-50 transition-all">
                  สมัครสมาชิกใหม่
                </button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6" id="news">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200 space-y-4 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center text-2xl">📢</div>
              <h4 className="font-black text-slate-800 uppercase tracking-tight">ประกาศสวัสดิการ</h4>
              <p className="text-sm text-slate-500 leading-relaxed">อัปเดตข้อมูลสวัสดิการและสิทธิประโยชน์ของนักศึกษาประจำปี 2026</p>
              <button className="text-[10px] font-black text-orange-600 uppercase tracking-widest hover:underline opacity-50 cursor-not-allowed">Coming Soon</button>
            </div>
            <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-xl space-y-4 hover:-translate-y-2 transition-all duration-500">
              <div className="w-12 h-12 bg-white/10 text-white rounded-2xl flex items-center justify-center text-2xl">🏢</div>
              <h4 className="font-black text-white uppercase tracking-tight">กิจกรรมคณะ</h4>
              <p className="text-sm text-slate-400 leading-relaxed">ตรวจสอบตารางกิจกรรมและพื้นที่การใช้งานของอาคารเรียนใหม่</p>
              <button className="text-[10px] font-black text-orange-400 uppercase tracking-widest hover:underline opacity-50 cursor-not-allowed">Coming Soon</button>
            </div>
            <div className="col-span-2 bg-indigo-600 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-10 opacity-10 transform scale-150 group-hover:scale-[1.8] transition-all duration-700 text-7xl">🛠️</div>
               <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
                 <div className="w-24 h-24 bg-white/10 rounded-3xl flex items-center justify-center text-4xl shadow-inner">👨‍💻</div>
                 <div className="flex-1 space-y-2 text-center md:text-left">
                   <h4 className="text-xl font-black text-white uppercase tracking-tight">ติดต่อฝ่ายพัฒนาซอฟต์แวร์</h4>
                   <p className="text-indigo-100/70 text-sm leading-relaxed">หากพบปัญหาการใช้งานระบบ หรือมีข้อเสนอแนะด้านเทคนิค สามารถติดต่อทีมงานได้โดยตรง</p>
                   <div className="pt-4">
                     <a href="mailto:support@rmuti.ac.th" className="inline-block px-6 py-3 bg-white text-indigo-600 font-black rounded-xl text-[10px] uppercase tracking-widest hover:bg-indigo-50 transition-colors">Contact Technical Support</a>
                   </div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comprehensive Manual & Regulations */}
      <section id="guide" className="bg-white py-32 border-y border-slate-100 overflow-hidden relative">
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-50/50 -skew-x-12 transform origin-top translate-x-20 pointer-events-none" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row justify-between items-end gap-8 mb-24">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-ping"></span>
                User Documentation
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none mb-8">
                คู่มือการใช้งาน <br />
                <span className="text-slate-400">& ระเบียบการร้องเรียน</span>
              </h2>
              <p className="text-lg text-slate-500 font-medium leading-relaxed">
                ทำความเข้าใจขั้นตอนการใช้งานและข้อกำหนดต่างๆ เพื่อสิทธิประโยชน์สูงสุดในการรับบริการ
              </p>
            </div>
            <div className="flex gap-4">
               <Link href="/manual" className="px-8 py-4 bg-slate-900 text-white font-black rounded-2xl shadow-xl hover:bg-slate-800 transition-all text-xs uppercase tracking-widest">
                 ดูฉบับเต็มทั้งหมด
               </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left: Video Player */}
            <div className="lg:col-span-7">
              <TutorialVideoPlayer />
            </div>

            {/* Right: Quick Rules & Documents */}
            <div className="lg:col-span-5 space-y-8">
              <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
                <div className="absolute top-0 right-0 p-8 text-7xl opacity-5 transform group-hover:scale-125 transition-transform duration-700">⚖️</div>
                <h4 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
                  <span className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-black shadow-lg">01</span>
                  ระเบียบการสำคัญ
                </h4>
                <ul className="space-y-5">
                  {[
                    "ใช้รหัสนักศึกษา 13 หลักในการเข้าใช้งาน",
                    "สามารถเลือกปกปิดตัวตน (Anonymous) ได้",
                    "แก้ไขข้อมูลหรือยกเลิกได้หากเรื่องยังไม่ถูกรับ",
                    "ระบบรักษาความลับข้อมูลส่วนบุคคลสูงสุด"
                  ].map((text, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-600 font-bold">
                      <span className="mt-2 w-1.5 h-1.5 bg-indigo-500 rounded-full shrink-0"></span>
                      {text}
                    </li>
                  ))}
                </ul>
                <div className="mt-12 pt-8 border-t border-slate-100">
                  <Link href="/manual" className="text-xs font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-700 transition-colors flex items-center gap-2 group/link">
                    อ่านระเบียบฉบับสมบูรณ์ 
                    <svg className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Link href="/manual" className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-2xl transition-all group">
                   <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center text-3xl mb-8 shadow-inner group-hover:rotate-6 transition-transform">📖</div>
                   <h5 className="font-black text-slate-900 uppercase tracking-tight text-base mb-1">คู่มือนักศึกษา</h5>
                   <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-10">USER GUIDE</p>
                   <span className="text-[10px] font-black text-slate-900 border-b-2 border-orange-500 pb-1">DOWNLOAD PDF</span>
                </Link>
                <Link href="/manual" className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-2xl transition-all group">
                   <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center text-3xl mb-8 shadow-inner group-hover:rotate-6 transition-transform">📄</div>
                   <h5 className="font-black text-slate-900 uppercase tracking-tight text-base mb-1">ระเบียบวินัย</h5>
                   <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-10">CODE OF CONDUCT</p>
                   <span className="text-[10px] font-black text-slate-900 border-b-2 border-indigo-500 pb-1">READ ONLINE</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-slate-900 text-white py-24">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-16 mb-20">
            <div className="max-w-md">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
                   {/* eslint-disable-next-line @next/next/no-img-element */}
                   <img src="https://upload.wikimedia.org/wikipedia/th/thumb/a/a2/Logo_RMUTI.png/220px-Logo_RMUTI.png" alt="RMUTI Logo" className="w-9 h-9 object-contain" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-black tracking-tighter uppercase leading-none">RMUTI</span>
                  <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest mt-1">Complaint System</span>
                </div>
              </div>
              <p className="text-slate-400 leading-relaxed font-medium">
                ศูนย์รับเรื่องร้องเรียนและบริการนักศึกษา มหาวิทยาลัยเทคโนโลยีราชมงคลอีสาน วิทยาเขตขอนแก่น มุ่งมั่นพัฒนาเพื่อสังคมที่ดีขึ้น
              </p>
              <div className="mt-10 flex gap-4">
                 <a href="#" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors">f</a>
                 <a href="#" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors">𝕏</a>
                 <a href="#" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors">🌐</a>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-20">
              <div className="space-y-6">
                <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500">Navigation</h5>
                <ul className="space-y-4 text-sm font-bold text-slate-400">
                  <li className="hover:text-white transition-colors"><Link href="/">หน้าหลัก</Link></li>
                  <li className="hover:text-white transition-colors"><a href="#news">ข่าวสารประกาศ</a></li>
                  <li className="hover:text-white transition-colors"><a href="#guide">คู่มือการใช้งาน</a></li>
                  <li className="hover:text-white transition-colors"><Link href="/student/login">แจ้งเรื่องร้องเรียน</Link></li>
                </ul>
              </div>
              <div className="space-y-6">
                <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500">Institutional</h5>
                <ul className="space-y-4 text-sm font-bold text-slate-400">
                  <li className="hover:text-white transition-colors"><a href="https://www.kkc.rmuti.ac.th" target="_blank">มหาวิทยาลัย</a></li>
                  <li className="hover:text-white transition-colors"><a href="https://student.kkc.rmuti.ac.th" target="_blank">กองพัฒนานักศึกษา</a></li>
                  <li className="hover:text-white transition-colors"><a href="mailto:admin@rmuti.ac.th">ติดต่อสอบถาม</a></li>
                  <li className="hover:text-indigo-400 transition-colors pt-4 border-t border-white/5">
                    <Link href="/admin/login" className="flex items-center gap-2">
                       <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
                       Staff Portal
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">© 2026 RMUTI Khon Kaen Campus. Digital Experience Portal v2.8</p>
            <div className="flex gap-8 text-[10px] font-black text-slate-500 uppercase tracking-widest">
              <span className="hover:text-white transition-all cursor-pointer">Privacy Policy</span>
              <span className="hover:text-white transition-all cursor-pointer">Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
