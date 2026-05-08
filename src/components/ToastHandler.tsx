"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Toast from "./Toast";

function ToastContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [toast, setToast] = useState<{ message: string, type: string } | null>(null);

  useEffect(() => {
    const submitted = searchParams.get("submitted");
    const deleted = searchParams.get("deleted");
    const updated = searchParams.get("updated");

    if (submitted === "true") {
      setToast({ message: "ส่งคำร้องเข้าระบบเรียบร้อยแล้ว!", type: "success" });
    } else if (deleted === "true") {
      setToast({ message: "ลบข้อมูลเรียบร้อยแล้ว", type: "success" });
    } else if (updated === "true") {
      setToast({ message: "อัปเดตข้อมูลสำเร็จ", type: "success" });
    }

    if (submitted || deleted || updated) {
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete("submitted");
      newParams.delete("deleted");
      newParams.delete("updated");
      const newUrl = window.location.pathname + (newParams.toString() ? `?${newParams.toString()}` : "");
      router.replace(newUrl);
    }
  }, [searchParams, router]);

  if (!toast) return null;

  return (
    <Toast 
      message={toast.message} 
      type={toast.type} 
      onClose={() => setToast(null)} 
    />
  );
}

export default function ToastHandler() {
  return (
    <Suspense fallback={null}>
      <ToastContent />
    </Suspense>
  );
}
