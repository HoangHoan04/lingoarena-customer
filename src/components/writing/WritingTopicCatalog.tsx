"use client";

import type { WritingTopic } from "@/types/writing";
import {
  Clock,
  FileText,
  PenTool,
  Search,
  Sparkles,
  Target,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

interface WritingTopicCatalogProps {
  topics: WritingTopic[];
  onSelectTopic: (topic: WritingTopic) => void;
}

export function WritingTopicCatalog({
  topics,
  onSelectTopic,
}: WritingTopicCatalogProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTopics = useMemo(() => {
    if (!searchQuery.trim()) return topics;
    const q = searchQuery.toLowerCase();
    return topics.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.prompt.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q)),
    );
  }, [topics, searchQuery]);

  return (
    <div className="space-y-6">
      {/* SEARCH BAR */}
      <div className="flex items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
        <div className="relative w-full max-w-md flex items-center">
          <Search className="absolute left-3.5 size-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm chủ đề, từ khóa đề bài..."
            className="w-full h-11 pl-10 pr-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold focus:border-emerald-600 focus:bg-white dark:focus:bg-slate-900 focus:outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        <span className="text-xs font-mono font-bold text-slate-400">
          {filteredTopics.length} đề bài
        </span>
      </div>

      {/* TOPICS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTopics.length === 0 ? (
          <div className="col-span-full rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center space-y-2">
            <PenTool className="size-10 mx-auto text-slate-400" />
            <h3 className="font-black">Chưa có đề writing</h3>
            <p className="text-sm text-slate-500">Catalog trống cho đến khi quản trị viên xuất bản câu ESSAY.</p>
          </div>
        ) : (
          filteredTopics.map((topic) => (
          <div
            key={topic.id}
            className="group rounded-3xl border-2 border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-500/60 transition-all p-5 sm:p-6 shadow-sm hover:shadow-xl flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              {/* BADGES */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 text-[10px] font-black uppercase">
                    {topic.examType}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 text-[10px] font-bold">
                    {topic.level}
                  </span>
                </div>

                <span className="text-[11px] font-bold text-slate-400">
                  {topic.category}
                </span>
              </div>

              {/* TITLE & PROMPT PREVIEW */}
              <div>
                <h4 className="text-base font-black text-slate-900 dark:text-white line-clamp-2 group-hover:text-emerald-600 transition-colors leading-snug">
                  {topic.title}
                </h4>
                <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                  {topic.prompt}
                </p>
              </div>

              {/* META INFO: WORDS & TIME */}
              <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-500 pt-1 border-t border-slate-100 dark:border-slate-800">
                <span className="flex items-center gap-1">
                  <Target className="size-3.5 text-emerald-500" />
                  <span>≥ {topic.minWords} từ</span>
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="size-3.5 text-amber-500" />
                  <span>{topic.timeLimitMin} phút</span>
                </span>
              </div>

              {/* TAGS */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {topic.tags.map((t, idx) => (
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
                onClick={() => onSelectTopic(topic)}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition-all hover:scale-101 cursor-pointer active:scale-98"
              >
                <PenTool className="size-4" />
                <span>Bắt đầu viết bài này</span>
              </button>
            </div>
          </div>
          ))
        )}
      </div>
    </div>
  );
}
