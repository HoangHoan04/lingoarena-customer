"use client";

import VocabAudioButton from "@/components/vocabulary/VocabAudioButton";
import VocabWordImage from "@/components/vocabulary/VocabWordImage";
import {
  cefrBadgeClass,
  formatIpa,
  hasVocabAudio,
  playVocabAudio,
  relationLabel,
} from "@/lib/vocab";
import type { FlashcardRating, VocabWord } from "@/types/vocabulary";
import { Rotate3d, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

const RATINGS: {
  key: FlashcardRating;
  label: string;
  hint: string;
  shortcut: string;
  borderClass: string;
  bgClass: string;
  textClass: string;
}[] = [
  {
    key: "AGAIN",
    label: "Quên (Again)",
    hint: "< 10 phút",
    shortcut: "1",
    borderClass: "border-rose-300 dark:border-rose-800 hover:border-rose-500",
    bgClass:
      "bg-rose-50/70 hover:bg-rose-100 dark:bg-rose-950/30 dark:hover:bg-rose-950/60",
    textClass: "text-rose-600 dark:text-rose-400",
  },
  {
    key: "HARD",
    label: "Khó (Hard)",
    hint: "~1 ngày",
    shortcut: "2",
    borderClass:
      "border-amber-300 dark:border-amber-800 hover:border-amber-500",
    bgClass:
      "bg-amber-50/70 hover:bg-amber-100 dark:bg-amber-950/30 dark:hover:bg-amber-950/60",
    textClass: "text-amber-600 dark:text-amber-400",
  },
  {
    key: "GOOD",
    label: "Tốt (Good)",
    hint: "~3 ngày",
    shortcut: "3",
    borderClass: "border-blue-300 dark:border-blue-800 hover:border-blue-500",
    bgClass:
      "bg-blue-50/70 hover:bg-blue-100 dark:bg-blue-950/30 dark:hover:bg-blue-950/60",
    textClass: "text-blue-600 dark:text-blue-400",
  },
  {
    key: "EASY",
    label: "Dễ (Easy)",
    hint: "~7 ngày",
    shortcut: "4",
    borderClass:
      "border-emerald-300 dark:border-emerald-800 hover:border-emerald-500",
    bgClass:
      "bg-emerald-50/70 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:hover:bg-emerald-950/60",
    textClass: "text-emerald-600 dark:text-emerald-400",
  },
];

export default function FlashcardPlayer({
  card,
  index,
  total,
  submitting,
  onRate,
}: {
  card: VocabWord;
  index: number;
  total: number;
  submitting?: boolean;
  onRate: (rating: FlashcardRating) => void;
}) {
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    if (hasVocabAudio(card)) playVocabAudio(card, "us");
  }, [card.id]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const tag = (event.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (event.code === "Space") {
        event.preventDefault();
        setFlipped((value) => !value);
        return;
      }
      if (!flipped || submitting) return;
      const map: Record<string, FlashcardRating> = {
        "1": "AGAIN",
        "2": "HARD",
        "3": "GOOD",
        "4": "EASY",
      };
      const rating = map[event.key];
      if (rating) onRate(rating);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [flipped, submitting, onRate]);

  const ipa = formatIpa(card);
  const extraExamples = (card.examples || []).slice(1);
  const collocations = card.collocations || [];
  const relations = card.relations || [];
  const percent = Math.round(
    ((index + (flipped ? 1 : 0)) / Math.max(total, 1)) * 100,
  );

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 sm:p-8 shadow-xl space-y-6">
      {/* Session Progress Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-primary dark:text-[#7b9bee] tracking-wider uppercase">
              Flashcard SRS
            </span>
            <span className="text-slate-400">· Thuật toán SM-2</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary dark:text-[#7b9bee] font-black text-xs">
              {index + 1} / {total}
            </span>
          </div>
        </div>
        <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-linear-to-r from-brand to-[#4563b0] rounded-full transition-all duration-300"
            style={{ width: `${Math.max(percent, 6)}%` }}
          />
        </div>
      </div>

      {/* 3D Flip Card Container */}
      <div className="w-full [perspective:1400px]">
        <div
          role="button"
          tabIndex={0}
          onClick={() => setFlipped((value) => !value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              setFlipped((value) => !value);
            }
          }}
          className="relative min-h-[420px] sm:min-h-[460px] w-full transition-transform duration-500 [transform-style:preserve-3d] cursor-pointer text-left select-none outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-3xl"
          style={{ transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
        >
          {/* FRONT SIDE */}
          <div className="absolute inset-0 rounded-3xl border-2 border-slate-200/90 dark:border-slate-800 bg-linear-to-b from-slate-50/80 via-white to-slate-50/40 dark:from-slate-800/50 dark:via-slate-900 dark:to-slate-900 p-6 sm:p-10 flex flex-col items-center justify-center text-center shadow-lg [backface-visibility:hidden]">
            {/* Pronunciation & Level Badge */}
            <div className="flex items-center gap-2 mb-2 shrink-0">
              <VocabAudioButton word={card} accent="us" />
              <VocabAudioButton word={card} accent="uk" />
              {card.cefrLevel && (
                <span
                  className={`px-2.5 py-1 rounded-full border text-xs font-black uppercase ${cefrBadgeClass(
                    card.cefrLevel,
                  )}`}
                >
                  CEFR {card.cefrLevel}
                </span>
              )}
            </div>

            {/* Word Image */}
            <VocabWordImage
              word={card}
              className="my-2.5 w-full max-w-56 sm:max-w-64 aspect-16/10 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 relative shadow-sm shrink-0"
            />

            {/* Headword */}
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
              {card.headword}
            </h2>

            {/* Part of Speech & IPA */}
            <div className="flex items-center gap-2 mt-2 text-slate-500 dark:text-slate-400 text-sm">
              {card.partOfSpeech && (
                <span className="font-semibold italic">
                  ({card.partOfSpeech})
                </span>
              )}
              {ipa && (
                <span className="font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-xs">
                  /{ipa.replace(/^\/|\/$/g, "")}/
                </span>
              )}
            </div>

            {/* Flip Hint */}
            <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800/80 text-xs font-bold text-slate-500 dark:text-slate-400 shrink-0">
              <Rotate3d className="size-4 text-primary dark:text-[#7b9bee]" />
              <span>Chạm hoặc nhấn Space để lật thẻ xem nghĩa</span>
            </div>
          </div>

          {/* BACK SIDE */}
          <div
            className="absolute inset-0 rounded-3xl border-2 border-primary/40 dark:border-primary/50 bg-white dark:bg-slate-900 p-6 sm:p-8 overflow-y-auto shadow-2xl [backface-visibility:hidden]"
            style={{ transform: "rotateY(180deg)" }}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-xl font-black text-slate-900 dark:text-white">
                  {card.headword}
                </span>
                {card.partOfSpeech && (
                  <span className="text-xs text-slate-400 italic">
                    ({card.partOfSpeech})
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                <VocabAudioButton word={card} accent="us" compact />
                <VocabAudioButton word={card} accent="uk" compact />
              </div>
            </div>

            {/* Image + Meaning Grid */}
            <div className="flex flex-col sm:flex-row gap-4 items-start pt-3">
              <VocabWordImage
                word={card}
                className="w-full sm:w-48 aspect-16/10 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 relative shrink-0 shadow-xs"
              />

              {/* Meaning & Definition */}
              <div className="flex-1 min-w-0 space-y-2 text-left">
                <div className="text-2xl sm:text-3xl font-black text-primary dark:text-[#7b9bee]">
                  {card.meaningVi}
                </div>
                {card.definitionVi && (
                  <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed pl-3 border-l-2 border-emerald-500/40">
                    {card.definitionVi}
                  </p>
                )}
                {card.definitionEn && (
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed pl-3 border-l-2 border-primary/30">
                    {card.definitionEn}
                  </p>
                )}
              </div>
            </div>

            {/* Examples */}
            {(card.exampleEn || extraExamples.length > 0) && (
              <div className="mt-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-left space-y-1.5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <Sparkles className="size-3 text-amber-500" /> Ví dụ minh họa
                </div>
                {card.exampleEn && (
                  <div>
                    <p className="text-xs font-medium text-slate-800 dark:text-slate-200 italic">
                      “{card.exampleEn}”
                    </p>
                    {card.exampleVi && (
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {card.exampleVi}
                      </p>
                    )}
                  </div>
                )}
                {extraExamples.map((item) => (
                  <div
                    key={item.id || item.sentence}
                    className="pt-1 border-t border-slate-200/50 dark:border-slate-700/50"
                  >
                    <p className="text-xs font-medium text-slate-800 dark:text-slate-200 italic">
                      “{item.sentence}”
                    </p>
                    {item.translation && (
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {item.translation}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Collocations */}
            {collocations.length > 0 && (
              <div className="mt-3 text-left">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Collocations thường gặp
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {collocations.map((item) => (
                    <span
                      key={item.id || item.collocation}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-200"
                    >
                      <strong className="font-semibold text-primary dark:text-[#7b9bee]">
                        {item.collocation}
                      </strong>
                      {item.meaningVi && (
                        <span className="text-slate-400">
                          ({item.meaningVi})
                        </span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Relations */}
            {relations.length > 0 && (
              <div className="mt-3 text-left">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Quan hệ từ
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {relations.map((item) => (
                    <span
                      key={item.id || item.relatedVocabularyId}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs"
                    >
                      <span className="text-[10px] uppercase font-bold text-slate-400">
                        {relationLabel(item.relationType)}:
                      </span>
                      <strong>{item.relatedHeadword}</strong>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4-Grade SRS Rating Buttons */}
      <div className="space-y-3 pt-2">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {RATINGS.map((item) => (
            <button
              key={item.key}
              type="button"
              disabled={submitting || !flipped}
              onClick={() => onRate(item.key)}
              className={`group flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed select-none active:scale-95 shadow-2xs hover:shadow-md ${item.borderClass} ${item.bgClass}`}
            >
              <div className="flex items-center gap-1.5">
                <span
                  className={`text-xs sm:text-sm font-black ${item.textClass}`}
                >
                  {item.label}
                </span>
                <span className="hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/10 dark:bg-white/10 text-slate-600 dark:text-slate-300">
                  [{item.shortcut}]
                </span>
              </div>
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                {item.hint}
              </span>
            </button>
          ))}
        </div>

        {!flipped ? (
          <p className="text-center text-xs text-slate-400 font-medium">
            💡 Lật thẻ (Space) để kiểm tra đáp án trước khi tự đánh giá mức độ
            nhớ
          </p>
        ) : (
          <p className="text-center text-xs text-slate-400 font-medium">
            Bấm phím 1 (Again), 2 (Hard), 3 (Good), 4 (Easy) để đánh giá nhanh
          </p>
        )}
      </div>
    </div>
  );
}
