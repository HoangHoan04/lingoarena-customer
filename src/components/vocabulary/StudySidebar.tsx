"use client";

import { STUDY_MODES } from "@/lib/vocab";
import { cn } from "@/lib/utils";
import type { VocabStudyModeUI } from "@/types/vocabulary";
import {
  BookOpen,
  CheckCircle2,
  FileEdit,
  Flame,
  HelpCircle,
  Layers3,
  Mic,
  RotateCcw,
  Sparkles,
} from "lucide-react";

const MODE_ICONS: Record<VocabStudyModeUI, any> = {
  FLASHCARD: Layers3,
  QUIZ: HelpCircle,
  FILL_BLANK: FileEdit,
  QUIZ_REVERSE: RotateCcw,
  REPEAT: Mic,
};

export default function StudySidebar({
  deckTitle,
  topics,
  mode,
  index,
  total,
  onModeChange,
}: {
  deckTitle: string;
  topics: string[];
  mode: VocabStudyModeUI;
  index: number;
  total: number;
  onModeChange: (mode: VocabStudyModeUI) => void;
}) {
  const percent = total ? Math.round(((index + 1) / total) * 100) : 0;

  return (
    <aside className="w-full lg:w-80 shrink-0">
      <div className="lg:sticky lg:top-24 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden space-y-0">
        {/* Deck Header */}
        <div className="p-5 bg-linear-to-r from-primary to-[#405ea7] text-white">
          <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-white/75 mb-1">
            <BookOpen className="size-3.5" />
            <span>Bộ thẻ đang học</span>
          </div>
          <h2 className="font-black text-base sm:text-lg leading-snug text-white line-clamp-2">
            {deckTitle}
          </h2>
        </div>

        {/* Topics */}
        {topics.length > 0 && (
          <div className="p-4 border-b border-slate-100 dark:border-slate-800">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Chủ đề & Cấp độ
            </p>
            <div className="flex flex-wrap gap-1.5">
              {topics.map((topic) => (
                <span
                  key={topic}
                  className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Study Mode Selector */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
            Chế độ luyện tập
          </p>
          <nav className="flex flex-col gap-1.5">
            {STUDY_MODES.map((item) => {
              const Icon = MODE_ICONS[item.key] || Layers3;
              const active = mode === item.key;

              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => onModeChange(item.key)}
                  className={cn(
                    "flex items-center gap-3 text-left p-2.5 rounded-2xl transition-all duration-200 cursor-pointer select-none",
                    active
                      ? "bg-primary text-white shadow-md shadow-primary/20"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800",
                  )}
                >
                  <div
                    className={cn(
                      "p-2 rounded-xl shrink-0",
                      active
                        ? "bg-white/20 text-white"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-500",
                    )}
                  >
                    <Icon className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold leading-tight flex items-center justify-between">
                      <span>{item.label}</span>
                      {(item.key === "FLASHCARD" || item.key === "QUIZ") && (
                        <span
                          className={cn(
                            "text-[9px] font-black px-1.5 py-0.2 rounded uppercase",
                            active
                              ? "bg-white/20 text-white"
                              : "bg-amber-500/10 text-amber-600 dark:text-amber-400",
                          )}
                        >
                          SRS
                        </span>
                      )}
                    </div>
                    <div
                      className={cn(
                        "text-[10px] truncate mt-0.5",
                        active ? "text-white/80" : "text-slate-400",
                      )}
                    >
                      {item.hint}
                    </div>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Progress & Shortcuts Info */}
        <div className="p-5 space-y-4">
          <div>
            <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 mb-1.5">
              <span className="font-semibold">Tiến độ phiên học</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {index + 1} / {total || 0} ({percent}%)
              </span>
            </div>
            <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-[#2b417e] to-[#4563b0] transition-all duration-300"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 space-y-1.5">
            <p className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <Sparkles className="size-3 text-amber-500" /> Phím tắt thao tác nhanh
            </p>
            <p>• <kbd className="font-mono bg-white dark:bg-slate-700 px-1 py-0.5 rounded border text-[10px]">Space</kbd>: Lật thẻ / Nghe lại audio</p>
            <p>• <kbd className="font-mono bg-white dark:bg-slate-700 px-1 py-0.5 rounded border text-[10px]">1 - 4</kbd>: Chấm điểm Again / Hard / Good / Easy</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
