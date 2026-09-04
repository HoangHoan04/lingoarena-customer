"use client";

import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import type { VocabStudyModeUI } from "@/types/vocabulary";
import {
  ArrowLeft,
  FileEdit,
  HelpCircle,
  Keyboard,
  Layers3,
  Mic,
  RotateCcw,
} from "lucide-react";
import { useState } from "react";

interface StudyTopNavProps {
  slug: string;
  mode: VocabStudyModeUI;
  onModeChange: (mode: VocabStudyModeUI) => void;
  currentIndex?: number;
  totalWords?: number;
  topicName?: string;
}

const MODES: {
  key: VocabStudyModeUI;
  label: string;
  icon: any;
  hasSrsBadge?: boolean;
}[] = [
  { key: "FLASHCARD", label: "Flashcard SRS", icon: Layers3, hasSrsBadge: true },
  { key: "QUIZ", label: "Trắc nghiệm", icon: HelpCircle, hasSrsBadge: true },
  { key: "FILL_BLANK", label: "Điền từ", icon: FileEdit },
  { key: "QUIZ_REVERSE", label: "Trắc nghiệm ngược", icon: RotateCcw },
  { key: "REPEAT", label: "Shadowing", icon: Mic },
];

export default function StudyTopNav({
  slug,
  mode,
  onModeChange,
  currentIndex = 1,
  totalWords = 0,
  topicName,
}: StudyTopNavProps) {
  const [showShortcuts, setShowShortcuts] = useState(false);

  return (
    <header className="relative z-20 rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-sm sm:shadow-md p-2.5 sm:p-3 transition-all">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left: Exit Link */}
        <div className="flex items-center justify-between md:justify-start gap-3 shrink-0">
          <Link
            href={`/vocabulary/${slug}`}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all group"
            title="Thoát phiên học & trở về trang bộ từ"
          >
            <ArrowLeft className="size-4 group-hover:-translate-x-0.5 transition-transform" />
            <span className="hidden sm:inline">Thoát phiên học</span>
            <span className="sm:hidden">Thoát</span>
          </Link>

          {/* Quick Progress Badge on mobile */}
          {totalWords > 0 && (
            <div className="flex md:hidden items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary dark:text-[#7b9bee] text-xs font-bold">
              <span>{Math.min(currentIndex, totalWords)}</span>
              <span>/</span>
              <span>{totalWords}</span>
            </div>
          )}
        </div>

        {/* Center: Practice Modes Horizontal Navigation */}
        <nav
          aria-label="Các chế độ luyện tập"
          className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 px-1 sm:px-0 -mx-1 sm:mx-0 scroll-smooth"
        >
          {MODES.map((item) => {
            const Icon = item.icon;
            const active = mode === item.key;

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => onModeChange(item.key)}
                className={cn(
                  "relative inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 shrink-0 cursor-pointer select-none whitespace-nowrap",
                  active
                    ? "bg-primary text-white shadow-md shadow-primary/25 ring-2 ring-primary/20 scale-[1.02]"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800",
                )}
              >
                <Icon className={cn("size-3.5 sm:size-4 shrink-0", active ? "text-white" : "text-slate-400")} />
                <span>{item.label}</span>
                {item.hasSrsBadge && (
                  <span
                    className={cn(
                      "text-[9px] font-black px-1.5 py-0.2 rounded uppercase",
                      active
                        ? "bg-white/20 text-white"
                        : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20",
                    )}
                  >
                    SRS
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right: Progress & Shortcuts helper on desktop */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          {totalWords > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <span className="text-slate-400 text-[11px] font-medium truncate max-w-[120px]">
                {topicName || "Tiến độ"}
              </span>
              <span className="font-bold text-primary dark:text-[#7b9bee]">
                {Math.min(currentIndex, totalWords)} / {totalWords}
              </span>
            </div>
          )}

          {/* Keyboard shortcut toggle */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowShortcuts((v) => !v)}
              className={cn(
                "p-2 rounded-xl border text-xs font-bold transition-colors cursor-pointer",
                showShortcuts
                  ? "border-primary bg-primary/10 text-primary dark:text-[#7b9bee]"
                  : "border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800",
              )}
              title="Xem phím tắt nhanh"
            >
              <Keyboard className="size-4" />
            </button>

            {showShortcuts && (
              <div className="absolute right-0 top-full mt-2 w-64 p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xl z-50 space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Keyboard className="size-3.5 text-primary" /> Phím tắt thao tác nhanh
                </p>
                <div className="space-y-1.5 pt-1 text-[11px]">
                  <div className="flex justify-between items-center">
                    <span>Lật thẻ / Phát lại audio:</span>
                    <kbd className="font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-[10px]">
                      Space
                    </kbd>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Đánh giá Flashcard:</span>
                    <kbd className="font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-[10px]">
                      1 - 4
                    </kbd>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Chọn đáp án Quiz:</span>
                    <kbd className="font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-[10px]">
                      1 - 4
                    </kbd>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
