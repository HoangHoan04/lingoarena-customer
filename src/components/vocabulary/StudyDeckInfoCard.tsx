"use client";

import DeckCover from "@/components/vocabulary/DeckCover";
import { pickLocaleText } from "@/lib/locale-text";
import { cn } from "@/lib/utils";
import { deckCefrLevel, estimateMinutes } from "@/lib/vocab";
import type { VocabDeck, VocabWord } from "@/types/vocabulary";
import {
  BookOpen,
  CheckCircle2,
  Clock3,
  Flame,
  FolderOpen,
  Layers,
  Sparkles,
  Tag,
} from "lucide-react";

export interface AggregatedTopic {
  id: string;
  name: string;
  count: number;
  words: VocabWord[];
}

interface StudyDeckInfoCardProps {
  deck: VocabDeck;
  locale: string;
  deckTopics: AggregatedTopic[];
  selectedTopicId: string;
  onSelectTopic: (topicId: string) => void;
  currentStudyIndex?: number;
  activeTopicWordCount?: number;
}

export default function StudyDeckInfoCard({
  deck,
  locale,
  deckTopics,
  selectedTopicId,
  onSelectTopic,
  currentStudyIndex = 0,
  activeTopicWordCount = 0,
}: StudyDeckInfoCardProps) {
  const cefr = deckCefrLevel(deck);
  const totalWords = deck.words?.length || deck.itemCount || 0;
  const minutes = deck.estimatedMinutes || estimateMinutes(totalWords);
  const due = deck.progress?.dueCount ?? 0;
  const progressPercent = activeTopicWordCount
    ? Math.round(((currentStudyIndex + 1) / activeTopicWordCount) * 100)
    : 0;

  return (
    <aside className="w-full lg:w-80 xl:w-88 shrink-0 space-y-4">
      <div className="rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden">
        {/* Top Deck Banner & Title */}
        <div className="p-5 sm:p-6 bg-linear-to-br from-slate-900 via-slate-800 to-primary text-white relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-white/5 blur-2xl pointer-events-none" />

          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary-200 mb-2">
            <BookOpen className="size-3.5" />
            <span>Bộ thẻ đang học</span>
          </div>

          <div className="flex items-start gap-3">
            {/* Small Cover Thumbnail */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden shrink-0 border-2 border-white/20 shadow-md bg-white/10">
              <DeckCover deck={deck} size="xs" />
            </div>

            <div className="min-w-0 flex-1 space-y-1">
              {cefr && (
                <span
                  className={cn(
                    "inline-block px-2 py-0.5 rounded-full text-[10px] font-black uppercase border border-white/30 bg-white/15 text-white",
                  )}
                >
                  {cefr}
                </span>
              )}
              <h2 className="font-black text-base sm:text-lg leading-tight text-white line-clamp-2">
                {pickLocaleText(locale, deck.title, deck.titleEn)}
              </h2>
            </div>
          </div>

          {/* Description snippet if any */}
          {(deck.description || deck.descriptionEn) && (
            <p className="mt-3 text-xs text-white/80 leading-relaxed line-clamp-2">
              {pickLocaleText(locale, deck.description, deck.descriptionEn)}
            </p>
          )}

          {/* Key Deck Stats Grid */}
          <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-white/10 text-xs">
            <div className="flex items-center gap-1.5 text-white/90">
              <Layers className="size-3.5 text-primary-200 shrink-0" />
              <span className="font-bold">{totalWords}</span> từ vựng
            </div>
            <div className="flex items-center gap-1.5 text-white/90">
              <Clock3 className="size-3.5 text-primary-200 shrink-0" />
              <span>~{minutes} phút</span>
            </div>
            {due > 0 && (
              <div className="col-span-2 flex items-center gap-1.5 text-amber-300 font-semibold pt-0.5">
                <Flame className="size-3.5 fill-current shrink-0" />
                <span>{due} thẻ cần ôn lại</span>
              </div>
            )}
          </div>
        </div>

        {/* Current Topic Session Progress Indicator */}
        {activeTopicWordCount > 0 && (
          <div className="p-4 bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-500 dark:text-slate-400 font-medium">
                Tiến độ chủ đề:
              </span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {Math.min(currentStudyIndex + 1, activeTopicWordCount)} /{" "}
                {activeTopicWordCount}
                <span className="text-primary font-black ml-1">
                  ({progressPercent}%)
                </span>
              </span>
            </div>
            <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-primary to-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(progressPercent, 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Topics Section (Phân chia theo chủ đề từ chính các từ vựng của bộ thẻ) */}
        <div className="p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Tag className="size-4 text-primary" />
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-200">
                Chủ đề từ vựng
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-slate-500">
              {deckTopics.length ? `${deckTopics.length} chủ đề` : "Toàn bộ"}
            </span>
          </div>

          <p className="text-[11px] text-slate-500 leading-snug">
            Chọn một chủ đề để học tập trung các từ trong chủ đề đó:
          </p>

          <div className="space-y-1.5 pt-1 max-h-[360px] overflow-y-auto pr-1">
            {/* Option: ALL TOPICS */}
            <button
              type="button"
              onClick={() => onSelectTopic("ALL")}
              className={cn(
                "w-full flex items-center justify-between gap-2 p-2.5 rounded-2xl text-left transition-all duration-200 cursor-pointer border select-none",
                selectedTopicId === "ALL"
                  ? "bg-primary text-white border-primary shadow-md shadow-primary/20 scale-[1.01]"
                  : "bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300",
              )}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={cn(
                    "p-1.5 rounded-xl shrink-0",
                    selectedTopicId === "ALL"
                      ? "bg-white/20 text-white"
                      : "bg-primary/10 text-primary dark:text-[#7b9bee]",
                  )}
                >
                  <Sparkles className="size-3.5" />
                </div>
                <span className="text-xs font-bold truncate">
                  Tất cả chủ đề
                </span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <span
                  className={cn(
                    "px-2 py-0.5 rounded-full text-[11px] font-bold",
                    selectedTopicId === "ALL"
                      ? "bg-white/25 text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300",
                  )}
                >
                  {totalWords} từ
                </span>
                {selectedTopicId === "ALL" && (
                  <CheckCircle2 className="size-3.5 text-white shrink-0" />
                )}
              </div>
            </button>

            {/* List of Deck's Topics */}
            {deckTopics.map((topic) => {
              const active = selectedTopicId === topic.id;

              return (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => onSelectTopic(topic.id)}
                  className={cn(
                    "w-full flex items-center justify-between gap-2 p-2.5 rounded-2xl text-left transition-all duration-200 cursor-pointer border select-none",
                    active
                      ? "bg-primary text-white border-primary shadow-md shadow-primary/20 scale-[1.01]"
                      : "bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300",
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={cn(
                        "p-1.5 rounded-xl shrink-0",
                        active
                          ? "bg-white/20 text-white"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-500",
                      )}
                    >
                      <FolderOpen className="size-3.5" />
                    </div>
                    <span className="text-xs font-bold truncate">
                      {topic.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-full text-[11px] font-bold",
                        active
                          ? "bg-white/25 text-white"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300",
                      )}
                    >
                      {topic.count} từ
                    </span>
                    {active && (
                      <CheckCircle2 className="size-3.5 text-white shrink-0" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}
