"use client";

import { Link } from "@/i18n/routing";
import type { StudySessionResult } from "@/types/vocabulary";
import type { StudyLog } from "@/stores/useVocabStudyStore";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  HelpCircle,
  RotateCcw,
  Sparkles,
  Trophy,
  XCircle,
} from "lucide-react";

export default function StudyResult({
  result,
  logs,
  slug,
  backHref,
}: {
  result: StudySessionResult;
  logs: StudyLog[];
  slug?: string;
  backHref?: string;
}) {
  const reviewAgain = logs.filter((item) => !item.correct);
  const studyAgain =
    backHref || (slug ? `/vocabulary/${slug}/study?mode=FLASHCARD` : "/vocabulary/review");
  const deckHref = slug && slug !== "due-review" ? `/vocabulary/${slug}` : "/vocabulary";

  const isExcellent = result.accuracy >= 80;

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-10 space-y-8 shadow-2xl animate-in zoom-in-95 duration-300">
      {/* Trophy & Congratulation Banner */}
      <div className="text-center space-y-3">
        <div className="relative inline-block">
          <div className="w-20 h-20 rounded-3xl bg-linear-to-tr from-amber-400 to-amber-500 text-white flex items-center justify-center mx-auto shadow-xl shadow-amber-500/25 animate-bounce">
            <Trophy className="size-10" />
          </div>
          <Sparkles className="absolute -top-1 -right-1 size-6 text-amber-400 animate-pulse" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          {isExcellent ? "Hoàn Thành Xuất Sắc!" : "Hoàn Thành Phiên Học!"}
        </h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Dữ liệu ghi nhớ đã được cập nhật vào thuật toán spaced repetition SRS của bạn.
        </p>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 text-center">
        <div className="p-4 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50">
          <div className="text-2xl sm:text-3xl font-black text-blue-700 dark:text-blue-300">
            {result.cardsReviewed}
          </div>
          <div className="text-xs text-slate-500 font-semibold mt-0.5">Thẻ đã học</div>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50">
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
            {result.cardsCorrect}
          </div>
          <div className="text-xs text-slate-500 font-semibold mt-0.5">Thuộc ngay</div>
        </div>

        <div className="p-4 rounded-2xl bg-rose-50/80 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/50">
          <div className="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-400">
            {reviewAgain.length}
          </div>
          <div className="text-xs text-slate-500 font-semibold mt-0.5">Cần ôn lại</div>
        </div>
      </div>

      {/* Accuracy Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-2">
        <div className="flex justify-between text-xs sm:text-sm font-bold">
          <span className="text-slate-600 dark:text-slate-300">Độ chính xác phiên này</span>
          <span className="text-primary dark:text-[#7b9bee]">{result.accuracy}%</span>
        </div>
        <div className="h-2.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
          <div
            className="h-full bg-linear-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-700"
            style={{ width: `${result.accuracy}%` }}
          />
        </div>
      </div>

      {/* Words to Review (if any) */}
      {reviewAgain.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <XCircle className="size-3.5 text-rose-500" />
            <span>Các từ cần củng cố lại sớm:</span>
          </p>
          <div className="grid sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
            {reviewAgain.map((item) => (
              <div
                key={item.vocabularyId}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-800 text-xs font-semibold"
              >
                <span className="text-slate-800 dark:text-slate-200">{item.headword}</span>
                <span className="text-rose-600 dark:text-rose-400 font-bold px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/60 text-[10px]">
                  Again
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Next Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        <Link
          href={studyAgain}
          className="inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-primary hover:bg-primary/90 text-white text-xs sm:text-sm font-black shadow-lg shadow-primary/25 transition-all text-center"
        >
          <RotateCcw className="size-4" /> Học tiếp Flashcard
        </Link>
        <Link
          href={slug ? `/vocabulary/${slug}/study?mode=QUIZ` : "/vocabulary/review?mode=QUIZ"}
          className="inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-bold transition-all text-center"
        >
          <HelpCircle className="size-4 text-primary dark:text-[#7b9bee]" /> Luyện Quiz
        </Link>
        <Link
          href={deckHref}
          className="inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-bold transition-all text-center"
        >
          <BookOpen className="size-4 text-slate-400" />
          {slug && slug !== "due-review" ? "Về bộ từ" : "Về kho từ vựng"}
        </Link>
      </div>
    </div>
  );
}
