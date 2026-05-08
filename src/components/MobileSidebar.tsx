"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  href: string;
  label: string;
  icon: string;
}

interface SidebarProps {
  brand: { name: string; sub: string; color: string };
  navItems: NavItem[];
  bottomItems?: NavItem[];
  userInitial: string;
  userName: string;
}

export default function MobileSidebar({
  brand,
  navItems,
  bottomItems,
  userInitial,
  userName,
}: SidebarProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href.endsWith("dashboard")) return pathname === href;
    return pathname.startsWith(href);
  };

  const renderNavLink = (item: NavItem) => {
    const active = isActive(item.href);
    return (
      <li key={item.href}>
        <Link
          href={item.href}
          onClick={() => setOpen(false)}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${
            active
              ? `${brand.color} text-white shadow-lg`
              : `text-slate-400 hover:text-white hover:bg-white/5`
          }`}
        >
          <span className="text-xl">{item.icon}</span>
          <span>{item.label}</span>
        </Link>
      </li>
    );
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="md:hidden p-2.5 rounded-xl bg-slate-50 text-slate-600 border border-slate-100 hover:bg-slate-100 transition shadow-sm"
        aria-label="Open menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {open && (
        <div
          className="fixed inset-0 bg-slate-900/60 z-40 md:hidden backdrop-blur-sm transition-all duration-300"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-80 bg-[#0f172a] text-white z-50 transform transition-transform duration-500 ease-out md:hidden shadow-[20px_0_60px_-15px_rgba(0,0,0,0.5)] ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-8 border-b border-white/5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black tracking-tighter uppercase">
              RMUTI<span className="text-indigo-400">Care</span>
            </h2>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-1">{brand.sub}</p>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-8 border-b border-white/5 flex items-center gap-4 bg-white/2 space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center font-black text-lg shadow-lg shadow-indigo-600/20">
            {userInitial}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-black text-white truncate">{userName}</p>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{brand.sub}</p>
          </div>
        </div>

        <nav className="flex-grow p-4 mt-4 overflow-y-auto">
          <ul className="space-y-1.5">
            {navItems.map(renderNavLink)}
          </ul>
        </nav>

        {bottomItems && (
          <div className="p-4 border-t border-white/5 mt-auto bg-black/10">
            <ul className="space-y-1.5">
              {bottomItems.map(renderNavLink)}
            </ul>
          </div>
        )}
      </aside>
    </>
  );
}
