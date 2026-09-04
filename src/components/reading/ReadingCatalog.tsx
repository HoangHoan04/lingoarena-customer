"use client";

import type { ReadingPassage } from "@/types/reading";
import {
  BookOpen,
  Clock,
  FileQuestion,
  FileText,
  Sparkles,
  Target,
} from "lucide-react";

interface ReadingCatalogProps {
  passages: ReadingPassage[];
  onSelectPassage: (passage: ReadingPassage) => void;
}

export function ReadingCatalog({
  passages,
  onSelectPassage,
}: ReadingCatalogProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {passages.length === 0 ? (
          <div className="col-span-full rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center space-y-2">
            <BookOpen className="size-10 mx-auto text-slate-400" />
            <h3 className="font-black">Chưa có bài đọc</h3>
            <p className="text-sm text-slate-500">Catalog trống cho đến khi quản trị viên xuất bản nhóm đọc.</p>
          </div>
        ) : (
          passages.map((ps) => (
          <div
            key={ps.id}
            className="group rounded-3xl border-2 border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-cyan-500/60 transition-all p-5 sm:p-6 shadow-sm hover:shadow-xl flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              {/* TOP BADGES */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {(ps.topics || []).slice(0, 2).map((topic) => (
                    <span
                      key={topic}
                      className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 text-[10px] font-black uppercase"
                    >
                      {topic}
                    </span>
                  ))}
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800 dark:bg-cyan-950/60 dark:text-cyan-300 text-[10px] font-black uppercase">
                    {ps.examType}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 text-[10px] font-bold">
                    {ps.level}
                  </span>
                </div>

                <span className="text-[11px] font-bold text-slate-400">
                  {ps.category}
                </span>
              </div>

              {/* TITLE & SUMMARY */}
              <div>
                <h4 className="text-base font-black text-slate-900 dark:text-white line-clamp-2 group-hover:text-cyan-600 transition-colors leading-snug">
                  {ps.title}
                </h4>
                <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                  {ps.summaryVi}
                </p>
              </div>

              {/* STATS: WORDS, TIME, QUESTIONS */}
              <div className="grid grid-cols-3 gap-2 text-xs font-mono font-bold text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-850">
                  <span className="text-[10px] text-slate-400 block">Số từ</span>
                  <span className="text-slate-800 dark:text-slate-200">{ps.wordCount}</span>
                </div>

                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-850">
                  <span className="text-[10px] text-slate-400 block">Thời gian</span>
                  <span className="text-slate-800 dark:text-slate-200">{ps.recommendedTimeMin}p</span>
                </div>

                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-850">
                  <span className="text-[10px] text-slate-400 block">Câu hỏi</span>
                  <span className="text-cyan-600 dark:text-cyan-400 font-black">{ps.questions.length} câu</span>
                </div>
              </div>

              {/* TAGS */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {ps.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-medium"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            {/* ACTION BUTTON */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => onSelectPassage(ps)}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-cyan-600 hover:bg-cyan-700 text-white font-black text-xs sm:text-sm shadow-md shadow-cyan-600/20 transition-all hover:scale-101 cursor-pointer active:scale-98"
              >
                <BookOpen className="size-4" />
                <span>Bắt đầu đọc & làm bài</span>
              </button>
            </div>
          </div>
          ))
        )}
      </div>
    </div>
  );
}
