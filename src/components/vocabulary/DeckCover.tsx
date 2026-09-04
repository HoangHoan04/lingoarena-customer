"use client";

import { pickLocaleText } from "@/lib/locale-text";
import { cn } from "@/lib/utils";
import { deckCoverUrl } from "@/lib/vocab";
import type { VocabDeck } from "@/types/vocabulary";
import { BookOpen, Layers, Sparkles } from "lucide-react";
import { useLocale } from "next-intl";
import Image from "next/image";
import { useId, useState } from "react";

const CEFR_THEMES: Record<
  string,
  {
    gradient: string;
    glow: string;
    badge: string;
    badgeBg: string;
    accent: string;
  }
> = {
  A1: {
    gradient: "from-emerald-700 via-teal-800 to-slate-950",
    glow: "bg-emerald-400/25",
    badge: "text-emerald-200 border-emerald-400/30",
    badgeBg: "bg-emerald-500/20",
    accent: "text-emerald-300",
  },
  A2: {
    gradient: "from-teal-700 via-cyan-800 to-slate-950",
    glow: "bg-cyan-400/25",
    badge: "text-cyan-200 border-cyan-400/30",
    badgeBg: "bg-cyan-500/20",
    accent: "text-cyan-300",
  },
  B1: {
    gradient: "from-sky-700 via-blue-800 to-slate-950",
    glow: "bg-sky-400/25",
    badge: "text-sky-200 border-sky-400/30",
    badgeBg: "bg-sky-500/20",
    accent: "text-sky-300",
  },
  B2: {
    gradient: "from-indigo-700 via-violet-800 to-slate-950",
    glow: "bg-indigo-400/25",
    badge: "text-indigo-200 border-indigo-400/30",
    badgeBg: "bg-indigo-500/20",
    accent: "text-indigo-300",
  },
  C1: {
    gradient: "from-purple-800 via-violet-900 to-slate-950",
    glow: "bg-purple-400/25",
    badge: "text-purple-200 border-purple-400/30",
    badgeBg: "bg-purple-500/20",
    accent: "text-purple-300",
  },
  C2: {
    gradient: "from-rose-800 via-pink-900 to-slate-950",
    glow: "bg-rose-400/25",
    badge: "text-rose-200 border-rose-400/30",
    badgeBg: "bg-rose-500/20",
    accent: "text-rose-300",
  },
};

const SEED_THEMES = [
  {
    gradient: "from-indigo-800 via-slate-900 to-blue-950",
    glow: "bg-indigo-400/25",
    badge: "text-indigo-200 border-indigo-400/30",
    badgeBg: "bg-indigo-500/20",
    accent: "text-indigo-300",
  },
  {
    gradient: "from-violet-800 via-slate-900 to-fuchsia-950",
    glow: "bg-fuchsia-400/25",
    badge: "text-fuchsia-200 border-fuchsia-400/30",
    badgeBg: "bg-fuchsia-500/20",
    accent: "text-fuchsia-300",
  },
  {
    gradient: "from-teal-800 via-slate-900 to-cyan-950",
    glow: "bg-teal-400/25",
    badge: "text-teal-200 border-teal-400/30",
    badgeBg: "bg-teal-500/20",
    accent: "text-teal-300",
  },
  {
    gradient: "from-amber-800 via-slate-900 to-rose-950",
    glow: "bg-amber-400/25",
    badge: "text-amber-200 border-amber-400/30",
    badgeBg: "bg-amber-500/20",
    accent: "text-amber-300",
  },
];

function getDeckTheme(deck: Pick<VocabDeck, "level" | "cefrLevel" | "slug">) {
  const level = (deck.cefrLevel || deck.level || "").toUpperCase();
  if (CEFR_THEMES[level]) {
    return CEFR_THEMES[level];
  }
  let hash = 0;
  const s = deck.slug || "";
  for (let i = 0; i < s.length; i += 1) {
    hash += s.charCodeAt(i);
  }
  return SEED_THEMES[Math.abs(hash) % SEED_THEMES.length];
}

export interface DeckCoverProps {
  deck: Pick<
    VocabDeck,
    | "title"
    | "titleEn"
    | "slug"
    | "thumbnailUrl"
    | "level"
    | "cefrLevel"
    | "itemCount"
  >;
  className?: string;
  size?: "xs" | "sm" | "md" | "lg";
  showBadges?: boolean;
  priority?: boolean;
}

export default function DeckCover({
  deck,
  className,
  size = "md",
  showBadges = true,
  priority = false,
}: DeckCoverProps) {
  const locale = useLocale();
  const patternId = useId();
  const [imgError, setImgError] = useState(false);

  const photoUrl = deckCoverUrl(deck);
  const hasPhoto = Boolean(photoUrl && !imgError);
  const theme = getDeckTheme(deck);
  const cefr = (deck.cefrLevel || deck.level || "").toUpperCase();
  const primaryTitle = pickLocaleText(locale, deck.title, deck.titleEn);
  const secondaryTitle =
    deck.titleEn && deck.titleEn.toLowerCase() !== deck.title.toLowerCase()
      ? deck.titleEn
      : null;

  const initial =
    cefr || (primaryTitle ? primaryTitle.trim().charAt(0).toUpperCase() : "V");

  // SPECIAL CASE: XS (Thumbnail Avatar mode) - Compact, clean, absolutely NO overlapping text
  if (size === "xs") {
    return (
      <div
        className={cn(
          "relative size-full overflow-hidden select-none flex items-center justify-center",
          className,
        )}
      >
        {hasPhoto ? (
          <Image
            src={photoUrl}
            alt={primaryTitle}
            fill
            className="object-cover"
            onError={() => setImgError(true)}
            unoptimized
          />
        ) : (
          <div
            className={cn(
              "size-full bg-gradient-to-br flex items-center justify-center relative overflow-hidden text-white",
              theme.gradient,
            )}
          >
            <div
              className={cn(
                "absolute inset-0 size-full blur-sm pointer-events-none opacity-40",
                theme.glow,
              )}
            />
            <span className="relative z-10 font-black text-base sm:text-lg tracking-wider text-white drop-shadow-sm">
              {initial}
            </span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden select-none",
        size === "sm" && "h-32 sm:h-36",
        size === "md" && "h-40 sm:h-44",
        size === "lg" && "min-h-60 sm:min-h-70 lg:min-h-80 h-full",
        className,
      )}
    >
      {hasPhoto ? (
        /* Image Mode with Clean Contrast Vignette */
        <>
          <Image
            src={photoUrl}
            alt={primaryTitle}
            fill
            priority={priority}
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            onError={() => setImgError(true)}
            unoptimized
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/25 to-black/40 pointer-events-none" />

          {/* Top badges */}
          {showBadges && (
            <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none z-10">
              {cefr ? (
                <span
                  className={cn(
                    "px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider backdrop-blur-md border shadow-sm",
                    theme.badge,
                    theme.badgeBg,
                  )}
                >
                  {cefr}
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white/90 bg-black/40 backdrop-blur-md border border-white/15">
                  Bộ thẻ
                </span>
              )}

              {typeof deck.itemCount === "number" && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold text-white/90 bg-black/50 backdrop-blur-md border border-white/15 shadow-sm">
                  <BookOpen className="size-3 text-indigo-300" />
                  {deck.itemCount} từ
                </span>
              )}
            </div>
          )}
        </>
      ) : (
        /* Typography Art Banner Mode (When deck has no image) */
        <div
          className={cn(
            "relative h-full w-full bg-gradient-to-br p-4 sm:p-5 flex flex-col justify-between overflow-hidden",
            theme.gradient,
          )}
        >
          {/* Micro dots SVG pattern */}
          <svg
            className="absolute inset-0 size-full opacity-10 pointer-events-none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id={`dots-${patternId}`}
                width="16"
                height="16"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="2" cy="2" r="1" fill="#ffffff" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#dots-${patternId})`} />
          </svg>

          {/* Ambient Glow Aura */}
          <div
            className={cn(
              "absolute -top-12 -left-12 size-48 rounded-full blur-3xl pointer-events-none",
              theme.glow,
            )}
          />
          <div
            className={cn(
              "absolute -bottom-16 -right-12 size-56 rounded-full blur-3xl pointer-events-none opacity-50",
              theme.glow,
            )}
          />

          {/* Monogram Watermark */}
          <span
            aria-hidden="true"
            className="absolute -right-2 -bottom-4 sm:-bottom-6 text-7xl sm:text-8xl lg:text-9xl font-black text-white/5 select-none pointer-events-none tracking-tighter leading-none"
          >
            {initial}
          </span>

          {/* Top Bar: CEFR Badge + Word count pill */}
          {showBadges ? (
            <div className="relative z-10 flex items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-1.5">
                {cefr ? (
                  <span
                    className={cn(
                      "px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider backdrop-blur-md border shadow-sm",
                      theme.badge,
                      theme.badgeBg,
                    )}
                  >
                    {cefr}
                  </span>
                ) : null}
              </div>

              {typeof deck.itemCount === "number" && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold text-white/80 bg-black/30 backdrop-blur-md border border-white/10 shadow-sm">
                  <BookOpen className="size-3 text-indigo-300/80" />
                  {deck.itemCount} từ
                </span>
              )}
            </div>
          ) : (
            <div className="shrink-0" />
          )}

          {/* Main Typography Focus - Clean spacing, NO overlapping */}
          <div className="relative z-10 my-auto py-2 min-h-0">
            <div className="flex items-start gap-2.5">
              <div className="size-8 sm:size-9 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-inner flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-white/15 transition-all duration-300">
                <Layers className="size-4 sm:size-5 text-white/90" />
              </div>

              <div className="flex-1 min-w-0">
                <h3
                  className={cn(
                    "font-black text-white leading-snug tracking-tight drop-shadow-sm group-hover:text-white/95 transition-colors line-clamp-2",
                    size === "sm" && "text-sm sm:text-base",
                    size === "md" && "text-base sm:text-lg",
                    size === "lg" && "text-2xl sm:text-3xl lg:text-4xl",
                  )}
                >
                  {primaryTitle}
                </h3>

                {secondaryTitle && (
                  <p
                    className={cn(
                      "text-[11px] font-medium text-white/70 tracking-wider truncate uppercase mt-0.5",
                      size === "lg" && "text-xs sm:text-sm text-white/80 mt-1",
                    )}
                  >
                    {secondaryTitle}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Accent */}
          <div className="relative z-10 flex items-center justify-between text-[11px] text-white/50 pt-2 border-t border-white/10 shrink-0">
            <span className="font-mono text-[10px] text-white/60 tracking-wider truncate max-w-[140px]">
              #{deck.slug || "deck"}
            </span>
            <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-white/60 shrink-0">
              <Sparkles className="size-2.5 text-indigo-300" />
              LingoArena
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
