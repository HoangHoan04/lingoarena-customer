"use client";

import { wordImageUrl } from "@/lib/vocab";
import type { VocabWord } from "@/types/vocabulary";
import { ImageIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function VocabWordImage({
  word,
  className = "w-full max-w-56 mx-auto aspect-4/3 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 relative shadow-xs",
  sizes = "(max-width: 768px) 100vw, 320px",
  showPlaceholder = false,
}: {
  word: VocabWord;
  className?: string;
  sizes?: string;
  showPlaceholder?: boolean;
}) {
  const [hasError, setHasError] = useState(false);
  const src = wordImageUrl(word);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  if ((!src || hasError) && !showPlaceholder) return null;

  return (
    <div className={className}>
      {src && !hasError ? (
        <Image
          src={src}
          alt={word.headword}
          fill
          sizes={sizes}
          className="object-cover"
          onError={() => setHasError(true)}
          unoptimized
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary dark:text-[#7b9bee] flex items-center justify-center mb-2">
            <ImageIcon className="size-5" />
          </div>
          <span className="text-[11px] font-bold text-slate-400">
            Minh hoạ từ vựng
          </span>
        </div>
      )}
    </div>
  );
}
