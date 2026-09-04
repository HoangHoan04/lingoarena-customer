"use client";

import VocabAudioButton from "@/components/vocabulary/VocabAudioButton";
import VocabWordImage from "@/components/vocabulary/VocabWordImage";
import { playResultFeedback } from "@/lib/sound";
import type { VocabWord } from "@/types/vocabulary";
import { ArrowRight, CheckCircle2, XCircle } from "lucide-react";
import { useMemo, useState } from "react";

function shuffleOptions(word: VocabWord, pool: VocabWord[]) {
  const distractors = pool
    .filter((item) => item.id !== word.id)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);
  return [word, ...distractors].sort(() => Math.random() - 0.5);
}

export default function ReverseQuizPlayer({
  card,
  pool,
  index,
  total,
  onNext,
}: {
  card: VocabWord;
  pool: VocabWord[];
  index: number;
  total: number;
  onNext: (correct: boolean) => void;
}) {
  const options = useMemo(() => shuffleOptions(card, pool), [card.id, pool]);
  const [picked, setPicked] = useState<string | null>(null);

  const correct = picked === card.id;

  const handlePick = (optionId: string) => {
    if (picked) return;
    setPicked(optionId);
    const isCorrect = optionId === card.id;
    playResultFeedback(card, isCorrect, "us", 380);
  };

  const getOptionStyle = (optionId: string) => {
    if (!picked) {
      return "border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:border-primary hover:bg-primary/5 dark:hover:bg-primary/10 shadow-2xs";
    }
    if (optionId === card.id) {
      return "border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 font-bold ring-2 ring-emerald-400/50";
    }
    if (optionId === picked && !correct) {
      return "border-rose-500 bg-rose-50/80 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200 font-bold ring-2 ring-rose-400/50";
    }
    return "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 text-slate-400 opacity-60";
  };

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 sm:p-8 shadow-xl space-y-6 min-h-[380px]">
      {/* Header Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-primary dark:text-[#7b9bee] tracking-wider uppercase">
              Trắc Nghiệm Đảo
            </span>
            <span className="text-slate-400">
              · Nghĩa tiếng Việt → Chọn từ tiếng Anh
            </span>
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

      {/* Meaning Prompt */}
      <div className="text-center py-6 px-4 rounded-3xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-2">
        <p className="text-xs uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500">
          Từ tiếng Anh nào mang ý nghĩa:
        </p>
        <h2 className="text-2xl sm:text-3xl font-black text-primary dark:text-[#7b9bee]">
          “{card.meaningVi}”
        </h2>
        <VocabWordImage
          word={card}
          className="mx-auto w-full max-w-44 aspect-4/3 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 relative"
        />
        {card.definitionVi && (
          <p className="text-xs text-slate-600 dark:text-slate-300 max-w-lg mx-auto italic">
            {card.definitionVi}
          </p>
        )}
        {card.definitionEn && (
          <p className="text-xs text-slate-500 max-w-lg mx-auto italic">
            {card.definitionEn}
          </p>
        )}
      </div>

      {/* Options */}
      <div className="grid gap-3">
        {options.map((option, i) => {
          const letter = String.fromCharCode(65 + i);
          const isSelected = picked === option.id;

          return (
            <div
              key={option.id}
              role="button"
              tabIndex={picked ? -1 : 0}
              onClick={() => {
                if (!picked) handlePick(option.id);
              }}
              onKeyDown={(e) => {
                if ((e.key === "Enter" || e.key === " ") && !picked) {
                  e.preventDefault();
                  handlePick(option.id);
                }
              }}
              className={`group flex items-center justify-between p-4 rounded-2xl border-2 transition-all duration-200 select-none ${
                picked ? "cursor-default" : "cursor-pointer"
              } ${getOptionStyle(option.id)}`}
            >
              <div className="flex items-center gap-3.5">
                <span className="flex items-center justify-center size-8 rounded-xl bg-slate-100 dark:bg-slate-800 group-hover:bg-primary group-hover:text-white text-xs font-black text-slate-600 dark:text-slate-300 transition-colors shrink-0">
                  {letter}
                </span>
                <span className="text-base font-black text-slate-900 dark:text-white">
                  {option.headword}
                </span>
                {option.partOfSpeech && (
                  <span className="text-xs text-slate-400 italic">
                    ({option.partOfSpeech})
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {picked && (
                  <VocabAudioButton word={option} accent="us" compact />
                )}
                {picked && option.id === card.id && (
                  <CheckCircle2 className="size-5 text-emerald-500 shrink-0" />
                )}
                {picked && isSelected && !correct && (
                  <XCircle className="size-5 text-rose-500 shrink-0" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {picked && (
        <button
          type="button"
          onClick={() => onNext(correct)}
          className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-primary hover:bg-primary/90 text-white text-sm font-black shadow-lg shadow-primary/25 transition-all cursor-pointer active:scale-98 animate-in fade-in"
        >
          <span>
            {index + 1 >= total ? "Hoàn thành lượt luyện" : "Từ tiếp theo"}
          </span>
          <ArrowRight className="size-4" />
        </button>
      )}
    </div>
  );
}
