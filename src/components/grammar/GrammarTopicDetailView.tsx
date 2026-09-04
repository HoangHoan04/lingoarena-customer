"use client";

import { Link } from "@/i18n/routing";
import type { GrammarStructure, GrammarTopic } from "@/types/grammar";
import { useToastStore } from "@/stores/useToastStore";
import {
  AlertTriangle,
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  HelpCircle,
  Lightbulb,
  Sparkles,
  Target,
  XCircle,
  Zap,
} from "lucide-react";
import { useState } from "react";

interface GrammarTopicDetailViewProps {
  topic: GrammarTopic;
  onUpdateMastery?: (structureId: string, isCorrect: boolean) => Promise<void>;
}

export function GrammarTopicDetailView({
  topic,
  onUpdateMastery,
}: GrammarTopicDetailViewProps) {
  const { addToast } = useToastStore();
  const [understoodStructures, setUnderstoodStructures] = useState<Record<string, boolean>>({});

  const structures = topic.structures || [];

  const handleToggleUnderstood = async (structureId: string) => {
    const nextState = !understoodStructures[structureId];
    setUnderstoodStructures((prev) => ({ ...prev, [structureId]: nextState }));

    if (onUpdateMastery) {
      await onUpdateMastery(structureId, nextState);
    } else {
      addToast(nextState ? "Tuyệt vời! Đã ghi nhận bạn đã hiểu cấu trúc này." : "Đã hủy đánh dấu hiểu bài.", "success");
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-20">
      {/* TOP BAR BACK LINK */}
      <div className="flex items-center justify-between">
        <Link
          href="/grammar"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-blue-600 transition-colors shadow-2xs"
        >
          <ArrowLeft className="size-4" />
          <span>Tất cả chuyên đề ngữ pháp</span>
        </Link>

        {topic.canonicalTopicId && (
          <Link
            href="/practice"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900 text-xs font-bold hover:bg-blue-100"
          >
            <Target className="size-3.5" />
            <span>Luyện đề thi liên quan</span>
          </Link>
        )}
      </div>

      {/* HERO TOPIC HEADER */}
      <section className="relative overflow-hidden rounded-2xl bg-linear-to-r from-slate-950 via-[#0e214d] to-slate-950 text-white p-5 sm:p-7 border border-slate-800 shadow-md space-y-3">
        <div className="relative z-10 space-y-2 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-[11px] font-bold uppercase tracking-wider text-blue-300">
            <Sparkles className="size-3 text-amber-400" />
            <span>Trình Độ CEFR {topic.cefrLevel || "B1"}</span>
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight leading-snug">
            {topic.title}
          </h1>

          {topic.titleEn && (
            <p className="text-xs sm:text-sm font-semibold text-blue-200 italic">
              {topic.titleEn}
            </p>
          )}

          {topic.description && (
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-0.5 max-w-2xl">
              {topic.description}
            </p>
          )}
        </div>
      </section>

      {/* 2-COLUMN DETAIL LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: STRUCTURES, FORMULAS & USAGE (8 / 12 COLS) */}
        <div className="lg:col-span-8 space-y-6">
          {structures.map((struct, idx) => {
            const isDone = !!understoodStructures[struct.id];

            return (
              <div
                key={struct.id || idx}
                className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm space-y-5"
              >
                {/* STRUCTURE HEADER */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
                      Cấu trúc #{idx + 1}
                    </span>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">
                      {struct.title}
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleUnderstood(struct.id)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                      isDone
                        ? "bg-emerald-500 text-white border-emerald-500 shadow-xs font-black"
                        : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-emerald-400"
                    }`}
                  >
                    <CheckCircle2 className="size-3.5" />
                    <span>{isDone ? "Đã hiểu cấu trúc này" : "Đánh dấu đã hiểu"}</span>
                  </button>
                </div>

                {/* FORMULA HIGHLIGHT BOX */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Công thức chuẩn (Formula):
                  </span>
                  <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-sm font-mono font-black text-blue-800 dark:text-blue-200 shadow-2xs">
                    {struct.formula}
                  </div>
                </div>

                {/* USAGE & MEANING */}
                {struct.usageContent && (
                  <div className="space-y-2 text-xs leading-relaxed">
                    <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-bold uppercase text-[11px]">
                      <Lightbulb className="size-3.5 text-amber-500" />
                      <span>Cách dùng & Lưu ý:</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-850 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800">
                      {struct.usageContent}
                    </p>
                  </div>
                )}

                {/* COMMON MISTAKES IF AVAILABLE */}
                {struct.commonMistakes && (
                  <div className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/60 space-y-1 text-xs">
                    <div className="flex items-center gap-1.5 text-rose-700 dark:text-rose-400 font-black uppercase text-[10px]">
                      <AlertTriangle className="size-3.5" />
                      <span>Lỗi sai thường gặp (Common Mistakes):</span>
                    </div>
                    <p className="text-rose-900 dark:text-rose-200 font-medium leading-relaxed">
                      {struct.commonMistakes}
                    </p>
                  </div>
                )}

                {/* EXAMPLES LIST */}
                {struct.examples && struct.examples.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Ví dụ minh họa thực tế:
                    </span>
                    <div className="grid gap-2.5">
                      {struct.examples.map((ex, exIdx) => (
                        <div
                          key={ex.id || exIdx}
                          className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800 space-y-1 text-xs"
                        >
                          <p className="font-bold text-slate-900 dark:text-white font-sans text-xs sm:text-sm">
                            💬 "{ex.sentence}"
                          </p>
                          <p className="text-slate-500 italic">
                            ➜ {ex.translation}
                          </p>
                          {ex.explanation && (
                            <p className="text-[11px] text-blue-600 dark:text-blue-400 font-medium pt-0.5">
                              💡 {ex.explanation}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* RIGHT COLUMN: PROGRESS & RELATED ROADMAP (4 / 12 COLS) */}
        <div className="lg:col-span-4 space-y-6">
          {/* MASTERY PROGRESS CARD */}
          <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                Tiến Độ Học Chủ Điểm
              </span>
              <Sparkles className="size-4 text-amber-500" />
            </div>

            <div className="text-center space-y-2 py-2">
              <div className="text-3xl font-black text-blue-600 dark:text-blue-400">
                {Object.keys(understoodStructures).filter((k) => understoodStructures[k]).length} / {structures.length}
              </div>
              <p className="text-xs text-slate-500">
                Cấu trúc đã hoàn thành đánh dấu hiểu bài
              </p>
            </div>

            <Link
              href="/grammar"
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-md shadow-blue-600/20 transition-all cursor-pointer"
            >
              <span>Tiếp tục chuyên đề khác</span>
              <ChevronRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
