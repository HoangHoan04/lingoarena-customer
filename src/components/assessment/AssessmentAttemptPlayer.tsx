"use client";

import { PracticePlayer } from "@/components/question";
import { Button } from "@/components/ui/button";
import { assessmentService } from "@/services/assessment.service";
import { useToastStore } from "@/stores/useToastStore";
import type { AssessmentAttempt, AttemptQuestion } from "@/types/assessment";
import type { PracticeAnswer } from "@/types/question";
import { ArrowLeft, CheckCircle2, Clock, Loader2, Send, Trophy } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

function formatTime(totalSeconds: number) {
  const safe = Math.max(0, totalSeconds);
  const hours = Math.floor(safe / 3600);
  const mins = Math.floor((safe % 3600) / 60);
  const secs = safe % 60;
  if (hours) {
    return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

function flattenQuestions(attempt?: AssessmentAttempt | null): AttemptQuestion[] {
  const fromSections = (attempt?.attemptSections || []).flatMap((section) => section.attemptQuestions || []);
  const source = fromSections.length ? fromSections : attempt?.attemptQuestions || [];
  return [...source].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
}

export default function AssessmentAttemptPlayer({
  initialAttempt,
  onBack,
}: {
  initialAttempt: AssessmentAttempt;
  onBack: () => void;
}) {
  const { addToast } = useToastStore();
  const [attempt, setAttempt] = useState(initialAttempt);
  const [index, setIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(() =>
    Math.max(0, Math.floor((new Date(initialAttempt.expiresAt).getTime() - Date.now()) / 1000)),
  );

  const questions = useMemo(() => flattenQuestions(attempt), [attempt]);
  const current = questions[index];
  const answeredIds = useMemo(
    () => new Set(questions.filter((item) => item.answer?.answerJson).map((item) => item.id)),
    [questions],
  );
  const isFinished = ["SUBMITTED", "GRADED"].includes(attempt.status);

  useEffect(() => {
    if (isFinished) return;
    const timer = setInterval(() => {
      const next = Math.max(0, Math.floor((new Date(attempt.expiresAt).getTime() - Date.now()) / 1000));
      setTimeLeft(next);
      if (next === 0) void handleSubmit();
    }, 1000);
    return () => clearInterval(timer);
  }, [attempt.expiresAt, isFinished]);

  useEffect(() => {
    if (isFinished) return;
    const heartbeat = setInterval(() => {
      assessmentService.heartbeat(attempt.id).catch(() => undefined);
    }, 30000);
    return () => clearInterval(heartbeat);
  }, [attempt.id, isFinished]);

  const refreshAttempt = async () => {
    const next = await assessmentService.attempt(attempt.id);
    setAttempt(next);
  };

  const handleAnswer = async (answerJson: PracticeAnswer) => {
    if (!current) return;
    setSaving(true);
    try {
      await assessmentService.saveAnswer(attempt.id, { attemptQuestionId: current.id, answerJson });
      await refreshAttempt();
      addToast("Đã lưu câu trả lời", "success");
    } catch (err: any) {
      addToast(err?.message || "Không thể lưu câu trả lời", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (submitting || isFinished) return;
    setSubmitting(true);
    try {
      const result = await assessmentService.submit(attempt.id);
      setAttempt(result);
      addToast("Đã nộp bài và chấm điểm", "success");
    } catch (err: any) {
      addToast(err?.message || "Không thể nộp bài", "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (!questions.length) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 text-center">
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8">
          <p className="text-sm text-slate-500">Đề này chưa có câu hỏi khả dụng.</p>
          <Button className="mt-4" variant="outline" onClick={onBack}>
            Quay lại
          </Button>
        </div>
      </div>
    );
  }

  if (isFinished) {
    const correct = questions.filter((item) => item.answer?.isCorrect === true).length;
    return (
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10 space-y-6">
        <div className="rounded-3xl bg-linear-to-r from-[#1b2950] via-[#2b417e] to-[#1b2950] text-white p-8 shadow-2xl space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-amber-400 text-white flex items-center justify-center shadow-xl">
            <Trophy className="size-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">Kết quả bài làm</h1>
          <p className="text-sm text-slate-200">
            Đúng {correct}/{questions.length} câu · Tổng điểm {Number(attempt.totalScore || 0)}
          </p>
        </div>

        <div className="space-y-3">
          {questions.map((item, idx) => (
            <div
              key={item.id}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="font-bold text-sm text-slate-900 dark:text-white">
                  Câu {idx + 1}: {item.questionSnapshotJson.prompt}
                </p>
                <span
                  className={`text-xs font-black px-2.5 py-1 rounded-full ${
                    item.answer?.isCorrect
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-rose-100 text-rose-700"
                  }`}
                >
                  {item.answer?.isCorrect ? "Đúng" : "Sai / chờ chấm"}
                </span>
              </div>
              {item.answer?.scoreAwarded != null && (
                <p className="mt-2 text-xs text-slate-500">Điểm: {Number(item.answer.scoreAwarded)}</p>
              )}
            </div>
          ))}
        </div>

        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="size-4" />
          Quay lại
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 sm:py-10 space-y-6">
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 p-4 flex flex-wrap items-center justify-between gap-3 shadow-md">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#2b417e] dark:text-[#7b9bee]">
            {attempt.assessment?.title || "Bài đánh giá"}
          </p>
          <h1 className="text-lg font-black text-slate-900 dark:text-white">
            Câu {index + 1}/{questions.length}
          </h1>
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-red-50 dark:bg-red-950/40 px-4 py-2 text-red-600 dark:text-red-400 font-mono font-bold">
          <Clock className="size-4" />
          {formatTime(timeLeft)}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <PracticePlayer
            key={current.id}
            question={current.questionSnapshotJson}
            disabled={saving}
            onSubmit={handleAnswer}
          />
        </div>

        <div className="lg:col-span-4 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xl space-y-5 h-fit">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-900 dark:text-white">Bảng câu hỏi</span>
            <span className="text-slate-500">
              Đã làm: <strong>{answeredIds.size}/{questions.length}</strong>
            </span>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {questions.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setIndex(idx)}
                className={`h-10 rounded-xl text-xs font-bold border ${
                  idx === index
                    ? "border-[#2b417e] bg-[#2b417e] text-white"
                    : answeredIds.has(item.id)
                      ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                      : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={index === 0}
              onClick={() => setIndex((prev) => Math.max(0, prev - 1))}
              className="flex-1"
            >
              Trước
            </Button>
            <Button
              disabled={index >= questions.length - 1}
              onClick={() => setIndex((prev) => Math.min(questions.length - 1, prev + 1))}
              className="flex-1 bg-[#2b417e] hover:bg-[#1e2f5e]"
            >
              Sau
            </Button>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full bg-emerald-600 hover:bg-emerald-700"
          >
            {submitting ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
            Nộp bài
          </Button>

          {answeredIds.has(current.id) && (
            <div className="text-xs text-emerald-600 flex items-center gap-1.5">
              <CheckCircle2 className="size-3.5" />
              Câu hiện tại đã được lưu
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
