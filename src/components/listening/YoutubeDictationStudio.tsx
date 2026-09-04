"use client";

import { useToastStore } from "@/stores/useToastStore";
import type {
  DictationDifficulty,
  StudioSettings,
  YoutubeSentence,
} from "@/types/listening-youtube";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  Pause,
  Play,
  RotateCcw,
  Settings,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

interface YoutubeDictationStudioProps {
  sentence: YoutubeSentence;
  currentIndex: number;
  totalSentences: number;
  isPlaying: boolean;
  onPlayToggle: () => void;
  onReplay: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onSentenceCompleted?: (sentenceId: string) => void;
}

// Clean word for comparison (remove punctuation, lower case)
function cleanWord(w: string): string {
  return w
    .toLowerCase()
    .replace(/[^a-z0-9']/g, "")
    .trim();
}

export function YoutubeDictationStudio({
  sentence,
  currentIndex,
  totalSentences,
  isPlaying,
  onPlayToggle,
  onReplay,
  onPrevious,
  onNext,
  onSentenceCompleted,
}: YoutubeDictationStudioProps) {
  const { addToast } = useToastStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Settings
  const [difficulty, setDifficulty] = useState<DictationDifficulty>("normal");
  const [settings, setSettings] = useState<StudioSettings>({
    autoRevealWords: false,
    showExplanation: true,
    soundEffects: true,
    playbackSpeed: 1.0,
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSpeedOpen, setIsSpeedOpen] = useState(false);

  // User input & validation
  const [userInput, setUserInput] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Split sentence into target words
  const targetWords = useMemo(() => {
    return sentence.text.split(/\s+/).filter(Boolean);
  }, [sentence.text]);

  // Reset input and textarea height when sentence changes
  useEffect(() => {
    setUserInput("");
    setIsSubmitted(false);
    setIsCorrect(false);
    if (textareaRef.current) {
      textareaRef.current.style.height = "106px";
      textareaRef.current.focus();
    }
  }, [sentence.id]);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserInput(e.target.value);
    setIsSubmitted(false);

    // Auto-expand textarea height dynamically
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.max(56, textareaRef.current.scrollHeight)}px`;
    }
  };

  // Check matching words in real-time as user types
  const userWordTokens = useMemo(() => {
    return userInput.split(/\s+/).filter(Boolean).map(cleanWord);
  }, [userInput]);

  const wordMatchStatuses = useMemo(() => {
    const remainingUserTokens = [...userWordTokens];

    return targetWords.map((targetW, idx) => {
      const cleanTarget = cleanWord(targetW);

      // 1. Direct positional match
      if (userWordTokens[idx] === cleanTarget) {
        return {
          originalWord: targetW,
          cleanTarget,
          isMatched: true,
        };
      }

      // 2. Token presence match anywhere in input
      const foundIdx = remainingUserTokens.indexOf(cleanTarget);
      if (foundIdx !== -1) {
        remainingUserTokens.splice(foundIdx, 1);
        return {
          originalWord: targetW,
          cleanTarget,
          isMatched: true,
        };
      }

      return {
        originalWord: targetW,
        cleanTarget,
        isMatched:
          (isSubmitted && isCorrect) ||
          (settings.autoRevealWords && isSubmitted),
      };
    });
  }, [
    targetWords,
    userWordTokens,
    isSubmitted,
    isCorrect,
    settings.autoRevealWords,
  ]);

  // Real-time auto-detection when all words are typed correctly
  useEffect(() => {
    if (
      wordMatchStatuses.length > 0 &&
      wordMatchStatuses.every((w) => w.isMatched) &&
      !isCorrect
    ) {
      setIsCorrect(true);
      setIsSubmitted(true);
      onSentenceCompleted?.(sentence.id);
    }
  }, [wordMatchStatuses, isCorrect, sentence.id, onSentenceCompleted]);

  const handleSubmitOrCheck = () => {
    const cleanTargetFull = targetWords.map(cleanWord).join(" ");
    const cleanUserFull = userWordTokens.join(" ");

    const allMatch =
      cleanUserFull === cleanTargetFull ||
      wordMatchStatuses.every((w) => w.isMatched);
    setIsSubmitted(true);
    setIsCorrect(allMatch);

    if (allMatch) {
      onSentenceCompleted?.(sentence.id);
      addToast(
        "Tuyệt vời! Bạn đã nghe chính xác 100% và mở khóa bản chép câu này.",
        "success",
      );
    } else {
      addToast(
        "Chưa hoàn toàn chính xác, hãy nghe lại hoặc xem các từ gợi ý màu xanh.",
        "info",
      );
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isSubmitted || !isCorrect) {
        handleSubmitOrCheck();
      } else {
        onNext();
      }
    }
  };

  return (
    <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 shadow-sm space-y-5 flex flex-col justify-between">
      <div className="space-y-4">
        {/* 1. TOP DIFFICULTY TABS */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3.5">
          <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs font-bold">
            <button
              type="button"
              onClick={() => setDifficulty("easy")}
              className={`px-2.5 sm:px-3.5 py-1.5 rounded-xl transition-all cursor-pointer text-[11px] sm:text-xs ${
                difficulty === "easy"
                  ? "bg-emerald-600 text-white shadow-xs font-black"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              🌱 Dễ
            </button>

            <button
              type="button"
              onClick={() => setDifficulty("normal")}
              className={`px-2.5 sm:px-3.5 py-1.5 rounded-xl transition-all cursor-pointer text-[11px] sm:text-xs ${
                difficulty === "normal"
                  ? "bg-brand text-white shadow-xs font-black"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              ⚡ Chuẩn
            </button>

            <button
              type="button"
              onClick={() => setDifficulty("hard")}
              className={`px-2.5 sm:px-3.5 py-1.5 rounded-xl transition-all cursor-pointer text-[11px] sm:text-xs ${
                difficulty === "hard"
                  ? "bg-rose-600 text-white shadow-xs font-black"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              🔥 Khó
            </button>
          </div>

          <span className="text-xs font-mono font-bold text-slate-400">
            Câu {currentIndex + 1} / {totalSentences}
          </span>
        </div>

        {/* 2. PLAYBACK & SETTINGS TOOLBAR */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800">
          {/* Left Controls: < , Replay, Play, > */}
          <div className="flex items-center gap-2">
            {/* Previous */}
            <button
              type="button"
              disabled={currentIndex === 0}
              onClick={onPrevious}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors cursor-pointer"
              title="Trở về câu trước (<)"
            >
              <ChevronLeft className="size-4" />
            </button>

            {/* Replay */}
            <button
              type="button"
              onClick={onReplay}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Phát lại đoạn này"
            >
              <RotateCcw className="size-4 text-rose-600" />
            </button>

            {/* Play/Pause */}
            <button
              type="button"
              onClick={onPlayToggle}
              className="p-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition-all shadow-md shadow-rose-600/20 cursor-pointer flex items-center gap-1.5"
              title={isPlaying ? "Tạm dừng" : "Phát"}
            >
              {isPlaying ? (
                <Pause className="size-4 fill-current" />
              ) : (
                <Play className="size-4 fill-current" />
              )}
              <span className="text-xs">{isPlaying ? "Tạm dừng" : "Phát"}</span>
            </button>

            {/* Next */}
            <button
              type="button"
              disabled={currentIndex + 1 >= totalSentences}
              onClick={onNext}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors cursor-pointer"
              title="Câu tiếp theo (>)"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>

          {/* Right Controls: Speed & Settings */}
          <div className="flex items-center gap-2 relative">
            {/* Speed Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsSpeedOpen(!isSpeedOpen);
                  setIsSettingsOpen(false);
                }}
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                {settings.playbackSpeed}x
              </button>

              {isSpeedOpen && (
                <div className="absolute right-0 top-full mt-2 w-28 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-1.5 z-30 space-y-1">
                  {[0.75, 1.0, 1.25, 1.5].map((spd) => (
                    <button
                      key={spd}
                      type="button"
                      onClick={() => {
                        setSettings((prev) => ({
                          ...prev,
                          playbackSpeed: spd,
                        }));
                        setIsSpeedOpen(false);
                      }}
                      className={`w-full py-1.5 px-3 rounded-xl text-xs text-left font-bold cursor-pointer ${
                        settings.playbackSpeed === spd
                          ? "bg-rose-50 text-rose-600 dark:bg-rose-950 font-black"
                          : "text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                      }`}
                    >
                      {spd}x
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Settings Menu Button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsSettingsOpen(!isSettingsOpen);
                  setIsSpeedOpen(false);
                }}
                className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                  isSettingsOpen
                    ? "border-rose-500 bg-rose-50 text-rose-600 dark:bg-rose-950"
                    : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100"
                }`}
                title="Cài đặt luyện nghe"
              >
                <Settings className="size-4" />
              </button>

              {isSettingsOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-4 z-30 space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                    Cài đặt chế độ học
                  </h4>

                  <label className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                    <span>Tự động hiển thị từ</span>
                    <input
                      type="checkbox"
                      checked={settings.autoRevealWords}
                      onChange={(e) =>
                        setSettings((p) => ({
                          ...p,
                          autoRevealWords: e.target.checked,
                        }))
                      }
                      className="size-4 text-rose-600 rounded-md cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                    <span>Hiển thị Chú giải & Từ vựng</span>
                    <input
                      type="checkbox"
                      checked={settings.showExplanation}
                      onChange={(e) =>
                        setSettings((p) => ({
                          ...p,
                          showExplanation: e.target.checked,
                        }))
                      }
                      className="size-4 text-rose-600 rounded-md cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                    <span>Hiệu ứng âm thanh</span>
                    <input
                      type="checkbox"
                      checked={settings.soundEffects}
                      onChange={(e) =>
                        setSettings((p) => ({
                          ...p,
                          soundEffects: e.target.checked,
                        }))
                      }
                      className="size-4 text-rose-600 rounded-md cursor-pointer"
                    />
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 3. INPUT: NHỮNG GÌ BẠN NGHE ĐƯỢC (AUTO-RESIZE TEXTAREA) */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center justify-between">
            <span>Những gì bạn nghe được:</span>
            <span className="text-[11px] text-slate-400 lowercase font-normal">
              (Nhấn <strong>Enter</strong> để kiểm tra,{" "}
              <strong>Shift + Enter</strong> để xuống dòng)
            </span>
          </label>
          <textarea
            ref={textareaRef}
            rows={1}
            value={userInput}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder="Nhập toàn bộ câu hoặc các từ bạn nghe được tại đây..."
            className="w-full min-h-20 py-4 px-5 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/80 text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-rose-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none transition-all resize-none overflow-hidden leading-relaxed break-words"
          />
        </div>

        {/* 4. WORD TOKEN BOXES (***) */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Kết quả nhận diện từng từ:
          </span>

          <div className="flex flex-wrap gap-2 p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 min-h-16 items-center">
            {wordMatchStatuses.map((item, idx) => {
              if (item.isMatched) {
                return (
                  <span
                    key={idx}
                    className="inline-flex items-center px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border-2 border-emerald-400 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-700 text-sm font-black shadow-2xs animate-in zoom-in-95 duration-200"
                  >
                    {item.originalWord}
                  </span>
                );
              }

              // Exact character matching: Replace alphanumeric characters with *, keeping punctuation
              const placeholderText =
                difficulty === "easy"
                  ? `${item.originalWord[0]}${item.originalWord.slice(1).replace(/[a-zA-Z0-9]/g, "*")}`
                  : item.originalWord.replace(/[a-zA-Z0-9]/g, "*");

              return (
                <span
                  key={idx}
                  className="inline-flex items-center px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-400 text-xs font-mono font-bold select-none tracking-wider"
                  title={`Từ thứ ${idx + 1} (${item.cleanTarget.length} ký tự)`}
                >
                  {placeholderText}
                </span>
              );
            })}
          </div>
        </div>

        {/* 5. VIETNAMESE TRANSLATION */}
        <div className="rounded-2xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/40 dark:bg-blue-950/20 p-4 space-y-2">
          <div className="flex items-center gap-1.5 text-blue-700 dark:text-blue-300 text-xs font-black uppercase tracking-wider">
            <Lightbulb className="size-3.5 text-amber-500" />
            <span>Bản dịch nghĩa tiếng Việt:</span>
          </div>

          <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
            {sentence.translationVi || (
              <span className="italic text-muted-foreground font-normal">
                (Đang cập nhật bản dịch nghĩa)
              </span>
            )}
          </p>

          {/* Optional Explanation / Vocab */}
          {settings.showExplanation && sentence.explanation && (
            <div className="pt-2 border-t border-blue-100 dark:border-blue-900/40 text-xs text-slate-600 dark:text-slate-300">
              <strong className="text-blue-700 dark:text-blue-300">
                Chú giải:
              </strong>{" "}
              {sentence.explanation}
            </div>
          )}

          {settings.showExplanation &&
            sentence.keyVocab &&
            sentence.keyVocab.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {sentence.keyVocab.map((v, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-800 text-[11px] font-bold text-slate-700 dark:text-slate-300"
                  >
                    <strong className="text-blue-600 dark:text-blue-400">
                      {v.word}
                    </strong>{" "}
                    {v.phonetic ? `(${v.phonetic})` : ""}: {v.meaningVi}
                  </span>
                ))}
              </div>
            )}
        </div>
      </div>

      {/* 6. BOTTOM ACTION BUTTON */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
        <button
          type="button"
          disabled={currentIndex === 0}
          onClick={onPrevious}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-bold disabled:opacity-40 cursor-pointer"
        >
          <ArrowLeft className="size-4" />
          <span>Câu trước</span>
        </button>

        <div className="flex items-center gap-3">
          {!isSubmitted || !isCorrect ? (
            <button
              type="button"
              onClick={handleSubmitOrCheck}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-black shadow-lg shadow-rose-600/25 transition-all hover:scale-102 cursor-pointer active:scale-98"
            >
              <Check className="size-4" />
              <span>Kiểm tra đáp án</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onNext}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-black shadow-lg shadow-emerald-600/25 transition-all hover:scale-102 cursor-pointer active:scale-98"
            >
              <span>
                {currentIndex + 1 >= totalSentences
                  ? "Hoàn thành bài nghe"
                  : "Câu tiếp theo"}
              </span>
              <ArrowRight className="size-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
