"use client";

import type { AptisQuestion } from "@/types/aptis";
import { ArrowLeft, ArrowRight, BookOpen, Flag, MoveDown, MoveUp } from "lucide-react";
import { useState } from "react";

interface AptisReadingSectionProps {
  question: AptisQuestion;
  currentIndex: number;
  totalQuestions: number;
  selectedAnswer?: any;
  isFlagged: boolean;
  onSelectAnswer: (value: any) => void;
  onToggleFlag: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

export function AptisReadingSection({
  question,
  currentIndex,
  totalQuestions,
  selectedAnswer,
  isFlagged,
  onSelectAnswer,
  onToggleFlag,
  onNext,
  onPrevious,
}: AptisReadingSectionProps) {
  const [textSize, setTextSize] = useState<"sm" | "base" | "lg">("base");

  // For Part 2 ordering: list of items that user can shift up/down
  const orderList = Array.isArray(selectedAnswer)
    ? selectedAnswer
    : question.options?.map((o) => o.key) || [];

  const handleMoveOrder = (fromIdx: number, toIdx: number) => {
    if (toIdx < 0 || toIdx >= orderList.length) return;
    const next = [...orderList];
    const item = next.splice(fromIdx, 1)[0];
    next.splice(toIdx, 0, item);
    onSelectAnswer(next);
  };

  return (
    <div className="space-y-6">
      {/* READING PASSAGE CONTAINER (If present) */}
      {question.passageText && (
        <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
                <BookOpen className="size-4" />
              </div>
              <span className="text-xs font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                Ngữ Liệu Đoạn Văn
              </span>
            </div>

            {/* Font Size Adjuster */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300">
              <span className="px-1 text-[11px] text-slate-400">Cỡ chữ:</span>
              <button
                type="button"
                onClick={() => setTextSize("sm")}
                className={`px-2 py-0.5 rounded-lg cursor-pointer ${textSize === "sm" ? "bg-white dark:bg-slate-700 shadow-2xs text-emerald-600 font-black" : ""}`}
              >
                A-
              </button>
              <button
                type="button"
                onClick={() => setTextSize("base")}
                className={`px-2 py-0.5 rounded-lg cursor-pointer ${textSize === "base" ? "bg-white dark:bg-slate-700 shadow-2xs text-emerald-600 font-black" : ""}`}
              >
                A
              </button>
              <button
                type="button"
                onClick={() => setTextSize("lg")}
                className={`px-2 py-0.5 rounded-lg cursor-pointer ${textSize === "lg" ? "bg-white dark:bg-slate-700 shadow-2xs text-emerald-600 font-black" : ""}`}
              >
                A+
              </button>
            </div>
          </div>

          <div
            className={`prose dark:prose-invert max-w-none leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-wrap font-serif ${
              textSize === "sm" ? "text-xs sm:text-sm" : textSize === "lg" ? "text-base sm:text-lg" : "text-sm sm:text-base"
            }`}
          >
            {question.passageText}
          </div>
        </div>
      )}

      {/* QUESTION MAIN CARD */}
      <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 text-xs font-black uppercase">
              Reading Part {question.part}
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
            <Flag className={`size-3.5 ${isFlagged ? "fill-amber-400 text-amber-500" : ""}`} />
            <span>{isFlagged ? "Đã đánh dấu" : "Đánh dấu câu này"}</span>
          </button>
        </div>

        {/* Prompt */}
        <div className="space-y-2">
          {question.instructions && (
            <p className="text-xs text-slate-400 italic">
              {question.instructions}
            </p>
          )}
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
            {question.prompt}
          </h2>
        </div>

        {/* PART 2: TEXT COHESION / ORDERING INTERFACE */}
        {question.part === 2 ? (
          <div className="space-y-3 pt-2">
            <p className="text-xs font-semibold text-slate-500">
              Dùng các nút mũi tên lên/xuống để sắp xếp thứ tự các câu theo đúng trình tự câu chuyện:
            </p>
            <div className="space-y-2.5">
              {orderList.map((key: string, idx: number) => {
                const opt = question.options?.find((o) => o.key === key);
                if (!opt) return null;

                return (
                  <div
                    key={key}
                    className="flex items-center gap-3 p-3.5 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 transition-all"
                  >
                    <span className="flex items-center justify-center size-7 rounded-xl bg-emerald-600 text-white text-xs font-black shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-xs sm:text-sm font-semibold flex-1 text-slate-800 dark:text-slate-200">
                      {opt.content}
                    </span>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveOrder(idx, idx - 1)}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-200 text-slate-600 dark:text-slate-300 disabled:opacity-30 cursor-pointer"
                        title="Di chuyển lên"
                      >
                        <MoveUp className="size-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === orderList.length - 1}
                        onClick={() => handleMoveOrder(idx, idx + 1)}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-200 text-slate-600 dark:text-slate-300 disabled:opacity-30 cursor-pointer"
                        title="Di chuyển xuống"
                      >
                        <MoveDown className="size-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* STANDARD MULTIPLE CHOICE FOR PART 1, 3, 4 */
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
                    {opt.key || String.fromCharCode(65 + idx)}
                  </span>
                  <span className="text-sm sm:text-base font-semibold flex-1">
                    {opt.content}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Navigation buttons */}
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
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-black shadow-md shadow-emerald-600/25 cursor-pointer"
          >
            <span>{currentIndex + 1 >= totalQuestions ? "Kiểm tra toàn bộ" : "Câu tiếp theo"}</span>
            <ArrowRight className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
