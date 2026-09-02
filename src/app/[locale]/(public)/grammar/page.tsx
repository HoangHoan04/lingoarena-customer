"use client";

import { Link } from "@/i18n/routing";
import { grammarService } from "@/services/grammar.service";
import { useToastStore } from "@/stores/useToastStore";
import type { GrammarStructure, GrammarTopic } from "@/types/grammar";
import { BookOpen, Layers, RotateCcw, Search, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const CEFR_OPTIONS = ["A1", "A2", "B1", "B2", "C1", "C2"];

export default function GrammarPage() {
  const { addToast } = useToastStore();
  const [topics, setTopics] = useState<GrammarTopic[]>([]);
  const [structures, setStructures] = useState<GrammarStructure[]>([]);
  const [keyword, setKeyword] = useState("");
  const [cefrLevel, setCefrLevel] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const [topicRes, structureRes] = await Promise.all([
          grammarService.paginationTopics(0, 60, cefrLevel ? { cefrLevel } : {}),
          grammarService.paginationStructures(0, 100, {}),
        ]);
        if (!cancelled) {
          setTopics(topicRes.data);
          setStructures(structureRes.data);
        }
      } catch (err: unknown) {
        addToast(err instanceof Error ? err.message : "Không tải được ngữ pháp", "error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [addToast, cefrLevel]);

  const filteredTopics = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    if (!q) return topics;
    return topics.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.slug.toLowerCase().includes(q) ||
        (item.description || "").toLowerCase().includes(q),
    );
  }, [keyword, topics]);

  const structuresByTopic = useMemo(() => {
    return structures.reduce<Record<string, GrammarStructure[]>>((acc, item) => {
      acc[item.grammarTopicId] = [...(acc[item.grammarTopicId] || []), item];
      return acc;
    }, {});
  }, [structures]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-16">
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-r from-slate-900 via-[#1e2f5e] to-slate-900 text-white p-6 sm:p-10 border border-slate-800 shadow-xl">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/25 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-bold uppercase tracking-wider text-blue-200">
            <Sparkles className="size-3.5 text-amber-400" />
            <span>Grammar Arena</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
            Hệ Thống Ngữ Pháp Theo CEFR
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            Khám phá chủ điểm, công thức, cách dùng và ví dụ đã được duyệt để luyện ngữ pháp có hệ thống.
          </p>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Tìm chủ điểm ngữ pháp..."
              className="w-full h-11 pl-10 pr-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:border-primary focus:outline-none"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {CEFR_OPTIONS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCefrLevel((prev) => (prev === item ? "" : item))}
                className={`px-4 py-2 rounded-2xl text-xs font-black border transition-colors cursor-pointer ${
                  cefrLevel === item
                    ? "bg-primary text-white border-primary"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                }`}
              >
                {item}
              </button>
            ))}
            {(keyword || cefrLevel) && (
              <button type="button" onClick={() => { setKeyword(""); setCefrLevel(""); }} className="inline-flex items-center gap-1 text-xs font-bold text-primary">
                <RotateCcw className="size-3" />
                Đặt lại
              </button>
            )}
          </div>
        </div>
      </section>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="h-56 rounded-3xl bg-slate-100 dark:bg-slate-800/60 animate-pulse" />
          ))}
        </div>
      ) : (
        <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTopics.map((topic) => {
            const count = structuresByTopic[topic.id]?.length || 0;
            return (
              <Link
                key={topic.id}
                href={`/grammar/${topic.slug}`}
                className="group rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-2xs hover:shadow-lg transition-all space-y-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="size-12 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-primary flex items-center justify-center">
                    <BookOpen className="size-6" />
                  </div>
                  <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-xs font-bold text-slate-500">
                    CEFR {topic.cefrLevel || "A2"}
                  </span>
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-primary">
                    {topic.title}
                  </h2>
                  <p className="mt-2 line-clamp-2 text-sm text-slate-500">{topic.description || "Chủ điểm ngữ pháp LingoArena."}</p>
                </div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary">
                  <Layers className="size-3.5" />
                  {count} cấu trúc đã duyệt
                </div>
              </Link>
            );
          })}
        </section>
      )}
    </div>
  );
}
