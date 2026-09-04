"use client";

import type { YoutubeSentence } from "@/types/listening-youtube";
import { CheckCircle2, Clock, FileText, Lock, Sparkles, Unlock } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";

interface YoutubeTranscriptSidebarProps {
  sentences: YoutubeSentence[];
  currentIndex: number;
  completedSentenceIds: string[];
  onSelectSentence: (index: number) => void;
}

function formatSec(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

function maskSentenceText(text: string): string {
  return text
    .split(/\s+/)
    .map((word) => {
      // Replace every alphanumeric character with an asterisk, keeping punctuation
      return word.replace(/[a-zA-Z0-9]/g, "*");
    })
    .join(" ");
}

export function YoutubeTranscriptSidebar({
  sentences,
  currentIndex,
  completedSentenceIds,
  onSelectSentence,
}: YoutubeTranscriptSidebarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);

  // Auto scroll ONLY within the transcript card container, NEVER scrolling the window/page!
  useEffect(() => {
    const container = containerRef.current;
    const target = activeRef.current;
    if (container && target) {
      const containerRect = container.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      const currentScroll = container.scrollTop;
      const targetOffset = targetRect.top - containerRect.top + currentScroll;

      container.scrollTo({
        top: Math.max(0, targetOffset - container.clientHeight / 2 + target.clientHeight / 2),
        behavior: "smooth",
      });
    }
  }, [currentIndex]);

  const completedCount = useMemo(() => {
    return sentences.filter((s) => completedSentenceIds.includes(s.id)).length;
  }, [sentences, completedSentenceIds]);

  const progressPercent = sentences.length > 0 ? Math.round((completedCount / sentences.length) * 100) : 0;

  return (
    <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 shadow-sm space-y-4 max-h-[820px] flex flex-col justify-between">
      {/* HEADER */}
      <div className="space-y-2 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="size-4 text-rose-600" />
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Bản Chép Phụ Đề
            </h3>
          </div>

          <span className="text-[11px] font-bold text-slate-400">
            <strong className="text-emerald-600 dark:text-emerald-400 font-black">{completedCount}</strong>/{sentences.length} mở khóa
          </span>
        </div>

        {/* Mini progress bar */}
        <div className="h-1 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-linear-to-r from-rose-500 to-emerald-500 transition-all duration-300"
            style={{ width: `${Math.max(progressPercent, 2)}%` }}
          />
        </div>
      </div>

      {/* SENTENCE LIST - Internal scrolling only */}
      <div ref={containerRef} className="space-y-2.5 overflow-y-auto pr-1 custom-scrollbar flex-1 max-h-[640px]">
        {sentences.map((st, idx) => {
          const isActive = idx === currentIndex;
          const isUnlocked = completedSentenceIds.includes(st.id);

          return (
            <button
              key={st.id}
              ref={isActive ? activeRef : null}
              type="button"
              onClick={() => onSelectSentence(idx)}
              className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer select-none space-y-1.5 ${
                isActive
                  ? "border-rose-500 bg-rose-50/70 dark:bg-rose-950/40 text-slate-900 dark:text-white shadow-xs ring-1 ring-rose-400"
                  : isUnlocked
                    ? "border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20 text-slate-800 dark:text-slate-200 hover:bg-emerald-50/70"
                    : "border-slate-200/80 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`flex items-center justify-center size-5 rounded-md text-[10px] font-black ${
                      isActive
                        ? "bg-rose-600 text-white"
                        : isUnlocked
                          ? "bg-emerald-600 text-white"
                          : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    {idx + 1}
                  </span>

                  {isUnlocked ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 text-[9px] font-black uppercase">
                      <CheckCircle2 className="size-2.5 text-emerald-600" />
                      <span>Đã mở khóa</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500 dark:bg-slate-800 text-[9px] font-bold">
                      <Lock className="size-2.5" />
                      <span>Chưa mở</span>
                    </span>
                  )}
                </div>

                <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-slate-400">
                  <Clock className="size-2.5" />
                  <span>{formatSec(st.startSec)}</span>
                </span>
              </div>

              {/* TRANSCRIPT TEXT: REVEAL ONLY WHEN UNLOCKED */}
              {isUnlocked ? (
                <>
                  <p className={`text-xs leading-relaxed ${isActive ? "font-black text-slate-900 dark:text-white" : "font-bold text-slate-800 dark:text-slate-200"}`}>
                    {st.text}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 italic">
                    {st.translationVi}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-xs font-mono tracking-widest text-slate-400 dark:text-slate-500 select-none">
                    {maskSentenceText(st.text)}
                  </p>
                  <p className="text-[10px] text-slate-400 italic flex items-center gap-1">
                    <Lock className="size-2.5 text-amber-500" />
                    <span>Gõ đúng câu này để mở khóa bản chép</span>
                  </p>
                </>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
