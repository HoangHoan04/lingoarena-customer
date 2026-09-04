"use client";

import {
  ClozePlayer,
  FlashcardPlayer,
  QuizPlayer,
  RepeatPlayer,
  ReverseQuizPlayer,
  StudyDeckInfoCard,
  StudyResult,
  StudyTopNav,
} from "@/components/vocabulary";
import type { AggregatedTopic } from "@/components/vocabulary/StudyDeckInfoCard";
import { Link, useRouter } from "@/i18n/routing";
import { isApiStudyMode, parseStudyMode } from "@/lib/vocab";
import { vocabularyService } from "@/services/vocabulary.service";
import { useAuthStore } from "@/stores/useAuthStore";
import { useToastStore } from "@/stores/useToastStore";
import { useVocabStudyStore } from "@/stores/useVocabStudyStore";
import type {
  FlashcardRating,
  VocabDeck,
  VocabStudyModeUI,
  VocabWord,
} from "@/types/vocabulary";
import { Sparkles } from "lucide-react";
import { useLocale } from "next-intl";
import { useParams, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function VocabularyStudyPage() {
  const locale = useLocale();
  const params = useParams<{ slug: string }>();
  const searchParams = useSearchParams();
  const slug = params.slug;
  const mode = parseStudyMode(searchParams.get("mode"));
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { addToast } = useToastStore();

  const [deck, setDeck] = useState<VocabDeck | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedTopicId, setSelectedTopicId] = useState<string>("ALL");

  // Client-only mode state
  const [clientCards, setClientCards] = useState<VocabWord[]>([]);
  const [clientIndex, setClientIndex] = useState(0);
  const [clientDone, setClientDone] = useState(false);

  const {
    cards,
    index,
    lastAnswer,
    result,
    logs,
    loading,
    start,
    submitFlashcard,
    submitQuiz,
    next,
    finish,
    reset,
  } = useVocabStudyStore();

  // Aggregate topics directly from the words belonging to THIS deck
  const deckTopics = useMemo<AggregatedTopic[]>(() => {
    if (!deck?.words?.length) return [];
    const map = new Map<
      string,
      { id: string; name: string; words: VocabWord[] }
    >();
    const untaggedWords: VocabWord[] = [];

    deck.words.forEach((word) => {
      if (word.topics && word.topics.length > 0) {
        word.topics.forEach((topic) => {
          const existing = map.get(topic.id) || {
            id: topic.id,
            name: topic.name,
            words: [],
          };
          if (!existing.words.some((w) => w.id === word.id)) {
            existing.words.push(word);
          }
          map.set(topic.id, existing);
        });
      } else {
        untaggedWords.push(word);
      }
    });

    const list: AggregatedTopic[] = Array.from(map.values()).map((item) => ({
      id: item.id,
      name: item.name,
      count: item.words.length,
      words: item.words,
    }));

    if (untaggedWords.length > 0) {
      list.push({
        id: "__untagged__",
        name: "Chưa phân loại",
        count: untaggedWords.length,
        words: untaggedWords,
      });
    }

    return list;
  }, [deck?.words]);

  // Determine the active word pool for the selected topic (or ALL words)
  const activeWords = useMemo<VocabWord[]>(() => {
    if (!deck?.words?.length) return [];
    if (selectedTopicId === "ALL") return deck.words;
    const found = deckTopics.find((t) => t.id === selectedTopicId);
    return found?.words || deck.words;
  }, [deck?.words, deckTopics, selectedTopicId]);

  // Current active topic name for display
  const activeTopicName = useMemo(() => {
    if (selectedTopicId === "ALL") return "Tất cả chủ đề";
    return deckTopics.find((t) => t.id === selectedTopicId)?.name || "Chủ đề";
  }, [selectedTopicId, deckTopics]);

  // Core study session starter (No hardcoded 12 limit!)
  const initStudySession = useCallback(
    async (
      deckData: VocabDeck,
      targetWords: VocabWord[],
      currentMode: VocabStudyModeUI,
      topicId?: string,
    ) => {
      reset();
      setClientDone(false);

      if (isApiStudyMode(currentMode)) {
        await start(
          deckData.id,
          currentMode === "QUIZ" ? "QUIZ" : "FLASHCARD",
          targetWords.length,
          topicId && topicId !== "ALL" && topicId !== "__untagged__"
            ? topicId
            : undefined,
        );
      } else {
        // Client-only modes: use all words in that topic/deck, full count!
        const shuffled = [...targetWords].sort(() => Math.random() - 0.5);
        setClientCards(shuffled);
        setClientIndex(0);
      }
    },
    [reset, start],
  );

  // Load deck data on mount / auth change
  useEffect(() => {
    if (!slug) return;
    const href = `/vocabulary/${slug}/study?mode=${mode}`;
    if (!isAuthenticated) {
      router.replace(`/login?redirect=${encodeURIComponent(href)}`);
      return;
    }

    let cancelled = false;
    (async () => {
      setPageLoading(true);
      try {
        const deckData = await vocabularyService.getDeckBySlug(slug);
        if (cancelled || !deckData) return;
        setDeck(deckData);

        const words = deckData.words?.length ? deckData.words : [];
        await initStudySession(deckData, words, mode, "ALL");
      } catch (err: any) {
        addToast(err?.message || "Không thể khởi tạo phiên học", "error");
      } finally {
        if (!cancelled) setPageLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [slug, mode, isAuthenticated]);

  // Mode changer
  const onModeChange = (nextMode: VocabStudyModeUI) => {
    router.replace(`/vocabulary/${slug}/study?mode=${nextMode}`);
  };

  // Topic selector handler
  const handleSelectTopic = (topicId: string) => {
    if (!deck) return;
    setSelectedTopicId(topicId);

    let targetWords = deck.words || [];
    if (topicId !== "ALL") {
      const found = deckTopics.find((t) => t.id === topicId);
      if (found) targetWords = found.words;
    }

    void initStudySession(deck, targetWords, mode, topicId);
  };

  // Flashcard & Quiz Handlers
  const goResult = async () => {
    try {
      await finish();
    } catch (err: any) {
      addToast(err?.message || "Không thể hoàn tất phiên học", "error");
    }
  };

  const onRate = async (rating: FlashcardRating) => {
    setSubmitting(true);
    try {
      await submitFlashcard(rating);
      if (index + 1 >= cards.length) await goResult();
      else next();
    } catch (err: any) {
      addToast(err?.message || "Không gửi được đánh giá", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const onQuizAnswer = async (optionId: string) => {
    setSubmitting(true);
    try {
      await submitQuiz(optionId);
    } catch (err: any) {
      addToast(err?.message || "Không gửi được đáp án", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const onQuizNext = async () => {
    if (index + 1 >= cards.length) {
      await goResult();
      return;
    }
    next();
  };

  const clientNext = () => {
    if (clientIndex + 1 >= clientCards.length) {
      setClientDone(true);
      return;
    }
    setClientIndex((value) => value + 1);
  };

  const apiCard = cards[index];
  const clientCard = clientCards[clientIndex];
  const activeIndex = isApiStudyMode(mode) ? index : clientIndex;
  const activeTotal = isApiStudyMode(mode) ? cards.length : clientCards.length;

  return (
    <div className="space-y-6 pb-16 max-w-7xl mx-auto">
      {/* 1. Top Navigation Bar for Practice Modes & Quick Exit */}
      <StudyTopNav
        slug={slug}
        mode={mode}
        onModeChange={onModeChange}
        currentIndex={activeIndex + 1}
        totalWords={activeTotal}
        topicName={activeTopicName}
      />

      {/* 2. Main 2-Column Study Layout */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
        {/* Left Column: Deck Info Card with Aggregated Topic List */}
        {deck && !result && (
          <StudyDeckInfoCard
            deck={deck}
            locale={locale}
            deckTopics={deckTopics}
            selectedTopicId={selectedTopicId}
            onSelectTopic={handleSelectTopic}
            currentStudyIndex={activeIndex}
            activeTopicWordCount={activeTotal}
          />
        )}

        {/* Right Column: Player Area */}
        <div className="flex-1 min-w-0 w-full">
          {result ? (
            <StudyResult result={result} logs={logs} slug={slug} />
          ) : clientDone ? (
            <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 sm:p-12 text-center shadow-xl space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center mx-auto">
                <Sparkles className="size-8" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                Hoàn Thành Lượt Luyện Tập!
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm max-w-md mx-auto">
                Bạn vừa hoàn thành xuất sắc toàn bộ {activeTotal} từ vựng trong chủ đề{" "}
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  &ldquo;{activeTopicName}&rdquo;
                </span>
                . Để lưu tiến độ ghi nhớ lâu dài vào thuật toán SM-2, hãy chuyển sang chế độ Flashcard SRS.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <button
                  type="button"
                  onClick={() => onModeChange("FLASHCARD")}
                  className="px-6 py-3 rounded-2xl bg-primary hover:bg-primary/90 text-white text-xs sm:text-sm font-bold shadow-md cursor-pointer"
                >
                  Học Flashcard SRS
                </button>
                <Link
                  href={`/vocabulary/${slug}`}
                  className="px-6 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-bold text-center"
                >
                  Về trang bộ từ
                </Link>
              </div>
            </div>
          ) : pageLoading || !deck ? (
            <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-16 text-center space-y-3 shadow-sm">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm font-bold text-slate-500">
                Đang chuẩn bị phiên học cho bạn...
              </p>
            </div>
          ) : isApiStudyMode(mode) ? (
            loading || !apiCard ? (
              <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-16 text-center space-y-3 shadow-sm">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-sm font-bold text-slate-500">
                  Đang nạp thẻ học từ hệ thống...
                </p>
              </div>
            ) : mode === "QUIZ" ? (
              <QuizPlayer
                key={apiCard.id || index}
                card={apiCard}
                index={index}
                total={cards.length}
                submitting={submitting}
                lastAnswer={lastAnswer}
                onAnswer={onQuizAnswer}
                onNext={onQuizNext}
              />
            ) : (
              <FlashcardPlayer
                key={apiCard.id || index}
                card={apiCard}
                index={index}
                total={cards.length}
                submitting={submitting}
                onRate={onRate}
              />
            )
          ) : clientCard ? (
            <>
              {mode === "FILL_BLANK" && (
                <ClozePlayer
                  key={clientCard.id || clientIndex}
                  card={clientCard}
                  index={clientIndex}
                  total={clientCards.length}
                  onNext={clientNext}
                />
              )}
              {mode === "QUIZ_REVERSE" && (
                <ReverseQuizPlayer
                  key={clientCard.id || clientIndex}
                  card={clientCard}
                  pool={clientCards}
                  index={clientIndex}
                  total={clientCards.length}
                  onNext={clientNext}
                />
              )}
              {mode === "REPEAT" && (
                <RepeatPlayer
                  key={clientCard.id || clientIndex}
                  card={clientCard}
                  index={clientIndex}
                  total={clientCards.length}
                  onNext={clientNext}
                />
              )}
            </>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center text-slate-500 space-y-3">
              <p>Chủ đề này hiện chưa có từ vựng nào để luyện tập.</p>
              <button
                type="button"
                onClick={() => handleSelectTopic("ALL")}
                className="text-primary font-bold text-sm hover:underline cursor-pointer"
              >
                ← Xem tất cả từ vựng trong bộ thẻ
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
