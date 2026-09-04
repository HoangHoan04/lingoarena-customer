"use client";

import { cn } from "@/lib/utils";
import { pronounceWord } from "@/lib/sound";
import type { VocabWord } from "@/types/vocabulary";
import { Volume2 } from "lucide-react";
import { useState } from "react";

type Accent = "us" | "uk";

export default function VocabAudioButton({
  word,
  accent,
  compact,
  className,
}: {
  word: Pick<VocabWord, "headword" | "audioUsUrl" | "audioUkUrl">;
  accent?: Accent;
  compact?: boolean;
  className?: string;
}) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    setIsPlaying(true);
    pronounceWord(word, accent || "us");

    setTimeout(() => {
      setIsPlaying(false);
    }, 1000);
  };

  const isUS = accent === "us";
  const isUK = accent === "uk";

  return (
    <button
      type="button"
      onClick={handlePlay}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg border font-semibold transition-all duration-200 cursor-pointer select-none active:scale-95",
        // Color themes based on accent
        isUS
          ? "border-blue-200/80 bg-blue-50/70 text-blue-700 hover:bg-blue-100 hover:border-blue-300 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300 dark:hover:bg-blue-900/60"
          : isUK
            ? "border-purple-200/80 bg-purple-50/70 text-purple-700 hover:bg-purple-100 hover:border-purple-300 dark:border-purple-900/60 dark:bg-purple-950/40 dark:text-purple-300 dark:hover:bg-purple-900/60"
            : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700",
        // Sizes
        compact
          ? "px-2 py-1 text-[11px] h-6"
          : "px-2.5 py-1.5 text-xs h-7.5 shadow-2xs",
        isPlaying && "ring-2 ring-primary/40 scale-105",
        className,
      )}
      aria-label={accent ? `Phát âm tiếng Anh giọng ${accent.toUpperCase()}` : "Phát âm từ"}
      title={accent ? `Phát âm (${accent.toUpperCase()})` : "Phát âm"}
    >
      <Volume2
        className={cn(
          compact ? "size-3" : "size-3.5",
          isPlaying && "animate-pulse text-primary",
        )}
      />
      {accent && (
        <span className="font-bold tracking-wider text-[10px] uppercase">
          {accent}
        </span>
      )}
      {!accent && !compact && <span>Nghe</span>}
    </button>
  );
}
