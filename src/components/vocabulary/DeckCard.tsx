"use client";

import { Link } from "@/i18n/routing";
import { cefrBadgeClass, deckTheme, estimateMinutes, masteredPercent } from "@/lib/vocab";
import type { VocabDeck } from "@/types/vocabulary";
import { BookOpen, Clock3, Sparkles } from "lucide-react";

export default function DeckCard({ deck }: { deck: VocabDeck }) {
  const theme = deckTheme(deck);
  const minutes = deck.estimatedMinutes || estimateMinutes(deck.itemCount);
  const mastered = masteredPercent(deck);
  const due = deck.progress?.dueCount ?? deck.itemCount;

  return (
    <Link
      href={`/vocabulary/${deck.slug}`}
      className="group flex flex-col rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-2xs hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
    >
      <div className={`h-28 bg-linear-to-br ${theme.gradient} p-4 text-white flex flex-col justify-between relative overflow-hidden`}>
        <div className="flex items-center justify-between z-10">
          <span className="px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-black tracking-wider uppercase opacity-95">
            {theme.exam}
          </span>
          {deck.level && (
            <span className="px-2 py-0.5 rounded-full bg-black/25 backdrop-blur-md text-[10px] font-bold">
              {deck.level}
            </span>
          )}
        </div>
        <h3 className="text-base sm:text-lg font-black leading-snug line-clamp-1 text-white z-10">
          {deck.title}
        </h3>
        <Sparkles className="absolute -right-2 -bottom-2 size-16 text-white/10 pointer-events-none" />
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between gap-3">
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
          {deck.description || "Bộ từ vựng chuẩn hóa để luyện Flashcard và Quiz thông minh."}
        </p>

        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1">
            <BookOpen className="size-3.5 text-primary dark:text-[#7b9bee]" /> {deck.itemCount} từ
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock3 className="size-3.5" /> {minutes}p
          </span>
        </div>

        <div className="pt-1 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex justify-between text-[11px] text-slate-500 mb-1">
            <span className="font-semibold text-primary dark:text-[#7b9bee]">{due} thẻ đến hạn</span>
            <span>{mastered}% thuộc</span>
          </div>
          <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-primary dark:bg-[#7b9bee] rounded-full transition-all duration-300"
              style={{ width: `${Math.max(mastered, 4)}%` }}
            />
          </div>
        </div>
      </div>
    </Link>
  );
}
