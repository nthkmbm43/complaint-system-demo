"use client";

import { useSession } from "next-auth/react";

export default function UserAvatar({
  color = "bg-orange-100 text-orange-600",
}: {
  color?: string;
}) {
  const { data: session } = useSession();
  const user = session?.user as any;
  const name = user?.name || "User";
  const initial = name.charAt(0).toUpperCase();

  return (
    <div className="flex items-center gap-3">
      <div
        className={`w-8 h-8 ${color} rounded-full flex justify-center items-center font-bold text-sm`}
      >
        {initial}
      </div>
      <span className="text-sm font-semibold text-slate-700 hidden sm:inline max-w-[150px] truncate">
        {name}
      </span>
    </div>
  );
}
