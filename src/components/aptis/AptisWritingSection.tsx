"use client";

import type { AptisQuestion } from "@/types/aptis";
import { ArrowLeft, ArrowRight, CheckCircle2, Flag, PenTool } from "lucide-react";
import { useState } from "react";

function countWords(str: string): number {
  if (!str) return 0;
  return str.trim().split(/\s+/).filter(Boolean).length;
}

interface AptisWritingSectionProps {
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

export function AptisWritingSection({
  question,
  currentIndex,
  totalQuestions,
  selectedAnswer = {},
  isFlagged,
  onSelectAnswer,
  onToggleFlag,
  onNext,
  onPrevious,
}: AptisWritingSectionProps) {
  const part = question.part;

  // PART 1: Word-level 5 brief answers
  if (part === 1) {
    const answersObj = (typeof selectedAnswer === "object" ? selectedAnswer : {}) || {};
    return (
      <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 text-xs font-black uppercase">
            Writing Part 1: Form Completion (5 mục ngắn)
          </span>
          <button
            type="button"
            onClick={onToggleFlag}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500 cursor-pointer"
          >
            <Flag className={`size-3.5 ${isFlagged ? "fill-amber-400 text-amber-500" : ""}`} />
            <span>{isFlagged ? "Đã đánh dấu" : "Đánh dấu"}</span>
          </button>
        </div>

        <div className="space-y-1">
          <p className="text-xs text-slate-400 italic">{question.instructions}</p>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            {question.prompt}
          </h2>
        </div>

        <div className="space-y-4 pt-2">
          {question.subQuestions?.map((subQ) => (
            <div key={subQ.id} className="space-y-1.5">
              <label className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">
                {subQ.prompt}
              </label>
              <input
                value={answersObj[subQ.id] || ""}
                onChange={(e) =>
                  onSelectAnswer({ ...answersObj, [subQ.id]: e.target.value })
                }
                placeholder="Nhập thông tin ngắn gọn (1 - 5 từ)..."
                className="w-full h-12 px-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white focus:border-purple-600 focus:bg-white dark:focus:bg-slate-900 focus:outline-none transition-colors"
              />
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            disabled={currentIndex === 0}
            onClick={onPrevious}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold disabled:opacity-40"
          >
            <ArrowLeft className="size-4" /> Câu trước
          </button>
          <button
            type="button"
            onClick={onNext}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-black shadow-md cursor-pointer"
          >
            <span>Part tiếp theo</span> <ArrowRight className="size-4" />
          </button>
        </div>
      </div>
    );
  }

  // PART 2: Short text (20 - 30 words)
  if (part === 2) {
    const text = typeof selectedAnswer === "string" ? selectedAnswer : "";
    const words = countWords(text);
    const inRange = words >= (question.minWords || 20) && words <= (question.maxWords || 30);

    return (
      <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 text-xs font-black uppercase">
            Writing Part 2: Short Text Form (20 - 30 từ)
          </span>
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${
                inRange
                  ? "bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40"
                  : "bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/40"
              }`}
            >
              {words} / {question.minWords}-{question.maxWords} từ
            </span>
            <button
              type="button"
              onClick={onToggleFlag}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500 cursor-pointer"
            >
              <Flag className={`size-3.5 ${isFlagged ? "fill-amber-400 text-amber-500" : ""}`} />
            </button>
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-xs text-slate-400 italic">{question.instructions}</p>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            {question.prompt}
          </h2>
        </div>

        <div className="space-y-2">
          <textarea
            rows={5}
            value={text}
            onChange={(e) => onSelectAnswer(e.target.value)}
            placeholder="Viết đoạn văn của bạn tại đây (khoảng 20 - 30 từ)..."
            className="w-full p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white focus:border-purple-600 focus:bg-white dark:focus:bg-slate-900 focus:outline-none transition-colors"
          />
        </div>

        <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onPrevious}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold"
          >
            <ArrowLeft className="size-4" /> Câu trước
          </button>
          <button
            type="button"
            onClick={onNext}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-black shadow-md cursor-pointer"
          >
            <span>Part tiếp theo</span> <ArrowRight className="size-4" />
          </button>
        </div>
      </div>
    );
  }

  // PART 3: Social Network Group Chat (3 questions, 30 - 40 words each)
  if (part === 3) {
    const answersObj = (typeof selectedAnswer === "object" ? selectedAnswer : {}) || {};

    return (
      <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 text-xs font-black uppercase">
            Writing Part 3: Group Chat (3 câu, 30 - 40 từ mỗi câu)
          </span>
          <button
            type="button"
            onClick={onToggleFlag}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500 cursor-pointer"
          >
            <Flag className={`size-3.5 ${isFlagged ? "fill-amber-400 text-amber-500" : ""}`} />
          </button>
        </div>

        <div className="space-y-1">
          <p className="text-xs text-slate-400 italic">{question.instructions}</p>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            {question.prompt}
          </h2>
        </div>

        <div className="space-y-6 pt-2">
          {question.subQuestions?.map((subQ, idx) => {
            const subText = answersObj[subQ.id] || "";
            const subWords = countWords(subText);
            const inRange = subWords >= 30 && subWords <= 40;

            return (
              <div
                key={subQ.id}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-850 p-4 sm:p-5 space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                    {subQ.prompt}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold border ${
                      inRange
                        ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                    }`}
                  >
                    {subWords} / 30-40 từ
                  </span>
                </div>

                <textarea
                  rows={3}
                  value={subText}
                  onChange={(e) =>
                    onSelectAnswer({ ...answersObj, [subQ.id]: e.target.value })
                  }
                  placeholder={`Phản hồi tin nhắn ${idx + 1} (30 - 40 từ)...`}
                  className="w-full p-3.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-semibold focus:border-purple-600 focus:outline-none"
                />
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onPrevious}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold"
          >
            <ArrowLeft className="size-4" /> Câu trước
          </button>
          <button
            type="button"
            onClick={onNext}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-black shadow-md cursor-pointer"
          >
            <span>Part tiếp theo</span> <ArrowRight className="size-4" />
          </button>
        </div>
      </div>
    );
  }

  // PART 4: Informal & Formal Email Writing (Task 1 & Task 2)
  const answersObj = (typeof selectedAnswer === "object" ? selectedAnswer : {}) || {};
  const email1 = answersObj["email_1"] || "";
  const email2 = answersObj["email_2"] || "";
  const words1 = countWords(email1);
  const words2 = countWords(email2);

  return (
    <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 text-xs font-black uppercase">
          Writing Part 4: Email Writing (Thân mật & Trang trọng)
        </span>
        <button
          type="button"
          onClick={onToggleFlag}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500 cursor-pointer"
        >
          <Flag className={`size-3.5 ${isFlagged ? "fill-amber-400 text-amber-500" : ""}`} />
        </button>
      </div>

      <div className="rounded-2xl border border-purple-200 dark:border-purple-900/50 bg-purple-50/40 dark:bg-purple-950/20 p-4 space-y-1">
        <p className="text-xs font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider">
          Ngữ cảnh tình huống đề bài:
        </p>
        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
          {question.prompt}
        </p>
      </div>

      {/* Task 1: Informal Email */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
            Task 1: Email gửi bạn bè (Informal Email ~ 50 từ)
          </label>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            {words1} / ~50 từ
          </span>
        </div>
        <textarea
          rows={5}
          value={email1}
          onChange={(e) =>
            onSelectAnswer({ ...answersObj, email_1: e.target.value })
          }
          placeholder="Hi Sarah, ..."
          className="w-full p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold focus:border-purple-600 focus:outline-none"
        />
      </div>

      {/* Task 2: Formal Email */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
            Task 2: Email trang trọng gửi Chủ tịch CLB (Formal Email 120 - 150 từ)
          </label>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            {words2} / 120-150 từ
          </span>
        </div>
        <textarea
          rows={8}
          value={email2}
          onChange={(e) =>
            onSelectAnswer({ ...answersObj, email_2: e.target.value })
          }
          placeholder="Dear Mr. President / Dear Club Committee, ..."
          className="w-full p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold focus:border-purple-600 focus:outline-none"
        />
      </div>

      <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <button
          type="button"
          onClick={onPrevious}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold"
        >
          <ArrowLeft className="size-4" /> Câu trước
        </button>
        <button
          type="button"
          onClick={onNext}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-black shadow-md cursor-pointer"
        >
          <span>Kiểm tra & Hoàn thành Phần Viết</span> <ArrowRight className="size-4" />
        </button>
      </div>
    </div>
  );
}
