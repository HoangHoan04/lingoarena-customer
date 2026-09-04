"use client";

import { questionService } from "@/services/question.service";
import { useToastStore } from "@/stores/useToastStore";
import type { ParaphraseExercise } from "@/types/writing";
import {
  CheckCircle2,
  HelpCircle,
  Lightbulb,
  Repeat,
  Send,
} from "lucide-react";
import { useState } from "react";

export function WritingParaphraseStudio({ exercises = [] }: { exercises?: ParaphraseExercise[] }) {
  const { addToast } = useToastStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState("");
  const currentExercise = exercises[currentIndex];

  if (!exercises.length || !currentExercise) {
    return (
      <div className="max-w-3xl mx-auto rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-10 text-center space-y-2">
        <Repeat className="size-10 mx-auto text-slate-400" />
        <p className="font-bold">Chưa có bài paraphrase</p>
        <p className="text-sm text-slate-500">Danh sách lấy từ câu FILL_BLANK đã xuất bản.</p>
      </div>
    );
  }

  const handleCheckAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) {
      addToast("Vui lòng nhập câu viết lại của bạn", "info");
      return;
    }
    try {
      const result = await questionService.grade({
        questionId: currentExercise.id,
        answerJson: { value: userInput, blanks: [userInput] },
      });
      setIsSubmitted(true);
      setIsCorrect(Boolean(result.isCorrect));
      setFeedback(result.explanation || "");
      addToast(result.isCorrect ? "Chính xác." : "Chưa khớp đáp án hệ thống.", result.isCorrect ? "success" : "info");
    } catch (err: any) {
      addToast(err?.message || "Không chấm được câu này.", "error");
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < exercises.length) {
      setCurrentIndex((idx) => idx + 1);
      setUserInput("");
      setIsSubmitted(false);
      setIsCorrect(false);
      setShowHint(false);
      setFeedback("");
    } else {
      addToast("Bạn đã hoàn thành các bài luyện viết câu.", "success");
    }
  };

  return (
    <div className="max-w-3xl mx-auto rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-10 shadow-md space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-black">Phòng Luyện Viết Câu & Paraphrase</h3>
          <p className="text-xs text-slate-400">Câu {currentIndex + 1} / {exercises.length}</p>
        </div>
      </div>
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border space-y-2">
        <span className="text-[11px] font-bold text-slate-400 uppercase">Câu gốc</span>
        <p className="text-sm font-bold">"{currentExercise.original}"</p>
      </div>
      {(currentExercise.keyword || currentExercise.targetStructure) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {currentExercise.keyword ? (
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200">
              <span className="font-bold uppercase text-[10px]">Từ khóa</span>
              <div className="text-sm font-black">{currentExercise.keyword}</div>
            </div>
          ) : null}
          {currentExercise.targetStructure ? (
            <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-200">
              <span className="font-bold uppercase text-[10px]">Gợi ý</span>
              <div className="text-xs font-semibold">{currentExercise.targetStructure}</div>
            </div>
          ) : null}
        </div>
      )}
      <form onSubmit={handleCheckAnswer} className="space-y-4">
        <textarea
          rows={3}
          value={userInput}
          onChange={(e) => {
            setUserInput(e.target.value);
            setIsSubmitted(false);
          }}
          placeholder="Nhập câu viết lại..."
          className="w-full p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
        />
        {isSubmitted && (
          <div className={`p-4 rounded-2xl border text-xs ${isCorrect ? "bg-emerald-50 border-emerald-300" : "bg-amber-50 border-amber-300"}`}>
            <div className="flex items-center gap-2 font-black text-sm">
              {isCorrect ? <CheckCircle2 className="size-4 text-emerald-600" /> : <Lightbulb className="size-4 text-amber-600" />}
              <span>{isCorrect ? "Chính xác" : "Xem giải thích"}</span>
            </div>
            {currentExercise.sampleAnswers.map((ans, idx) => (
              <p key={idx} className="font-mono pl-2 border-l-2 border-emerald-500 mt-2">• {ans}</p>
            ))}
            {(feedback || currentExercise.explanationVi) && (
              <p className="pt-2">{feedback || currentExercise.explanationVi}</p>
            )}
          </div>
        )}
        <div className="flex items-center justify-between">
          <button type="button" onClick={() => setShowHint(!showHint)} className="text-xs font-bold text-slate-500 flex items-center gap-1">
            <HelpCircle className="size-3.5" />
            {showHint ? "Ẩn gợi ý" : "Xem gợi ý"}
          </button>
          {!isSubmitted ? (
            <button type="submit" className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 text-white text-xs font-black cursor-pointer">
              <Send className="size-3.5" /> Kiểm tra
            </button>
          ) : (
            <button type="button" onClick={handleNext} className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-purple-600 text-white text-xs font-black cursor-pointer">
              Câu tiếp theo
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
