"use client";

import VocabAudioButton from "@/components/vocabulary/VocabAudioButton";
import VocabWordImage from "@/components/vocabulary/VocabWordImage";
import { wordImageUrl } from "@/lib/vocab";
import { cefrBadgeClass, formatIpa, relationLabel } from "@/lib/vocab";
import type { VocabWord } from "@/types/vocabulary";
import { ChevronDown, Sparkles, BookOpen, GitFork } from "lucide-react";
import { useState, type ReactNode } from "react";

export default function WordRow({
  word,
  extra,
}: {
  word: VocabWord;
  extra?: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ipa = formatIpa(word);
  const examples = word.examples || [];
  const collocations = word.collocations || [];
  const relations = word.relations || [];

  return (
    <div className="group border-b border-slate-100 dark:border-slate-800/80 transition-colors last:border-b-0 hover:bg-slate-50/70 dark:hover:bg-slate-800/30">
      <div className="flex items-center gap-3 px-4 sm:px-5 py-3.5">
        {wordImageUrl(word) && (
          <VocabWordImage
            word={word}
            className="relative size-12 shrink-0 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60"
            sizes="48px"
          />
        )}
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="flex-1 text-left min-w-0 cursor-pointer select-none"
        >
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-base font-black text-slate-900 dark:text-white tracking-tight">
              {word.headword}
            </span>
            {word.partOfSpeech && (
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 italic">
                ({word.partOfSpeech})
              </span>
            )}
            {word.cefrLevel && (
              <span
                className={`px-2 py-0.5 rounded-full border text-[10px] font-bold tracking-wide uppercase ${cefrBadgeClass(
                  word.cefrLevel,
                )}`}
              >
                {word.cefrLevel}
              </span>
            )}
            {ipa && (
              <span className="text-xs font-mono text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800/80 px-1.5 py-0.5 rounded">
                /{ipa.replace(/^\/|\/$/g, "")}/
              </span>
            )}
          </div>

          <p className="text-sm font-medium text-slate-700 dark:text-slate-200 line-clamp-1">
            {word.meaningVi}
          </p>

          {extra && <div className="mt-1">{extra}</div>}
        </button>

        <div className="flex items-center gap-1.5 shrink-0">
          <VocabAudioButton word={word} accent="us" compact />
          <VocabAudioButton word={word} accent="uk" compact />
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
            aria-label={open ? "Thu gọn chi tiết từ" : "Mở rộng chi tiết từ"}
          >
            <ChevronDown
              className={`size-4 transition-transform duration-200 ${
                open ? "rotate-180 text-primary" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {open && (
        <div className="px-4 sm:px-5 pb-4 pt-1 space-y-3 bg-slate-50/40 dark:bg-slate-900/30 text-xs text-slate-600 dark:text-slate-300 border-t border-dashed border-slate-100 dark:border-slate-800">
          <VocabWordImage
            word={word}
            className="w-full max-w-56 aspect-4/3 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 relative"
          />
          {word.definitionVi && (
            <div className="pt-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1 flex items-center gap-1">
                <BookOpen className="size-3" /> Định nghĩa tiếng Việt
              </p>
              <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed pl-4 border-l-2 border-emerald-500/40">
                {word.definitionVi}
              </p>
            </div>
          )}

          {word.definitionEn && (
            <div className={word.definitionVi ? "pt-1" : "pt-2"}>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1 flex items-center gap-1">
                <BookOpen className="size-3" /> Định nghĩa tiếng Anh
              </p>
              <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed pl-4 border-l-2 border-primary/30">
                {word.definitionEn}
              </p>
            </div>
          )}

          {/* Examples */}
          {(word.exampleEn || examples.length > 0) && (
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5 flex items-center gap-1">
                <Sparkles className="size-3 text-amber-500" /> Ví dụ minh họa
              </p>
              <div className="space-y-1.5 pl-4 border-l-2 border-amber-400/40">
                {word.exampleEn && (
                  <div>
                    <p className="text-xs text-slate-800 dark:text-slate-200 italic">
                      “{word.exampleEn}”
                    </p>
                    {word.exampleVi && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {word.exampleVi}
                      </p>
                    )}
                  </div>
                )}
                {examples.map((item) => (
                  <div key={item.id || item.sentence}>
                    <p className="text-xs text-slate-800 dark:text-slate-200 italic">
                      “{item.sentence}”
                    </p>
                    {item.translation && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {item.translation}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Collocations */}
          {collocations.length > 0 && (
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                Cụm từ thường gặp (Collocations)
              </p>
              <div className="flex flex-wrap gap-1.5">
                {collocations.map((item) => (
                  <span
                    key={item.id || item.collocation}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs shadow-2xs"
                  >
                    <strong className="font-semibold text-primary dark:text-[#7b9bee]">
                      {item.collocation}
                    </strong>
                    {item.meaningVi && (
                      <span className="text-slate-400 dark:text-slate-500">
                        : {item.meaningVi}
                      </span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Relations */}
          {relations.length > 0 && (
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5 flex items-center gap-1">
                <GitFork className="size-3" /> Quan hệ từ
              </p>
              <div className="flex flex-wrap gap-1.5">
                {relations.map((item) => (
                  <span
                    key={item.id || item.relatedVocabularyId}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100/80 dark:bg-slate-800/80 text-xs"
                  >
                    <span className="text-[10px] uppercase font-bold text-slate-400">
                      {relationLabel(item.relationType)}:
                    </span>
                    <strong className="font-semibold text-slate-800 dark:text-slate-100">
                      {item.relatedHeadword}
                    </strong>
                    {item.relatedMeaningVi && (
                      <span className="text-slate-500">
                        ({item.relatedMeaningVi})
                      </span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
