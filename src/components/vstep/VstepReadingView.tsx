"use client";

import type { VstepQuestion } from "@/types/vstep";
import { ArrowLeft, ArrowRight, BookOpen, Flag } from "lucide-react";
import { useState } from "react";

interface VstepReadingViewProps {
  question: VstepQuestion;
  currentIndex: number;
  totalQuestions: number;
  selectedAnswer?: string;
  isFlagged: boolean;
  onSelectAnswer: (value: string) => void;
  onToggleFlag: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

export function VstepReadingView({
  question,
  currentIndex,
  totalQuestions,
  selectedAnswer,
  isFlagged,
  onSelectAnswer,
  onToggleFlag,
  onNext,
  onPrevious,
}: VstepReadingViewProps) {
  const [textSize, setTextSize] = useState<"sm" | "base" | "lg">("base");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* PASSAGE COLUMN */}
      <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-7 shadow-sm space-y-4 max-h-[750px] overflow-y-auto custom-scrollbar">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 sticky top-0 bg-white dark:bg-slate-900 z-10">
          <div className="flex items-center gap-2">
            <BookOpen className="size-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
              {question.partTitle || `Bài đọc ${question.part}`}
            </span>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300">
            <button
              type="button"
              onClick={() => setTextSize("sm")}
              className={`px-2 py-0.5 rounded-lg cursor-pointer ${textSize === "sm" ? "bg-white dark:bg-slate-750 font-black shadow-2xs text-emerald-600" : ""}`}
            >
              A-
            </button>
            <button
              type="button"
              onClick={() => setTextSize("base")}
              className={`px-2 py-0.5 rounded-lg cursor-pointer ${textSize === "base" ? "bg-white dark:bg-slate-750 font-black shadow-2xs text-emerald-600" : ""}`}
            >
              A
            </button>
            <button
              type="button"
              onClick={() => setTextSize("lg")}
              className={`px-2 py-0.5 rounded-lg cursor-pointer ${textSize === "lg" ? "bg-white dark:bg-slate-750 font-black shadow-2xs text-emerald-600" : ""}`}
            >
              A+
            </button>
          </div>
        </div>

        <div
          className={`font-serif leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-wrap ${
            textSize === "sm" ? "text-xs sm:text-sm" : textSize === "lg" ? "text-base sm:text-lg" : "text-sm sm:text-base"
          }`}
        >
          {question.passageText || "Nội dung bài đọc VSTEP đang tải..."}
        </div>
      </div>

      {/* QUESTION & OPTIONS */}
      <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-sm space-y-6 flex flex-col justify-between">
        <div className="space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 text-xs font-black uppercase">
                VSTEP Reading Câu {currentIndex + 1}
              </span>
              <span className="text-xs font-bold text-slate-400">
                {currentIndex + 1} / {totalQuestions}
              </span>
            </div>

            <button
              type="button"
              onClick={onToggleFlag}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-colors cursor-pointer select-none ${
                isFlagged
                  ? "border-amber-400 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300"
                  : "border-slate-200 dark:border-slate-800 text-slate-500 hover:border-amber-400"
              }`}
            >
              <Flag className={`size-3.5 ${isFlagged ? "fill-amber-400 text-amber-500" : ""}`} />
              <span>{isFlagged ? "Đã gắn cờ" : "Gắn cờ"}</span>
            </button>
          </div>

          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
            {question.prompt}
          </h2>

          <div className="grid gap-3 pt-2">
            {question.options?.map((opt) => {
              const isSelected = selectedAnswer === opt.key;

              return (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => onSelectAnswer(opt.key)}
                  className={`group flex items-center gap-3.5 w-full text-left p-4 rounded-2xl border-2 transition-all cursor-pointer select-none ${
                    isSelected
                      ? "border-emerald-600 dark:border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/30 text-slate-900 dark:text-white shadow-md ring-2 ring-emerald-500/30"
                      : "border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:border-emerald-500/60 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                  }`}
                >
                  <span
                    className={`flex items-center justify-center size-8 rounded-xl text-xs font-black transition-colors shrink-0 ${
                      isSelected
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-emerald-600 group-hover:text-white"
                    }`}
                  >
                    {opt.key}
                  </span>
                  <span className="text-sm font-semibold flex-1">
                    {opt.content}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            disabled={currentIndex === 0}
            onClick={onPrevious}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl border text-xs font-bold disabled:opacity-40"
          >
            <ArrowLeft className="size-4" /> Câu trước
          </button>
          <button
            type="button"
            onClick={onNext}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-md cursor-pointer"
          >
            <span>{currentIndex + 1 >= totalQuestions ? "Kiểm tra toàn bộ" : "Câu tiếp theo"}</span>
            <ArrowRight className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
