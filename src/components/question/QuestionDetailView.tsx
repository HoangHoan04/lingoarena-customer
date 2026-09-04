"use client";

import { Link, useRouter } from "@/i18n/routing";
import { cefrBadgeClass } from "@/lib/vocab";
import { pickLocaleText } from "@/lib/locale-text";
import { questionService } from "@/services/question.service";
import { useToastStore } from "@/stores/useToastStore";
import type { GradeResult, PracticeAnswer, PublicQuestion } from "@/types/question";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  Copy,
  FileQuestion,
  Headphones,
  HelpCircle,
  Lightbulb,
  Play,
  RotateCcw,
  Share2,
  Sparkles,
  Volume2,
  XCircle,
} from "lucide-react";
import { useLocale } from "next-intl";
import { useState } from "react";
import PracticePlayer from "./PracticePlayer";

interface QuestionDetailViewProps {
  question: PublicQuestion;
  nextQuestionId?: string | null;
  previousQuestionId?: string | null;
}

export default function QuestionDetailView({
  question,
  nextQuestionId,
  previousQuestionId,
}: QuestionDetailViewProps) {
  const locale = useLocale();
  const router = useRouter();
  const { addToast } = useToastStore();
  const [grade, setGrade] = useState<GradeResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [explanationLang, setExplanationLang] = useState<"vi" | "en">("vi");

  const handleGrade = async (answerJson: PracticeAnswer) => {
    if (!question.currentVersionId) {
      addToast("Phiên bản câu hỏi không khả dụng để chấm điểm", "error");
      return;
    }
    setSubmitting(true);
    try {
      const res = await questionService.grade({
        questionId: question.id,
        questionVersionId: question.currentVersionId,
        answerJson,
      });
      setGrade(res);
      if (res.isCorrect) {
        addToast("Chúc mừng! Bạn đã trả lời chính xác!", "success");
      } else {
        addToast("Chưa chính xác, hãy xem lời giải chi tiết bên dưới.", "info");
      }
    } catch (err: any) {
      addToast(err?.message || "Không thể chấm câu hỏi này", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setGrade(null);
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      addToast("Đã sao chép liên kết câu hỏi vào bộ nhớ tạm", "success");
    }
  };

  const handleStartSimilarPractice = () => {
    sessionStorage.setItem("lingoarena.practice", JSON.stringify([question]));
    router.push("/questions/practice");
  };

  const explanationVi = grade?.explanation;
  const explanationEn = grade?.explanationEn;

  return (
    <div className="space-y-6">
      {/* TOP NAVIGATION BREADCRUMBS & ACTIONS */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-500">
          <Link
            href="/questions"
            className="inline-flex items-center gap-1.5 hover:text-primary transition-colors text-slate-600 dark:text-slate-300"
          >
            <ArrowLeft className="size-4" />
            <span>Ngân hàng câu hỏi</span>
          </Link>
          <span>/</span>
          {question.examType && (
            <span className="text-slate-800 dark:text-slate-200">
              {pickLocaleText(locale, question.examType.name, question.examType.nameEn)}
            </span>
          )}
          {question.examSkill && (
            <>
              <span>/</span>
              <span className="text-primary dark:text-[#7b9bee]">
                {pickLocaleText(locale, question.examSkill.name, question.examSkill.nameEn)}
              </span>
            </>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {previousQuestionId && (
            <Link
              href={`/questions/${previousQuestionId}`}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-200 hover:border-primary transition-colors"
            >
              <ArrowLeft className="size-3.5" />
              <span>Câu trước</span>
            </Link>
          )}

          {nextQuestionId && (
            <Link
              href={`/questions/${nextQuestionId}`}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-200 hover:border-primary transition-colors"
            >
              <span>Câu sau</span>
              <ArrowRight className="size-3.5" />
            </Link>
          )}

          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-200 hover:border-primary transition-colors cursor-pointer"
            title="Sao chép link chia sẻ"
          >
            <Share2 className="size-3.5" />
            <span className="hidden sm:inline">Chia sẻ</span>
          </button>
        </div>
      </div>

      {/* QUESTION INTERACTIVE SOLVER */}
      <PracticePlayer
        key={question.id}
        question={question}
        grade={grade}
        disabled={submitting}
        submitting={submitting}
        onSubmit={handleGrade}
        onReset={handleReset}
      />

      {/* GRADED RESULT & EXPLANATION PANEL */}
      {grade && (
        <div className="rounded-3xl border-2 border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-6 shadow-xl animate-in fade-in slide-in-from-bottom-3 duration-300">
          {/* Result Status Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              {grade.isCorrect ? (
                <div className="flex items-center gap-2.5 text-emerald-600 dark:text-emerald-400 font-black text-lg sm:text-xl">
                  <div className="size-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center">
                    <CheckCircle2 className="size-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <div>Chính xác tuyệt đối!</div>
                    <div className="text-xs font-semibold text-slate-400">
                      Bạn đã nắm vững kiến thức câu hỏi này
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2.5 text-rose-600 dark:text-rose-400 font-black text-lg sm:text-xl">
                  <div className="size-10 rounded-2xl bg-rose-100 dark:bg-rose-950/60 flex items-center justify-center">
                    <XCircle className="size-6 text-rose-600 dark:text-rose-400" />
                  </div>
                  <div>
                    <div>Chưa chính xác!</div>
                    <div className="text-xs font-semibold text-slate-400">
                      Xem lời giải chi tiết bên dưới để hiểu rõ hơn
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Reset / Try Again Button */}
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
            >
              <RotateCcw className="size-3.5" />
              <span>Làm lại câu này</span>
            </button>
          </div>

          {/* Detailed Explanation Section */}
          {(explanationVi || explanationEn) ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-primary dark:text-[#7b9bee]">
                  <Lightbulb className="size-4 text-amber-500" />
                  <span>Lời Giải & Phân Tích Chi Tiết</span>
                </div>

                {/* Lang tabs if bilingual */}
                {explanationVi && explanationEn && (
                  <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => setExplanationLang("vi")}
                      className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                        explanationLang === "vi"
                          ? "bg-white dark:bg-slate-700 text-primary shadow-2xs font-black"
                          : "text-slate-500"
                      }`}
                    >
                      Tiếng Việt
                    </button>
                    <button
                      type="button"
                      onClick={() => setExplanationLang("en")}
                      className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                        explanationLang === "en"
                          ? "bg-white dark:bg-slate-700 text-primary shadow-2xs font-black"
                          : "text-slate-500"
                      }`}
                    >
                      English
                    </button>
                  </div>
                )}
              </div>

              <div className="rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-800/40 p-5 text-sm sm:text-base leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-wrap">
                {explanationLang === "vi"
                  ? explanationVi || explanationEn
                  : explanationEn || explanationVi}
              </div>
            </div>
          ) : (
            <div className="text-xs text-slate-400 italic">
              Câu hỏi này hiện chưa có lời giải văn bản bổ sung.
            </div>
          )}

          {/* Bottom Navigation & Next Question Flow */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800">
            <Link
              href="/questions"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs sm:text-sm font-bold"
            >
              <ArrowLeft className="size-4" />
              <span>Về danh sách câu hỏi</span>
            </Link>

            <div className="w-full sm:w-auto flex items-center gap-3">
              <button
                type="button"
                onClick={handleStartSimilarPractice}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-bold cursor-pointer"
              >
                <Play className="size-3.5 fill-current" />
                <span>Luyện theo chế độ tập trung</span>
              </button>

              {nextQuestionId && (
                <Link
                  href={`/questions/${nextQuestionId}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-primary hover:bg-primary/90 text-white text-xs sm:text-sm font-black shadow-md shadow-primary/25"
                >
                  <span>Câu tiếp theo</span>
                  <ArrowRight className="size-4" />
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
