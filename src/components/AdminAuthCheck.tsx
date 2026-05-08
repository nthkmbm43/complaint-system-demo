"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

export default function AdminAuthCheck({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    const isLoginPage = pathname === "/admin/login";

    if (!session && !isLoginPage) {
      router.push("/admin/login");
    } else if (session && isLoginPage) {
      router.push("/admin/dashboard");
    }
  }, [session, status, pathname, router]);

  // While loading, we can show a loader or nothing
  if (status === "loading") {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
    </div>;
  }

  return <>{children}</>;
}
