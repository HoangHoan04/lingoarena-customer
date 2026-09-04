"use client";

import VocabAudioButton from "@/components/vocabulary/VocabAudioButton";
import VocabWordImage from "@/components/vocabulary/VocabWordImage";
import { playResultFeedback } from "@/lib/sound";
import { formatIpa, hasVocabAudio, playVocabAudio } from "@/lib/vocab";
import type { StudyAnswerResult, VocabWord } from "@/types/vocabulary";
import { ArrowRight, CheckCircle2, XCircle } from "lucide-react";
import { useEffect, useState } from "react";

export default function QuizPlayer({
  card,
  index,
  total,
  submitting,
  lastAnswer,
  onAnswer,
  onNext,
}: {
  card: VocabWord;
  index: number;
  total: number;
  submitting?: boolean;
  lastAnswer: StudyAnswerResult | null;
  onAnswer: (optionId: string) => void;
  onNext: () => void;
}) {
  const [picked, setPicked] = useState<string | null>(null);
  const quiz = card.quiz;
  const ipa = formatIpa(card);

  useEffect(() => {
    if (hasVocabAudio(card)) playVocabAudio(card, "us");
  }, [card.id]);

  useEffect(() => {
    if (lastAnswer) {
      playResultFeedback(card, lastAnswer.correct, "us", 380);
    }
  }, [lastAnswer, card.id]);

  if (!quiz) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 p-10 text-center text-slate-500">
        Không thể tạo câu hỏi trắc nghiệm cho từ này.
      </div>
    );
  }

  const getOptionStyle = (optionId: string) => {
    if (!picked || !lastAnswer) {
      return "border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:border-primary hover:bg-primary/5 dark:hover:bg-primary/10 shadow-2xs";
    }
    if (optionId === card.id) {
      return "border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 font-bold shadow-md shadow-emerald-500/10 ring-2 ring-emerald-400/50";
    }
    if (optionId === picked && !lastAnswer.correct) {
      return "border-rose-500 bg-rose-50/80 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200 font-bold shadow-md shadow-rose-500/10 ring-2 ring-rose-400/50";
    }
    return "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 text-slate-400 opacity-60";
  };

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 sm:p-8 shadow-xl space-y-6">
      {/* Header Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-primary dark:text-[#7b9bee] tracking-wider uppercase">
              Trắc Nghiệm Nghĩa
            </span>
            <span className="text-slate-400">· Chọn nghĩa tiếng Việt đúng</span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary dark:text-[#7b9bee] font-black text-xs">
            {index + 1} / {total}
          </span>
        </div>
        <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-linear-to-r from-brand to-[#4563b0] rounded-full transition-all duration-300"
            style={{
              width: `${Math.round(((index + (picked ? 1 : 0)) / Math.max(total, 1)) * 100)}%`,
            }}
          />
        </div>
      </div>

      {/* Headword Question Card */}
      <div className="text-center py-6 px-4 rounded-3xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-3">
        <div className="flex items-center justify-center gap-2">
          <VocabAudioButton word={card} accent="us" />
          <VocabAudioButton word={card} accent="uk" />
        </div>

        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          {quiz.prompt}
        </h2>

        <VocabWordImage
          word={card}
          className="w-full max-w-44 mx-auto aspect-4/3 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 relative"
        />

        {ipa && (
          <p className="text-xs font-mono text-slate-400 dark:text-slate-500">
            /{ipa.replace(/^\/|\/$/g, "")}/
          </p>
        )}

        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
          {quiz.question}
        </p>
      </div>

      {/* 4 Options */}
      <div className="grid gap-3">
        {quiz.options.map((option, i) => {
          const letter = String.fromCharCode(65 + i);
          const isSelected = picked === option.id;

          return (
            <button
              key={option.id}
              type="button"
              disabled={!!picked || submitting}
              onClick={() => {
                setPicked(option.id);
                onAnswer(option.id);
              }}
              className={`group flex items-center gap-3.5 w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer disabled:cursor-default select-none ${getOptionStyle(
                option.id,
              )}`}
            >
              <span className="flex items-center justify-center size-8 rounded-xl bg-slate-100 dark:bg-slate-800 group-hover:bg-primary group-hover:text-white text-xs font-black text-slate-600 dark:text-slate-300 transition-colors shrink-0">
                {letter}
              </span>
              <span className="text-sm sm:text-base font-semibold flex-1 leading-snug">
                {option.text}
              </span>
              {picked && option.id === card.id && (
                <CheckCircle2 className="size-5 text-emerald-500 shrink-0" />
              )}
              {picked && isSelected && !lastAnswer?.correct && (
                <XCircle className="size-5 text-rose-500 shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Answer Explanation & Next Button */}
      {lastAnswer && (
        <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-850 p-5 sm:p-6 space-y-4 shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center gap-2">
            {lastAnswer.correct ? (
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-black text-base">
                <CheckCircle2 className="size-5 fill-emerald-500 text-white" />
                <span>Chính xác! (+Good SRS)</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-black text-base">
                <XCircle className="size-5 fill-rose-500 text-white" />
                <span>Chưa đúng (+Again SRS)</span>
              </div>
            )}
          </div>

          <div className="space-y-1.5 text-xs sm:text-sm pl-4 border-l-2 border-primary/30">
            <p className="font-bold text-slate-900 dark:text-white">
              Nghĩa tiếng Việt:{" "}
              <span className="text-primary dark:text-[#7b9bee]">
                {lastAnswer.explanation.meaningVi}
              </span>
            </p>
            {lastAnswer.explanation.definitionVi && (
              <p className="text-slate-700 dark:text-slate-200 text-xs">
                {lastAnswer.explanation.definitionVi}
              </p>
            )}
            {lastAnswer.explanation.definitionEn && (
              <p className="text-slate-600 dark:text-slate-300 text-xs">
                {lastAnswer.explanation.definitionEn}
              </p>
            )}
            {lastAnswer.explanation.exampleEn && (
              <p className="text-slate-500 italic text-xs pt-1">
                “{lastAnswer.explanation.exampleEn}”
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onNext}
            className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-primary hover:bg-primary/90 text-white text-sm font-black shadow-lg shadow-primary/25 transition-all cursor-pointer active:scale-98"
          >
            <span>
              {index + 1 >= total ? "Xem kết quả bài học" : "Câu tiếp theo"}
            </span>
            <ArrowRight className="size-4" />
          </button>
        </div>
      )}
    </div>
  );
}
