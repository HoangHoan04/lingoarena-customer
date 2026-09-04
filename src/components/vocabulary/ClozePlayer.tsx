"use client";

import VocabAudioButton from "@/components/vocabulary/VocabAudioButton";
import { playResultFeedback } from "@/lib/sound";
import { cefrBadgeClass, formatIpa, hasVocabAudio, wordImageUrl } from "@/lib/vocab";
import type { VocabWord } from "@/types/vocabulary";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  HelpCircle,
  ImageIcon,
  Languages,
  Lightbulb,
  Sparkles,
  X,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

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
  const [answer, setAnswer] = useState("");
  const [checked, setChecked] = useState(false);
  const [isUnknown, setIsUnknown] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Extract example and Cloze text breakdown
  const sentence = card.exampleEn || card.examples?.[0]?.sentence || "";
  const sentenceVi = card.exampleVi || card.examples?.[0]?.translation || "";

  const cloze = useMemo(() => {
    if (!sentence) {
      return {
        before: "",
        after: "",
        answer: card.headword,
        hasExample: false,
      };
    }

    const escaped = card.headword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    let pattern = new RegExp(`\\b${escaped}\\b`, "i");
    let match = sentence.match(pattern);

    if (!match) {
      const stem = escaped.replace(/(ing|ed|es|s|d|ly|tion|er|est)$/i, "");
      if (stem.length >= 3) {
        pattern = new RegExp(`\\b${stem}\\w*\\b`, "i");
        match = sentence.match(pattern);
      }
    }

    if (!match) {
      pattern = new RegExp(escaped, "i");
      match = sentence.match(pattern);
    }

    if (!match || match.index === undefined) {
      return {
        before: sentence + " [",
        after: "]",
        answer: card.headword,
        hasExample: true,
      };
    }

    return {
      before: sentence.slice(0, match.index),
      after: sentence.slice(match.index + match[0].length),
      answer: match[0],
      hasExample: true,
    };
  }, [sentence, card.headword]);

  const targetAnswer = cloze.answer.trim();
  const normalizedUserAnswer = answer.trim().toLowerCase();
  const normalizedTarget = targetAnswer.toLowerCase();
  const normalizedHeadword = (card.normalizedWord || card.headword)
    .trim()
    .toLowerCase();

  const isCorrect =
    !isUnknown &&
    checked &&
    (normalizedUserAnswer === normalizedTarget ||
      normalizedUserAnswer === normalizedHeadword);

  // Auto focus input on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  // Handle checking answer
  const handleCheck = () => {
    if (!answer.trim() || checked) return;
    const userAns = answer.trim().toLowerCase();
    const correct =
      userAns === normalizedTarget || userAns === normalizedHeadword;
    setChecked(true);
    setIsUnknown(false);
    playResultFeedback(card, correct, "us", 380);
  };

  // Handle "Don't know" button
  const handleDontKnow = () => {
    if (checked) return;
    setIsUnknown(true);
    setChecked(true);
    playResultFeedback(card, false, "us", 380);
  };

  // Handle Enter key for submit and next
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (!checked) {
        if (answer.trim()) {
          handleCheck();
        } else {
          handleDontKnow();
        }
      } else {
        onNext(isCorrect);
      }
    }
  };

  // Construct masked hint (e.g. "S _ _ _ _ Y" or "S _ _ _ _")
  const maskedHint = useMemo(() => {
    if (!targetAnswer) return "";
    return targetAnswer
      .split("")
      .map((char, i) => {
        if (i === 0) return char.toUpperCase();
        if (char === " " || char === "-" || char === "'") return char;
        return "_";
      })
      .join(" ");
  }, [targetAnswer]);

  const ipa = formatIpa(card);
  const imageUrl = wordImageUrl(card);

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 sm:p-8 shadow-xl space-y-6">
      {/* 1. Header Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary dark:text-[#7b9bee] font-black tracking-wider uppercase text-[11px]">
              <Sparkles className="size-3" />
              Chế độ Điền từ
            </span>
            <span className="hidden sm:inline text-slate-400">
              · Nhập từ còn thiếu vào ngữ cảnh
            </span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-black text-xs">
            {index + 1} / {total}
          </span>
        </div>

        <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-linear-to-r from-brand to-[#4563b0] rounded-full transition-all duration-300"
            style={{
              width: `${Math.round(((index + (checked ? 1 : 0)) / Math.max(total, 1)) * 100)}%`,
            }}
          />
        </div>
      </div>

      {/* 2. Main Content Box */}
      <div className="rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 p-4 sm:p-6 space-y-5">
        {/* Row with Illustration Image & Core Meanings */}
        <div className="flex flex-col md:flex-row gap-5 items-start">
          {/* Ảnh minh hoạ */}
          <div className="w-full md:w-48 lg:w-56 shrink-0 aspect-4/3 sm:aspect-16/10 md:aspect-4/3 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 relative group shadow-xs">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={card.headword}
                fill
                sizes="(max-width: 768px) 100vw, 224px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                unoptimized={imageUrl.startsWith("http")}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-linear-to-br from-slate-100 via-primary/5 to-slate-200/60 dark:from-slate-800 dark:via-slate-800/90 dark:to-slate-900">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 dark:bg-primary/20 text-primary dark:text-[#7b9bee] flex items-center justify-center mb-2 shadow-inner">
                  <ImageIcon className="size-6" />
                </div>
                <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500">
                  Minh hoạ từ vựng
                </span>
                <span className="text-xs font-black text-slate-700 dark:text-slate-300 mt-0.5">
                  {card.partOfSpeech}
                </span>
              </div>
            )}

            {/* Badges on image corner */}
            <div className="absolute top-2 left-2 flex items-center gap-1.5">
              {card.cefrLevel && (
                <span
                  className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase border shadow-2xs ${cefrBadgeClass(
                    card.cefrLevel,
                  )}`}
                >
                  {card.cefrLevel}
                </span>
              )}
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-900/70 text-white backdrop-blur-xs">
                {card.partOfSpeech}
              </span>
            </div>
          </div>

          {/* Core Meanings & Definitions */}
          <div className="flex-1 min-w-0 space-y-3.5 w-full">
            {/* Nghĩa tiếng Việt của từ đó (Prominent Badge) */}
            <div className="p-3.5 rounded-xl bg-linear-to-r from-emerald-500/10 via-emerald-500/5 to-transparent dark:from-emerald-500/20 dark:via-emerald-500/10 border border-emerald-500/20">
              <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider mb-1">
                <Languages className="size-3.5" />
                <span>Nghĩa tiếng Việt</span>
              </div>
              <p className="text-lg sm:text-xl font-extrabold text-emerald-950 dark:text-emerald-100">
                {card.meaningVi}
              </p>
            </div>

            {/* Định nghĩa tiếng Anh & tiếng Việt */}
            <div className="grid grid-cols-1 gap-2.5 text-xs sm:text-sm">
              {/* Định nghĩa tiếng Anh */}
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200/70 dark:border-slate-800 space-y-1">
                <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Định nghĩa tiếng Anh (EN)
                </div>
                <p className="text-slate-700 dark:text-slate-200 font-medium leading-relaxed">
                  {card.definitionEn || "No definition provided."}
                </p>
              </div>

              {/* Định nghĩa tiếng Việt */}
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200/70 dark:border-slate-800 space-y-1">
                <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Định nghĩa tiếng Việt (VI)
                </div>
                <p className="text-slate-700 dark:text-slate-200 font-medium leading-relaxed">
                  {card.definitionVi || card.meaningVi}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Ví dụ với vị trí điền từ vào 3 chấm (.....) */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-dashed border-primary/25 dark:border-primary/40 space-y-3 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400">
            <span className="flex items-center gap-1.5 text-primary dark:text-[#7b9bee] font-black uppercase text-[11px] tracking-wider">
              <BookOpen className="size-3.5" />
              Câu ví dụ & Ngữ cảnh
            </span>
            {checked && hasVocabAudio(card) && (
              <VocabAudioButton word={card} accent="us" compact />
            )}
          </div>

          {/* Câu tiếng Anh có chỗ trống thay bằng từ đang gõ hoặc kết quả */}
          <div className="text-base sm:text-lg font-medium text-slate-800 dark:text-slate-100 leading-relaxed">
            {cloze.before}

            {/* Vị trí 3 chấm / Slot điền từ */}
            <span
              className={`inline-flex items-center justify-center min-w-30 px-3 py-1 mx-1.5 rounded-lg font-extrabold transition-all duration-200 align-baseline ${
                checked
                  ? isCorrect
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-b-2 border-emerald-500"
                    : "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-b-2 border-rose-500"
                  : answer.trim()
                    ? "bg-primary/10 text-primary dark:text-[#7b9bee] border-b-2 border-primary"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-400 border-b-2 border-dashed border-slate-300 dark:border-slate-600"
              }`}
            >
              {checked ? (
                isCorrect ? (
                  <span>{targetAnswer}</span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    {answer ? (
                      <span className="line-through opacity-70 text-xs sm:text-sm">
                        {answer}
                      </span>
                    ) : null}
                    <span className="font-black underline">{targetAnswer}</span>
                  </span>
                )
              ) : answer.trim() ? (
                <span>{answer}</span>
              ) : (
                <span className="tracking-widest font-black text-slate-400">
                  . . . . .
                </span>
              )}
            </span>

            {cloze.after}
          </div>

          {/* Dịch nghĩa câu ví dụ */}
          {sentenceVi && (
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 italic pt-1 border-t border-slate-100 dark:border-slate-800">
              Dịch: &ldquo;{sentenceVi}&rdquo;
            </p>
          )}
        </div>
      </div>

      {/* 4. Gợi ý Box (Nếu mở) */}
      {showHint && !checked && (
        <div className="p-4 rounded-2xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-black text-amber-800 dark:text-amber-300">
              <Lightbulb className="size-4 text-amber-600" />
              <span>Gợi ý cho bạn:</span>
            </div>
            <button
              type="button"
              onClick={() => setShowHint(false)}
              className="text-amber-600 hover:text-amber-800 p-1 text-xs cursor-pointer"
            >
              <X className="size-3.5" />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-amber-900 dark:text-amber-200 font-semibold">
            <span>
              💡 Độ dài từ: <strong>{targetAnswer.length} chữ cái</strong>
            </span>
            <span>
              💡 Mẫu từ:{" "}
              <code className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-900/60 font-mono font-bold tracking-widest">
                {maskedHint}
              </code>
            </span>
            {ipa && <span>💡 Phiên âm: [{ipa}]</span>}
          </div>
        </div>
      )}

      {/* 5. Input Form & Action Buttons */}
      {!checked ? (
        <div className="space-y-4">
          {/* Input row */}
          <div className="relative flex items-center gap-2">
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Nhập từ tiếng Anh cần điền vào câu..."
                autoComplete="off"
                spellCheck={false}
                className="w-full h-13 px-4 pr-10 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-base font-bold text-slate-900 dark:text-white placeholder:text-slate-400 placeholder:font-normal focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all"
              />
              {answer && (
                <button
                  type="button"
                  onClick={() => {
                    setAnswer("");
                    inputRef.current?.focus();
                  }}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  title="Xoá ô nhập"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>

            {/* Nút Gợi ý */}
            <button
              type="button"
              onClick={() => setShowHint((prev) => !prev)}
              className={`h-13 px-4 rounded-2xl border font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer select-none active:scale-95 ${
                showHint
                  ? "bg-amber-100 border-amber-300 text-amber-800 dark:bg-amber-950/60 dark:border-amber-800 dark:text-amber-300"
                  : "bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-amber-50/60 hover:border-amber-200"
              }`}
              title="Xem gợi ý ký tự"
            >
              <Lightbulb className="size-4 text-amber-500" />
              <span className="hidden sm:inline">Gợi ý</span>
            </button>
          </div>

          {/* Hai nút hành động: Kiểm tra hoặc Không biết */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Nút Không biết */}
            <button
              type="button"
              onClick={handleDontKnow}
              className="h-12 rounded-2xl border-2 border-slate-200 dark:border-slate-700 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-extrabold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
            >
              <HelpCircle className="size-4 text-slate-400" />
              <span>Không biết (Xem đáp án)</span>
            </button>

            {/* Nút Kiểm tra */}
            <button
              type="button"
              disabled={!answer.trim()}
              onClick={handleCheck}
              className="h-12 rounded-2xl bg-primary hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black text-sm shadow-md shadow-primary/25 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
            >
              <CheckCircle2 className="size-4" />
              <span>Kiểm tra</span>
            </button>
          </div>
        </div>
      ) : (
        /* 6. Kết quả sau khi trả lời */
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {/* Result card */}
          <div
            className={`p-4 sm:p-5 rounded-2xl border ${
              isCorrect
                ? "bg-emerald-50/90 border-emerald-300 dark:bg-emerald-950/40 dark:border-emerald-800"
                : "bg-rose-50/90 border-rose-300 dark:bg-rose-950/40 dark:border-rose-800"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                {isCorrect ? (
                  <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                    <CheckCircle2 className="size-5" />
                  </div>
                ) : (
                  <div className="w-9 h-9 rounded-xl bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                    <XCircle className="size-5" />
                  </div>
                )}

                <div className="space-y-1">
                  <p
                    className={`text-base font-black ${
                      isCorrect
                        ? "text-emerald-800 dark:text-emerald-200"
                        : "text-rose-800 dark:text-rose-200"
                    }`}
                  >
                    {isCorrect
                      ? "Chính xác tuyệt vời!"
                      : isUnknown
                        ? `Đáp án đúng: "${targetAnswer}"`
                        : `Chưa chính xác. Đáp án đúng: "${targetAnswer}"`}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <span className="font-extrabold text-sm text-primary dark:text-[#7b9bee]">
                      {card.headword}
                    </span>
                    <span className="text-slate-400">
                      ({card.partOfSpeech})
                    </span>
                    {ipa && (
                      <span className="font-mono text-slate-500">/{ipa}/</span>
                    )}
                    <span className="text-slate-400">·</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {card.meaningVi}
                    </span>
                  </div>
                </div>
              </div>

              {/* Audio US & UK buttons */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <VocabAudioButton word={card} accent="us" />
                <VocabAudioButton word={card} accent="uk" />
              </div>
            </div>
          </div>

          {/* Button sang câu tiếp theo */}
          <button
            type="button"
            autoFocus
            onClick={() => onNext(isCorrect)}
            className="w-full h-13 inline-flex items-center justify-center gap-2 rounded-2xl bg-primary hover:bg-primary/90 text-white text-sm font-black shadow-lg shadow-primary/25 transition-all cursor-pointer active:scale-98 select-none"
          >
            <span>
              {index + 1 >= total
                ? "Hoàn thành lượt luyện tập"
                : "Câu tiếp theo"}
            </span>
            <ArrowRight className="size-4" />
          </button>
        </div>
      )}
    </div>
  );
}
