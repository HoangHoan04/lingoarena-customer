"use client";

import { Link } from "@/i18n/routing";
import type { PublicQuestion } from "@/types/question";
import { ExternalLink, X } from "lucide-react";
import { useEffect } from "react";
import QuestionDetailView from "./QuestionDetailView";

interface QuickQuestionModalProps {
  question: PublicQuestion | null;
  onClose: () => void;
}

export default function QuickQuestionModal({
  question,
  onClose,
}: QuickQuestionModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (question) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [question, onClose]);

  if (!question) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 shadow-2xl p-5 sm:p-8 space-y-4 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar controls */}
        <div className="flex items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary dark:text-[#7b9bee] text-xs font-black uppercase">
              Làm Nhanh Câu Hỏi
            </span>
            <Link
              href={`/questions/${question.id}`}
              className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-primary transition-colors"
              onClick={onClose}
            >
              <span>Mở toàn trang</span>
              <ExternalLink className="size-3" />
            </Link>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Đóng cửa sổ"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Solver View */}
        <QuestionDetailView question={question} />
      </div>
    </div>
  );
}
