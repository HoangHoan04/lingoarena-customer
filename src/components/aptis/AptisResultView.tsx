"use client";

import { Link } from "@/i18n/routing";
import type {
  AptisExam,
  AptisExamResult,
  AptisSectionKey,
} from "@/types/aptis";
import {
  Award,
  BookOpen,
  CheckCircle2,
  Headphones,
  Mic,
  PenTool,
  RotateCcw,
  Sparkles,
  Trophy,
} from "lucide-react";
import { useState } from "react";

interface AptisResultViewProps {
  exam: AptisExam;
  result: AptisExamResult;
  onRestartExam: () => void;
}

const SECTION_ICONS: Record<AptisSectionKey, any> = {
  grammar_vocab: Sparkles,
  listening: Headphones,
  reading: BookOpen,
  writing: PenTool,
  speaking: Mic,
};

export function AptisResultView({
  exam,
  result,
  onRestartExam,
}: AptisResultViewProps) {
  const [activeTab, setActiveTab] = useState<"summary" | "review">("summary");
  const [reviewSection, setReviewSection] =
    useState<AptisSectionKey>("grammar_vocab");

  const formatSeconds = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins} phút ${secs} giây`;
  };

  const sectionScores = result.sectionScores;

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* CERTIFICATE SCORE BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-slate-950 via-[#192b56] to-slate-950 text-white p-6 sm:p-10 border border-slate-800 shadow-2xl space-y-6">
        <div className="absolute -top-24 -right-24 size-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 size-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold uppercase tracking-wider text-blue-200">
              <Award className="size-4 text-amber-400" />
              <span>Báo Cáo Kết Quả Thi Thử Aptis ESOL</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              {exam.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Hoàn thành lúc:{" "}
              {new Date(result.completedAt).toLocaleString("vi-VN")} · Tổng thời
              gian: {formatSeconds(result.totalTimeSpentSeconds)}
            </p>
          </div>

          {/* OVERALL CEFR BADGE */}
          <div className="flex flex-col items-center justify-center p-6 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl shrink-0 min-w-44 text-center">
            <span className="text-[11px] font-black uppercase tracking-wider text-blue-200">
              Trình Độ Đạt Được
            </span>
            <div className="text-4xl sm:text-5xl font-black text-amber-400 my-1 drop-shadow-md">
              CEFR {result.overallCefr}
            </div>
            <span className="text-xs font-bold text-slate-200">
              {result.overallCefr === "C" ||
              result.overallCefr === "C1" ||
              result.overallCefr === "C2"
                ? "Proficient User"
                : result.overallCefr === "B2" || result.overallCefr === "B1"
                  ? "Independent User"
                  : "Basic User"}
            </span>
          </div>
        </div>

        {/* 2 Main Scores */}
        <div className="relative z-10 grid grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-300 font-semibold">
                Điểm 4 Kỹ Năng (Scaled Score)
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white">
                {result.overallScaledScore} / 200
              </div>
            </div>
            <Trophy className="size-8 text-amber-400 opacity-80" />
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-300 font-semibold">
                Điểm Ngữ Pháp & Từ Vựng (Core)
              </div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-400">
                {result.grammarVocabScore} / 50
              </div>
            </div>
            <Sparkles className="size-8 text-emerald-400 opacity-80" />
          </div>
        </div>
      </div>

      {/* 5 SECTION SCORE CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
        {exam.sections.map((section) => {
          const scoreData = sectionScores[section.key];
          const Icon = SECTION_ICONS[section.key] || Sparkles;

          return (
            <div
              key={section.key}
              className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    <Icon className="size-4 text-primary" />
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary dark:text-[#7b9bee] text-xs font-black">
                    CEFR {scoreData?.cefrBand || "B2"}
                  </span>
                </div>

                <div>
                  <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">
                    {section.title}
                  </h3>
                  <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                    {scoreData?.score || 0} / 50
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 font-medium pt-2 border-t border-slate-100 dark:border-slate-800">
                {scoreData?.feedback || "Đạt yêu cầu chuẩn Aptis ESOL"}
              </div>
            </div>
          );
        })}
      </div>

      {/* TABS: SUMMARY VS DETAILED REVIEW */}
      <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("summary")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                activeTab === "summary"
                  ? "bg-brand text-white shadow-xs"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
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
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
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
            <span>Thi lại đề này</span>
          </button>
        </div>

        {activeTab === "summary" ? (
          <div className="space-y-6">
            <div className="rounded-2xl border border-blue-200 dark:border-blue-900/40 bg-blue-50/50 dark:bg-blue-950/20 p-5 space-y-2">
              <h4 className="text-sm font-black text-blue-900 dark:text-blue-200 flex items-center gap-2">
                <Sparkles className="size-4 text-blue-600" />
                <span>
                  Quy đổi khung tham chiếu ngôn ngữ chung Châu Âu (CEFR):
                </span>
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Bài thi Aptis ESOL của British Council đánh giá chính xác trình
                độ tiếng Anh từ A1 (Cơ bản) đến C (Thành thạo). Điểm phần Ngữ
                pháp & Từ vựng đóng vai trò chuẩn hóa và đối chiếu kết quả cho 4
                kỹ năng Nghe, Đọc, Viết, Nói.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <button
                type="button"
                onClick={onRestartExam}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-brand hover:bg-brand/90 text-white text-xs sm:text-sm font-black shadow-lg shadow-brand/25 cursor-pointer"
              >
                <RotateCcw className="size-4" />
                <span>Luyện thi lại từ đầu</span>
              </button>

              <Link
                href="/practice/aptis"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl border-2 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <BookOpen className="size-4" />
                <span>Xem danh sách đề Aptis khác</span>
              </Link>
            </div>
          </div>
        ) : (
          /* DETAILED REVIEW MODE */
          <div className="space-y-6">
            {/* Section Switcher Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              {exam.sections.map((sec) => (
                <button
                  key={sec.key}
                  type="button"
                  onClick={() => setReviewSection(sec.key)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    reviewSection === sec.key
                      ? "bg-primary text-white shadow-xs font-black"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                  }`}
                >
                  {sec.title}
                </button>
              ))}
            </div>

            {/* Questions list for selected section */}
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
              {exam.questions[reviewSection]?.map((q, idx) => (
                <div
                  key={q.id}
                  className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850 space-y-3"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-black text-primary">
                      Câu {idx + 1} ({q.partTitle || "Part " + q.part})
                    </span>
                    {q.correctAnswer && (
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="size-3.5" /> Đáp án:{" "}
                        {String(q.correctAnswer)}
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
