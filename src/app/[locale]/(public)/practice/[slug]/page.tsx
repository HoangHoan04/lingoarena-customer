"use client";

import AssessmentAttemptPlayer from "@/components/assessment/AssessmentAttemptPlayer";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/routing";
import { assessmentService } from "@/services/assessment.service";
import { useAuthStore } from "@/stores/useAuthStore";
import { useToastStore } from "@/stores/useToastStore";
import type { AssessmentAttempt } from "@/types/assessment";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PracticeAssessmentPage() {
  const router = useRouter();
  const params = useParams();
  const slug = String(params?.slug || "");
  const { isAuthenticated } = useAuthStore();
  const { addToast } = useToastStore();
  const [attempt, setAttempt] = useState<AssessmentAttempt | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    if (!isAuthenticated) {
      router.replace(`/login?redirect=${encodeURIComponent(`/practice/${slug}`)}`);
      return;
    }
    let mounted = true;
    setLoading(true);
    assessmentService
      .start({ slug })
      .then((data) => {
        if (mounted) setAttempt(data);
      })
      .catch((err: any) => {
        addToast(err?.message || "Không thể bắt đầu đề thi", "error");
        if (String(err?.message || "").toLowerCase().includes("gói")) {
          router.push("/pricing");
        }
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [addToast, isAuthenticated, router, slug]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-[#2b417e]" />
      </div>
    );
  }

  if (!attempt) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 text-center">
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 space-y-4">
          <h1 className="text-xl font-black text-slate-900 dark:text-white">Không mở được đề thi</h1>
          <p className="text-sm text-slate-500">Vui lòng thử lại hoặc chọn đề khác trong kho luyện tập.</p>
          <Button onClick={() => router.push("/practice")}>Quay lại kho đề</Button>
        </div>
      </div>
    );
  }

  return <AssessmentAttemptPlayer initialAttempt={attempt} onBack={() => router.push("/practice")} />;
}
