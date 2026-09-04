"use client";

import type { ToeicQuestion } from "@/types/toeic";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Flag,
  Headphones,
  Pause,
  Play,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface ToeicQuestionCardProps {
  question: ToeicQuestion;
  currentIndex: number;
  totalQuestions: number;
  selectedAnswer?: string;
  isFlagged: boolean;
  onSelectAnswer: (value: "A" | "B" | "C" | "D") => void;
  onToggleFlag: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

export function ToeicQuestionCard({
  question,
  currentIndex,
  totalQuestions,
  selectedAnswer,
  isFlagged,
  onSelectAnswer,
  onToggleFlag,
  onNext,
  onPrevious,
}: ToeicQuestionCardProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [textSize, setTextSize] = useState<"sm" | "base" | "lg">("base");

  const isListening = question.sectionKey === "listening";

  useEffect(() => {
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  }, [question.id]);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  };

  return (
    <div className="space-y-4">
      {/* 1. PASSAGE VIEW (For Part 6 & Part 7) */}
      {question.passageText && (
        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
            <div className="flex items-center gap-2">
              <BookOpen className="size-4 text-brand dark:text-[#7b9bee]" />
              <span className="text-xs font-black uppercase tracking-wider text-brand dark:text-[#7b9bee]">
                Đoạn văn đọc hiểu (Part {question.part})
              </span>
            </div>

            {/* Font size adjuster */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300">
              <button
                type="button"
                onClick={() => setTextSize("sm")}
                className={`px-1.5 py-0.5 rounded cursor-pointer ${textSize === "sm" ? "bg-white dark:bg-slate-700 font-black shadow-2xs" : ""}`}
              >
                A-
              </button>
              <button
                type="button"
                onClick={() => setTextSize("base")}
                className={`px-1.5 py-0.5 rounded cursor-pointer ${textSize === "base" ? "bg-white dark:bg-slate-700 font-black shadow-2xs" : ""}`}
              >
                A
              </button>
              <button
                type="button"
                onClick={() => setTextSize("lg")}
                className={`px-1.5 py-0.5 rounded cursor-pointer ${textSize === "lg" ? "bg-white dark:bg-slate-700 font-black shadow-2xs" : ""}`}
              >
                A+
              </button>
            </div>
          </div>

          <div
            className={`font-serif leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-wrap ${
              textSize === "sm"
                ? "text-xs sm:text-sm"
                : textSize === "lg"
                  ? "text-base"
                  : "text-sm"
            }`}
          >
            {question.passageText}
          </div>
        </div>
      )}

      {/* 2. MAIN QUESTION CARD */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-7 space-y-5 shadow-sm">
        {/* Top Badges & Flag */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-brand/10 text-brand dark:bg-brand/25 dark:text-[#7b9bee] text-xs font-black uppercase tracking-wider">
              TOEIC Part {question.part}
            </span>
            <span className="text-xs font-bold text-slate-400">
              Câu {question.number} ({currentIndex + 1}/{totalQuestions})
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
            <Flag
              className={`size-3.5 ${isFlagged ? "fill-amber-400 text-amber-500" : ""}`}
            />
            <span>{isFlagged ? "Đã gắn cờ" : "Gắn cờ câu này"}</span>
          </button>
        </div>

        {/* Audio Player (If Listening) */}
        {isListening && question.audioUrl && (
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
            <audio
              ref={audioRef}
              src={question.audioUrl}
              onEnded={() => setIsPlaying(false)}
            />
            <div className="flex items-center gap-2 text-xs font-bold text-brand dark:text-[#7b9bee]">
              <Headphones className="size-4" />
              <span>Audio TOEIC Part {question.part}</span>
            </div>

            <button
              type="button"
              onClick={toggleAudio}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-brand hover:bg-brand/90 text-white text-xs font-black shadow-xs cursor-pointer"
            >
              {isPlaying ? (
                <Pause className="size-3.5 fill-current" />
              ) : (
                <Play className="size-3.5 fill-current" />
              )}
              <span>{isPlaying ? "Tạm dừng" : "Phát audio"}</span>
            </button>
          </div>
        )}

        {/* Image (If Part 1) */}
        {question.imageUrl && (
          <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 max-h-72 flex items-center justify-center bg-slate-100 dark:bg-slate-800">
            <img
              src={question.imageUrl}
              alt={`TOEIC Part 1 Question ${question.number}`}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Prompt */}
        <div className="space-y-1">
          {question.instructions && (
            <p className="text-xs text-slate-400 italic">
              {question.instructions}
            </p>
          )}
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
            {question.prompt}
          </h2>
        </div>

        {/* Options */}
        <div className="grid gap-2.5 pt-1">
          {question.options?.map((opt) => {
            const isSelected = selectedAnswer === opt.key;

            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => onSelectAnswer(opt.key)}
                className={`group flex items-center gap-3 w-full text-left p-3.5 rounded-xl border-2 transition-all cursor-pointer select-none ${
                  isSelected
                    ? "border-brand dark:border-[#7b9bee] bg-brand/10 text-slate-900 dark:text-white shadow-xs font-bold"
                    : "border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:border-brand/50 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                }`}
              >
                <span
                  className={`flex items-center justify-center size-7 rounded-lg text-xs font-black transition-colors shrink-0 ${
                    isSelected
                      ? "bg-brand text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-brand group-hover:text-white"
                  }`}
                >
                  {opt.key}
                </span>
                <span className="text-xs sm:text-sm font-semibold flex-1">
                  {opt.content}
                </span>
              </button>
            );
          })}
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            disabled={currentIndex === 0}
            onClick={onPrevious}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 text-xs font-bold disabled:opacity-40 cursor-pointer"
          >
            <ArrowLeft className="size-3.5" />
            <span>Câu trước</span>
          </button>

          <button
            type="button"
            onClick={onNext}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-brand hover:bg-brand/90 text-white text-xs font-black shadow-md shadow-brand/25 cursor-pointer"
          >
            <span>
              {currentIndex + 1 >= totalQuestions
                ? "Kiểm tra toàn bộ"
                : "Câu tiếp theo"}
            </span>
            <ArrowRight className="size-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
