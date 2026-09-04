"use client";

import type { YoutubeVideoItem } from "@/types/listening-youtube";
import { ArrowLeft, CheckCircle2, Columns2, Maximize2, Sparkles, Video } from "lucide-react";

interface YoutubeTopBarProps {
  video: YoutubeVideoItem;
  isCinemaMode: boolean;
  onToggleCinemaMode: () => void;
  completedCount: number;
  totalSentences: number;
  onBackToCatalog: () => void;
}

export function YoutubeTopBar({
  video,
  isCinemaMode,
  onToggleCinemaMode,
  completedCount,
  totalSentences,
  onBackToCatalog,
}: YoutubeTopBarProps) {
  const percent = totalSentences > 0 ? Math.round((completedCount / totalSentences) * 100) : 0;

  return (
    <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 p-3 sm:p-4 shadow-sm flex flex-wrap items-center justify-between gap-3 backdrop-blur-xl sticky top-4 z-40">
      {/* LEFT: BACK & TITLE */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onBackToCatalog}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 shrink-0"
        >
          <ArrowLeft className="size-4" />
          <span>Danh sách bài nghe</span>
        </button>

        <span className="hidden sm:inline text-slate-300 dark:text-slate-700">|</span>

        <div className="min-w-0">
          <h2 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white truncate max-w-[220px] sm:max-w-xs md:max-w-md lg:max-w-lg">
            {video.title}
          </h2>
          <p className="text-[11px] text-slate-400 truncate">
            {video.channel} · <span className="uppercase font-semibold text-rose-500">{video.difficulty}</span>
          </p>
        </div>
      </div>

      {/* RIGHT: PROGRESS & VIEW TOGGLE */}
      <div className="flex items-center gap-2.5 shrink-0 ml-auto sm:ml-0">
        {/* Progress Pill */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300">
          <CheckCircle2 className="size-3.5 text-emerald-500" />
          <span>
            <strong className="text-emerald-600 dark:text-emerald-400 font-black">{completedCount}</strong>/{totalSentences} câu ({percent}%)
          </span>
        </div>

        {/* Cinema Mode Toggle */}
        <button
          type="button"
          onClick={onToggleCinemaMode}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
            isCinemaMode
              ? "border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 shadow-2xs font-black"
              : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750"
          }`}
          title={isCinemaMode ? "Thu nhỏ về bố cục tiêu chuẩn (hiện phụ đề)" : "Mở rộng video tối đa (chế độ Rạp phim)"}
        >
          {isCinemaMode ? (
            <>
              <Columns2 className="size-3.5 text-rose-600" />
              <span>Hiện phụ đề</span>
            </>
          ) : (
            <>
              <Maximize2 className="size-3.5 text-rose-600" />
              <span>Rạp phim</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
