"use client";

import VocabAudioButton from "@/components/vocabulary/VocabAudioButton";
import type { VocabWord } from "@/types/vocabulary";
import { CheckCircle2, Flame, RotateCcw, Sparkles, Trophy, Zap } from "lucide-react";
import { useMemo, useState } from "react";

type Side = { key: string; vocabularyId: string; text: string; kind: "word" | "meaning" };

function shuffle<T>(list: T[]) {
  return list
    .map((item) => ({ item, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map((entry) => entry.item);
}

export default function MatchingGame({ words }: { words: VocabWord[] }) {
  const pool = useMemo(
    () => shuffle(words.filter((item) => item.headword && item.meaningVi)).slice(0, 8),
    [words],
  );

  const [left, setLeft] = useState<Side[]>(() =>
    shuffle(
      pool.map((item) => ({
        key: `w-${item.id}`,
        vocabularyId: item.id,
        text: item.headword,
        kind: "word" as const,
      })),
    ),
  );

  const [right, setRight] = useState<Side[]>(() =>
    shuffle(
      pool.map((item) => ({
        key: `m-${item.id}`,
        vocabularyId: item.id,
        text: item.meaningVi,
        kind: "meaning" as const,
      })),
    ),
  );

  const [picked, setPicked] = useState<Side | null>(null);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [wrong, setWrong] = useState<string | null>(null);
  const [misses, setMisses] = useState(0);
  const [streak, setStreak] = useState(0);

  const onPick = (side: Side) => {
    if (matched.has(side.vocabularyId)) return;

    if (!picked) {
      setPicked(side);
      setWrong(null);
      return;
    }

    if (picked.key === side.key) {
      setPicked(null);
      return;
    }

    if (picked.kind === side.kind) {
      setPicked(side);
      return;
    }

    if (picked.vocabularyId === side.vocabularyId) {
      setMatched((prev) => new Set(prev).add(side.vocabularyId));
      setStreak((s) => s + 1);
      setPicked(null);
      setWrong(null);
      return;
    }

    setWrong(`${picked.key}|${side.key}`);
    setMisses((value) => value + 1);
    setStreak(0);
    setTimeout(() => {
      setWrong(null);
      setPicked(null);
    }, 450);
  };

  const handleRestart = () => {
    setMatched(new Set());
    setPicked(null);
    setWrong(null);
    setMisses(0);
    setStreak(0);
    setLeft(
      shuffle(
        pool.map((item) => ({
          key: `w-${item.id}`,
          vocabularyId: item.id,
          text: item.headword,
          kind: "word" as const,
        })),
      ),
    );
    setRight(
      shuffle(
        pool.map((item) => ({
          key: `m-${item.id}`,
          vocabularyId: item.id,
          text: item.meaningVi,
          kind: "meaning" as const,
        })),
      ),
    );
  };

  const done = matched.size === pool.length && pool.length > 0;

  const renderCard = (side: Side) => {
    const isMatch = matched.has(side.vocabularyId);
    const isPicked = picked?.key === side.key;
    const isWrong = wrong?.includes(side.key);

    return (
      <button
        key={side.key}
        type="button"
        disabled={isMatch}
        onClick={() => onPick(side)}
        className={`w-full min-h-[56px] text-left px-4 py-3 rounded-2xl border-2 font-bold text-sm sm:text-base transition-all duration-200 cursor-pointer select-none active:scale-98 ${
          isMatch
            ? "border-emerald-300/80 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300 opacity-60 line-through cursor-default"
            : isWrong
              ? "border-rose-400 bg-rose-50 dark:bg-rose-950/50 text-rose-700 animate-shake"
              : isPicked
                ? "border-primary bg-primary/10 text-primary dark:text-[#7b9bee] shadow-md ring-2 ring-primary/30 scale-102"
                : "border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:border-primary/60 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-2xs"
        }`}
      >
        <div className="flex items-center justify-between gap-2">
          <span className="line-clamp-2">{side.text}</span>
          {isMatch && <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />}
        </div>
      </button>
    );
  };

  if (!pool.length) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 p-10 text-center text-slate-500">
        Bộ từ vựng này chưa có đủ từ để tạo trò chơi nối nghĩa.
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-8 shadow-xl space-y-6">
      {/* Header & Score Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
            Nối Từ Với Nghĩa
          </h2>
          <p className="text-xs text-slate-500">
            Chạm một từ tiếng Anh và ghép với nghĩa tiếng Việt tương ứng.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {streak > 1 && (
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-xs font-black animate-pulse">
              <Flame className="size-3.5 fill-current" />
              <span>Combo x{streak}</span>
            </div>
          )}
          <div className="text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl">
            Ghép đúng: <strong className="text-primary dark:text-[#7b9bee]">{matched.size}</strong>/{pool.length}
            {misses > 0 && <span className="text-slate-400 ml-1.5">(Sai: {misses})</span>}
          </div>
        </div>
      </div>

      {/* Finished Celebration Banner */}
      {done && (
        <div className="p-6 rounded-3xl bg-linear-to-r from-emerald-500 to-teal-600 text-white shadow-xl text-center space-y-3 animate-in zoom-in-95 duration-300">
          <Trophy className="size-12 mx-auto text-amber-300" />
          <h3 className="text-2xl font-black">Xuất Sắc! Hoàn Thành Ghép Thẻ</h3>
          <p className="text-xs text-emerald-100">
            Bạn đã ghép đúng toàn bộ {pool.length} cặp từ chỉ với {misses} lần thử lệch.
          </p>
          <button
            type="button"
            onClick={handleRestart}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-emerald-800 text-xs font-black shadow-md hover:bg-slate-100 cursor-pointer"
          >
            <RotateCcw className="size-4" /> Chơi lại lượt mới
          </button>
        </div>
      )}

      {/* 2-Column Match Area */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2.5">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
            Từ tiếng Anh (Headwords)
          </p>
          {left.map(renderCard)}
        </div>
        <div className="space-y-2.5">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
            Nghĩa tiếng Việt
          </p>
          {right.map(renderCard)}
        </div>
      </div>

      {/* Word Pronunciation Preview Footnotes */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
          Phát âm các từ trong màn chơi:
        </p>
        <div className="flex flex-wrap gap-2">
          {pool.map((word) => (
            <div
              key={word.id}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300"
            >
              <span className="font-semibold">{word.headword}</span>
              <VocabAudioButton word={word} compact />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
