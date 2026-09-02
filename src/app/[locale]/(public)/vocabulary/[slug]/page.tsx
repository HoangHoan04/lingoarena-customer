"use client";

import { WordRow } from "@/components/vocabulary";
import { Link, useRouter } from "@/i18n/routing";
import {
  cefrBadgeClass,
  deckCoverUrl,
  deckLearnerCount,
  deckTheme,
  estimateMinutes,
} from "@/lib/vocab";
import { vocabularyService } from "@/services/vocabulary.service";
import { useAuthStore } from "@/stores/useAuthStore";
import { useToastStore } from "@/stores/useToastStore";
import type { VocabDeck, VocabStudyModeUI } from "@/types/vocabulary";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock3,
  FileEdit,
  Flame,
  Gamepad2,
  HelpCircle,
  Layers3,
  Mic,
  Play,
  RotateCcw,
  Search,
  Sparkles,
  Users,
} from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const STUDY_QUICK_MODES: {
  key: VocabStudyModeUI;
  title: string;
  desc: string;
  icon: any;
  colorClass: string;
  bgClass: string;
}[] = [
  {
    key: "FLASHCARD",
    title: "Flashcard SRS",
    desc: "Lật thẻ tự đánh giá theo chuẩn SuperMemo SM-2",
    icon: Layers3,
    colorClass: "text-blue-600 dark:text-blue-400",
    bgClass: "bg-blue-50 dark:bg-blue-950/50",
  },
  {
    key: "QUIZ",
    title: "Trắc nghiệm 4 đáp án",
    desc: "Chọn nghĩa tiếng Việt chính xác theo ngữ cảnh",
    icon: HelpCircle,
    colorClass: "text-purple-600 dark:text-purple-400",
    bgClass: "bg-purple-50 dark:bg-purple-950/50",
  },
  {
    key: "FILL_BLANK",
    title: "Điền từ vào câu",
    desc: "Thực hành gõ từ vựng vào câu ví dụ minh họa",
    icon: FileEdit,
    colorClass: "text-emerald-600 dark:text-emerald-400",
    bgClass: "bg-emerald-50 dark:bg-emerald-950/50",
  },
  {
    key: "REPEAT",
    title: "Shadowing (Nhắc lại)",
    desc: "Nghe phát âm bản ngữ và luyện phản xạ phát âm",
    icon: Mic,
    colorClass: "text-amber-600 dark:text-amber-400",
    bgClass: "bg-amber-50 dark:bg-amber-950/50",
  },
];

export default function VocabularyDeckPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { addToast } = useToastStore();
  const [deck, setDeck] = useState<VocabDeck | null>(null);
  const [loading, setLoading] = useState(true);
  const [wordFilter, setWordFilter] = useState("");

  useEffect(() => {
    if (!slug) return;
    vocabularyService
      .getDeckBySlug(slug)
      .then(setDeck)
      .catch((err) => addToast(err?.message || "Không tìm thấy bộ từ vựng", "error"))
      .finally(() => setLoading(false));
  }, [slug]);

  const startStudy = (mode: VocabStudyModeUI = "FLASHCARD") => {
    const href = `/vocabulary/${slug}/study?mode=${mode}`;
    if (!isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent(href)}`);
      return;
    }
    router.push(href);
  };

  const filteredWords = useMemo(() => {
    if (!deck?.words) return [];
    if (!wordFilter.trim()) return deck.words;
    const q = wordFilter.toLowerCase().trim();
    return deck.words.filter(
      (w) =>
        w.headword.toLowerCase().includes(q) ||
        w.meaningVi.toLowerCase().includes(q) ||
        (w.definitionEn && w.definitionEn.toLowerCase().includes(q)),
    );
  }, [deck?.words, wordFilter]);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-6 w-36 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        <div className="h-80 rounded-3xl bg-slate-100 dark:bg-slate-800" />
        <div className="grid sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 rounded-2xl bg-slate-100 dark:bg-slate-800" />
          ))}
        </div>
      </div>
    );
  }

  if (!deck) {
    return (
      <div className="py-20 text-center space-y-4 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
        <p className="text-base text-slate-500">Không tìm thấy bộ từ vựng yêu cầu.</p>
        <Link
          href="/vocabulary"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-bold shadow-md"
        >
          <ArrowLeft className="size-4" /> Quay lại danh mục bộ thẻ
        </Link>
      </div>
    );
  }

  const theme = deckTheme(deck);
  const due = deck.progress?.dueCount ?? deck.itemCount;
  const minutes = deck.estimatedMinutes || estimateMinutes(deck.itemCount);
  const cover = deckCoverUrl(deck);
  const learners = deckLearnerCount(deck);

  return (
    <div className="space-y-8 pb-12">
      {/* Back to Catalog Breadcrumb */}
      <div>
        <Link
          href="/vocabulary"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-500 hover:text-primary transition-colors"
        >
          <ArrowLeft className="size-4" /> Danh mục bộ từ vựng
        </Link>
      </div>

      {/* Hero Deck Card */}
      <div className="grid lg:grid-cols-12 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900 shadow-xl">
        {/* Cover / Visual */}
        <div className="lg:col-span-5 relative min-h-[260px] lg:min-h-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          {deck.thumbnailUrl ? (
            <Image src={cover} alt={deck.title} fill className="object-cover" unoptimized />
          ) : (
            <div
              className={`h-full w-full bg-linear-to-br ${theme.gradient} p-8 text-white flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black tracking-widest uppercase">
                  {theme.exam}
                </span>
                {deck.level && (
                  <span className="px-3 py-1 rounded-full bg-black/30 backdrop-blur-md text-xs font-bold">
                    CEFR {deck.level}
                  </span>
                )}
              </div>
              <div>
                <Sparkles className="size-10 text-white/40 mb-2" />
                <h2 className="text-2xl sm:text-3xl font-black leading-tight">{deck.title}</h2>
              </div>
            </div>
          )}
        </div>

        {/* Deck Info & Actions */}
        <div className="lg:col-span-7 p-6 sm:p-8 space-y-6 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className={`text-xs font-black tracking-widest uppercase ${theme.accent}`}>
                {theme.exam}
              </span>
              {deck.level && (
                <span
                  className={`px-2.5 py-0.5 rounded-full border text-xs font-bold uppercase ${cefrBadgeClass(
                    deck.level,
                  )}`}
                >
                  CEFR {deck.level}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              {deck.title}
            </h1>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {deck.description ||
                "Học từ vựng theo phương pháp lặp lại ngắt quãng SRS, luyện flashcard và quiz tương tác cao."}
            </p>

            {/* Key Badges */}
            <div className="flex flex-wrap gap-4 pt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-semibold">
              <span className="inline-flex items-center gap-1.5">
                <BookOpen className="size-4 text-primary dark:text-[#7b9bee]" />
                <strong>{deck.itemCount}</strong> thẻ từ vựng
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Users className="size-4 text-slate-400" />
                {learners.toLocaleString("vi-VN")} người học
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock3 className="size-4 text-slate-400" />
                {minutes} phút hoàn thành
              </span>
              {due > 0 && (
                <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold">
                  <Flame className="size-4 fill-current" /> {due} thẻ đến hạn ôn
                </span>
              )}
            </div>
          </div>

          {/* Primary Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => startStudy("FLASHCARD")}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-primary hover:bg-primary/90 text-white text-sm font-black shadow-xl shadow-primary/25 hover:scale-101 transition-all cursor-pointer"
            >
              <Play className="size-4 fill-current" /> Bắt đầu học Flashcard SRS
            </button>
            <Link
              href={`/vocabulary/games/match/${deck.slug}`}
              className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl border-2 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm font-bold transition-all text-center"
            >
              <Gamepad2 className="size-4 text-emerald-500" /> Game nối nghĩa
            </Link>
          </div>
        </div>
      </div>

      {/* Choose Study Mode Cards Grid */}
      <section className="space-y-4">
        <div>
          <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
            Lựa Chọn Chế Độ Luyện Tập
          </h3>
          <p className="text-xs sm:text-sm text-slate-500">
            Bạn có thể chọn phương thức học phù hợp với mục tiêu và thời gian hiện tại.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STUDY_QUICK_MODES.map((mode) => {
            const Icon = mode.icon;
            return (
              <button
                key={mode.key}
                type="button"
                onClick={() => startStudy(mode.key)}
                className="group flex flex-col justify-between text-left p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-primary hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer shadow-2xs"
              >
                <div>
                  <div
                    className={`w-12 h-12 rounded-2xl ${mode.bgClass} ${mode.colorClass} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="size-6" />
                  </div>
                  <h4 className="text-base font-black text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                    {mode.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{mode.desc}</p>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-primary dark:text-[#7b9bee] mt-4">
                  <span>Học ngay</span>
                  <span>→</span>
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Words in Deck List */}
      {!!deck.words?.length && (
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                Danh Sách Từ Vựng Trong Bộ Thẻ
              </h3>
              <p className="text-xs sm:text-sm text-slate-500">
                Hiển thị {filteredWords.length} / {deck.words.length} từ
              </p>
            </div>

            {/* In-deck Word Search */}
            <div className="relative w-full sm:w-64">
              <Search className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={wordFilter}
                onChange={(e) => setWordFilter(e.target.value)}
                placeholder="Tìm từ trong bộ này..."
                className="w-full h-10 pl-10 pr-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm focus:border-primary focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
            <div className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800">
              Từ vựng & Phát âm
            </div>
            {filteredWords.length > 0 ? (
              filteredWords.map((word) => <WordRow key={word.id} word={word} />)
            ) : (
              <div className="p-8 text-center text-xs text-slate-400">
                Không tìm thấy từ vựng khớp với &ldquo;{wordFilter}&rdquo;.
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
