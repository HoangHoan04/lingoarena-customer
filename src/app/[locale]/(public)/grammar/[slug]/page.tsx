"use client";

import { Link } from "@/i18n/routing";
import { grammarService } from "@/services/grammar.service";
import { useAuthStore } from "@/stores/useAuthStore";
import { useToastStore } from "@/stores/useToastStore";
import type { GrammarTopic } from "@/types/grammar";
import { ArrowLeft, CheckCircle2, HelpCircle, Sparkles, Target, XCircle } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function GrammarTopicDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug;
  const { isAuthenticated } = useAuthStore();
  const { addToast } = useToastStore();
  const [topic, setTopic] = useState<GrammarTopic | null>(null);
  const [loading, setLoading] = useState(true);
  const [masteryLoading, setMasteryLoading] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const data = await grammarService.getTopicBySlug(String(slug));
        if (!cancelled) setTopic(data);
      } catch (err: unknown) {
        addToast(err instanceof Error ? err.message : "Không tải được chủ điểm ngữ pháp", "error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [addToast, slug]);

  const handleMastery = async (grammarStructureId: string, isCorrect: boolean) => {
    setMasteryLoading(grammarStructureId);
    try {
      const result = await grammarService.updateMastery(grammarStructureId, isCorrect);
      addToast(`Điểm thành thạo hiện tại: ${Number(result.masteryScore || 0).toFixed(0)}%`, "success");
    } catch (err: unknown) {
      addToast(err instanceof Error ? err.message : "Không cập nhật được tiến độ", "error");
    } finally {
      setMasteryLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10 space-y-4">
        {[1, 2, 3].map((item) => (
          <div key={item} className="h-48 rounded-3xl bg-slate-100 dark:bg-slate-800/60 animate-pulse" />
        ))}
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16 text-center">
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Không tìm thấy chủ điểm</h1>
        <Link href="/grammar" className="mt-4 inline-flex text-primary font-bold">
          Quay lại ngữ pháp
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8 space-y-6 pb-16">
      <Link href="/grammar" className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-500 hover:text-primary">
        <ArrowLeft className="size-4" />
        Tất cả chủ điểm
      </Link>

      <section className="relative overflow-hidden rounded-3xl bg-linear-to-r from-slate-900 via-[#1e2f5e] to-slate-900 text-white p-6 sm:p-8 border border-slate-800 shadow-xl">
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-bold uppercase tracking-wider text-blue-200">
            <Sparkles className="size-3.5 text-amber-400" />
            <span>CEFR {topic.cefrLevel || "A2"}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">{topic.title}</h1>
          {topic.description && <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">{topic.description}</p>}
          {topic.canonicalTopicId && (
            <Link
              href={`/questions?topic=${topic.canonicalTopicId}`}
              className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2 text-xs font-black text-white hover:bg-white/15"
            >
              <Target className="size-4" />
              Luyện câu hỏi liên quan
            </Link>
          )}
        </div>
      </section>

      {!isAuthenticated && (
        <section className="rounded-3xl border border-amber-200 dark:border-amber-900/60 bg-amber-50 dark:bg-amber-950/30 p-4 text-sm text-amber-900 dark:text-amber-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span>Đăng nhập để lưu điểm thành thạo sau mỗi lần tự kiểm tra cấu trúc.</span>
          <Link href="/login" className="inline-flex justify-center rounded-2xl bg-amber-500 px-4 py-2 text-xs font-black text-white">
            Đăng nhập
          </Link>
        </section>
      )}

      <section className="space-y-5">
        {(topic.structures || []).map((structure) => (
          <article key={structure.id} className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-2xs space-y-5">
            <div className="space-y-2">
              <h2 className="text-xl font-black text-slate-900 dark:text-white">{structure.title}</h2>
              <div className="rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 p-4">
                <p className="text-xs font-bold uppercase text-blue-500">Công thức</p>
                <p className="mt-1 font-mono text-sm text-slate-800 dark:text-slate-100 whitespace-pre-wrap">{structure.formula}</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/60 p-4">
                <p className="text-xs font-bold uppercase text-slate-400">Nghĩa tiếng Việt</p>
                <p className="mt-1 text-sm text-slate-700 dark:text-slate-200 whitespace-pre-wrap">{structure.meaningVi}</p>
              </div>
              {structure.commonMistakes && (
                <div className="rounded-2xl bg-rose-50 dark:bg-rose-950/30 p-4">
                  <p className="text-xs font-bold uppercase text-rose-500">Lỗi thường gặp</p>
                  <p className="mt-1 text-sm text-rose-700 dark:text-rose-200 whitespace-pre-wrap">{structure.commonMistakes}</p>
                </div>
              )}
            </div>

            <div className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: structure.usageContent || "" }} />

            <div className="space-y-3">
              <h3 className="text-sm font-black uppercase tracking-wide text-slate-400">Ví dụ</h3>
              {(structure.examples || []).map((example) => (
                <div key={example.id} className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/40 p-4">
                  <div className="flex items-start gap-2">
                    {example.isNegativeExample ? <XCircle className="mt-0.5 size-4 text-rose-500" /> : <CheckCircle2 className="mt-0.5 size-4 text-emerald-500" />}
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{example.sentence}</p>
                      <p className="text-sm text-slate-500">{example.translation}</p>
                      {example.explanation && <p className="mt-2 text-xs text-slate-500">{example.explanation}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {isAuthenticated ? (
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={masteryLoading === structure.id}
                  onClick={() => handleMastery(structure.id, true)}
                  className="inline-flex items-center gap-1.5 rounded-2xl bg-emerald-500 px-4 py-2 text-xs font-black text-white disabled:opacity-50"
                >
                  <CheckCircle2 className="size-4" />
                  Tôi làm đúng
                </button>
                <button
                  type="button"
                  disabled={masteryLoading === structure.id}
                  onClick={() => handleMastery(structure.id, false)}
                  className="inline-flex items-center gap-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 px-4 py-2 text-xs font-black text-slate-700 dark:text-slate-200 disabled:opacity-50"
                >
                  <HelpCircle className="size-4" />
                  Cần ôn lại
                </button>
              </div>
            ) : null}
          </article>
        ))}
      </section>
    </div>
  );
}
