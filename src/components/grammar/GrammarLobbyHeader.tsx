"use client";

import {
  BookOpen,
  FileText,
  Search,
  Sparkles,
  Zap,
} from "lucide-react";

interface GrammarLobbyHeaderProps {
  selectedLevel: string;
  activeMode: "topics" | "quiz" | "cheatsheet";
  keyword: string;
  onSelectLevel: (level: string) => void;
  onChangeMode: (mode: "topics" | "quiz" | "cheatsheet") => void;
  onKeywordChange: (val: string) => void;
  topicsCount: number;
}

const CEFR_OPTIONS = ["ALL", "A1", "A2", "B1", "B2", "C1", "C2"];

export function GrammarLobbyHeader({
  selectedLevel,
  activeMode,
  keyword,
  onSelectLevel,
  onChangeMode,
  onKeywordChange,
  topicsCount,
}: GrammarLobbyHeaderProps) {
  return (
    <div className="space-y-5">
      {/* COMPACT SLEEK BANNER */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-slate-950 via-[#0e214d] to-slate-950 text-white p-5 sm:p-7 border border-slate-800 shadow-md">
        {/* Decorative background glow */}
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-[11px] font-bold uppercase tracking-wider text-blue-300">
              <Sparkles className="size-3 text-amber-400" />
              <span>Grammar Arena · Hệ Thống Ngữ Pháp</span>
            </div>

            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight leading-snug">
              Kho Ngữ Pháp Tiếng Anh{" "}
              <span className="bg-linear-to-r from-blue-300 via-sky-200 to-amber-200 bg-clip-text text-transparent">
                Chuẩn CEFR
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
              Làm chủ 12 thì, câu bị động, điều kiện &amp; ngữ pháp nâng cao kèm đấu trường trắc nghiệm và sổ tay tra cứu công thức nhanh.
            </p>
          </div>

          {/* Quick micro stats on md+ */}
          <div className="hidden sm:flex items-center gap-2.5 shrink-0 self-start md:self-center">
            <div className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs text-center space-y-0.5">
              <div className="text-base font-black text-sky-300">{topicsCount}</div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Chủ điểm</div>
            </div>
            <div className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs text-center space-y-0.5">
              <div className="text-base font-black text-amber-300">A1 - C2</div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Cấp độ</div>
            </div>
            <div className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs text-center space-y-0.5">
              <div className="text-base font-black text-emerald-300">100%</div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Miễn phí</div>
            </div>
          </div>
        </div>
      </div>

      {/* SLEEK NAVIGATION TABS & TOOLBAR */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* SEGMENTED PILL TABS */}
        <div className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs self-start sm:self-auto">
          <button
            type="button"
            onClick={() => onChangeMode("topics")}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeMode === "topics"
                ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs font-black"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <BookOpen className="size-3.5" />
            <span>Chuyên đề</span>
            {topicsCount > 0 && (
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  activeMode === "topics"
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                    : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                }`}
              >
                {topicsCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => onChangeMode("quiz")}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeMode === "quiz"
                ? "bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-2xs font-black"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Zap className="size-3.5 text-amber-500" />
            <span>Đấu trường trắc nghiệm</span>
          </button>

          <button
            type="button"
            onClick={() => onChangeMode("cheatsheet")}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeMode === "cheatsheet"
                ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-2xs font-black"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <FileText className="size-3.5 text-emerald-600" />
            <span>Sổ tay tra cứu</span>
          </button>
        </div>

        {/* TOPICS COUNT INFO ON RIGHT */}
        {activeMode === "topics" && (
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <span>Hiển thị</span>
            <strong className="font-bold text-slate-800 dark:text-slate-200">{topicsCount}</strong>
            <span>chủ điểm</span>
          </div>
        )}
      </div>

      {/* COMPACT SEARCH & LEVEL FILTER BAR (When in topics or cheatsheet mode) */}
      {activeMode !== "quiz" && (
        <div className="flex flex-col md:flex-row gap-2.5 items-stretch md:items-center justify-between p-2 sm:p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          {/* SEARCH INPUT */}
          <div className="relative flex-1 max-w-md">
            <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => onKeywordChange(e.target.value)}
              placeholder="Tìm thì, công thức (ví dụ: hiện tại hoàn thành, passive, if)..."
              className="w-full h-9 pl-9 pr-3 rounded-xl border border-slate-200/80 dark:border-slate-700/80 bg-slate-50/70 dark:bg-slate-800/70 text-xs font-medium focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none transition-colors"
            />
          </div>

          {/* CEFR FILTER BUTTONS */}
          <div className="flex items-center gap-1 overflow-x-auto pb-0.5 md:pb-0 scrollbar-none">
            <span className="text-[11px] font-bold text-slate-400 mr-1 shrink-0">
              Cấp độ:
            </span>
            {CEFR_OPTIONS.map((item) => {
              const isSelected =
                (item === "ALL" && !selectedLevel) || selectedLevel === item;

              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => onSelectLevel(item === "ALL" ? "" : item)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 border ${
                    isSelected
                      ? "bg-blue-600 text-white border-blue-600 shadow-2xs font-black"
                      : "bg-slate-50 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700/80 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                  }`}
                >
                  {item === "ALL" ? "Tất cả" : item}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
