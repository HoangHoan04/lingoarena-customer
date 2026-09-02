"use client";

import { FlashcardPlayer, QuizPlayer, StudyResult } from "@/components/vocabulary";
import { Link, useRouter } from "@/i18n/routing";
import { useAuthStore } from "@/stores/useAuthStore";
import { useToastStore } from "@/stores/useToastStore";
import { useVocabStudyStore } from "@/stores/useVocabStudyStore";
import type { FlashcardRating, VocabStudyMode } from "@/types/vocabulary";
import { ArrowLeft, BookOpen, CheckCircle2, Flame, Layers, Sparkles } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function VocabularyDueReviewPage() {
  const searchParams = useSearchParams();
  const mode = (searchParams.get("mode") || "FLASHCARD").toUpperCase() as VocabStudyMode;
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { addToast } = useToastStore();
  const [submitting, setSubmitting] = useState(false);
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
  } = useVocabStudyStore();

  useEffect(() => {
    const href = `/vocabulary/review?mode=${mode}`;
    if (!isAuthenticated) {
      router.replace(`/login?redirect=${encodeURIComponent(href)}`);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        await start(undefined, mode === "QUIZ" ? "QUIZ" : "FLASHCARD");
      } catch (err: any) {
        if (!cancelled) addToast(err?.message || "Không khởi tạo được phiên ôn thẻ đến hạn", "error");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [mode, isAuthenticated]);

  const goResult = async () => {
    try {
      await finish();
    } catch (err: any) {
      addToast(err?.message || "Không hoàn thành được phiên học", "error");
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

  const card = cards[index];

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Header Breadcrumb */}
      <div className="flex items-center justify-between gap-3 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <Link
          href="/vocabulary"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-500 hover:text-primary transition-colors"
        >
          <ArrowLeft className="size-4" />
          <span>Danh mục từ vựng</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/vocabulary/review?mode=FLASHCARD"
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
              mode === "FLASHCARD"
                ? "bg-primary text-white shadow-sm"
                : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            Flashcard
          </Link>
          <Link
            href="/vocabulary/review?mode=QUIZ"
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
              mode === "QUIZ"
                ? "bg-primary text-white shadow-sm"
                : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            Quiz
          </Link>
        </div>
      </div>

      {result ? (
        <StudyResult result={result} logs={logs} backHref="/vocabulary/review" />
      ) : loading ? (
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-16 text-center space-y-3 shadow-sm">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-bold text-slate-500">
            Đang quét danh sách các từ vựng đến hạn ôn tập hôm nay...
          </p>
        </div>
      ) : cards.length === 0 ? (
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-10 sm:p-14 text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 rounded-3xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="size-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            Tuyệt Vời! Không Có Thẻ Nào Đến Hạn
          </h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            Bạn đã hoàn thành toàn bộ lịch ôn tập hôm nay theo thuật toán SuperMemo SM-2. Hãy học thêm một bộ thẻ mới hoặc xem lại sổ tay.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link
              href="/vocabulary"
              className="inline-flex items-center justify-center gap-1.5 px-6 py-3 rounded-2xl bg-primary text-white text-sm font-bold shadow-md hover:bg-primary/90 transition-colors"
            >
              <Layers className="size-4" /> Chọn bộ thẻ mới
            </Link>
            <Link
              href="/vocabulary/notebook"
              className="inline-flex items-center justify-center gap-1.5 px-6 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-bold"
            >
              <BookOpen className="size-4" /> Xem sổ tay
            </Link>
          </div>
        </div>
      ) : !card ? (
        <div className="rounded-3xl border p-12 text-center text-slate-500">
          Đang chuẩn bị thẻ học tiếp theo...
        </div>
      ) : mode === "QUIZ" ? (
        <QuizPlayer
          card={card}
          index={index}
          total={cards.length}
          submitting={submitting}
          lastAnswer={lastAnswer}
          onAnswer={onQuizAnswer}
          onNext={onQuizNext}
        />
      ) : (
        <FlashcardPlayer
          card={card}
          index={index}
          total={cards.length}
          submitting={submitting}
          onRate={onRate}
        />
      )}
    </div>
  );
}
