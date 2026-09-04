"use client";

import type { AptisQuestion } from "@/types/aptis";
import { ArrowLeft, ArrowRight, Flag, Headphones, Pause, Play, RotateCcw, Volume2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface AptisListeningSectionProps {
  question: AptisQuestion;
  currentIndex: number;
  totalQuestions: number;
  selectedAnswer?: string;
  isFlagged: boolean;
  onSelectAnswer: (value: string) => void;
  onToggleFlag: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

export function AptisListeningSection({
  question,
  currentIndex,
  totalQuestions,
  selectedAnswer,
  isFlagged,
  onSelectAnswer,
  onToggleFlag,
  onNext,
  onPrevious,
}: AptisListeningSectionProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playCount, setPlayCount] = useState(0);
  const MAX_PLAYS = 2;

  useEffect(() => {
    // Reset play state on question change
    setIsPlaying(false);
    setPlayCount(0);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  }, [question.id]);

  const handleTogglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      if (playCount >= MAX_PLAYS) return;
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {});
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setPlayCount((p) => Math.min(MAX_PLAYS, p + 1));
  };

  return (
    <div className="space-y-6">
      {/* Audio Player Card */}
      <div className="rounded-3xl border border-blue-200/80 dark:border-blue-900/50 bg-linear-to-br from-blue-50/70 via-indigo-50/40 to-slate-50 dark:from-slate-900 dark:via-blue-950/20 dark:to-slate-900 p-6 sm:p-7 shadow-sm space-y-4">
        {question.audioUrl && (
          <audio
            ref={audioRef}
            src={question.audioUrl}
            onEnded={handleAudioEnded}
          />
        )}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-600 text-white shadow-xs">
              <Headphones className="size-4" />
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-blue-700 dark:text-blue-300 block">
                {question.partTitle || "Audio Nghe Aptis"}
              </span>
              <span className="text-[11px] font-semibold text-slate-500">
                Lượt nghe: <strong className="text-blue-600">{playCount}</strong> / {MAX_PLAYS} lần
              </span>
            </div>
          </div>

          <button
            type="button"
            disabled={playCount >= MAX_PLAYS && !isPlaying}
            onClick={handleTogglePlay}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer ${
              isPlaying
                ? "bg-rose-600 text-white hover:bg-rose-700"
                : playCount >= MAX_PLAYS
                  ? "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="size-4 fill-current" />
                <span>Tạm dừng</span>
              </>
            ) : (
              <>
                <Play className="size-4 fill-current" />
                <span>{playCount === 0 ? "Bắt đầu nghe" : "Nghe lại (lần 2)"}</span>
              </>
            )}
          </button>
        </div>

        {/* Visual equalizer wave */}
        {isPlaying && (
          <div className="flex items-center justify-center gap-1.5 h-6 pt-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((bar) => (
              <span
                key={bar}
                className="w-1 bg-blue-500 rounded-full animate-pulse"
                style={{
                  height: `${Math.sin(bar + Date.now()) * 12 + 14}px`,
                  animationDuration: `${0.4 + (bar % 3) * 0.2}s`,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Question Card Container */}
      <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 text-xs font-black uppercase">
              Listening Part {question.part}
            </span>
            <span className="text-xs font-bold text-slate-400">
              Câu {currentIndex + 1} / {totalQuestions}
            </span>
          </div>

          <button
            type="button"
            onClick={onToggleFlag}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-colors cursor-pointer select-none ${
              isFlagged
                ? "border-amber-400 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300"
                : "border-slate-200 dark:border-slate-800 text-slate-500 hover:border-amber-400"
            }`}
          >
            <Flag className={`size-3.5 ${isFlagged ? "fill-amber-400 text-amber-500" : ""}`} />
            <span>{isFlagged ? "Đã đánh dấu" : "Đánh dấu câu này"}</span>
          </button>
        </div>

        {/* Prompt */}
        <div className="space-y-2">
          {question.instructions && (
            <p className="text-xs text-slate-400 italic">
              {question.instructions}
            </p>
          )}
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-relaxed">
            {question.prompt}
          </h2>
        </div>

        {/* Options */}
        <div className="grid gap-3 pt-2">
          {question.options?.map((opt, idx) => {
            const isSelected = selectedAnswer === opt.key;

            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => onSelectAnswer(opt.key)}
                className={`group flex items-center gap-3.5 w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer select-none ${
                  isSelected
                    ? "border-blue-600 dark:border-blue-500 bg-blue-50/70 dark:bg-blue-950/30 text-slate-900 dark:text-white shadow-md ring-2 ring-blue-500/30"
                    : "border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:border-blue-500/60 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                }`}
              >
                <span
                  className={`flex items-center justify-center size-8 rounded-xl text-xs font-black transition-colors shrink-0 ${
                    isSelected
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-blue-600 group-hover:text-white"
                  }`}
                >
                  {opt.key || String.fromCharCode(65 + idx)}
                </span>
                <span className="text-sm sm:text-base font-semibold flex-1">
                  {opt.content}
                </span>
              </button>
            );
          })}
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            disabled={currentIndex === 0}
            onClick={onPrevious}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 text-xs sm:text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <ArrowLeft className="size-4" />
            <span>Câu trước</span>
          </button>

          <button
            type="button"
            onClick={onNext}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-black shadow-md shadow-blue-600/25 cursor-pointer"
          >
            <span>{currentIndex + 1 >= totalQuestions ? "Kiểm tra toàn bộ" : "Câu tiếp theo"}</span>
            <ArrowRight className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
