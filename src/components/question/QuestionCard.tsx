"use client";

import { Link } from "@/i18n/routing";
import { cefrBadgeClass } from "@/lib/vocab";
import { pickLocaleText } from "@/lib/locale-text";
import type { PublicQuestion } from "@/types/question";
import {
  ArrowRight,
  BookOpen,
  FileQuestion,
  Headphones,
  ImageIcon,
  Play,
  Sparkles,
  Volume2,
  Zap,
} from "lucide-react";
import { useLocale } from "next-intl";

export default function QuestionCard({
  question,
  onQuickSolve,
  onPracticeSingle,
}: {
  question: PublicQuestion;
  onQuickSolve?: (question: PublicQuestion) => void;
  onPracticeSingle?: (question: PublicQuestion) => void;
}) {
  const locale = useLocale();
  const skillCode = (question.examSkill?.code || question.examSkill?.name || "").toUpperCase();
  const SkillIcon =
    skillCode.includes("LISTEN")
      ? Headphones
      : skillCode.includes("READ")
        ? BookOpen
        : skillCode.includes("GRAM")
          ? Sparkles
          : FileQuestion;

  const hasMedia = Boolean(
    question.imageUrl ||
      question.audioUrl ||
      question.questionGroup?.audioUrl ||
      question.questionGroup?.imageUrl ||
      question.questionGroup?.passageText,
  );

  const difficulty = question.difficultyLevel || 1;

  return (
    <div className="group relative flex flex-col justify-between rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-2xs hover:shadow-xl hover:border-primary/50 dark:hover:border-primary/50 transition-all duration-300">
      <div className="space-y-3.5">
        {/* Top Badges Row */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            {question.examType && (
              <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary dark:text-[#7b9bee] text-[11px] font-black tracking-wider uppercase">
                {pickLocaleText(locale, question.examType.name, question.examType.nameEn)}
              </span>
            )}

            {question.examSkill && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-bold">
                <SkillIcon className="size-3 text-primary dark:text-[#7b9bee]" />
                <span>{pickLocaleText(locale, question.examSkill.name, question.examSkill.nameEn)}</span>
              </span>
            )}

            {question.questionType && (
              <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-medium">
                {pickLocaleText(locale, question.questionType.name, question.questionType.nameEn)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {question.cefrLevel && (
              <span
                className={`px-2 py-0.5 rounded-full border text-[10px] font-black uppercase ${cefrBadgeClass(
                  question.cefrLevel,
                )}`}
              >
                CEFR {question.cefrLevel}
              </span>
            )}

            {/* Difficulty stars */}
            <div className="flex items-center gap-0.5" title={`Độ khó: ${difficulty}/5`}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`size-1.5 rounded-full ${
                    star <= difficulty ? "bg-amber-400" : "bg-slate-200 dark:bg-slate-700"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Question Prompt */}
        <Link href={`/questions/${question.id}`} className="block space-y-1.5 group-hover:text-primary transition-colors">
          <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-white line-clamp-3 leading-relaxed">
            {question.prompt}
          </p>

          {pickLocaleText(locale, question.instructions, question.instructionsEn) && (
            <p className="text-xs text-slate-500 italic line-clamp-1">
              {pickLocaleText(locale, question.instructions, question.instructionsEn)}
            </p>
          )}
        </Link>

        {/* Media indicators */}
        {hasMedia && (
          <div className="flex flex-wrap items-center gap-2 pt-0.5 text-[11px] font-semibold text-slate-400">
            {(question.audioUrl || question.questionGroup?.audioUrl) && (
              <span className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded-md">
                <Volume2 className="size-3" /> Audio
              </span>
            )}
            {(question.imageUrl || question.questionGroup?.imageUrl) && (
              <span className="inline-flex items-center gap-1 text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 px-2 py-0.5 rounded-md">
                <ImageIcon className="size-3" /> Hình ảnh
              </span>
            )}
            {question.questionGroup?.passageText && (
              <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">
                <BookOpen className="size-3" /> Đoạn văn
              </span>
            )}
          </div>
        )}
      </div>

      {/* Card Footer with options count and Action Buttons */}
      <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
        <span className="text-xs text-slate-400 font-medium">
          {question.options?.length ? `${question.options.length} phương án` : "Tự luận / Điền từ"}
        </span>

        <div className="flex items-center gap-2">
          {onQuickSolve && (
            <button
              type="button"
              onClick={() => onQuickSolve(question)}
              className="inline-flex items-center gap-1 py-1.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer"
              title="Làm nhanh câu này ngay tại đây"
            >
              <Zap className="size-3 text-amber-500 fill-amber-400" />
              <span>Làm nhanh</span>
            </button>
          )}

          <Link
            href={`/questions/${question.id}`}
            className="inline-flex items-center gap-1 py-1.5 px-3.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all"
          >
            <span>Làm bài</span>
            <ArrowRight className="size-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
