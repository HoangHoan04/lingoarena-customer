"use client";

import { DeckCard } from "@/components/vocabulary";
import { Link, useRouter } from "@/i18n/routing";
import { vocabularyService } from "@/services/vocabulary.service";
import { useAuthStore } from "@/stores/useAuthStore";
import { useToastStore } from "@/stores/useToastStore";
import type { VocabDeck } from "@/types/vocabulary";
import { Gamepad2, HelpCircle, Layers3, Link2, Play, Sparkles, Trophy, Zap } from "lucide-react";
import { useEffect, useState } from "react";

export default function VocabularyGamesPage() {
  const { isAuthenticated } = useAuthStore();
  const { addToast } = useToastStore();
  const router = useRouter();
  const [decks, setDecks] = useState<VocabDeck[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    vocabularyService
      .paginationDecks(0, 24)
      .then((res) => setDecks(res.data))
      .catch((err) => addToast(err?.message || "Không tải được danh sách bộ từ", "error"))
      .finally(() => setLoading(false));
  }, []);

  const startQuiz = (slug: string) => {
    const href = `/vocabulary/${slug}/study?mode=QUIZ`;
    if (!isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent(href)}`);
      return;
    }
    router.push(href);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-purple-900 via-primary to-slate-900 text-white p-6 sm:p-10 shadow-xl">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-purple-200">
            <Gamepad2 className="size-3.5 text-amber-300" />
            <span>Phòng Luyện Game Phản Xạ</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Trò Chơi Học Từ Vựng
          </h1>
          <p className="text-xs sm:text-sm text-purple-100 leading-relaxed">
            Nâng cao phản xạ tiếng Anh thông qua hình thức Quiz tương tác và trò chơi ghép thẻ tốc độ cao.
          </p>
        </div>
      </div>

      {/* 2 Game Modes Cards */}
      <div className="grid sm:grid-cols-2 gap-5">
        <div className="group relative rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-7 bg-white dark:bg-slate-900 shadow-2xs hover:shadow-lg transition-all">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4">
            <HelpCircle className="size-6" />
          </div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              Quiz Trắc Nghiệm SRS
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 text-[10px] font-bold">
              Ghi nhận SRS
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
            Chọn nghĩa tiếng Việt đúng từ 4 phương án cho trước. Trả lời đúng ghi điểm Good, sai ghi điểm Again để đồng bộ vào lịch ôn.
          </p>
        </div>

        <div className="group relative rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-7 bg-white dark:bg-slate-900 shadow-2xs hover:shadow-lg transition-all">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
            <Zap className="size-6" />
          </div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              Nối Từ Speed Match
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-bold">
              Luyện nhanh
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
            Ghép nhanh headword tiếng Anh với định nghĩa tiếng Việt tương ứng. Không yêu cầu đăng nhập, luyện phản xạ tức thì.
          </p>
        </div>
      </div>

      {/* Decks Grid */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">
            Chọn Bộ Thẻ Bắt Đầu Trò Chơi
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Lựa chọn chủ đề bạn muốn thử thách kiến thức hôm nay.
          </p>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-64 rounded-3xl bg-slate-100 dark:bg-slate-800/60 animate-pulse border border-slate-200/50 dark:border-slate-800"
              />
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {decks.map((deck) => (
              <div
                key={deck.id}
                className="space-y-3 p-3.5 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow"
              >
                <DeckCard deck={deck} />

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => startQuiz(deck.slug)}
                    className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    <HelpCircle className="size-3.5" />
                    <span>Quiz SRS</span>
                  </button>

                  <Link
                    href={`/vocabulary/games/match/${deck.slug}`}
                    className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors text-center"
                  >
                    <Gamepad2 className="size-3.5 text-emerald-500" />
                    <span>Nối nghĩa</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
