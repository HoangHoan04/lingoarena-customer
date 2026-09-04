"use client";

import type { VstepQuestion } from "@/types/vstep";
import { ArrowLeft, ArrowRight, Flag, PenTool } from "lucide-react";

function countWords(str: string): number {
  if (!str) return 0;
  return str.trim().split(/\s+/).filter(Boolean).length;
}

interface VstepWritingViewProps {
  question: VstepQuestion;
  currentIndex: number;
  totalQuestions: number;
  selectedAnswer?: string;
  isFlagged: boolean;
  onSelectAnswer: (text: string) => void;
  onToggleFlag: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

export function VstepWritingView({
  question,
  currentIndex,
  totalQuestions,
  selectedAnswer = "",
  isFlagged,
  onSelectAnswer,
  onToggleFlag,
  onNext,
  onPrevious,
}: VstepWritingViewProps) {
  const words = countWords(selectedAnswer);
  const minWords = question.minWords || (question.part === 1 ? 120 : 250);
  const isSatisfied = words >= minWords;

  return (
    <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 text-xs font-black uppercase">
            {question.partTitle || `VSTEP Writing Task ${question.part}`}
          </span>
          <span className="text-xs font-bold text-slate-400">
            Task {currentIndex + 1} / {totalQuestions}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div
            className={`px-3.5 py-1.5 rounded-xl border text-xs font-mono font-bold transition-all ${
              isSatisfied
                ? "bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300"
                : "bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300"
            }`}
          >
            Số từ: <strong>{words}</strong> / tối thiểu {minWords} từ
          </div>

          <button
            type="button"
            onClick={onToggleFlag}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-500 cursor-pointer"
          >
            <Flag className={`size-3.5 ${isFlagged ? "fill-amber-400 text-amber-500" : ""}`} />
            <span>{isFlagged ? "Đã gắn cờ" : "Gắn cờ"}</span>
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/40 dark:bg-emerald-950/20 p-5 space-y-2">
        <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
          Đề bài yêu cầu:
        </p>
        <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-relaxed whitespace-pre-wrap">
          {question.prompt}
        </h2>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          Bài viết của thí sinh:
        </label>
        <textarea
          rows={14}
          value={selectedAnswer}
          onChange={(e) => onSelectAnswer(e.target.value)}
          placeholder={`Nhập bài viết của bạn tại đây (Yêu cầu ít nhất ${minWords} từ)...`}
          className="w-full p-5 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold leading-relaxed focus:border-emerald-600 focus:bg-white dark:focus:bg-slate-900 focus:outline-none transition-colors"
        />
      </div>

      <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <button
          type="button"
          disabled={currentIndex === 0}
          onClick={onPrevious}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl border text-xs font-bold disabled:opacity-40"
        >
          <ArrowLeft className="size-4" /> Task trước
        </button>

        <button
          type="button"
          onClick={onNext}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-md cursor-pointer"
        >
          <span>{currentIndex + 1 >= totalQuestions ? "Kiểm tra toàn bộ phần Viết" : "Task tiếp theo"}</span>
          <ArrowRight className="size-4" />
        </button>
      </div>
    </div>
  );
}
