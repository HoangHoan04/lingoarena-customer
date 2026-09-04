"use client";

import type { AptisQuestion } from "@/types/aptis";
import { ArrowLeft, ArrowRight, Flag } from "lucide-react";

interface AptisGrammarVocabSectionProps {
  question: AptisQuestion;
  currentIndex: number;
  totalQuestions: number;
  selectedAnswer?: string;
  isFlagged: boolean;
  onSelectAnswer: (value: string) => void;
  onToggleFlag: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

export function AptisGrammarVocabSection({
  question,
  currentIndex,
  totalQuestions,
  selectedAnswer,
  isFlagged,
  onSelectAnswer,
  onToggleFlag,
  onNext,
  onPrevious,
}: AptisGrammarVocabSectionProps) {
  const isPart1 = question.part === 1;

  return (
    <div className="space-y-6">
      {/* Question Card Container */}
      <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-6 shadow-sm">
        {/* Top Badges & Flag */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-brand/10 dark:bg-brand/25 text-brand dark:text-[#7b9bee] text-xs font-black uppercase">
              {isPart1
                ? "Phần 1: Ngữ Pháp (Grammar)"
                : "Phần 2: Từ Vựng (Vocabulary)"}
            </span>
            <span className="text-xs font-bold text-slate-400">
              Câu {currentIndex + 1} / {totalQuestions}
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
            <Flag
              className={`size-3.5 ${isFlagged ? "fill-amber-400 text-amber-500" : ""}`}
            />
            <span>{isFlagged ? "Đã đánh dấu" : "Đánh dấu câu này"}</span>
          </button>
        </div>

        {/* Question Prompt */}
        <div className="space-y-2">
          {question.instructions && (
            <p className="text-xs text-slate-400 italic">
              {question.instructions}
            </p>
          )}
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-relaxed">
            {question.prompt}
          </h2>
        </div>

        {/* Options List */}
        <div className="grid gap-3 pt-2">
          {question.options?.map((opt, idx) => {
            const isSelected = selectedAnswer === opt.key;

            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => onSelectAnswer(opt.key)}
                className={`group flex items-center gap-3.5 w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer select-none ${
                  isSelected
                    ? "border-brand dark:border-[#7b9bee] bg-brand/10 text-slate-900 dark:text-white shadow-md ring-2 ring-brand/30"
                    : "border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:border-brand/60 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                }`}
              >
                <span
                  className={`flex items-center justify-center size-8 rounded-xl text-xs font-black transition-colors shrink-0 ${
                    isSelected
                      ? "bg-brand text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-brand group-hover:text-white"
                  }`}
                >
                  {opt.key || String.fromCharCode(65 + idx)}
                </span>
                <span className="text-sm sm:text-base font-semibold flex-1">
                  {opt.content}
                </span>
              </button>
            );
          })}
        </div>

        {/* Next / Previous Controls */}
        <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            disabled={currentIndex === 0}
            onClick={onPrevious}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 text-xs sm:text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <ArrowLeft className="size-4" />
            <span>Câu trước</span>
          </button>

          <button
            type="button"
            onClick={onNext}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand hover:bg-brand/90 text-white text-xs sm:text-sm font-black shadow-md shadow-brand/25 cursor-pointer"
          >
            <span>
              {currentIndex + 1 >= totalQuestions
                ? "Kiểm tra toàn bộ"
                : "Câu tiếp theo"}
            </span>
            <ArrowRight className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
