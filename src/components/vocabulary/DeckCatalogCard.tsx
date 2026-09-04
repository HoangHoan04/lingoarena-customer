"use client";

import { Link, useRouter } from "@/i18n/routing";
import { pickLocaleText } from "@/lib/locale-text";
import {
  estimateMinutes,
  masteredPercent,
} from "@/lib/vocab";
import { useAuthStore } from "@/stores/useAuthStore";
import type { VocabDeck } from "@/types/vocabulary";
import { BookOpen, Clock3, Play } from "lucide-react";
import { useLocale } from "next-intl";
import DeckCover from "./DeckCover";

export default function DeckCatalogCard({
  deck,
  compact,
}: {
  deck: VocabDeck;
  compact?: boolean;
}) {
  const locale = useLocale();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const minutes = deck.estimatedMinutes || estimateMinutes(deck.itemCount);
  const mastered = masteredPercent(deck);

  const startStudy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const href = `/vocabulary/${deck.slug}/study?mode=FLASHCARD`;
    if (!isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent(href)}`);
      return;
    }
    router.push(href);
  };

  return (
    <article className="group relative flex flex-col rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-slate-800/90 bg-white dark:bg-slate-900 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      {/* Top Banner / Cover */}
      <Link
        href={`/vocabulary/${deck.slug}`}
        className="relative block overflow-hidden cursor-pointer"
      >
        <DeckCover deck={deck} size={compact ? "sm" : "md"} />
      </Link>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 gap-3.5">
        <div>
          <Link
            href={`/vocabulary/${deck.slug}`}
            className="font-black text-base sm:text-lg text-slate-900 dark:text-white group-hover:text-primary dark:group-hover:text-[#7b9bee] line-clamp-2 transition-colors"
          >
            {pickLocaleText(locale, deck.title, deck.titleEn)}
          </Link>

          {!compact && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed min-h-[2rem]">
              {pickLocaleText(locale, deck.description, deck.descriptionEn) ||
                "Luyện từ vựng theo phương pháp lặp lại ngắt quãng SRS hiệu quả."}
            </p>
          )}
        </div>

        {/* Stats Row */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-medium">
          <span className="inline-flex items-center gap-1">
            <BookOpen className="size-3.5 text-primary dark:text-[#7b9bee]" />
            <strong className="text-slate-700 dark:text-slate-300 font-bold">
              {deck.itemCount}
            </strong>{" "}
            từ
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock3 className="size-3.5 text-slate-400" />
            {minutes} phút
          </span>
        </div>

        {/* Progress Bar (if learning) */}
        {mastered > 0 && (
          <div className="space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400">Tiến độ</span>
              <span className="font-bold text-primary dark:text-[#7b9bee]">
                {mastered}%
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-brand to-[#4563b0] rounded-full transition-all duration-500"
                style={{ width: `${mastered}%` }}
              />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-auto pt-2 flex items-center gap-2">
          <button
            type="button"
            onClick={startStudy}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs sm:text-sm font-bold shadow-md shadow-primary/20 hover:shadow-primary/35 transition-all duration-200 cursor-pointer active:scale-98"
          >
            <Play className="size-3.5 fill-current" /> Học ngay
          </button>
          <Link
            href={`/vocabulary/${deck.slug}`}
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-bold transition-colors text-center"
          >
            Chi tiết
          </Link>
        </div>
      </div>
    </article>
  );
}
