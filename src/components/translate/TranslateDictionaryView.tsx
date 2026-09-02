"use client";

import type { TranslateDictionaryData } from "@/types/translate";
import { BookOpen, Check, Sparkles, Star } from "lucide-react";
import { useState } from "react";

export type DictionaryData = TranslateDictionaryData;

function posTone(pos: string): { text: string; border: string } {
  const key = pos.toLowerCase();
  if (key.includes("verb") || key.includes("động từ")) {
    return { text: "text-primary dark:text-[#7b9bee]", border: "border-primary/30" };
  }
  if (key.includes("noun") || key.includes("danh từ")) {
    return { text: "text-purple-600 dark:text-purple-400", border: "border-purple-400/40" };
  }
  if (key.includes("adj") || key.includes("tính từ")) {
    return { text: "text-amber-600 dark:text-amber-400", border: "border-amber-400/40" };
  }
  return { text: "text-slate-600 dark:text-slate-300", border: "border-slate-300/60" };
}

function FrequencyBars({ value }: { value: 1 | 2 | 3 }) {
  return (
    <div className="flex items-center gap-1" title={`Độ phổ biến: ${value}/3`}>
      {[1, 2, 3].map((bar) => (
        <span
          key={bar}
          className={`h-3 w-1 rounded-full ${
            bar <= value ? "bg-primary" : "bg-slate-200 dark:bg-slate-700"
          }`}
        />
      ))}
    </div>
  );
}

export default function TranslateDictionaryView({
  data,
  sourceText,
  translatedText,
  onSaveToNotebook,
}: {
  data?: TranslateDictionaryData | null;
  sourceText: string;
  translatedText: string;
  onSaveToNotebook?: () => void;
}) {
  const [saved, setSaved] = useState(false);

  if (!data) return null;
  const hasMeanings = Boolean(data.meanings?.length);
  const hasAlts = Boolean(data.alternateTranslations?.length);
  const hasExamples = Boolean(data.examples?.length);
  if (!hasMeanings && !hasAlts && !hasExamples) return null;

  const handleSave = () => {
    setSaved(true);
    onSaveToNotebook?.();
    setTimeout(() => setSaved(false), 2000);
  };

  const synonyms = Array.from(
    new Set(
      (data.meanings || [])
        .flatMap((meaning) => meaning.definitions.flatMap((def) => def.synonyms || []))
        .filter(Boolean),
    ),
  ).slice(0, 12);

  return (
    <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-6 shadow-sm">
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              {data.headword || sourceText.trim()}
            </h3>
            {data.ipa && (
              <span className="text-xs font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                {data.ipa}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Định nghĩa và các bản dịch thay thế phổ biến trong ngữ cảnh
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs ${
            saved
              ? "bg-emerald-500 text-white"
              : "border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:bg-amber-100"
          }`}
        >
          {saved ? <Check className="size-3.5" /> : <Star className="size-3.5 fill-current" />}
          <span>{saved ? "Đã lưu vào Sổ tay" : "Lưu vào Sổ tay SRS"}</span>
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {hasMeanings && (
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <BookOpen className="size-3.5 text-primary" />
              <span>Định nghĩa chi tiết</span>
            </h4>

            {data.meanings.map((meaning) => {
              const tone = posTone(meaning.pos);
              return (
              <div key={meaning.pos} className="space-y-2">
                <span className={`text-xs font-bold italic block ${tone.text}`}>
                  {meaning.pos}
                </span>
                <div className={`space-y-2.5 pl-3 border-l-2 ${tone.border}`}>
                  {meaning.definitions.map((def, index) => (
                    <div key={`${meaning.pos}-${index}`}>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                        {index + 1}. {def.definition}
                      </p>
                      {def.example && (
                        <p className="text-xs text-slate-500 italic mt-0.5">
                          &ldquo;{def.example}&rdquo;
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              );
            })}
          </div>
        )}

        <div className="space-y-4">
          {hasAlts && (
            <>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Sparkles className="size-3.5 text-amber-500" />
                <span>Các bản dịch thay thế</span>
              </h4>

              <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden text-xs">
                {data.alternateTranslations!.map((item) => (
                  <div
                    key={item.translation}
                    className="p-3 flex items-center justify-between hover:bg-slate-100/60 dark:hover:bg-slate-800/80 transition-colors"
                  >
                    <div>
                      <strong className="text-sm font-bold text-slate-900 dark:text-white block">
                        {item.translation}
                      </strong>
                      {item.reverseTranslation?.length > 0 && (
                        <span className="text-slate-500 text-[11px]">
                          {item.reverseTranslation.join(", ")}
                        </span>
                      )}
                    </div>
                    <FrequencyBars value={item.frequency} />
                  </div>
                ))}
              </div>
            </>
          )}

          {!hasAlts && translatedText && (
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              {translatedText}
            </p>
          )}

          {synonyms.length > 0 && (
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-bold text-slate-400">Từ đồng nghĩa (Synonyms):</span>
              <div className="flex flex-wrap gap-1.5">
                {synonyms.map((syn) => (
                  <span
                    key={syn}
                    className="px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium"
                  >
                    {syn}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {hasExamples && (
        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Ví dụ ngữ cảnh</h4>
          <div className="space-y-2">
            {data.examples!.map((example, index) => (
              <div key={`${example.source}-${index}`} className="text-sm">
                <p className="font-semibold text-slate-800 dark:text-slate-200">{example.source}</p>
                {example.target && (
                  <p className="text-xs text-primary dark:text-[#7b9bee] mt-0.5">{example.target}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
