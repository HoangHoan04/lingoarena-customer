"use client";

import type { WritingScoreResult, WritingTopic } from "@/types/writing";
import {
  AlertCircle,
  ArrowLeft,
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  Copy,
  FileCheck,
  FileText,
  Lightbulb,
  PenTool,
  RotateCcw,
  Sparkles,
  Target,
  Wand2,
} from "lucide-react";
import { useState } from "react";

interface WritingFeedbackReportProps {
  topic: WritingTopic;
  result: WritingScoreResult;
  onRetry: () => void;
  onBackToCatalog: () => void;
}

export function WritingFeedbackReport({
  topic,
  result,
  onRetry,
  onBackToCatalog,
}: WritingFeedbackReportProps) {
  const [activeTab, setActiveTab] = useState<"errors" | "upgrades" | "rewrite">("errors");

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}m ${s}s`;
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-20 animate-in fade-in-50 duration-300">
      {/* HEADER BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-slate-950 via-[#0b2820] to-slate-950 text-white p-6 sm:p-10 border border-slate-800 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black uppercase tracking-wider mb-2">
              <Sparkles className="size-3.5" />
              <span>Kết Quả Chấm Điểm & Phân Tích AI</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              {topic.title}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Dạng bài: {topic.category} · Yêu cầu: ≥ {topic.minWords} từ
            </p>
          </div>

          {/* OVERALL BAND BADGE */}
          <div className="text-center p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 shadow-xl shrink-0">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">
              Điểm Tổng Quan (Estimated)
            </span>
            <div className="text-3xl sm:text-4xl font-black text-white mt-0.5">
              {result.scoreLabel}
            </div>
          </div>
        </div>

        {/* QUICK STATS PILLS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-slate-400">Số từ đã viết</span>
            <div className="text-base font-black text-white flex items-center gap-1.5">
              <Target className="size-4 text-emerald-400" />
              <span>{result.wordCount} từ</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-slate-400">Thời gian làm bài</span>
            <div className="text-base font-black text-white flex items-center gap-1.5">
              <Clock className="size-4 text-amber-400" />
              <span>{formatTime(result.timeSpentSec)}</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-slate-400">Lỗi phát hiện</span>
            <div className="text-base font-black text-rose-300 flex items-center gap-1.5">
              <AlertCircle className="size-4 text-rose-400" />
              <span>{result.errors.length} lỗi</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-slate-400">Gợi ý từ vựng C1/C2</span>
            <div className="text-base font-black text-teal-300 flex items-center gap-1.5">
              <Wand2 className="size-4 text-teal-400" />
              <span>{result.vocabUpgrades.length} cụm từ</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 CRITERIA EVALUATION CARDS */}
      <div className="space-y-4">
        <h3 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <FileCheck className="size-5 text-emerald-600" />
          <span>Đánh Giá Theo 4 Tiêu Chí Chuẩn Quốc Tế</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* 1. Task Response */}
          <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-2">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <span className="text-xs font-black text-slate-800 dark:text-slate-200">
                1. Task Achievement / Response
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-mono font-black text-xs">
                {result.criteria.taskResponse.score.toFixed(1)} / 9.0
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {result.criteria.taskResponse.feedback}
            </p>
          </div>

          {/* 2. Coherence & Cohesion */}
          <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-2">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <span className="text-xs font-black text-slate-800 dark:text-slate-200">
                2. Coherence & Cohesion
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-mono font-black text-xs">
                {result.criteria.coherenceCohesion.score.toFixed(1)} / 9.0
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {result.criteria.coherenceCohesion.feedback}
            </p>
          </div>

          {/* 3. Lexical Resource */}
          <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-2">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <span className="text-xs font-black text-slate-800 dark:text-slate-200">
                3. Lexical Resource (Từ Vựng)
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-mono font-black text-xs">
                {result.criteria.lexicalResource.score.toFixed(1)} / 9.0
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {result.criteria.lexicalResource.feedback}
            </p>
          </div>

          {/* 4. Grammatical Range & Accuracy */}
          <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-2">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <span className="text-xs font-black text-slate-800 dark:text-slate-200">
                4. Grammatical Range & Accuracy
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-mono font-black text-xs">
                {result.criteria.grammaticalAccuracy.score.toFixed(1)} / 9.0
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {result.criteria.grammaticalAccuracy.feedback}
            </p>
          </div>
        </div>
      </div>

      {/* DETAILED DIAGNOSTIC TABS */}
      <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm space-y-6">
        {/* TABS SELECTOR */}
        <div className="flex p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 max-w-xl mx-auto">
          <button
            type="button"
            onClick={() => setActiveTab("errors")}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === "errors"
                ? "bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <AlertCircle className="size-3.5" />
            <span>Sửa Lỗi Ngữ Pháp ({result.errors.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("upgrades")}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === "upgrades"
                ? "bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Sparkles className="size-3.5" />
            <span>Nâng Cấp Từ Vựng ({result.vocabUpgrades.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("rewrite")}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === "rewrite"
                ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Wand2 className="size-3.5" />
            <span>Bản Viết Lại Của AI</span>
          </button>
        </div>

        {/* TAB 1: GRAMMAR ERRORS */}
        {activeTab === "errors" && (
          <div className="space-y-4">
            <h4 className="text-sm font-black text-slate-800 dark:text-slate-200">
              Chi Tiết Các Lỗi Ngữ Pháp & Chính Tả Cần Khắc Phục:
            </h4>

            {result.errors.length > 0 ? (
              <div className="grid gap-3">
                {result.errors.map((err, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/40 dark:bg-rose-950/20 space-y-2 text-xs"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="line-through text-rose-600 dark:text-rose-400 font-bold bg-rose-100 dark:bg-rose-950 px-2 py-0.5 rounded-md">
                        {err.originalText}
                      </span>
                      <span className="text-slate-400">➜</span>
                      <span className="text-emerald-700 dark:text-emerald-300 font-black bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-md">
                        {err.correctedText}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-[10px] font-bold uppercase text-slate-600 dark:text-slate-300">
                        {err.type}
                      </span>
                    </div>

                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      💡 <strong>Quy tắc & Giải thích:</strong> {err.explanationVi}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 text-center text-xs text-emerald-800 dark:text-emerald-300 font-bold">
                🎉 Tuyệt vời! Không phát hiện lỗi ngữ pháp hay chính tả nghiêm trọng nào trong bài viết.
              </div>
            )}
          </div>
        )}

        {/* TAB 2: VOCABULARY UPGRADES */}
        {activeTab === "upgrades" && (
          <div className="space-y-4">
            <h4 className="text-sm font-black text-slate-800 dark:text-slate-200">
              Gợi Ý Cụm Từ Vựng & Collocations Nâng Cao Band 8.0+:
            </h4>

            <div className="grid gap-3">
              {result.vocabUpgrades.map((up, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl border border-teal-200 dark:border-teal-900/60 bg-teal-50/40 dark:bg-teal-950/20 space-y-2 text-xs"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">
                      Từ gốc: <strong className="text-slate-800 dark:text-slate-200">"{up.originalPhrase}"</strong>
                    </span>
                    <span className="text-teal-500">➜</span>
                    <span className="text-teal-800 dark:text-teal-300 font-black bg-teal-100 dark:bg-teal-950 px-2.5 py-1 rounded-lg">
                      "{up.upgradedPhrase}"
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-teal-200 text-teal-900 text-[10px] font-black uppercase">
                      {up.level}
                    </span>
                  </div>

                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    🎯 <strong>Lý do nâng cấp:</strong> {up.explanationVi}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: AI REWRITE POLISHED VERSION */}
        {activeTab === "rewrite" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-black text-slate-800 dark:text-slate-200">
                Phiên Bản Hoàn Thiện Của AI (Band 8.5 Model):
              </h4>
              <span className="text-[11px] text-slate-400">
                Dựa trên ý tưởng và cấu trúc bài của bạn
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 font-sans text-xs sm:text-sm text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed shadow-2xs">
              {result.improvedVersion}
            </div>
          </div>
        )}
      </div>

      {/* ACTIONS */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <button
          type="button"
          onClick={onBackToCatalog}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 cursor-pointer"
        >
          <ArrowLeft className="size-4" />
          <span>Chọn đề viết khác</span>
        </button>

        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-lg shadow-emerald-600/25 transition-all cursor-pointer"
        >
          <RotateCcw className="size-4" />
          <span>Viết lại đề bài này</span>
        </button>
      </div>
    </div>
  );
}
