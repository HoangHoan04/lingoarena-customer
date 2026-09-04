"use client";

import AssessmentAttemptPlayer from "@/components/assessment/AssessmentAttemptPlayer";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/routing";
import { pickLocaleText } from "@/lib/locale-text";
import { assessmentService } from "@/services/assessment.service";
import { useAuthStore } from "@/stores/useAuthStore";
import { useToastStore } from "@/stores/useToastStore";
import type { AssessmentAttempt, AssessmentSummary } from "@/types/assessment";
import { Compass, Loader2 } from "lucide-react";
import { useLocale } from "next-intl";
import { useEffect, useState } from "react";

export default function PlacementTestPage() {
  const locale = useLocale();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { addToast } = useToastStore();
  const [assessment, setAssessment] = useState<AssessmentSummary | null>(null);
  const [attempt, setAttempt] = useState<AssessmentAttempt | null>(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace(
        `/login?redirect=${encodeURIComponent("/placement-test")}`,
      );
      return;
    }
    let mounted = true;
    setLoading(true);
    assessmentService
      .list({ assessmentType: "PLACEMENT_TEST" }, 0, 1)
      .then(async (res) => {
        const first =
          res.data[0] ||
          (await assessmentService.bySlug("placement-toeic").catch(() => null));
        if (mounted) setAssessment(first);
      })
      .catch(() => {
        if (mounted) setAssessment(null);
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [isAuthenticated, router]);

  const start = async () => {
    if (!assessment) return;
    setStarting(true);
    try {
      const next = await assessmentService.start({ slug: assessment.slug });
      setAttempt(next);
    } catch (err: any) {
      addToast(err?.message || "Không thể bắt đầu bài xếp lớp", "error");
    } finally {
      setStarting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-brand" />
      </div>
    );
  }

  if (attempt) {
    return (
      <AssessmentAttemptPlayer
        initialAttempt={attempt}
        onBack={() => router.push("/practice")}
      />
    );
  }

  if (!assessment) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 text-center">
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 space-y-4">
          <Compass className="mx-auto size-10 text-brand dark:text-[#7b9bee]" />
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            Chưa có bài xếp lớp
          </h1>
          <p className="text-sm text-slate-500">
            Hệ thống chưa xuất bản bài placement test. Vui lòng quay lại sau.
          </p>
          <Button variant="outline" onClick={() => router.push("/practice")}>
            Xem kho đề luyện tập
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto py-10 px-4">
      <div className="rounded-3xl bg-linear-to-r from-brand-dark via-brand to-brand-dark text-white p-8 sm:p-10 shadow-2xl space-y-5">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-[#a0baff] text-xs font-bold uppercase tracking-wider">
          <Compass className="size-3.5" />
          Đánh giá năng lực đầu vào
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-black">
            {pickLocaleText(locale, assessment.title, assessment.titleEn)}
          </h1>
          <p className="text-sm text-slate-200 leading-relaxed">
            {pickLocaleText(
              locale,
              assessment.description,
              assessment.descriptionEn,
            ) ||
              "Làm bài xếp lớp ngắn để xác định trình độ hiện tại và nhận kết quả ngay sau khi nộp."}
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-xs text-slate-200">
          <span className="rounded-full bg-white/10 px-3 py-1">
            {Math.round(Number(assessment.durationSeconds || 0) / 60)} phút
          </span>
          <span className="rounded-full bg-white/10 px-3 py-1">
            {assessment.sections?.reduce(
              (sum, section) => sum + (section.items?.length || 0),
              0,
            ) || 0}{" "}
            câu
          </span>
          <span className="rounded-full bg-emerald-500 px-3 py-1 font-bold">
            Miễn phí
          </span>
        </div>
        <Button
          size="lg"
          disabled={starting}
          onClick={start}
          className="bg-white text-brand hover:bg-slate-100 font-black"
        >
          {starting ? <Loader2 className="size-4 animate-spin" /> : null}
          Bắt đầu làm bài
        </Button>
      </div>
    </div>
  );
}
