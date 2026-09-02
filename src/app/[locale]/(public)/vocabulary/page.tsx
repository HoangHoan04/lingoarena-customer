"use client";

import {
  DeckCatalogCard,
  MyDeckSection,
  VocabPageHeader,
  VocabStatsPanel,
} from "@/components/vocabulary";
import { groupDecks, matchDeckTag, VOCAB_TAGS, type VocabTag } from "@/lib/vocab";
import { vocabularyService } from "@/services/vocabulary.service";
import { useAuthStore } from "@/stores/useAuthStore";
import { useToastStore } from "@/stores/useToastStore";
import type { UserVocabStats, VocabDeck } from "@/types/vocabulary";
import { Filter, Layers, RotateCcw, Search, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export default function VocabularyPage() {
  const { isAuthenticated } = useAuthStore();
  const { addToast } = useToastStore();
  const [decks, setDecks] = useState<VocabDeck[]>([]);
  const [stats, setStats] = useState<UserVocabStats | null>(null);
  const [tag, setTag] = useState<VocabTag>("Tất cả");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await vocabularyService.paginationDecks(0, 50);
        if (cancelled) return;
        setDecks(res.data);
        if (mounted && isAuthenticated) {
          try {
            setStats(await vocabularyService.myStats());
          } catch {
            setStats(null);
          }
        } else {
          setStats(null);
        }
      } catch (err: any) {
        addToast(err?.message || "Không tải được danh sách bộ từ", "error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [mounted, isAuthenticated]);

  const filteredDecks = useMemo(() => {
    return decks.filter((deck) => {
      const matchTag = matchDeckTag(deck, tag);
      if (!matchTag) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        deck.title.toLowerCase().includes(q) ||
        (deck.description && deck.description.toLowerCase().includes(q)) ||
        deck.slug.toLowerCase().includes(q)
      );
    });
  }, [decks, tag, searchQuery]);

  const catalogGroups = useMemo(() => groupDecks(filteredDecks), [filteredDecks]);

  const popularDecks = useMemo(
    () => [...decks].sort((a, b) => b.itemCount - a.itemCount),
    [decks],
  );

  return (
    <div className="space-y-10 pb-12">
      {/* Hero Header Banner */}
      <VocabPageHeader />

      {/* SRS Personal Stats Panel */}
      <VocabStatsPanel stats={stats} guest={!mounted || !isAuthenticated} />

      {/* My Learning Space / Decks */}
      <MyDeckSection popularDecks={popularDecks} mounted={mounted} />

      {/* Catalog Search & Filters Header */}
      <section className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="size-5 text-primary dark:text-[#7b9bee]" />
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Khám Phá Toàn Bộ Bộ Thẻ
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Lựa chọn bộ từ theo kỳ thi quốc tế, khung CEFR hoặc chủ đề giao tiếp.
            </p>
          </div>

          {/* Quick Search */}
          <div className="relative w-full sm:w-72">
            <Search className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm bộ từ..."
              className="w-full h-10 pl-10 pr-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm focus:border-primary focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Tag Filters */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <div className="inline-flex items-center gap-1 text-xs font-bold text-slate-400 mr-1">
            <Filter className="size-3.5" />
            <span>Lọc:</span>
          </div>
          {VOCAB_TAGS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setTag(item)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all duration-200 cursor-pointer select-none ${
                tag === item
                  ? "bg-primary text-white border-primary shadow-sm shadow-primary/20 scale-102"
                  : "border-slate-200/90 dark:border-slate-700/80 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-primary/50"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      {/* Catalog Groups or Skeletons */}
      {loading ? (
        <div className="space-y-8">
          {[1, 2].map((group) => (
            <div key={group} className="space-y-4">
              <div className="h-6 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="h-80 rounded-3xl bg-slate-100 dark:bg-slate-800/60 animate-pulse border border-slate-200/50 dark:border-slate-800"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        catalogGroups.map((group) => (
          <section key={group.id} className="space-y-4">
            <div className="flex items-baseline justify-between border-b border-slate-100 dark:border-slate-800/80 pb-2">
              <div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  {group.title}
                </h3>
                {group.subtitle && (
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                    {group.subtitle}
                  </p>
                )}
              </div>
              <span className="text-xs font-bold text-slate-400">
                {group.decks.length} bộ từ
              </span>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {group.decks.map((deck) => (
                <DeckCatalogCard key={deck.id} deck={deck} />
              ))}
            </div>
          </section>
        ))
      )}

      {/* Empty State */}
      {!loading && !filteredDecks.length && (
        <div className="rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 p-12 text-center space-y-3 bg-white dark:bg-slate-900/40">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <Search className="size-7" />
          </div>
          <h3 className="text-lg font-black text-slate-800 dark:text-slate-200">
            Không tìm thấy bộ thẻ nào phù hợp
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            Không có kết quả khớp với tag &ldquo;{tag}&rdquo;
            {searchQuery && ` hoặc từ khóa "${searchQuery}"`}.
          </p>
          <button
            type="button"
            onClick={() => {
              setTag("Tất cả");
              setSearchQuery("");
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-sm hover:bg-primary/90 transition-colors cursor-pointer"
          >
            <RotateCcw className="size-3.5" /> Xóa bộ lọc
          </button>
        </div>
      )}
    </div>
  );
}
