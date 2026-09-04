"use client";

import { Link } from "@/i18n/routing";
import type {
  ToeicExam,
  ToeicExamResult,
  ToeicSectionKey,
} from "@/types/toeic";
import {
  Award,
  BookOpen,
  CheckCircle2,
  Headphones,
  Mic,
  PenTool,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { useState } from "react";

interface ToeicResultViewProps {
  exam: ToeicExam;
  result: ToeicExamResult;
  onRestartExam: () => void;
}

const SECTION_ICONS: Record<ToeicSectionKey, any> = {
  listening: Headphones,
  reading: BookOpen,
  speaking: Mic,
  writing: PenTool,
};

export function ToeicResultView({
  exam,
  result,
  onRestartExam,
}: ToeicResultViewProps) {
  const [activeTab, setActiveTab] = useState<"summary" | "review">("summary");
  const [reviewSection, setReviewSection] =
    useState<ToeicSectionKey>("listening");

  const formatSeconds = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins} phút ${secs} giây`;
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* SCORE BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-slate-950 via-[#1b2b52] to-slate-950 text-white p-6 sm:p-10 border border-slate-800 shadow-2xl space-y-6">
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-bold uppercase tracking-wider text-blue-200">
              <Award className="size-4 text-amber-400" />
              <span>Phiếu Điểm TOEIC 4 Kỹ Năng Chuẩn ETS</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white">
              {exam.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Hoàn thành: {new Date(result.completedAt).toLocaleString("vi-VN")}{" "}
              · Tổng thời gian: {formatSeconds(result.totalTimeSpentSeconds)}
            </p>
          </div>

          {/* TOTAL SCORE BADGES */}
          <div className="flex gap-3">
            {/* L&R Score */}
            <div className="flex flex-col items-center justify-center p-5 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl text-center">
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-200">
                Listening & Reading
              </span>
              <div className="text-3xl sm:text-4xl font-black text-amber-400 my-1">
                {result.totalLRScore}{" "}
                <span className="text-xs text-slate-300">/ 990</span>
              </div>
              <span className="text-[11px] font-bold text-slate-200">
                L: {result.listeningScaledScore} | R:{" "}
                {result.readingScaledScore}
              </span>
            </div>

            {/* S&W Score */}
            <div className="flex flex-col items-center justify-center p-5 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl text-center">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-200">
                Speaking & Writing
              </span>
              <div className="text-3xl sm:text-4xl font-black text-emerald-400 my-1">
                {result.totalSWScore}{" "}
                <span className="text-xs text-slate-300">/ 400</span>
              </div>
              <span className="text-[11px] font-bold text-slate-200">
                S: {result.speakingScaledScore} | W: {result.writingScaledScore}
              </span>
            </div>
          </div>
        </div>

        {/* 4 DETAILED SKILL SCORES */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-[11px] text-slate-300 font-semibold flex items-center gap-1">
              <Headphones className="size-3 text-blue-400" /> Listening
            </div>
            <div className="text-xl font-black text-white mt-1">
              {result.listeningScaledScore} / 495
            </div>
            <div className="text-[10px] text-slate-400">
              Đúng {result.listeningRawScore}/100 câu
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-[11px] text-slate-300 font-semibold flex items-center gap-1">
              <BookOpen className="size-3 text-emerald-400" /> Reading
            </div>
            <div className="text-xl font-black text-emerald-400 mt-1">
              {result.readingScaledScore} / 495
            </div>
            <div className="text-[10px] text-slate-400">
              Đúng {result.readingRawScore}/100 câu
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-[11px] text-slate-300 font-semibold flex items-center gap-1">
              <Mic className="size-3 text-amber-400" /> Speaking
            </div>
            <div className="text-xl font-black text-amber-400 mt-1">
              {result.speakingScaledScore} / 200
            </div>
            <div className="text-[10px] text-slate-400">
              Hoàn thành 11 câu hỏi
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-[11px] text-slate-300 font-semibold flex items-center gap-1">
              <PenTool className="size-3 text-purple-400" /> Writing
            </div>
            <div className="text-xl font-black text-purple-400 mt-1">
              {result.writingScaledScore} / 200
            </div>
            <div className="text-[10px] text-slate-400">
              Hoàn thành 8 câu hỏi
            </div>
          </div>
        </div>
      </div>

      {/* TABS & REVIEW */}
      <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("summary")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                activeTab === "summary"
                  ? "bg-brand text-white shadow-xs"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
              }`}
            >
              Tổng quan kết quả
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("review")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                activeTab === "review"
                  ? "bg-brand text-white shadow-xs"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
              }`}
            >
              Xem lại từng câu hỏi
            </button>
          </div>

          <button
            type="button"
            onClick={onRestartExam}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold cursor-pointer"
          >
            <RotateCcw className="size-3.5" />
            <span>Thi lại đề TOEIC này</span>
          </button>
        </div>

        {activeTab === "summary" ? (
          <div className="space-y-6">
            <div className="rounded-2xl border border-blue-200 dark:border-blue-900/40 bg-blue-50/50 dark:bg-blue-950/20 p-5 space-y-2">
              <h4 className="text-sm font-black text-blue-900 dark:text-blue-200 flex items-center gap-2">
                <Sparkles className="size-4 text-blue-600" />
                <span>Quy chuẩn tính điểm TOEIC 4 Kỹ Năng ETS:</span>
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Bài thi TOEIC 4 kỹ năng đánh giá toàn diện năng lực tiếng Anh
                trong môi trường làm việc quốc tế: Nghe & Đọc (10 - 990 điểm)
                kết hợp Nói & Viết (0 - 400 điểm).
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <button
                type="button"
                onClick={onRestartExam}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-brand hover:bg-brand/90 text-white text-xs sm:text-sm font-black shadow-lg shadow-brand/25 cursor-pointer"
              >
                <RotateCcw className="size-4" />
                <span>Luyện thi lại từ đầu</span>
              </button>

              <Link
                href="/practice/toeic"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl border-2 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <BookOpen className="size-4" />
                <span>Xem danh sách đề TOEIC khác</span>
              </Link>
            </div>
          </div>
        ) : (
          /* REVIEW MODE */
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              {exam.sections.map((sec) => (
                <button
                  key={sec.key}
                  type="button"
                  onClick={() => setReviewSection(sec.key)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    reviewSection === sec.key
                      ? "bg-brand text-white font-black shadow-xs"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  {sec.name} ({exam.questions[sec.key]?.length || 0} câu)
                </button>
              ))}
            </div>

            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
              {exam.questions[reviewSection]?.map((q, idx) => (
                <div
                  key={q.id}
                  className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850 space-y-3"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-black text-primary">
                      Câu {q.number || idx + 1} (
                      {q.partTitle || "Part " + q.part})
                    </span>
                    {q.correctAnswer && (
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="size-3.5" /> Đáp án đúng:{" "}
                        {q.correctAnswer}
                      </span>
                    )}
                  </div>

                  <p className="text-sm font-bold text-slate-900 dark:text-white leading-relaxed">
                    {q.prompt}
                  </p>

                  {q.options && (
                    <div className="grid sm:grid-cols-2 gap-2 pt-1">
                      {q.options.map((opt) => (
                        <div
                          key={opt.key}
                          className={`p-2.5 rounded-xl text-xs font-medium border ${
                            opt.key === q.correctAnswer
                              ? "border-emerald-400 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200 font-bold"
                              : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400"
                          }`}
                        >
                          <span className="font-bold mr-1.5">{opt.key}.</span>{" "}
                          {opt.content}
                        </div>
                      ))}
                    </div>
                  )}

                  {q.explanation && (
                    <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-300">
                      <strong className="text-slate-800 dark:text-slate-200">
                        Giải thích:
                      </strong>{" "}
                      {q.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
