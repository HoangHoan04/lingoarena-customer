"use client";

import {
  ClozePlayer,
  FlashcardPlayer,
  QuizPlayer,
  RepeatPlayer,
  ReverseQuizPlayer,
  StudyResult,
  StudySidebar,
} from "@/components/vocabulary";
import { Link, useRouter } from "@/i18n/routing";
import { examFromDeck, isApiStudyMode, parseStudyMode } from "@/lib/vocab";
import { vocabularyService } from "@/services/vocabulary.service";
import { useAuthStore } from "@/stores/useAuthStore";
import { useToastStore } from "@/stores/useToastStore";
import { useVocabStudyStore } from "@/stores/useVocabStudyStore";
import type { FlashcardRating, VocabDeck, VocabStudyModeUI, VocabWord } from "@/types/vocabulary";
import { ArrowLeft, BookOpen, Layers, Sparkles, X } from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

function shuffleWords(words: VocabWord[]) {
  return [...words].sort(() => Math.random() - 0.5).slice(0, 12);
}

export default function VocabularyStudyPage() {
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

  const loadDeck = useCallback(async () => {
    if (!slug) return null;
    return vocabularyService.getDeckBySlug(slug);
  }, [slug]);

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
        const deckData = await loadDeck();
        if (cancelled || !deckData) return;
        setDeck(deckData);
        reset();
        setClientDone(false);

        if (isApiStudyMode(mode)) {
          await start(deckData.id, mode === "QUIZ" ? "QUIZ" : "FLASHCARD");
        } else {
          const words = deckData.words?.length ? deckData.words : [];
          setClientCards(shuffleWords(words));
          setClientIndex(0);
        }
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

  const onModeChange = (nextMode: VocabStudyModeUI) => {
    router.replace(`/vocabulary/${slug}/study?mode=${nextMode}`);
  };

  const topics = useMemo(() => {
    if (!deck) return [];
    const fromWords = new Set<string>();
    (deck.words || []).forEach((word) => {
      word.topics?.forEach((topic) => fromWords.add(topic.name));
    });
    const base = [examFromDeck(deck), deck.level ? `CEFR ${deck.level}` : ""].filter(Boolean);
    return [...base, ...Array.from(fromWords)].slice(0, 8);
  }, [deck]);

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
    <div className="space-y-6 pb-12">
      {/* Top Session Breadcrumb Bar */}
      <div className="flex items-center justify-between gap-3 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <Link
          href={`/vocabulary/${slug}`}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-500 hover:text-primary transition-colors"
        >
          <ArrowLeft className="size-4" />
          <span>Thoát phiên học & Quay lại bộ từ</span>
        </Link>

        {deck && (
          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-500">
            <BookOpen className="size-3.5 text-primary" />
            <span className="truncate max-w-xs">{deck.title}</span>
          </div>
        )}
      </div>

      {/* Main Study Grid */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
        {/* Left / Player Area */}
        <div className="flex-1 min-w-0 w-full order-1">
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
                Bạn vừa hoàn thành xuất sắc lượt luyện nhanh. Để lưu tiến độ ghi nhớ dài hạn vào thuật toán SM-2, hãy chuyển sang chế độ Flashcard SRS.
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
                  className="px-6 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-bold"
                >
                  Về trang bộ từ
                </Link>
              </div>
            </div>
          ) : pageLoading || !deck ? (
            <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-16 text-center space-y-3">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm font-bold text-slate-500">Đang chuẩn bị phiên học cho bạn...</p>
            </div>
          ) : isApiStudyMode(mode) ? (
            loading || !apiCard ? (
              <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-16 text-center space-y-3">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-sm font-bold text-slate-500">Đang tải thẻ học từ hệ thống...</p>
              </div>
            ) : mode === "QUIZ" ? (
              <QuizPlayer
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
                  card={clientCard}
                  index={clientIndex}
                  total={clientCards.length}
                  onNext={clientNext}
                />
              )}
              {mode === "QUIZ_REVERSE" && (
                <ReverseQuizPlayer
                  card={clientCard}
                  pool={clientCards}
                  index={clientIndex}
                  total={clientCards.length}
                  onNext={clientNext}
                />
              )}
              {mode === "REPEAT" && (
                <RepeatPlayer
                  card={clientCard}
                  index={clientIndex}
                  total={clientCards.length}
                  onNext={clientNext}
                />
              )}
            </>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 p-12 text-center text-slate-500 space-y-3">
              <p>Bộ thẻ này hiện chưa có từ vựng nào để luyện tập.</p>
              <Link href="/vocabulary" className="text-primary font-bold text-sm">
                ← Chọn bộ thẻ khác
              </Link>
            </div>
          )}
        </div>

        {/* Right / Sidebar Area */}
        {deck && !result && (
          <div className="w-full lg:w-80 shrink-0 order-2">
            <StudySidebar
              deckTitle={deck.title}
              topics={topics}
              mode={mode}
              index={activeIndex}
              total={activeTotal}
              onModeChange={onModeChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}
