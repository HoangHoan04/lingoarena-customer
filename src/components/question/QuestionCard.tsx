"use client";

import { cefrBadgeClass } from "@/lib/vocab";
import type { PublicQuestion } from "@/types/question";
import {
  BookOpen,
  CheckCircle2,
  FileQuestion,
  Headphones,
  HelpCircle,
  ImageIcon,
  Play,
  Sparkles,
  Volume2,
} from "lucide-react";

const SKILL_ICONS: Record<string, any> = {
  LISTENING: Headphones,
  READING: BookOpen,
  GRAMMAR: Sparkles,
  VOCABULARY: FileQuestion,
};

export default function QuestionCard({
  question,
  onPracticeSingle,
}: {
  question: PublicQuestion;
  onPracticeSingle?: (question: PublicQuestion) => void;
}) {
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
      question.questionGroup?.imageUrl,
  );

  const difficulty = question.difficultyLevel || 1;

  return (
    <div className="group relative flex flex-col justify-between rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-2xs hover:shadow-lg hover:border-primary/50 dark:hover:border-primary/50 transition-all duration-300">
      <div className="space-y-3">
        {/* Top Badges Row */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            {question.examType && (
              <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary dark:text-[#7b9bee] text-[11px] font-black tracking-wider uppercase">
                {question.examType.name}
              </span>
            )}

            {question.examSkill && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-bold">
                <SkillIcon className="size-3 text-primary dark:text-[#7b9bee]" />
                <span>{question.examSkill.name}</span>
              </span>
            )}

            {question.questionType && (
              <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-medium">
                {question.questionType.name}
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

            {/* Difficulty stars / dots */}
            <div className="flex items-center gap-0.5" title={`Độ khó: ${difficulty}/5`}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`size-1.5 rounded-full ${
                    star <= difficulty
                      ? "bg-amber-400"
                      : "bg-slate-200 dark:bg-slate-700"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Question Prompt */}
        <div className="space-y-1.5">
          <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-white line-clamp-3 leading-relaxed">
            {question.prompt}
          </p>

          {question.instructions && (
            <p className="text-xs text-slate-500 italic line-clamp-1">
              {question.instructions}
            </p>
          )}
        </div>

        {/* Media indicators */}
        {hasMedia && (
          <div className="flex items-center gap-2 pt-1 text-[11px] font-semibold text-slate-400">
            {(question.audioUrl || question.questionGroup?.audioUrl) && (
              <span className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded-md">
                <Volume2 className="size-3" /> Audio đính kèm
              </span>
            )}
            {(question.imageUrl || question.questionGroup?.imageUrl) && (
              <span className="inline-flex items-center gap-1 text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 px-2 py-0.5 rounded-md">
                <ImageIcon className="size-3" /> Hình ảnh
              </span>
            )}
          </div>
        )}
      </div>

      {/* Card Footer with options count and Action */}
      <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3">
        <span className="text-xs text-slate-400 font-medium">
          {question.options?.length ? `${question.options.length} phương án lựa chọn` : "Tự luận / Điền từ"}
        </span>

        {onPracticeSingle && (
          <button
            type="button"
            onClick={() => onPracticeSingle(question)}
            className="inline-flex items-center gap-1.5 py-1.5 px-3.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer"
          >
            <Play className="size-3 fill-current" />
            <span>Luyện câu này</span>
          </button>
        )}
      </div>
    </div>
  );
}
