"use client";

import VocabAudioButton from "@/components/vocabulary/VocabAudioButton";
import { formatIpa, hasVocabAudio, playVocabAudio } from "@/lib/vocab";
import type { VocabWord } from "@/types/vocabulary";
import { ArrowRight, Eye, Mic, RotateCcw, Sparkles, Volume2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

type Phase = "listen" | "reveal";

export default function RepeatPlayer({
  card,
  index,
  total,
  onNext,
}: {
  card: VocabWord;
  index: number;
  total: number;
  onNext: () => void;
}) {
  const [phase, setPhase] = useState<Phase>("listen");
  const [playCount, setPlayCount] = useState(0);
  const ipa = formatIpa(card);
  const example = card.exampleEn || card.examples?.[0]?.sentence || "";
  const exampleVi = card.exampleVi || card.examples?.[0]?.translation || "";
  const hasAudio = hasVocabAudio(card);

  const replay = useCallback(() => {
    playVocabAudio(card, "us");
    setPlayCount((value) => value + 1);
  }, [card]);

  useEffect(() => {
    setPhase("listen");
    setPlayCount(0);
    if (hasVocabAudio(card)) {
      playVocabAudio(card, "us");
      setPlayCount(1);
    }
  }, [card.id]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.code !== "Space") return;
      const tag = (event.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      event.preventDefault();
      replay();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [replay]);

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 sm:p-8 shadow-xl space-y-6 min-h-[440px] flex flex-col justify-between">
      {/* Header Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-primary dark:text-[#7b9bee] tracking-wider uppercase">
              Luyện Shadowing (Nhắc Lại)
            </span>
            <span className="text-slate-400">· Nghe audio & nói to trước khi xem đáp án</span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary dark:text-[#7b9bee] font-black text-xs">
            {index + 1} / {total}
          </span>
        </div>
        <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-linear-to-r from-[#2b417e] to-[#4563b0] rounded-full transition-all duration-300"
            style={{
              width: `${Math.round(((index + (phase === "reveal" ? 1 : 0)) / Math.max(total, 1)) * 100)}%`,
            }}
          />
        </div>
      </div>

      {phase === "listen" ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 py-6">
          <div className="space-y-1 max-w-md">
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              Bước 1: Nghe & Nhắc lại thật to
            </h3>
            <p className="text-xs text-slate-500">
              Hãy tập trung bắt chước ngữ điệu và trọng âm của người bản ngữ.
            </p>
          </div>

          {/* Big Audio Play Button */}
          <button
            type="button"
            onClick={replay}
            className="group relative size-28 rounded-full bg-linear-to-tr from-primary to-[#405ea7] text-white flex flex-col items-center justify-center gap-1.5 shadow-xl shadow-primary/30 hover:scale-105 transition-all duration-300 cursor-pointer active:scale-95"
            aria-label="Phát âm từ"
          >
            <Volume2 className="size-10 group-hover:animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-wider">
              Nghe lại
            </span>
            <div className="absolute -inset-1 rounded-full bg-primary/20 animate-ping -z-10" />
          </button>

          {hasAudio ? (
            <p className="text-xs text-slate-400 font-medium">
              Đã phát <span className="font-bold text-primary dark:text-[#7b9bee]">{playCount}</span> lần · Nhấn Space để nghe lại
            </p>
          ) : (
            <p className="text-xs text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-3.5 py-2 rounded-xl">
              Từ này chưa có file thu âm — hãy đọc IPA và tập phát âm.
            </p>
          )}

          {/* Hidden Word Placeholder */}
          <div className="rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 px-8 py-5 w-full max-w-sm">
            <p className="text-3xl font-black text-slate-300 dark:text-slate-600 tracking-widest">
              • • • • •
            </p>
            <p className="text-xs text-slate-400 mt-1">Từ vựng & nghĩa đang được ẩn</p>
          </div>

          <div className="flex gap-2">
            <VocabAudioButton word={card} accent="us" />
            <VocabAudioButton word={card} accent="uk" />
          </div>

          <button
            type="button"
            onClick={() => setPhase("reveal")}
            className="w-full max-w-md py-3.5 px-6 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-sm shadow-lg shadow-primary/25 inline-flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
          >
            <Mic className="size-4" />
            <span>Tôi đã nhắc lại xong — Mở đáp án</span>
          </button>
        </div>
      ) : (
        <div className="flex-1 flex flex-col space-y-6 py-4 animate-in fade-in">
          <div className="text-center py-6 px-4 rounded-3xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-center gap-2">
              <VocabAudioButton word={card} accent="us" />
              <VocabAudioButton word={card} accent="uk" />
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              {card.headword}
            </h2>

            {ipa && (
              <p className="text-xs font-mono text-slate-400 dark:text-slate-500">
                /{ipa.replace(/^\/|\/$/g, "")}/
              </p>
            )}

            <p className="text-xl font-black text-primary dark:text-[#7b9bee]">
              {card.meaningVi}
            </p>

            {card.definitionEn && (
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                {card.definitionEn}
              </p>
            )}
          </div>

          {example && (
            <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Sparkles className="size-3 text-amber-500" /> Câu ví dụ
              </p>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200 italic">
                “{example}”
              </p>
              {exampleVi && (
                <p className="text-xs text-slate-500">{exampleVi}</p>
              )}
            </div>
          )}

          <div className="flex flex-wrap gap-2 justify-center pt-2">
            <button
              type="button"
              onClick={replay}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 cursor-pointer"
            >
              <RotateCcw className="size-3.5" /> Nghe lại
            </button>
            <button
              type="button"
              onClick={() => setPhase("listen")}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 cursor-pointer"
            >
              <Eye className="size-3.5" /> Luyện lại từ này
            </button>
          </div>

          <button
            type="button"
            onClick={onNext}
            className="mt-auto w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-primary hover:bg-primary/90 text-white text-sm font-black shadow-lg shadow-primary/25 transition-all cursor-pointer active:scale-98"
          >
            <span>{index + 1 >= total ? "Hoàn thành lượt luyện" : "Từ tiếp theo"}</span>
            <ArrowRight className="size-4" />
          </button>
        </div>
      )}
    </div>
  );
}
