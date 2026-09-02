"use client";

import VocabAudioButton from "@/components/vocabulary/VocabAudioButton";
import { buildClozeSentence } from "@/lib/vocab";
import type { VocabWord } from "@/types/vocabulary";
import { ArrowRight, CheckCircle2, HelpCircle, Sparkles, XCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function ClozePlayer({
  card,
  index,
  total,
  onNext,
}: {
  card: VocabWord;
  index: number;
  total: number;
  onNext: (correct: boolean) => void;
}) {
  const cloze = buildClozeSentence(card);
  const [answer, setAnswer] = useState("");
  const [checked, setChecked] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const correct = answer.trim().toLowerCase() === cloze.answer.trim().toLowerCase();

  useEffect(() => {
    setAnswer("");
    setChecked(false);
    setShowHint(false);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, [card.id]);

  const handleCheck = () => {
    if (!answer.trim()) return;
    setChecked(true);
  };

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 sm:p-8 shadow-xl space-y-6 min-h-[380px]">
      {/* Header Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-primary dark:text-[#7b9bee] tracking-wider uppercase">
              Điền Từ Vào Câu
            </span>
            <span className="text-slate-400">· Nhập từ còn thiếu vào ngữ cảnh</span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary dark:text-[#7b9bee] font-black text-xs">
            {index + 1} / {total}
          </span>
        </div>
        <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-linear-to-r from-[#2b417e] to-[#4563b0] rounded-full transition-all duration-300"
            style={{
              width: `${Math.round(((index + (checked ? 1 : 0)) / Math.max(total, 1)) * 100)}%`,
            }}
          />
        </div>
      </div>

      {/* Meaning & Sentence Card */}
      <div className="p-6 rounded-3xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-4 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary dark:text-[#7b9bee] text-xs font-bold">
          <Sparkles className="size-3.5" />
          <span>Gợi ý nghĩa: {card.meaningVi}</span>
        </div>

        {/* Cloze Sentence */}
        <div className="text-lg sm:text-xl font-medium text-slate-800 dark:text-slate-200 leading-relaxed max-w-2xl mx-auto">
          {cloze.before}
          <span className="inline-flex items-center justify-center min-w-[140px] px-3 py-1 mx-1.5 border-b-2 border-primary font-bold text-primary dark:text-[#7b9bee] bg-primary/5 rounded-t-lg align-baseline">
            {checked ? (
              <span className={correct ? "text-emerald-600 font-black" : "text-rose-600 font-black"}>
                {cloze.answer}
              </span>
            ) : answer ? (
              answer
            ) : (
              <span className="text-slate-400 font-normal italic text-sm">(từ còn thiếu)</span>
            )}
          </span>
          {cloze.after}
        </div>

        {card.exampleVi && (
          <p className="text-xs text-slate-500 italic max-w-lg mx-auto">
            Dịch: {card.exampleVi}
          </p>
        )}
      </div>

      {/* Input Form */}
      <div className="space-y-3">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            disabled={checked}
            placeholder="Gõ từ tiếng Anh cần điền..."
            className="flex-1 h-12 px-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-primary focus:outline-none transition-colors"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !checked) handleCheck();
            }}
          />
          {!checked && (
            <button
              type="button"
              onClick={() => setShowHint(true)}
              className="px-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold flex items-center gap-1 cursor-pointer"
              title="Xem gợi ý ký tự đầu"
            >
              <HelpCircle className="size-4 text-amber-500" />
              <span className="hidden sm:inline">Gợi ý</span>
            </button>
          )}
        </div>

        {showHint && !checked && (
          <p className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-3 py-2 rounded-xl">
            💡 Ký tự đầu tiên: <strong>{cloze.answer[0]?.toUpperCase()}</strong> (từ có {cloze.answer.length} chữ cái)
          </p>
        )}
      </div>

      {/* Action Buttons */}
      {!checked ? (
        <button
          type="button"
          disabled={!answer.trim()}
          onClick={handleCheck}
          className="w-full py-3.5 rounded-2xl bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-black text-sm shadow-md shadow-primary/25 transition-all cursor-pointer"
        >
          Kiểm tra đáp án
        </button>
      ) : (
        <div className="space-y-4 animate-in fade-in">
          <div
            className={`p-4 rounded-2xl border ${
              correct
                ? "bg-emerald-50/80 border-emerald-300 dark:bg-emerald-950/40 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200"
                : "bg-rose-50/80 border-rose-300 dark:bg-rose-950/40 dark:border-rose-800 text-rose-800 dark:text-rose-200"
            } flex items-center justify-between gap-3`}
          >
            <div className="flex items-center gap-2.5">
              {correct ? (
                <CheckCircle2 className="size-5 text-emerald-600 shrink-0" />
              ) : (
                <XCircle className="size-5 text-rose-600 shrink-0" />
              )}
              <div>
                <p className="text-sm font-black">
                  {correct ? "Chính xác tuyệt đối!" : `Đáp án đúng: ${cloze.answer}`}
                </p>
                <p className="text-xs opacity-80 mt-0.5">
                  {card.headword} ({card.partOfSpeech}) — {card.meaningVi}
                </p>
              </div>
            </div>
            <VocabAudioButton word={card} accent="us" />
          </div>

          <button
            type="button"
            onClick={() => onNext(correct)}
            className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-primary hover:bg-primary/90 text-white text-sm font-black shadow-lg shadow-primary/25 transition-all cursor-pointer active:scale-98"
          >
            <span>{index + 1 >= total ? "Hoàn thành lượt luyện" : "Câu tiếp theo"}</span>
            <ArrowRight className="size-4" />
          </button>
        </div>
      )}
    </div>
  );
}
