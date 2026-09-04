"use client";

import { useToastStore } from "@/stores/useToastStore";
import type { GrammarQuizQuestion } from "@/types/grammar";
import {
  CheckCircle2,
  ChevronRight,
  Flame,
  Lightbulb,
  RotateCcw,
  Trophy,
  XCircle,
  Zap,
} from "lucide-react";
import { useState } from "react";

export function GrammarQuizArena({ questions = [] }: { questions?: GrammarQuizQuestion[] }) {
  const { addToast } = useToastStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentQ = questions[currentIndex];

  if (!questions.length) {
    return (
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-10 text-center space-y-2">
        <Zap className="size-10 mx-auto text-slate-400" />
        <p className="font-bold">Chưa có câu quiz ngữ pháp</p>
        <p className="text-sm text-slate-500">Quiz lấy từ examplesJson của cấu trúc đã xuất bản.</p>
      </div>
    );
  }

  const handleSelectOption = (idx: number) => {
    if (isAnswered || !currentQ) return;
    setSelectedOption(idx);
    setIsAnswered(true);
    const isCorrect = idx === currentQ.correctAnswerIndex;
    if (isCorrect) {
      setScore((s) => s + 10);
      setStreak((st) => st + 1);
      addToast("+10 Điểm! Câu trả lời chính xác.", "success");
    } else {
      setStreak(0);
      addToast("Chưa chính xác, hãy xem giải thích ngữ pháp bên dưới.", "info");
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((idx) => idx + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setStreak(0);
    setIsCompleted(false);
  };

  if (isCompleted) {
    const accuracy = Math.round((score / (questions.length * 10)) * 100);
    return (
      <div className="max-w-2xl mx-auto rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 sm:p-12 text-center space-y-6">
        <div className="size-20 rounded-3xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
          <Trophy className="size-10" />
        </div>
        <h3 className="text-2xl font-black">Hoàn Thành Đấu Trường Ngữ Pháp!</h3>
        <p className="text-sm text-slate-500">Bạn đã làm {questions.length} câu hỏi.</p>
        <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60">
            <span className="text-xs font-bold text-slate-400">Tổng điểm</span>
            <div className="text-2xl font-black text-blue-600 mt-1">{score} pts</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60">
            <span className="text-xs font-bold text-slate-400">Độ chính xác</span>
            <div className="text-2xl font-black text-emerald-600 mt-1">{accuracy}%</div>
          </div>
        </div>
        <button
          type="button"
          onClick={handleRestart}
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-blue-600 text-white font-black text-sm cursor-pointer"
        >
          <RotateCcw className="size-4" />
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-10 shadow-md space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-black">Đấu Trường Trắc Nghiệm Ngữ Pháp</h3>
          <p className="text-xs text-slate-400">
            Chủ đề: {currentQ.topicTitle} · {currentQ.level}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {streak > 1 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-black">
              <Flame className="size-3.5" /> Chuỗi {streak}
            </span>
          )}
          <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-mono font-bold">
            Câu {currentIndex + 1} / {questions.length}
          </span>
        </div>
      </div>

      <h4 className="text-base sm:text-lg font-black leading-relaxed">{currentQ.question}</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {currentQ.options.map((opt, idx) => {
          const isSelected = selectedOption === idx;
          const isCorrectAnswer = idx === currentQ.correctAnswerIndex;
          let btnStyle = "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900";
          if (isAnswered) {
            if (isCorrectAnswer) btnStyle = "border-emerald-500 bg-emerald-50 text-emerald-800";
            else if (isSelected) btnStyle = "border-rose-500 bg-rose-50 text-rose-800";
            else btnStyle = "opacity-50";
          }
          return (
            <button
              key={idx}
              type="button"
              disabled={isAnswered}
              onClick={() => handleSelectOption(idx)}
              className={`p-4 rounded-2xl border-2 text-left cursor-pointer flex items-center justify-between text-sm font-semibold ${btnStyle}`}
            >
              <span>{opt}</span>
              {isAnswered && isCorrectAnswer && <CheckCircle2 className="size-5 text-emerald-600" />}
              {isAnswered && isSelected && !isCorrectAnswer && <XCircle className="size-5 text-rose-600" />}
            </button>
          );
        })}
      </div>
      {isAnswered && (
        <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 space-y-1.5 text-xs">
          <div className="flex items-center gap-1.5 text-blue-700 font-black uppercase text-[11px]">
            <Lightbulb className="size-3.5 text-amber-500" />
            Giải thích
          </div>
          <p>{currentQ.explanationVi}</p>
        </div>
      )}
      {isAnswered && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleNextQuestion}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 text-white font-black text-xs cursor-pointer"
          >
            {currentIndex + 1 < questions.length ? "Câu tiếp theo" : "Xem kết quả"}
            <ChevronRight className="size-4" />
          </button>
        </div>
      )}
    </div>
  );
}
