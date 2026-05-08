"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";

export default function NotificationBell({ userType }: { userType: "student" | "staff" }) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      const data = await res.json();
      if (data.notifications) {
        setNotifications(data.notifications);
        
        // เช็คการแจ้งเตือนที่ยังไม่ได้อ่าน (จำลองด้วยการเทียบกับค่าใน LocalStorage)
        const lastRead = localStorage.getItem(`lastRead_${userType}`) || "0";
        const newCount = data.notifications.filter((n: any) => 
          new Date(n.createdAt).getTime() > Number(lastRead)
        ).length;
        setUnreadCount(newCount);
      }
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Refresh ทุกๆ 1 นาที
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen && notifications.length > 0) {
      // เมื่อเปิดดูแล้ว ให้เซ็ตค่าล่าสุดที่อ่านลง LocalStorage
      localStorage.setItem(`lastRead_${userType}`, new Date(notifications[0].createdAt).getTime().toString());
      setUnreadCount(0);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleOpen}
        className="p-2.5 rounded-xl hover:bg-white hover:shadow-lg hover:shadow-indigo-500/10 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all relative text-slate-500 hover:text-indigo-600 border border-transparent hover:border-slate-100"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white animate-bounce">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 bg-white rounded-[1.5rem] shadow-2xl border border-slate-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
            <h4 className="font-black text-slate-800 text-xs uppercase tracking-widest">การแจ้งเตือน</h4>
            <span className="text-[10px] font-bold text-slate-400">{notifications.length} รายการล่าสุด</span>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-2xl mb-2 grayscale opacity-20">🔔</p>
                <p className="text-xs font-bold text-slate-400">ยังไม่มีการแจ้งเตือนใหม่</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {notifications.map((n) => (
                  <Link
                    key={n.id}
                    href={userType === "student" ? `/student/complaints/${n.complaint.id}` : `/admin/complaints/${n.complaint.id}`}
                    onClick={() => setIsOpen(false)}
                    className="block p-4 hover:bg-slate-50 transition-colors group"
                  >
                    <p className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-indigo-600">
                      {n.isNewCase ? "🔔 มีเคสใหม่:" : "📝 อัปเดตสถานะ:"} {n.complaint.title}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">
                      {n.note || "มีการอัปเดตข้อมูลในคำร้องของคุณ"}
                    </p>
                    <p className="text-[9px] text-slate-300 mt-2 uppercase font-bold tracking-tighter">
                      {new Date(n.createdAt).toLocaleString("th-TH")}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>
          
          <Link
            href={userType === "student" ? "/student/complaints" : "/admin/complaints"}
            onClick={() => setIsOpen(false)}
            className="block py-3 text-center text-[10px] font-black text-indigo-600 bg-slate-50 border-t border-slate-100 hover:bg-white transition-colors uppercase tracking-widest"
          >
            ดูทั้งหมด
          </Link>
        </div>
      )}
    </div>
  );
}
