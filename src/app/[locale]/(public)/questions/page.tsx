"use client";

import { useRouter } from "@/i18n/routing";
import { useEffect } from "react";

export default function QuestionsRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to practice exams hub since questions are organized by exams
    router.replace("/practice");
  }, [router]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 text-center space-y-4">
      <div className="h-48 rounded-3xl bg-slate-100 dark:bg-slate-800/60 animate-pulse flex items-center justify-center text-slate-400 font-bold text-sm">
        Đang chuyển hướng đến phòng luyện thi theo bộ đề...
      </div>
    </div>
  );
}
