"use client";

import { PracticePlayer } from "@/components/question";
import { Link, useRouter } from "@/i18n/routing";
import { questionService } from "@/services/question.service";
import { useToastStore } from "@/stores/useToastStore";
import type { GradeResult, PracticeAnswer, PublicQuestion } from "@/types/question";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  CheckCircle2,
  Clock3,
  HelpCircle,
  Play,
  RotateCcw,
  Sparkles,
  Target,
  Trophy,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function QuestionPracticePage() {
  const router = useRouter();
  const { addToast } = useToastStore();
  const [items, setItems] = useState<PublicQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [grade, setGrade] = useState<GradeResult | null>(null);
  const [gradeHistory, setGradeHistory] = useState<Record<number, GradeResult>>({});
  const [submitting, setSubmitting] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("lingoarena.practice");
      const parsed = raw ? (JSON.parse(raw) as PublicQuestion[]) : [];
      if (!parsed.length) {
        router.replace("/questions");
        return;
      }
      setItems(parsed);
    } catch {
      router.replace("/questions");
    }
  }, [router]);

  // Timer
  useEffect(() => {
    if (done || !items.length) return;
    const interval = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [done, items.length]);

  const current = items[index];

  const handleGrade = async (answerJson: PracticeAnswer) => {
    if (!current?.currentVersionId) return;
    setSubmitting(true);
    try {
      const result = await questionService.grade({
        questionId: current.id,
        questionVersionId: current.currentVersionId,
        answerJson,
      });
      setGrade(result);
      setGradeHistory((prev) => ({ ...prev, [index]: result }));
      if (result.isCorrect) setScore((prev) => prev + 1);
    } catch (err: any) {
      addToast(err?.message || "Không thể chấm câu hỏi", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = () => {
    if (index + 1 >= items.length) {
      setDone(true);
      return;
    }
    setIndex((prev) => prev + 1);
    setGrade(null);
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (!current && !done) return null;

  const percent = items.length ? Math.round(((index + (grade ? 1 : 0)) / items.length) * 100) : 0;
  const accuracy = items.length ? Math.round((score / items.length) * 100) : 0;

  // COMPLETED SCREEN
  if (done) {
    return (
      <div className="mx-auto max-w-2xl px-4 sm:px-6 py-12 space-y-8 pb-16">
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 sm:p-10 text-center shadow-2xl space-y-8 animate-in zoom-in-95 duration-300">
          {/* Trophy Header */}
          <div className="space-y-3">
            <div className="relative inline-block">
              <div className="w-20 h-20 rounded-3xl bg-linear-to-tr from-amber-400 to-amber-500 text-white flex items-center justify-center mx-auto shadow-xl shadow-amber-500/25 animate-bounce">
                <Trophy className="size-10" />
              </div>
              <Sparkles className="absolute -top-1 -right-1 size-6 text-amber-400 animate-pulse" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Hoàn Thành Phiên Luyện Tập!
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              Bạn vừa hoàn thành bộ {items.length} câu hỏi rèn luyện kỹ năng và dạng bài.
            </p>
          </div>

          {/* 3 Metrics Cards */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 text-center">
            <div className="p-4 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50">
              <div className="text-2xl sm:text-3xl font-black text-blue-700 dark:text-blue-300">
                {score} / {items.length}
              </div>
              <div className="text-xs text-slate-500 font-semibold mt-0.5">Số câu đúng</div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50">
              <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
                {accuracy}%
              </div>
              <div className="text-xs text-slate-500 font-semibold mt-0.5">Độ chính xác</div>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50/80 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/50">
              <div className="text-2xl sm:text-3xl font-black text-purple-600 dark:text-purple-400">
                {formatTime(seconds)}
              </div>
              <div className="text-xs text-slate-500 font-semibold mt-0.5">Thời gian làm</div>
            </div>
          </div>

          {/* Question Breakdown List */}
          <div className="space-y-3 text-left">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Chi tiết từng câu hỏi trong phiên:
            </h3>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {items.map((item, i) => {
                const itemGrade = gradeHistory[i];
                const isCorrect = itemGrade?.isCorrect;

                return (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="flex items-center justify-center size-6 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold shrink-0">
                        {i + 1}
                      </span>
                      <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {item.prompt}
                      </p>
                    </div>

                    <div className="shrink-0">
                      {itemGrade ? (
                        isCorrect ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">
                            <CheckCircle2 className="size-3.5" /> Đúng
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-rose-600 font-bold bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded-md">
                            <XCircle className="size-3.5" /> Sai
                          </span>
                        )
                      ) : (
                        <span className="text-slate-400">Chưa làm</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <button
              type="button"
              onClick={() => {
                setIndex(0);
                setGrade(null);
                setGradeHistory({});
                setScore(0);
                setDone(false);
                setSeconds(0);
              }}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-primary hover:bg-primary/90 text-white text-sm font-black shadow-lg shadow-primary/25 cursor-pointer"
            >
              <RotateCcw className="size-4" /> Luyện lại bộ này
            </button>
            <Link
              href="/questions"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl border-2 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm font-bold"
            >
              <ArrowLeft className="size-4" /> Về ngân hàng câu hỏi
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ACTIVE PRACTICE SCREEN
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8 space-y-6 pb-16">
      {/* SESSION TOP BAR */}
      <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between gap-4">
          {/* Back Button */}
          <button
            type="button"
            onClick={() => router.push("/questions")}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-500 hover:text-primary transition-colors cursor-pointer"
          >
            <ArrowLeft className="size-4" />
            <span>Thoát phiên</span>
          </button>

          {/* Live Timer */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
            <Clock3 className="size-3.5 text-primary" />
            <span>{formatTime(seconds)}</span>
          </div>

          {/* Current Question Progress */}
          <div className="text-xs font-black text-primary dark:text-[#7b9bee]">
            Câu {index + 1} / {items.length}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-linear-to-r from-primary to-[#405ea7] rounded-full transition-all duration-300"
            style={{ width: `${Math.max(percent, 5)}%` }}
          />
        </div>

        {/* Question Navigator Dots */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {items.map((_, i) => {
            const isCurrent = i === index;
            const pastGrade = gradeHistory[i];

            return (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setIndex(i);
                  setGrade(gradeHistory[i] || null);
                }}
                className={`flex items-center justify-center size-7 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  isCurrent
                    ? "bg-primary text-white shadow-md shadow-primary/25 scale-110 ring-2 ring-primary/40"
                    : pastGrade
                      ? pastGrade.isCorrect
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-300 dark:bg-emerald-950/40"
                        : "bg-rose-50 text-rose-700 border border-rose-300 dark:bg-rose-950/40"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                }`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* QUESTION PLAYER */}
      <PracticePlayer
        key={current.id}
        question={current}
        disabled={submitting || Boolean(grade)}
        onSubmit={handleGrade}
      />

      {/* GRADE RESULT FEEDBACK CARD */}
      {grade && (
        <div className="rounded-3xl border-2 border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-4 shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center gap-2.5">
            {grade.isCorrect ? (
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-black text-lg">
                <CheckCircle2 className="size-6 fill-emerald-500 text-white" />
                <span>Chính xác tuyệt đối!</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-black text-lg">
                <XCircle className="size-6 fill-rose-500 text-white" />
                <span>Chưa chính xác!</span>
              </div>
            )}
          </div>

          {grade.explanation && (
            <div className="space-y-1 pl-4 border-l-2 border-primary/30">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Lời giải & Giải thích chi tiết:
              </p>
              <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-200 whitespace-pre-wrap">
                {grade.explanation}
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={handleNext}
            className="w-full inline-flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-primary hover:bg-primary/90 text-white text-sm sm:text-base font-black shadow-lg shadow-primary/25 transition-all cursor-pointer active:scale-98"
          >
            <span>{index + 1 >= items.length ? "Xem kết quả bài luyện" : "Câu hỏi tiếp theo"}</span>
            <ArrowRight className="size-4" />
          </button>
        </div>
      )}
    </div>
  );
}
