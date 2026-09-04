"use client";

import type { VstepQuestion } from "@/types/vstep";
import { ArrowLeft, ArrowRight, CheckCircle2, Clock, Flag, Mic, MicOff, Network, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

interface VstepSpeakingViewProps {
  question: VstepQuestion;
  currentIndex: number;
  totalQuestions: number;
  selectedAnswer?: any;
  isFlagged: boolean;
  onSelectAnswer: (value: any) => void;
  onToggleFlag: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

export function VstepSpeakingView({
  question,
  currentIndex,
  totalQuestions,
  selectedAnswer = {},
  isFlagged,
  onSelectAnswer,
  onToggleFlag,
  onNext,
  onPrevious,
}: VstepSpeakingViewProps) {
  const [activeSubIndex, setActiveSubIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [prepSeconds, setPrepSeconds] = useState(0);
  const [isPrepping, setIsPrepping] = useState(false);

  const subQuestions = question.subQuestions || [];
  const currentSub = subQuestions[activeSubIndex] || { id: "vstep-spk", prompt: question.prompt };
  const targetSpeakTime = question.speakTimeSeconds || 60;

  useEffect(() => {
    if (!isPrepping || prepSeconds <= 0) {
      if (isPrepping && prepSeconds <= 0) {
        setIsPrepping(false);
        setIsRecording(true);
      }
      return;
    }
    const timer = setInterval(() => {
      setPrepSeconds((s) => s - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isPrepping, prepSeconds]);

  useEffect(() => {
    if (!isRecording) return;
    const timer = setInterval(() => {
      setRecordingSeconds((s) => {
        if (s + 1 >= targetSpeakTime) {
          setIsRecording(false);
          onSelectAnswer({ ...selectedAnswer, [currentSub.id]: true });
          return targetSpeakTime;
        }
        return s + 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isRecording, targetSpeakTime, currentSub.id, onSelectAnswer, selectedAnswer]);

  const handleStart = () => {
    const prep = question.prepTimeSeconds || 5;
    setIsRecording(false);
    setRecordingSeconds(0);
    setPrepSeconds(prep);
    setIsPrepping(true);
  };

  const handleStop = () => {
    setIsRecording(false);
    setIsPrepping(false);
    onSelectAnswer({ ...selectedAnswer, [currentSub.id]: true });
  };

  const isRecorded = Boolean(selectedAnswer[currentSub.id]);

  return (
    <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 text-xs font-black uppercase">
            {question.partTitle || `VSTEP Speaking Part ${question.part}`}
          </span>
          <span className="text-xs font-bold text-slate-400">
            Part {currentIndex + 1} / {totalQuestions}
          </span>
        </div>

        <button
          type="button"
          onClick={onToggleFlag}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-500 cursor-pointer"
        >
          <Flag className={`size-3.5 ${isFlagged ? "fill-amber-400 text-amber-500" : ""}`} />
          <span>{isFlagged ? "Đã gắn cờ" : "Gắn cờ"}</span>
        </button>
      </div>

      {/* PART 3: MINDMAP VIEW */}
      {question.part === 3 && question.cueCardPoints ? (
        <div className="rounded-3xl border-2 border-emerald-300 dark:border-emerald-900 bg-emerald-50/40 dark:bg-emerald-950/20 p-6 space-y-4">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
            <Network className="size-4" />
            <span className="text-xs font-black uppercase tracking-wider">
              Sơ đồ phát triển ý tưởng (Mindmap)
            </span>
          </div>

          <h2 className="text-lg font-black text-slate-900 dark:text-white">
            {question.prompt}
          </h2>

          <div className="grid sm:grid-cols-2 gap-2.5 pt-2">
            {question.cueCardPoints.map((point, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-white dark:bg-slate-900 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2"
              >
                <span className="flex items-center justify-center size-5 rounded-full bg-emerald-600 text-white text-[10px] font-black shrink-0">
                  {idx + 1}
                </span>
                <span>{point}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* PART 1 & PART 2 */
        <div className="space-y-4">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
            {question.prompt}
          </h2>

          {subQuestions.length > 1 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                {subQuestions.map((sq, idx) => (
                  <button
                    key={sq.id}
                    type="button"
                    onClick={() => {
                      setActiveSubIndex(idx);
                      setIsRecording(false);
                      setIsPrepping(false);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${
                      idx === activeSubIndex
                        ? "bg-emerald-600 text-white shadow-xs"
                        : Boolean(selectedAnswer[sq.id])
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                    }`}
                  >
                    Câu hỏi {idx + 1} {Boolean(selectedAnswer[sq.id]) ? "✓" : ""}
                  </button>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/20 border-2 border-emerald-200 dark:border-emerald-900 text-sm font-bold text-slate-900 dark:text-white">
                {currentSub.prompt}
              </div>
            </div>
          )}
        </div>
      )}

      {/* RECORDING STUDIO */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 p-6 text-center space-y-4">
        {isPrepping ? (
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 text-xs font-bold animate-pulse">
              <Clock className="size-3.5" />
              <span>Thời gian chuẩn bị: {prepSeconds} giây</span>
            </div>
            <p className="text-xs text-slate-400">
              Hãy suy nghĩ và chuẩn bị luận điểm, micro sẽ tự động bật sau khi đếm ngược.
            </p>
          </div>
        ) : isRecording ? (
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 text-xs font-black animate-pulse">
              <span className="size-2.5 rounded-full bg-emerald-600 animate-ping" />
              <span>Đang ghi âm bài nói: {recordingSeconds}s / {targetSpeakTime}s</span>
            </div>

            <div className="flex items-center justify-center gap-1 h-8">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((bar) => (
                <span
                  key={bar}
                  className="w-1.5 bg-emerald-600 rounded-full animate-pulse"
                  style={{
                    height: `${Math.sin(bar + Date.now()) * 14 + 16}px`,
                    animationDuration: `${0.3 + (bar % 4) * 0.15}s`,
                  }}
                />
              ))}
            </div>
          </div>
        ) : isRecorded ? (
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
              <CheckCircle2 className="size-4" />
              <span>Đã lưu bài nói thành công ({recordingSeconds || targetSpeakTime}s)</span>
            </div>
            <p className="text-[11px] text-slate-400">Bạn có thể bấm "Ghi âm lại" để thực hiện lại phần này.</p>
          </div>
        ) : (
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
              Sẵn sàng trả lời bài thi Nói VSTEP (Thời gian nói: {targetSpeakTime}s)
            </p>
          </div>
        )}

        <div className="flex items-center justify-center gap-3 pt-2">
          {!isRecording && !isPrepping ? (
            <button
              type="button"
              onClick={handleStart}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-black shadow-lg shadow-emerald-600/25 cursor-pointer active:scale-95"
            >
              <Mic className="size-4" />
              <span>{isRecorded ? "Ghi âm lại" : "Bắt đầu bài nói"}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleStop}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-800 text-white text-xs sm:text-sm font-bold shadow-md cursor-pointer"
            >
              <MicOff className="size-4" />
              <span>Dừng & Lưu bài nói</span>
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <button
          type="button"
          disabled={currentIndex === 0}
          onClick={onPrevious}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl border text-xs font-bold disabled:opacity-40"
        >
          <ArrowLeft className="size-4" /> Part trước
        </button>

        <button
          type="button"
          onClick={onNext}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-md cursor-pointer"
        >
          <span>{currentIndex + 1 >= totalQuestions ? "Kiểm tra toàn bộ phần Nói" : "Part tiếp theo"}</span>
          <ArrowRight className="size-4" />
        </button>
      </div>
    </div>
  );
}
