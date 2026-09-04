"use client";

import type {
  ReadingPassage,
  ReadingScoreReport,
} from "@/types/reading";
import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock,
  Gauge,
  Lightbulb,
  RotateCcw,
  Sparkles,
  Target,
  Trophy,
  XCircle,
} from "lucide-react";

interface ReadingResultViewProps {
  passage: ReadingPassage;
  report: ReadingScoreReport;
  onRetry: () => void;
  onBackToCatalog: () => void;
}

export function ReadingResultView({
  passage,
  report,
  onRetry,
  onBackToCatalog,
}: ReadingResultViewProps) {
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}m ${s}s`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 animate-in fade-in-50 duration-300">
      {/* HEADER BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-slate-950 via-[#102a3a] to-slate-950 text-white p-6 sm:p-10 border border-slate-800 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-black uppercase tracking-wider mb-2">
              <Trophy className="size-3.5" />
              <span>Kết Quả Đọc Hiểu Chi Tiết</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              {passage.title}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Dạng bài: {passage.category} · CEFR {passage.level}
            </p>
          </div>

          {/* ACCURACY BADGE */}
          <div className="text-center p-4 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 shadow-xl shrink-0">
            <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400">
              Độ Chính Xác
            </span>
            <div className="text-3xl sm:text-4xl font-black text-white mt-0.5">
              {report.correctCount}/{report.totalQuestions} ({report.scorePercent}%)
            </div>
          </div>
        </div>

        {/* METRICS PILLS */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-slate-400">Tốc độ đọc (Reading Speed)</span>
            <div className="text-base font-black text-cyan-300 flex items-center gap-1.5">
              <Gauge className="size-4 text-cyan-400" />
              <span>{report.wordsPerMinute} WPM</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-slate-400">Thời gian làm bài</span>
            <div className="text-base font-black text-amber-300 flex items-center gap-1.5">
              <Clock className="size-4 text-amber-400" />
              <span>{formatTime(report.timeSpentSec)}</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-slate-400">Tổng số từ văn bản</span>
            <div className="text-base font-black text-emerald-300 flex items-center gap-1.5">
              <BookOpen className="size-4 text-emerald-400" />
              <span>{passage.wordCount} từ</span>
            </div>
          </div>
        </div>
      </div>

      {/* DETAILED QUESTION-BY-QUESTION EXPLANATIONS */}
      <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm space-y-6">
        <h3 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <Lightbulb className="size-5 text-amber-500" />
          <span>Phân Tích Chi Tiết & Trích Dẫn Dẫn Chứng (Evidence Locator)</span>
        </h3>

        <div className="space-y-6">
          {passage.questions.map((q, idx) => {
            const ansReport = report.answers.find((a) => a.questionId === q.id);
            const isCorrect = !!ansReport?.isCorrect;

            return (
              <div
                key={q.id}
                className={`p-5 sm:p-6 rounded-2xl border space-y-4 ${
                  isCorrect
                    ? "border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/30 dark:bg-emerald-950/10"
                    : "border-rose-200 dark:border-rose-900/60 bg-rose-50/30 dark:bg-rose-950/10"
                }`}
              >
                {/* QUESTION TITLE & STATUS */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <span
                      className={`flex items-center justify-center size-6 rounded-lg text-white text-xs font-black shrink-0 mt-0.5 ${
                        isCorrect ? "bg-emerald-600" : "bg-rose-600"
                      }`}
                    >
                      {q.questionNumber}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                      {q.questionText}
                    </h4>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black shrink-0 ${
                      isCorrect
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                        : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                    }`}
                  >
                    {isCorrect ? <CheckCircle2 className="size-3.5" /> : <XCircle className="size-3.5" />}
                    <span>{isCorrect ? "Chính xác" : "Chưa đúng"}</span>
                  </span>
                </div>

                {/* USER ANSWER VS CORRECT ANSWER */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-0.5">
                    <span className="text-[11px] text-slate-400 font-bold block">
                      Câu trả lời của bạn:
                    </span>
                    <span
                      className={`font-black ${
                        isCorrect ? "text-emerald-600" : "text-rose-600"
                      }`}
                    >
                      {q.options && typeof ansReport?.userAnswer === "number"
                        ? q.options[ansReport.userAnswer]
                        : String(ansReport?.userAnswer)}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-0.5">
                    <span className="text-[11px] text-slate-400 font-bold block">
                      Đáp án đúng chuẩn:
                    </span>
                    <span className="font-black text-emerald-600 dark:text-emerald-400">
                      {q.options && typeof q.correctAnswer === "number"
                        ? q.options[q.correctAnswer]
                        : String(q.correctAnswer)}
                    </span>
                  </div>
                </div>

                {/* EVIDENCE SNIPPET */}
                {q.evidenceSnippet && (
                  <div className="p-3.5 rounded-xl bg-cyan-50/70 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-900/60 text-xs space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-cyan-800 dark:text-cyan-300">
                      📍 Dẫn chứng trong văn bản:
                    </span>
                    <p className="italic text-cyan-950 dark:text-cyan-200 font-medium leading-relaxed">
                      "{q.evidenceSnippet}"
                    </p>
                  </div>
                )}

                {/* EXPLANATION */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800 text-xs space-y-1 text-slate-700 dark:text-slate-300 leading-relaxed">
                  <span className="font-bold text-slate-900 dark:text-white">
                    💡 Giải thích chi tiết:
                  </span>
                  <p>{q.explanationVi}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <button
          type="button"
          onClick={onBackToCatalog}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 cursor-pointer"
        >
          <ArrowLeft className="size-4" />
          <span>Chọn bài đọc khác</span>
        </button>

        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-black shadow-lg shadow-cyan-600/25 transition-all cursor-pointer"
        >
          <RotateCcw className="size-4" />
          <span>Làm lại bài đọc này</span>
        </button>
      </div>
    </div>
  );
}
