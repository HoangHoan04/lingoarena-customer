"use client";

import type { StandardExamQuestion } from "@/types/exam-hub";
import { Flag, Layers, Zap } from "lucide-react";
import { useMemo, useState } from "react";

interface ExamQuestionPaletteProps {
  questions: StandardExamQuestion[];
  currentIndex: number;
  answers: Record<string, any>;
  flaggedIds: string[];
  onSelectIndex: (index: number) => void;
  onToggleFlag?: () => void;
}

type FilterMode = "all" | "unanswered" | "flagged";

export function ExamQuestionPalette({
  questions,
  currentIndex,
  answers,
  flaggedIds,
  onSelectIndex,
  onToggleFlag,
}: ExamQuestionPaletteProps) {
  const [filterMode, setFilterMode] = useState<FilterMode>("all");

  const isQuestionAnswered = (qId: string) => {
    const ans = answers[qId];
    if (!ans) return false;
    if (typeof ans === "string") return Boolean(ans.trim());
    if (Array.isArray(ans)) return ans.length > 0;
    if (typeof ans === "object") return Object.keys(ans).length > 0;
    return true;
  };

  const currentQ = questions[currentIndex];
  const isCurrentFlagged = currentQ ? flaggedIds.includes(currentQ.id) : false;

  const total = questions.length;
  const answeredCount = useMemo(
    () => questions.filter((q) => isQuestionAnswered(q.id)).length,
    [questions, answers],
  );
  const flaggedCount = useMemo(
    () => questions.filter((q) => flaggedIds.includes(q.id)).length,
    [questions, flaggedIds],
  );
  const unansweredCount = total - answeredCount;
  const progressPercent =
    total > 0 ? Math.round((answeredCount / total) * 100) : 0;

  // Group questions by Part
  const groupedParts = useMemo(() => {
    const groups: {
      partNumber: number;
      partTitle: string;
      items: { q: StandardExamQuestion; originalIdx: number }[];
    }[] = [];

    questions.forEach((q, originalIdx) => {
      const partNum = q.part || 1;
      let grp = groups.find((g) => g.partNumber === partNum);
      if (!grp) {
        grp = {
          partNumber: partNum,
          partTitle: q.partTitle || `Part ${partNum}`,
          items: [],
        };
        groups.push(grp);
      }
      grp.items.push({ q, originalIdx });
    });

    return groups;
  }, [questions]);

  const handleJumpToFirstUnanswered = () => {
    const firstUnansweredIdx = questions.findIndex(
      (q) => !isQuestionAnswered(q.id),
    );
    if (firstUnansweredIdx !== -1) {
      onSelectIndex(firstUnansweredIdx);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 p-3.5 shadow-2xs space-y-3">
      {/* 1. HEADER & PROGRESS */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <Layers className="size-3.5 text-brand dark:text-[#7b9bee]" />
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Bản đồ câu hỏi
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-medium text-slate-400">
              <strong className="text-primary dark:text-[#7b9bee] font-bold">
                {answeredCount}
              </strong>
              /{total} ({progressPercent}%)
            </span>

            {onToggleFlag && (
              <button
                type="button"
                onClick={onToggleFlag}
                className={`p-1.5 rounded-lg border text-xs transition-colors cursor-pointer ${
                  isCurrentFlagged
                    ? "border-amber-400 bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-300"
                    : "border-slate-200 dark:border-slate-800 text-slate-400 hover:text-amber-500 hover:border-amber-300"
                }`}
                title={
                  isCurrentFlagged
                    ? "Bỏ cờ câu này"
                    : "Gắn cờ câu này để xem lại"
                }
              >
                <Flag
                  className={`size-3 ${isCurrentFlagged ? "fill-amber-400" : ""}`}
                />
              </button>
            )}
          </div>
        </div>

        {/* Thin Progress Bar */}
        <div className="h-1 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-linear-to-r from-brand to-emerald-500 transition-all duration-300"
            style={{ width: `${Math.max(progressPercent, 2)}%` }}
          />
        </div>
      </div>

      {/* 2. THREE FILTER TABS */}
      <div className="grid grid-cols-3 gap-1 p-0.5 rounded-xl bg-slate-100/90 dark:bg-slate-850 text-center text-[10px] font-semibold">
        <button
          type="button"
          onClick={() => setFilterMode("all")}
          className={`py-1 px-1.5 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-0.5 ${
            filterMode === "all"
              ? "bg-white dark:bg-slate-750 text-slate-900 dark:text-white shadow-2xs font-bold"
              : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <span>Tất cả</span>
          <span className="opacity-60 text-[9px]">({total})</span>
        </button>

        <button
          type="button"
          onClick={() => setFilterMode("unanswered")}
          className={`py-1 px-1.5 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-0.5 ${
            filterMode === "unanswered"
              ? "bg-white dark:bg-slate-750 text-slate-900 dark:text-white shadow-2xs font-bold"
              : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <span className="size-1.5 rounded-full bg-slate-300 dark:bg-slate-600 shrink-0" />
          <span>Chưa làm</span>
          <span className="opacity-60 text-[9px]">({unansweredCount})</span>
        </button>

        <button
          type="button"
          onClick={() => setFilterMode("flagged")}
          className={`py-1 px-1.5 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-0.5 ${
            filterMode === "flagged"
              ? "bg-white dark:bg-slate-750 text-amber-600 dark:text-amber-400 shadow-2xs font-bold"
              : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <Flag className="size-2 fill-amber-400 text-amber-500 shrink-0" />
          <span>Gắn cờ</span>
          <span className="opacity-60 text-[9px]">({flaggedCount})</span>
        </button>
      </div>

      {/* 3. QUESTION CELLS PALETTE */}
      <div className="space-y-2.5 max-h-64 overflow-y-auto pr-0.5 custom-scrollbar">
        {groupedParts.map((group) => {
          const visibleItems = group.items.filter(({ q }) => {
            if (filterMode === "unanswered") return !isQuestionAnswered(q.id);
            if (filterMode === "flagged") return flaggedIds.includes(q.id);
            return true;
          });

          if (!visibleItems.length && filterMode !== "all") return null;

          const answeredInGroup = group.items.filter(({ q }) =>
            isQuestionAnswered(q.id),
          ).length;

          return (
            <div key={group.partNumber} className="space-y-1.5">
              <div className="flex items-center justify-between text-[9px] font-bold text-slate-400 uppercase tracking-wider px-0.5">
                <span className="truncate max-w-[140px]">
                  {group.partTitle}
                </span>
                <span className="text-[9px] opacity-70">
                  {answeredInGroup}/{group.items.length}
                </span>
              </div>

              <div className="grid grid-cols-6 sm:grid-cols-7 gap-1">
                {group.items.map(({ q, originalIdx }) => {
                  const isCurrent = originalIdx === currentIndex;
                  const isAnswered = isQuestionAnswered(q.id);
                  const isFlagged = flaggedIds.includes(q.id);

                  if (filterMode === "unanswered" && isAnswered) return null;
                  if (filterMode === "flagged" && !isFlagged) return null;

                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => onSelectIndex(originalIdx)}
                      className={`relative flex items-center justify-center size-7 rounded-lg text-[10px] font-semibold transition-all cursor-pointer select-none ${
                        isCurrent
                          ? "bg-brand text-white shadow-xs font-bold ring-1.5 ring-brand/50 dark:bg-blue-600 dark:ring-blue-400 z-10 scale-105"
                          : isAnswered
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-300 dark:bg-emerald-950/40 dark:border-emerald-800/80 dark:text-emerald-300 hover:bg-emerald-100"
                            : isFlagged
                              ? "bg-amber-50 text-amber-700 border border-amber-400 dark:bg-amber-950/40 dark:text-amber-300"
                              : "bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                      title={`Câu ${originalIdx + 1}${isAnswered ? " (Đã làm)" : ""}${isFlagged ? " (Đã gắn cờ)" : ""}`}
                    >
                      <span>{originalIdx + 1}</span>

                      {isFlagged && (
                        <span className="absolute -top-0.5 -right-0.5 size-1.5 rounded-full bg-amber-400 border border-white dark:border-slate-900" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. FAST JUMP ACTION */}
      {unansweredCount > 0 && (
        <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={handleJumpToFirstUnanswered}
            className="w-full inline-flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 text-[10px] font-bold text-brand dark:text-[#7b9bee] transition-colors cursor-pointer"
          >
            <Zap className="size-2.5 text-amber-500 fill-amber-400" />
            <span>Câu chưa làm tiếp theo</span>
          </button>
        </div>
      )}
    </div>
  );
}
