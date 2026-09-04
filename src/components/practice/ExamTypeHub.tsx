"use client";

import AssessmentAttemptPlayer from "@/components/assessment/AssessmentAttemptPlayer";
import { Button } from "@/components/ui/button";
import { Link, useRouter } from "@/i18n/routing";
import { pickLocaleText } from "@/lib/locale-text";
import { assessmentService } from "@/services/assessment.service";
import { questionService } from "@/services/question.service";
import { useAuthStore } from "@/stores/useAuthStore";
import { useToastStore } from "@/stores/useToastStore";
import type { AssessmentAttempt, AssessmentSummary } from "@/types/assessment";
import type { ExamSectionConfig } from "@/types/exam-hub";
import type { QuestionLookup } from "@/types/question";
import { ArrowRight, BookOpen, Clock, Loader2, Play, Sparkles } from "lucide-react";
import { useLocale } from "next-intl";
import { useEffect, useMemo, useState } from "react";

function asSections(hub?: Record<string, unknown> | null): ExamSectionConfig[] {
  const raw = hub?.sections;
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => {
      const row = (item || {}) as Record<string, unknown>;
      return {
        key: String(row.key || row.code || ""),
        name: String(row.name || row.title || ""),
        nameEn: String(row.nameEn || row.titleEn || row.name || ""),
        durationMinutes: Number(row.durationMinutes || 0),
        totalQuestions: Number(row.totalQuestions || 0),
        partsCount: Number(row.partsCount || 0),
        scoreScale: String(row.scoreScale || ""),
        description: String(row.description || ""),
      };
    })
    .filter((item) => item.key || item.name);
}

function asParts(hub?: Record<string, unknown> | null) {
  const raw = hub?.parts;
  if (!Array.isArray(raw)) return [];
  return raw.map((item, index) => {
    const row = (item || {}) as Record<string, unknown>;
    return {
      key: String(row.key || row.partNumber || index),
      name: String(row.partNameVi || row.name || row.title || `Phần ${index + 1}`),
      description: String(row.description || ""),
      totalQuestions: Number(row.totalQuestions || 0),
      sectionKey: String(row.sectionKey || ""),
    };
  });
}

export function ExamTypeHub({
  examCode,
  accentClass = "from-slate-950 via-[#192b55] to-slate-950",
  badgeClass = "text-blue-200",
}: {
  examCode: string;
  accentClass?: string;
  badgeClass?: string;
}) {
  const locale = useLocale();
  const router = useRouter();
  const [examType, setExamType] = useState<QuestionLookup | null>(null);
  const [assessments, setAssessments] = useState<AssessmentSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const types = await questionService.lookupExamTypes();
        const match =
          types.find((item) => (item.code || "").toUpperCase() === examCode.toUpperCase()) ||
          types.find((item) => (item.name || "").toUpperCase().includes(examCode.toUpperCase())) ||
          null;
        if (!mounted) return;
        setExamType(match);
        if (match?.id) {
          const res = await assessmentService.list({ examTypeId: match.id }, 0, 40);
          if (mounted) setAssessments(res.data || []);
        } else {
          setAssessments([]);
        }
      } catch {
        if (mounted) {
          setExamType(null);
          setAssessments([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [examCode]);

  const hub = examType?.hubContentJson || null;
  const sections = useMemo(() => asSections(hub), [hub]);
  const parts = useMemo(() => asParts(hub), [hub]);
  const description =
    pickLocaleText(locale, examType?.description, examType?.descriptionEn) ||
    asText(hub?.description) ||
    "Chọn đề đã xuất bản cho chứng chỉ này và làm bài trên hệ thống.";

  const first = assessments[0];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-10 pb-20">
      <div className={`relative overflow-hidden rounded-3xl bg-linear-to-r ${accentClass} text-white p-6 sm:p-12 border border-slate-800 shadow-2xl space-y-6`}>
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-bold uppercase tracking-wider ${badgeClass}`}>
            <Sparkles className="size-3.5 text-amber-400" />
            <span>Phòng thi thử {examCode}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
            {pickLocaleText(locale, examType?.name, examType?.nameEn) || examCode}
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">{description}</p>
          {first ? (
            <button
              type="button"
              onClick={() => router.push(`/practice/${first.slug}`)}
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-sm shadow-xl cursor-pointer"
            >
              <Play className="size-4 fill-current" />
              Vào đề {pickLocaleText(locale, first.title, first.titleEn)}
            </button>
          ) : null}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {sections.length > 0 && (
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {sections.map((sec) => (
                <div key={sec.key} className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-2">
                  <h3 className="font-black text-slate-900 dark:text-white">{sec.name}</h3>
                  <p className="text-xs text-slate-500">
                    {sec.durationMinutes ? `${sec.durationMinutes} phút` : ""} {sec.totalQuestions ? `· ${sec.totalQuestions} câu` : ""}
                  </p>
                  <p className="text-xs text-slate-500">{sec.description}</p>
                </div>
              ))}
            </section>
          )}

          {parts.length > 0 && (
            <section className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4">
              <h2 className="text-lg font-black">Cấu trúc phần thi</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {parts.map((part) => (
                  <div key={part.key} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850">
                    <p className="text-xs font-black text-primary">{part.name}</p>
                    <p className="text-xs text-slate-500 mt-1">{part.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="space-y-4">
            <h2 className="text-xl font-black text-slate-900 dark:text-white">Đề thi đã xuất bản</h2>
            {assessments.length === 0 ? (
              <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-10 text-center space-y-2">
                <BookOpen className="size-10 mx-auto text-slate-400" />
                <p className="font-bold">Chưa có đề {examCode}</p>
                <p className="text-sm text-slate-500">Catalog trống cho đến khi quản trị viên xuất bản đề thi.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {assessments.map((item) => (
                  <div key={item.id} className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4">
                    <div>
                      <h3 className="font-black text-lg">{pickLocaleText(locale, item.title, item.titleEn)}</h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                        {pickLocaleText(locale, item.description, item.descriptionEn) || "Đề luyện tập đã xuất bản."}
                      </p>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="size-3.5" />
                        {Math.round(Number(item.durationSeconds || 0) / 60)} phút
                      </span>
                      <Link
                        href={`/practice/${item.slug}`}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-black text-white"
                      >
                        Vào thi <ArrowRight className="size-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

function asText(value: unknown) {
  return typeof value === "string" ? value : "";
}

export function ExamTypeAttemptPage({ examCode }: { examCode: string }) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { addToast } = useToastStore();
  const [attempt, setAttempt] = useState<AssessmentAttempt | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace(`/login?redirect=${encodeURIComponent(`/practice/${examCode.toLowerCase()}/exam`)}`);
      return;
    }
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const types = await questionService.lookupExamTypes();
        const match =
          types.find((item) => (item.code || "").toUpperCase() === examCode.toUpperCase()) ||
          types.find((item) => (item.name || "").toUpperCase().includes(examCode.toUpperCase()));
        const res = match?.id
          ? await assessmentService.list({ examTypeId: match.id }, 0, 20)
          : { data: [] as AssessmentSummary[] };
        const first = res.data[0];
        if (!first) {
          if (mounted) setAttempt(null);
          return;
        }
        const next = await assessmentService.start({ slug: first.slug });
        if (mounted) setAttempt(next);
      } catch (err: any) {
        if (mounted) addToast(err?.message || "Không thể bắt đầu đề thi", "error");
        if (mounted) setAttempt(null);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [addToast, examCode, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-brand" />
      </div>
    );
  }

  if (!attempt) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 text-center">
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 space-y-4">
          <h1 className="text-xl font-black">Chưa có đề {examCode}</h1>
          <p className="text-sm text-slate-500">Hệ thống chưa xuất bản đề thi cho chứng chỉ này.</p>
          <Button onClick={() => router.push(`/practice/${examCode.toLowerCase()}`)}>Quay lại phòng thi</Button>
        </div>
      </div>
    );
  }

  return (
    <AssessmentAttemptPlayer
      initialAttempt={attempt}
      onBack={() => router.push(`/practice/${examCode.toLowerCase()}`)}
    />
  );
}
