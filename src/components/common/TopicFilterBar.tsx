"use client";

import type { QuestionLookup } from "@/types/question";
import { Hash, Loader2 } from "lucide-react";

export type TopicFilterAccent = "cyan" | "rose" | "emerald" | "purple" | "primary";

interface TopicFilterBarProps {
  topics: QuestionLookup[];
  selectedId: string;
  onSelect: (topicId: string) => void;
  accent?: TopicFilterAccent;
  loading?: boolean;
  title?: string;
  hint?: string;
}

const ACCENT: Record<
  TopicFilterAccent,
  { selected: string; idle: string; title: string }
> = {
  cyan: {
    selected: "bg-cyan-600 text-white border-cyan-600 shadow-xs",
    idle: "hover:border-cyan-300",
    title: "text-cyan-600 dark:text-cyan-400",
  },
  rose: {
    selected: "bg-rose-600 text-white border-rose-600 shadow-xs",
    idle: "hover:border-rose-300",
    title: "text-rose-600 dark:text-rose-400",
  },
  emerald: {
    selected: "bg-emerald-600 text-white border-emerald-600 shadow-xs",
    idle: "hover:border-emerald-300",
    title: "text-emerald-600 dark:text-emerald-400",
  },
  purple: {
    selected: "bg-purple-600 text-white border-purple-600 shadow-xs",
    idle: "hover:border-purple-300",
    title: "text-purple-600 dark:text-purple-400",
  },
  primary: {
    selected: "bg-primary text-white border-primary shadow-xs",
    idle: "hover:border-primary/50",
    title: "text-primary dark:text-[#7b9bee]",
  },
};

export function TopicFilterBar({
  topics,
  selectedId,
  onSelect,
  accent = "primary",
  loading = false,
  title = "Chọn chủ đề",
  hint = "Mỗi bài luyện được gắn chủ đề. Chọn một chủ đề để xem đúng nội dung liên quan.",
}: TopicFilterBarProps) {
  const tone = ACCENT[accent];
  const selected = selectedId || "ALL";

  return (
    <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 p-5 sm:p-7 shadow-sm space-y-4">
      <div>
        <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <Hash className="size-4" />
          <span>{title}</span>
          <span className={`text-xs font-bold lowercase ${tone.title}`}>
            ({topics.length} chủ đề)
          </span>
        </h3>
        <p className="text-xs text-slate-500 mt-1">{hint}</p>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Loader2 className="size-4 animate-spin" />
          Đang tải danh sách chủ đề…
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onSelect("ALL")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              selected === "ALL"
                ? tone.selected
                : `bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 ${tone.idle}`
            }`}
          >
            Tất cả chủ đề
          </button>
          {topics.map((topic) => {
            const id = topic.id || topic.value || "";
            const isSelected = selected === id;
            return (
              <button
                key={id || topic.name}
                type="button"
                onClick={() => onSelect(isSelected ? "ALL" : id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  isSelected
                    ? tone.selected
                    : `bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 ${tone.idle}`
                }`}
              >
                {topic.name || topic.label}
              </button>
            );
          })}
          {!topics.length ? (
            <p className="text-xs text-slate-400 self-center">
              Chưa có chủ đề. Quản trị viên tạo chủ đề trên Admin rồi gắn vào bài học.
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
}
