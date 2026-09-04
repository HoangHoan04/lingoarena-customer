"use client";

import type { ToeicQuestion } from "@/types/toeic";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  Flag,
  Mic,
  MicOff,
} from "lucide-react";
import { useEffect, useState } from "react";

interface ToeicSpeakingStudioProps {
  question: ToeicQuestion;
  currentIndex: number;
  totalQuestions: number;
  selectedAnswer?: any;
  isFlagged: boolean;
  onSelectAnswer: (value: any) => void;
  onToggleFlag: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

export function ToeicSpeakingStudio({
  question,
  currentIndex,
  totalQuestions,
  selectedAnswer = {},
  isFlagged,
  onSelectAnswer,
  onToggleFlag,
  onNext,
  onPrevious,
}: ToeicSpeakingStudioProps) {
  const [activeSubIndex, setActiveSubIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [prepSeconds, setPrepSeconds] = useState(0);
  const [isPrepping, setIsPrepping] = useState(false);

  const subQuestions = question.subQuestions || [];
  const currentSub = subQuestions[activeSubIndex];
  const targetSpeakTime =
    currentSub?.speakTimeSeconds || question.speakTimeSeconds || 45;
  const currentQId = currentSub ? currentSub.id : question.id;

  // Prep timer
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
          onSelectAnswer({ ...selectedAnswer, [currentQId]: true });
          return targetSpeakTime;
        }
        return s + 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [
    isRecording,
    targetSpeakTime,
    currentQId,
    onSelectAnswer,
    selectedAnswer,
  ]);

  const handleStart = () => {
    const prep = currentSub?.prepTimeSeconds || question.prepTimeSeconds || 45;
    setIsRecording(false);
    setRecordingSeconds(0);
    setPrepSeconds(prep);
    setIsPrepping(true);
  };

  const handleStop = () => {
    setIsRecording(false);
    setIsPrepping(false);
    onSelectAnswer({ ...selectedAnswer, [currentQId]: true });
  };

  const isRecorded = Boolean(selectedAnswer[currentQId]);

  return (
    <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 text-xs font-black uppercase">
            TOEIC Speaking (
            {question.partTitle || `Question ${question.number}`})
          </span>
          <span className="text-xs font-bold text-slate-400">
            Câu {currentIndex + 1} / {totalQuestions}
          </span>
        </div>

        <button
          type="button"
          onClick={onToggleFlag}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-500 cursor-pointer"
        >
          <Flag
            className={`size-3.5 ${isFlagged ? "fill-amber-400 text-amber-500" : ""}`}
          />
          <span>{isFlagged ? "Đã gắn cờ" : "Gắn cờ"}</span>
        </button>
      </div>

      {/* Instructions & Prompt */}
      <div className="space-y-3">
        {question.instructions && (
          <p className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">
            {question.instructions}
          </p>
        )}
        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
          {question.prompt}
        </h2>
      </div>

      {/* QUESTIONS 1-2: TEXT ALOUD */}
      {question.passageText && (
        <div className="p-6 rounded-2xl border-2 border-blue-200 dark:border-blue-900/50 bg-blue-50/40 dark:bg-blue-950/20 font-serif text-sm sm:text-base leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-wrap">
          {question.passageText}
        </div>
      )}

      {/* QUESTIONS 3-4: PICTURE DESCRIPTION */}
      {question.imageUrl && (
        <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 max-h-80 flex items-center justify-center bg-slate-100 dark:bg-slate-800">
          <img
            src={question.imageUrl}
            alt="TOEIC Speaking Picture"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* QUESTIONS 8-10: SCHEDULE / AGENDA TABLE */}
      {question.scheduleText && (
        <div className="rounded-2xl border border-indigo-200 dark:border-indigo-900 bg-indigo-50/40 dark:bg-indigo-950/20 p-5 space-y-2">
          <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 text-xs font-black uppercase tracking-wider">
            <Calendar className="size-4" />
            <span>Tài liệu lịch trình hội nghị (Schedule Document)</span>
          </div>
          <pre className="font-sans text-xs sm:text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
            {question.scheduleText}
          </pre>
        </div>
      )}

      {/* SUBQUESTIONS (For Q5-7 & Q8-10) */}
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
                    ? "bg-brand text-white shadow-xs font-black"
                    : Boolean(selectedAnswer[sq.id])
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                }`}
              >
                Câu {idx + (question.number === 5 ? 5 : 8)}{" "}
                {Boolean(selectedAnswer[sq.id]) ? "✓" : ""}
              </button>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-sm font-bold text-slate-900 dark:text-white">
            {currentSub.prompt}
          </div>
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
              Hãy chuẩn bị câu trả lời, microphone sẽ tự động ghi âm sau đếm
              ngược.
            </p>
          </div>
        ) : isRecording ? (
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 text-xs font-black animate-pulse">
              <span className="size-2.5 rounded-full bg-blue-600 animate-ping" />
              <span>
                Đang thu âm: {recordingSeconds}s / {targetSpeakTime}s
              </span>
            </div>

            <div className="flex items-center justify-center gap-1 h-8">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((bar) => (
                <span
                  key={bar}
                  className="w-1.5 bg-blue-600 rounded-full animate-pulse"
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
              <span>Đã lưu câu trả lời TOEIC Speaking</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Bạn có thể bấm "Ghi âm lại" để thử lại.
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
              Sẵn sàng trả lời TOEIC Speaking (Thời gian nói: {targetSpeakTime}
              s)
            </p>
          </div>
        )}

        <div className="flex items-center justify-center gap-3 pt-2">
          {!isRecording && !isPrepping ? (
            <button
              type="button"
              onClick={handleStart}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand hover:bg-brand/90 text-white text-xs sm:text-sm font-black shadow-lg shadow-brand/25 cursor-pointer active:scale-95"
            >
              <Mic className="size-4" />
              <span>{isRecorded ? "Ghi âm lại" : "Bắt đầu trả lời"}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleStop}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-800 text-white text-xs sm:text-sm font-bold shadow-md cursor-pointer"
            >
              <MicOff className="size-4" />
              <span>Dừng & Lưu câu trả lời</span>
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
          <ArrowLeft className="size-4" /> Câu trước
        </button>

        <button
          type="button"
          onClick={onNext}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand hover:bg-brand/90 text-white text-xs font-black shadow-md cursor-pointer"
        >
          <span>
            {currentIndex + 1 >= totalQuestions
              ? "Kiểm tra toàn bộ phần Nói"
              : "Câu tiếp theo"}
          </span>
          <ArrowRight className="size-4" />
        </button>
      </div>
    </div>
  );
}
