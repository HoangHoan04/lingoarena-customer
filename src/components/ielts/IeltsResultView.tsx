"use client";

import { Link } from "@/i18n/routing";
import type { IeltsExam, IeltsExamResult, IeltsSectionKey } from "@/types/ielts";
import {
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  Headphones,
  Mic,
  PenTool,
  RotateCcw,
  Sparkles,
  Trophy,
} from "lucide-react";
import { useState } from "react";

interface IeltsResultViewProps {
  exam: IeltsExam;
  result: IeltsExamResult;
  onRestartExam: () => void;
}

const SECTION_ICONS = {
  listening: Headphones,
  reading: BookOpen,
  writing: PenTool,
  speaking: Mic,
};

export function IeltsResultView({
  exam,
  result,
  onRestartExam,
}: IeltsResultViewProps) {
  const [activeTab, setActiveTab] = useState<"summary" | "review">("summary");
  const [reviewSection, setReviewSection] = useState<IeltsSectionKey>("listening");

  const formatSeconds = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins} phút ${secs} giây`;
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* IELTS OFFICIAL TRF BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-slate-950 via-[#3a1520] to-slate-950 text-white p-6 sm:p-10 border border-slate-800 shadow-2xl space-y-6">
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-bold uppercase tracking-wider text-rose-200">
              <Award className="size-4 text-amber-400" />
              <span>IELTS Official Computer Test Report</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white">
              {exam.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Hoàn thành: {new Date(result.completedAt).toLocaleString("vi-VN")} · Thời gian làm bài: {formatSeconds(result.totalTimeSpentSeconds)}
            </p>
          </div>

          {/* OVERALL BAND BADGE */}
          <div className="flex flex-col items-center justify-center p-6 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl shrink-0 min-w-48 text-center">
            <span className="text-[11px] font-black uppercase tracking-wider text-rose-200">
              Overall Band Score
            </span>
            <div className="text-4xl sm:text-5xl font-black text-amber-400 my-1 drop-shadow-md">
              Band {result.overallBand.toFixed(1)}
            </div>
            <span className="text-xs font-bold text-slate-200">
              {result.bandDescription}
            </span>
          </div>
        </div>

        {/* 4 SKILL SCORES */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {exam.sections.map((sec) => {
            const scoreData = result.skillScores[sec.key];
            const Icon = SECTION_ICONS[sec.key] || Sparkles;

            return (
              <div
                key={sec.key}
                className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <div className="p-1.5 rounded-xl bg-white/10 text-rose-300">
                    <Icon className="size-4" />
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-300">
                    {scoreData?.rawCorrect}/{scoreData?.totalQuestions}
                  </span>
                </div>

                <div>
                  <div className="text-[11px] font-bold text-slate-300 uppercase">{sec.name}</div>
                  <div className="text-2xl font-black text-white">
                    Band {scoreData?.bandScore.toFixed(1) || "6.5"}
                  </div>
                </div>
              </div>
            );
          })}
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
                  ? "bg-rose-600 text-white shadow-xs"
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
                  ? "bg-rose-600 text-white shadow-xs"
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
            <span>Thi lại đề IELTS này</span>
          </button>
        </div>

        {activeTab === "summary" ? (
          <div className="space-y-6">
            <div className="rounded-2xl border border-rose-200 dark:border-rose-900/40 bg-rose-50/50 dark:bg-rose-950/20 p-5 space-y-2">
              <h4 className="text-sm font-black text-rose-900 dark:text-rose-200 flex items-center gap-2">
                <Sparkles className="size-4 text-rose-600" />
                <span>Quy chuẩn tính điểm IELTS Band 0 - 9.0:</span>
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Điểm tổng Overall Band Score được tính bằng trung bình cộng điểm của cả 4 kỹ năng Nghe, Đọc, Viết, Nói và làm tròn theo quy tắc 0.25 (lên 0.5) và 0.75 (lên 1.0).
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <button
                type="button"
                onClick={onRestartExam}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-black shadow-lg shadow-rose-600/25 cursor-pointer"
              >
                <RotateCcw className="size-4" />
                <span>Luyện thi lại từ đầu</span>
              </button>

              <Link
                href="/practice/ielts"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl border-2 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <BookOpen className="size-4" />
                <span>Xem danh sách đề IELTS khác</span>
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
                      ? "bg-rose-600 text-white font-black shadow-xs"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  {sec.name}
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
                    <span className="font-black text-rose-600">Câu {idx + 1} ({q.partTitle || "Part " + q.part})</span>
                    {q.correctAnswer && (
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="size-3.5" /> Đáp án: {String(q.correctAnswer)}
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
                          <span className="font-bold mr-1.5">{opt.key}.</span> {opt.content}
                        </div>
                      ))}
                    </div>
                  )}

                  {q.explanation && (
                    <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-300">
                      <strong className="text-slate-800 dark:text-slate-200">Giải thích:</strong> {q.explanation}
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
