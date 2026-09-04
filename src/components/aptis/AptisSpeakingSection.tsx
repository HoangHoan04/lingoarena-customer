"use client";

import type { AptisQuestion } from "@/types/aptis";
import { ArrowLeft, ArrowRight, Clock, Flag, Mic, MicOff, Play, RotateCcw, Volume2, Zap } from "lucide-react";
import { useEffect, useState } from "react";

interface AptisSpeakingSectionProps {
  question: AptisQuestion;
  currentIndex: number;
  totalQuestions: number;
  selectedAnswer?: any;
  isFlagged: boolean;
  onSelectAnswer: (value: any) => void;
  onToggleFlag: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

export function AptisSpeakingSection({
  question,
  currentIndex,
  totalQuestions,
  selectedAnswer = {},
  isFlagged,
  onSelectAnswer,
  onToggleFlag,
  onNext,
  onPrevious,
}: AptisSpeakingSectionProps) {
  const [activeSubIndex, setActiveSubIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [prepSeconds, setPrepSeconds] = useState(0);
  const [isPrepping, setIsPrepping] = useState(false);

  const subQuestions = question.subQuestions || [];
  const currentSub = subQuestions[activeSubIndex] || { id: "spk-sub", prompt: question.prompt };
  const targetSpeakTime = question.speakTimeSeconds || 30;

  // Prep timer countdown
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

  // Recording timer
  useEffect(() => {
    if (!isRecording) return;
    const timer = setInterval(() => {
      setRecordingSeconds((s) => {
        if (s + 1 >= targetSpeakTime) {
          setIsRecording(false);
          // Mark as recorded
          onSelectAnswer({ ...selectedAnswer, [currentSub.id]: true });
          return targetSpeakTime;
        }
        return s + 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isRecording, targetSpeakTime, currentSub.id, onSelectAnswer, selectedAnswer]);

  const handleStartSpeaking = () => {
    const prepTime = question.prepTimeSeconds || 5;
    setIsRecording(false);
    setRecordingSeconds(0);
    setPrepSeconds(prepTime);
    setIsPrepping(true);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setIsPrepping(false);
    onSelectAnswer({ ...selectedAnswer, [currentSub.id]: true });
  };

  const isRecorded = Boolean(selectedAnswer[currentSub.id]);

  return (
    <div className="space-y-6">
      {/* SPEAKING MAIN CARD */}
      <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 text-xs font-black uppercase">
              Speaking Part {question.part}
            </span>
            <span className="text-xs font-bold text-slate-400">
              Part {currentIndex + 1} / {totalQuestions}
            </span>
          </div>

          <button
            type="button"
            onClick={onToggleFlag}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500 cursor-pointer"
          >
            <Flag className={`size-3.5 ${isFlagged ? "fill-amber-400 text-amber-500" : ""}`} />
            <span>{isFlagged ? "Đã đánh dấu" : "Đánh dấu"}</span>
          </button>
        </div>

        {/* Instructions & Prompt */}
        <div className="space-y-2">
          {question.instructions && (
            <p className="text-xs text-slate-400 italic">{question.instructions}</p>
          )}
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
            {question.prompt}
          </h2>
        </div>

        {/* PICTURES (If Part 2, Part 3, Part 4) */}
        {(question.imageUrl || question.image2Url) && (
          <div className="grid sm:grid-cols-2 gap-4">
            {question.imageUrl && (
              <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 flex items-center justify-center max-h-64">
                <img
                  src={question.imageUrl}
                  alt="Speaking picture 1"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            {question.image2Url && (
              <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 flex items-center justify-center max-h-64">
                <img
                  src={question.image2Url}
                  alt="Speaking picture 2"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        )}

        {/* SUBQUESTIONS STEPPER (For Part 1, 2, 3) */}
        {subQuestions.length > 1 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {subQuestions.map((sq, sIdx) => {
                const isSubDone = Boolean(selectedAnswer[sq.id]);
                const isSubActive = sIdx === activeSubIndex;
                return (
                  <button
                    key={sq.id}
                    type="button"
                    onClick={() => {
                      setActiveSubIndex(sIdx);
                      setIsRecording(false);
                      setIsPrepping(false);
                      setRecordingSeconds(0);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isSubActive
                        ? "bg-rose-600 text-white shadow-xs"
                        : isSubDone
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                    }`}
                  >
                    Câu hỏi {sIdx + 1} {isSubDone ? "✓" : ""}
                  </button>
                );
              })}
            </div>

            {/* Active Question Box */}
            <div className="p-4 rounded-2xl border-2 border-rose-200 dark:border-rose-900/50 bg-rose-50/40 dark:bg-rose-950/20 text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              {currentSub.prompt}
            </div>
          </div>
        )}

        {/* MICROPHONE RECORDING SIMULATOR */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 p-6 text-center space-y-4">
          {/* Status Display */}
          {isPrepping ? (
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 text-xs font-bold animate-pulse">
                <Clock className="size-3.5" />
                <span>Thời gian chuẩn bị: {prepSeconds}s</span>
              </div>
              <p className="text-xs text-slate-400">
                Hãy suy nghĩ câu trả lời, micro sẽ tự động bật sau khi đếm ngược kết thúc.
              </p>
            </div>
          ) : isRecording ? (
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 text-xs font-black animate-pulse">
                <span className="size-2.5 rounded-full bg-rose-600 animate-ping" />
                <span>Đang ghi âm: {recordingSeconds}s / {targetSpeakTime}s</span>
              </div>

              {/* Live Wave Animation */}
              <div className="flex items-center justify-center gap-1 h-8">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((bar) => (
                  <span
                    key={bar}
                    className="w-1.5 bg-rose-600 rounded-full animate-pulse"
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
                <Mic className="size-4" />
                <span>Đã ghi âm thành công ({recordingSeconds || targetSpeakTime}s)</span>
              </div>
              <p className="text-[11px] text-slate-400">Bạn có thể bấm "Ghi âm lại" nếu muốn thử lại.</p>
            </div>
          ) : (
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
                Sẵn sàng trả lời (Thời gian nói: {targetSpeakTime} giây)
              </p>
              <p className="text-[11px] text-slate-400">Bấm nút bên dưới để bắt đầu quá trình ghi âm.</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-3 pt-2">
            {!isRecording && !isPrepping ? (
              <button
                type="button"
                onClick={handleStartSpeaking}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-black shadow-lg shadow-rose-600/25 transition-all cursor-pointer active:scale-95"
              >
                <Mic className="size-4" />
                <span>{isRecorded ? "Ghi âm lại câu này" : "Bắt đầu trả lời"}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleStopRecording}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-900 text-white text-xs sm:text-sm font-bold shadow-md cursor-pointer"
              >
                <MicOff className="size-4" />
                <span>Dừng & Lưu câu trả lời</span>
              </button>
            )}
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            disabled={currentIndex === 0}
            onClick={onPrevious}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold disabled:opacity-40"
          >
            <ArrowLeft className="size-4" /> Câu trước
          </button>
          <button
            type="button"
            onClick={onNext}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black shadow-md cursor-pointer"
          >
            <span>{currentIndex + 1 >= totalQuestions ? "Kiểm tra & Nộp toàn bộ bài thi" : "Part tiếp theo"}</span>
            <ArrowRight className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
