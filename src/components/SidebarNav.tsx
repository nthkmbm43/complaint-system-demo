"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  href: string;
  label: string;
  icon: string;
}

export default function SidebarNav({
  items,
  activeColor = "bg-indigo-600",
}: {
  items: NavItem[];
  activeColor?: string;
}) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href.endsWith("dashboard")) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <ul className="space-y-1.5">
      {items.map((item) => {
        const active = isActive(item.href);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              className={`group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${
                active
                  ? `${activeColor} text-white shadow-lg shadow-indigo-900/20 translate-x-1`
                  : `text-slate-400 hover:text-white hover:bg-white/5 hover:translate-x-1`
              }`}
            >
              <span className={`text-lg transition-transform group-hover:scale-110 ${active ? 'scale-110' : ''}`}>
                {item.icon}
              </span>
              <span className="tracking-tight">{item.label}</span>
              {active && (
                <div className="ml-auto w-1 h-4 bg-white/40 rounded-full animate-pulse" />
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
