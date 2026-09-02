"use client";

import { MatchingGame } from "@/components/vocabulary";
import { Link } from "@/i18n/routing";
import { cefrBadgeClass } from "@/lib/vocab";
import { vocabularyService } from "@/services/vocabulary.service";
import { useToastStore } from "@/stores/useToastStore";
import type { VocabDeck } from "@/types/vocabulary";
import { ArrowLeft, Gamepad2, Sparkles } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function VocabularyMatchingPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const { addToast } = useToastStore();
  const [deck, setDeck] = useState<VocabDeck | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    vocabularyService
      .getDeckBySlug(slug)
      .then(setDeck)
      .catch((err) => addToast(err?.message || "Không tải được dữ liệu trò chơi", "error"))
      .finally(() => setLoading(false));
  }, [slug]);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between gap-3 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <Link
          href="/vocabulary/games"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-500 hover:text-primary transition-colors"
        >
          <ArrowLeft className="size-4" />
          <span>Quay lại danh mục trò chơi</span>
        </Link>
      </div>

      {loading ? (
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-16 text-center space-y-3 shadow-sm">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-bold text-slate-500">Đang chuẩn bị các cặp từ nối nghĩa...</p>
        </div>
      ) : deck ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Game Ghép Thẻ Nối Nghĩa
                </span>
                {deck.level && (
                  <span
                    className={`px-2 py-0.5 rounded-full border text-[10px] font-bold ${cefrBadgeClass(
                      deck.level,
                    )}`}
                  >
                    CEFR {deck.level}
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {deck.title}
              </h1>
            </div>
          </div>

          <MatchingGame key={deck.id} words={deck.words || []} />
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed p-12 text-center text-slate-500 space-y-3">
          <p>Không tìm thấy bộ từ vựng yêu cầu.</p>
          <Link href="/vocabulary/games" className="text-primary font-bold text-sm">
            Quay lại kho trò chơi
          </Link>
        </div>
      )}
    </div>
  );
}
