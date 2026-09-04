"use client";

import type { ToeicQuestion } from "@/types/toeic";
import { ArrowLeft, ArrowRight, CheckCircle2, Flag } from "lucide-react";

function countWords(str: string): number {
  if (!str) return 0;
  return str.trim().split(/\s+/).filter(Boolean).length;
}

interface ToeicWritingStudioProps {
  question: ToeicQuestion;
  currentIndex: number;
  totalQuestions: number;
  selectedAnswer?: string;
  isFlagged: boolean;
  onSelectAnswer: (text: string) => void;
  onToggleFlag: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

export function ToeicWritingStudio({
  question,
  currentIndex,
  totalQuestions,
  selectedAnswer = "",
  isFlagged,
  onSelectAnswer,
  onToggleFlag,
  onNext,
  onPrevious,
}: ToeicWritingStudioProps) {
  const isPictureSentence = question.number <= 5;
  const isEmail = question.number === 6 || question.number === 7;
  const isEssay = question.number === 8;

  const words = countWords(selectedAnswer);
  const minWords = question.minWords || 300;

  // Check required keywords presence for Q1-5
  const keywords = question.requiredKeywords || [];
  const keyword1 = keywords[0] || "";
  const keyword2 = keywords[1] || "";
  const hasKw1 = selectedAnswer
    .toLowerCase()
    .includes(keyword1.toLowerCase().slice(0, 4));
  const hasKw2 = selectedAnswer
    .toLowerCase()
    .includes(keyword2.toLowerCase().slice(0, 4));

  return (
    <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 text-xs font-black uppercase">
            TOEIC Writing (Question {question.number} / {totalQuestions})
          </span>
          <span className="text-xs font-bold text-slate-400">
            {question.partTitle}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {isEssay && (
            <div
              className={`px-3.5 py-1.5 rounded-xl border text-xs font-mono font-bold ${
                words >= minWords
                  ? "bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300"
                  : "bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300"
              }`}
            >
              Số từ: <strong>{words}</strong> / tối thiểu {minWords} từ
            </div>
          )}

          <button
            type="button"
            onClick={onToggleFlag}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-500 cursor-pointer"
          >
            <Flag
              className={`size-3.5 ${isFlagged ? "fill-amber-400 text-amber-500" : ""}`}
            />
            <span>{isFlagged ? "Đã gắn cờ" : "Gắn cờ"}</span>
          </button>
        </div>
      </div>

      {/* QUESTION 1 - 5: PICTURE + KEYWORDS */}
      {isPictureSentence && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/40 dark:bg-blue-950/20 p-4 space-y-2">
            <p className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">
              {question.instructions}
            </p>
            <div className="flex items-center gap-3 pt-1">
              <span className="text-xs font-bold text-slate-500">
                2 từ khóa bắt buộc:
              </span>
              <span
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-bold border ${
                  hasKw1
                    ? "bg-emerald-50 text-emerald-700 border-emerald-300 font-black"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                }`}
              >
                {hasKw1 ? (
                  <CheckCircle2 className="size-3 text-emerald-600" />
                ) : null}
                {keyword1}
              </span>
              <span
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-bold border ${
                  hasKw2
                    ? "bg-emerald-50 text-emerald-700 border-emerald-300 font-black"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                }`}
              >
                {hasKw2 ? (
                  <CheckCircle2 className="size-3 text-emerald-600" />
                ) : null}
                {keyword2}
              </span>
            </div>
          </div>

          {question.imageUrl && (
            <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 max-h-80 flex items-center justify-center bg-slate-100 dark:bg-slate-800">
              <img
                src={question.imageUrl}
                alt="TOEIC Writing Picture"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Viết câu của bạn (1 câu hoàn chỉnh chứa 2 từ trên):
            </label>
            <input
              value={selectedAnswer}
              onChange={(e) => onSelectAnswer(e.target.value)}
              placeholder={`Viết câu sử dụng "${keyword1}" và "${keyword2}"...`}
              className="w-full h-13 px-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white focus:border-blue-600 focus:bg-white dark:focus:bg-slate-900 focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* QUESTION 6 - 7: EMAIL RESPONSE */}
      {isEmail && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/40 dark:bg-blue-950/20 p-5 space-y-2">
            <p className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">
              {question.instructions}
            </p>
            <pre className="font-sans text-xs sm:text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
              {question.prompt}
            </pre>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Thư phản hồi của bạn:
            </label>
            <textarea
              rows={10}
              value={selectedAnswer}
              onChange={(e) => onSelectAnswer(e.target.value)}
              placeholder="Dear Mr. Sullivan / Hello Patricia, ..."
              className="w-full p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold focus:border-blue-600 focus:bg-white dark:focus:bg-slate-900 focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* QUESTION 8: OPINION ESSAY */}
      {isEssay && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/40 dark:bg-blue-950/20 p-5 space-y-2">
            <p className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">
              {question.instructions}
            </p>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-relaxed whitespace-pre-wrap">
              {question.prompt}
            </h2>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Bài luận của bạn (Tối thiểu 300 từ):
            </label>
            <textarea
              rows={14}
              value={selectedAnswer}
              onChange={(e) => onSelectAnswer(e.target.value)}
              placeholder="Nhập bài luận TOEIC Writing Task 3 tại đây..."
              className="w-full p-5 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold leading-relaxed focus:border-blue-600 focus:bg-white dark:focus:bg-slate-900 focus:outline-none"
            />
          </div>
        </div>
      )}

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
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand hover:bg-brand/90 text-white text-xs font-black shadow-md cursor-pointer"
        >
          <span>
            {currentIndex + 1 >= totalQuestions
              ? "Kiểm tra toàn bộ phần Viết"
              : "Câu tiếp theo"}
          </span>
          <ArrowRight className="size-4" />
        </button>
      </div>
    </div>
  );
}
