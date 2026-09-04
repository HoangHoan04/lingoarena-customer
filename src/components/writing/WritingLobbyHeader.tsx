"use client";

import type { WritingExamType } from "@/types/writing";
import {
  BookOpen,
  FileCheck2,
  FileEdit,
  PenTool,
  Repeat,
  Sparkles,
} from "lucide-react";

interface WritingLobbyHeaderProps {
  selectedExam: WritingExamType;
  activeMode: "catalog" | "custom" | "paraphrase";
  onSelectExam: (exam: WritingExamType) => void;
  onChangeMode: (mode: "catalog" | "custom" | "paraphrase") => void;
  topicsCount: number;
}

export function WritingLobbyHeader({
  selectedExam,
  activeMode,
  onSelectExam,
  onChangeMode,
  topicsCount,
}: WritingLobbyHeaderProps) {
  const exams: { key: WritingExamType; label: string; desc: string }[] = [
    { key: "ALL", label: "Tất cả đề viết", desc: "Mọi dạng bài & chứng chỉ" },
    { key: "IELTS", label: "IELTS Writing", desc: "Task 1 (Report) & Task 2 (Essay)" },
    { key: "TOEIC", label: "TOEIC Writing", desc: "Sentence, Business Email, Opinion" },
    { key: "VSTEP", label: "VSTEP B1 - C1", desc: "Viết thư giao tiếp & Bài luận 250 từ" },
    { key: "APTIS", label: "Aptis ESOL", desc: "Part 1-4 (Form, Chat, Email)" },
    { key: "GENERAL", label: "Viết tổng quát", desc: "Nghị luận xã hội & Đời sống" },
  ];

  return (
    <div className="space-y-8">
      {/* HERO BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-slate-950 via-[#0a231c] to-slate-950 text-white p-6 sm:p-12 border border-slate-800 shadow-2xl space-y-6">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-bold uppercase tracking-wider text-emerald-200">
            <Sparkles className="size-3.5 text-amber-400" />
            <span>Phòng Luyện Viết & Chấm Chữa Chi Tiết Bằng AI</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
            Luyện Viết Tiếng Anh{" "}
            <span className="bg-linear-to-r from-emerald-300 via-teal-200 to-amber-200 bg-clip-text text-transparent">
              AI Writing Studio
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            Luyện viết bài luận, thư thương mại theo đúng chuẩn IELTS, TOEIC, VSTEP, Aptis hoặc tự dán đề bài của bạn. Hệ thống AI chấm điểm theo 4 tiêu chuẩn quốc tế, sửa lỗi ngữ pháp và gợi ý nâng cấp từ vựng C1/C2 tức thì.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-slate-300">
            <span className="flex items-center gap-1.5">
              <FileCheck2 className="size-4 text-emerald-400" />
              Chấm theo 4 tiêu chí chuẩn quốc tế
            </span>
            <span className="flex items-center gap-1.5">
              <PenTool className="size-4 text-teal-400" />
              Sửa lỗi ngữ pháp & gợi ý từ vựng Band cao
            </span>
            <span className="flex items-center gap-1.5">
              <BookOpen className="size-4 text-amber-300" />
              Kho bài mẫu Band 8.0+ kèm dàn ý chi tiết
            </span>
          </div>
        </div>
      </div>

      {/* 3 WRITING MODES SELECTOR */}
      <div className="flex items-center justify-center">
        <div className="p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center gap-2 border border-slate-200 dark:border-slate-700 max-w-2xl w-full">
          <button
            type="button"
            onClick={() => onChangeMode("catalog")}
            className={`flex-1 py-3 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeMode === "catalog"
                ? "bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-300 shadow-sm"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <BookOpen className="size-4 text-emerald-600" />
            <span>Thư Viện Đề Thi</span>
          </button>

          <button
            type="button"
            onClick={() => onChangeMode("custom")}
            className={`flex-1 py-3 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeMode === "custom"
                ? "bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-300 shadow-sm"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <FileEdit className="size-4 text-teal-600" />
            <span>Tự Nhập Đề Bài</span>
          </button>

          <button
            type="button"
            onClick={() => onChangeMode("paraphrase")}
            className={`flex-1 py-3 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeMode === "paraphrase"
                ? "bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-300 shadow-sm"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <Repeat className="size-4 text-amber-500" />
            <span>Viết Câu & Paraphrase</span>
          </button>
        </div>
      </div>

      {/* EXAM TABS SELECTOR (When in catalog mode) */}
      {activeMode === "catalog" && (
        <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 p-5 sm:p-7 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <span>Chọn Dạng Đề & Chứng Chỉ Luyện Viết</span>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold lowercase">
                  ({topicsCount} đề luyện tập)
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Lựa chọn đúng cấu trúc và dạng bài thi bạn đang hướng tới
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {exams.map((ex) => {
              const isSelected = selectedExam === ex.key;

              return (
                <button
                  key={ex.key}
                  type="button"
                  onClick={() => onSelectExam(ex.key)}
                  className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between space-y-1.5 ${
                    isSelected
                      ? "border-emerald-600 bg-emerald-50/80 dark:bg-emerald-950/40 text-slate-900 dark:text-white shadow-sm ring-2 ring-emerald-400/20"
                      : "border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-emerald-300 hover:bg-slate-50"
                  }`}
                >
                  <span className={`text-xs font-black ${isSelected ? "text-emerald-700 dark:text-emerald-300" : "text-slate-800 dark:text-slate-200"}`}>
                    {ex.label}
                  </span>
                  <p className="text-[10px] text-slate-400 line-clamp-1">
                    {ex.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
