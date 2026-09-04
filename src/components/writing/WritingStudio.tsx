"use client";

import { questionService } from "@/services/question.service";
import { useToastStore } from "@/stores/useToastStore";
import type { WritingScoreResult, WritingTopic } from "@/types/writing";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock,
  Lightbulb,
  Loader2,
  PenTool,
  RotateCcw,
  Save,
  Send,
  Sparkles,
  Target,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

interface WritingStudioProps {
  topic: WritingTopic;
  onBackToCatalog: () => void;
  onSubmitResult: (result: WritingScoreResult) => void;
}

export function WritingStudio({
  topic,
  onBackToCatalog,
  onSubmitResult,
}: WritingStudioProps) {
  const { addToast } = useToastStore();

  // Active assistant tab on left column
  const [assistantTab, setAssistantTab] = useState<
    "outline" | "vocab" | "sample"
  >("outline");

  // User input text
  const [essayContent, setEssayContent] = useState("");
  const [isGrading, setIsGrading] = useState(false);

  // Timer state
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  // Count timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setSecondsElapsed((sec) => sec + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning]);

  // Live word counter
  const wordsCount = useMemo(() => {
    return essayContent.trim().split(/\s+/).filter(Boolean).length;
  }, [essayContent]);

  const progressPercent = Math.min(
    100,
    Math.round((wordsCount / topic.minWords) * 100),
  );

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleSaveDraft = () => {
    try {
      localStorage.setItem(`lingoarena_draft_${topic.id}`, essayContent);
      addToast(
        "Đã lưu bản nháp thành công vào trình duyệt của bạn.",
        "success",
      );
    } catch {
      addToast("Không thể lưu bản nháp.", "error");
    }
  };

  const handleSubmitEssay = async () => {
    if (wordsCount < 20) {
      addToast("Vui lòng viết ít nhất 20 từ trước khi nộp bài.", "info");
      return;
    }

    setIsGrading(true);
    setIsTimerRunning(false);
    try {
      const result = await questionService.grade({
        questionId: topic.id,
        answerJson: { value: essayContent, text: essayContent },
      });
      const feedback = (result.explanation || "Đã nộp bài viết.") as string;
      onSubmitResult({
        overallBand: result.isCorrect ? 7 : 5,
        scoreLabel: result.isCorrect ? "Đạt yêu cầu" : "Cần cải thiện",
        wordCount: wordsCount,
        targetWords: topic.minWords,
        timeSpentSec: secondsElapsed,
        criteria: {
          taskResponse: {
            score: result.isCorrect ? 7 : 5,
            maxScore: 9,
            feedback,
          },
          coherenceCohesion: { score: 0, maxScore: 9, feedback: "" },
          lexicalResource: { score: 0, maxScore: 9, feedback: "" },
          grammaticalAccuracy: { score: 0, maxScore: 9, feedback: "" },
        },
        errors: [],
        vocabUpgrades: [],
        generalFeedbackVi: feedback,
        improvedVersion: "",
      });
      addToast("Đã nộp bài viết.", "success");
    } catch (err: any) {
      addToast(err?.message || "Không nộp được bài viết.", "error");
      setIsTimerRunning(true);
    } finally {
      setIsGrading(false);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* STUDIO HEADER */}
      <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 p-4 sm:p-5 shadow-md flex flex-wrap items-center justify-between gap-4 backdrop-blur-xl sticky top-4 z-40">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToCatalog}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-600 hover:text-emerald-600 dark:text-slate-300 transition-colors cursor-pointer bg-slate-100 dark:bg-slate-800 hover:bg-slate-200"
          >
            <ArrowLeft className="size-4" />
            <span>Thư viện đề</span>
          </button>

          <span className="hidden sm:inline text-slate-300">|</span>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white truncate max-w-sm lg:max-w-md">
                {topic.title}
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 text-[10px] font-black uppercase">
                {topic.examType}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {topic.category} · Yêu cầu tối thiểu:{" "}
              <strong>≥ {topic.minWords} từ</strong>
            </p>
          </div>
        </div>

        {/* TIMER & QUICK STATS */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-mono font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            <Clock className="size-3.5 text-amber-500" />
            <span>{formatTime(secondsElapsed)}</span>
          </div>

          <button
            type="button"
            onClick={handleSaveDraft}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 cursor-pointer"
            title="Lưu bản nháp"
          >
            <Save className="size-3.5 text-teal-600" />
            <span className="hidden sm:inline">Lưu nháp</span>
          </button>
        </div>
      </div>

      {/* 2-COLUMN MAIN STUDIO */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: PROMPT & ASSISTANT TABS (5 / 12 COLS) */}
        <div className="lg:col-span-5 space-y-6">
          {/* PROMPT CARD */}
          <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Target className="size-4 text-emerald-600" />
                <span>Nội Dung Đề Bài</span>
              </span>

              <span className="text-xs font-mono font-bold text-slate-500">
                {topic.level} Level
              </span>
            </div>

            <p className="text-sm font-semibold text-slate-900 dark:text-white leading-relaxed">
              {topic.prompt}
            </p>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
              <span>Độ dài yêu cầu:</span>
              <strong className="text-emerald-600 dark:text-emerald-400 font-black">
                {topic.minWords} {topic.maxWords ? `- ${topic.maxWords}` : "+"}{" "}
                từ
              </strong>
            </div>
          </div>

          {/* ASSISTANT SUPPORT TABS */}
          <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setAssistantTab("outline")}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  assistantTab === "outline"
                    ? "bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-300 shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Lightbulb className="size-3.5" />
                <span>Dàn ý</span>
              </button>

              <button
                type="button"
                onClick={() => setAssistantTab("vocab")}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  assistantTab === "vocab"
                    ? "bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-300 shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Sparkles className="size-3.5" />
                <span>Từ vựng</span>
              </button>

              <button
                type="button"
                onClick={() => setAssistantTab("sample")}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  assistantTab === "sample"
                    ? "bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-300 shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <BookOpen className="size-3.5" />
                <span>Bài mẫu</span>
              </button>
            </div>

            {/* TAB CONTENT */}
            <div className="min-h-56 max-h-96 overflow-y-auto pr-1 custom-scrollbar text-xs leading-relaxed space-y-3">
              {assistantTab === "outline" && (
                <div className="space-y-2.5">
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase">
                    Gợi ý phát triển luận điểm:
                  </h4>
                  {topic.outlineIdeas.map((idea, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800 font-medium text-slate-700 dark:text-slate-300 flex items-start gap-2"
                    >
                      <span className="size-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{idea}</span>
                    </div>
                  ))}
                </div>
              )}

              {assistantTab === "vocab" && (
                <div className="space-y-2.5">
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase">
                    Từ vựng & Cụm từ Band cao nên dùng:
                  </h4>
                  {topic.suggestedVocab.map((voc, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800 space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 dark:text-white text-xs">
                          {voc.word}
                        </span>
                        {voc.level && (
                          <span className="px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[9px] font-black">
                            {voc.level}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 italic">
                        {voc.meaning}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {assistantTab === "sample" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 text-[10px] font-black">
                      {topic.sampleBand}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Tham khảo cấu trúc
                    </span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800 font-sans text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed">
                    {topic.sampleAnswer}
                  </div>
                  <p className="text-[11px] text-slate-500 italic bg-amber-50/60 dark:bg-amber-950/20 p-2.5 rounded-xl border border-amber-200/60">
                    💡 <strong>Phân tích:</strong> {topic.sampleAnalysisVi}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: ESSAY EDITOR & SUBMIT (7 / 12 COLS) */}
        <div className="lg:col-span-7 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-7 shadow-sm space-y-4">
          {/* WORD COUNT PROGRESS BAR */}
          <div className="space-y-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <PenTool className="size-4 text-emerald-600" />
                <span>Trình Soạn Thảo Bài Viết</span>
              </span>

              <div className="flex items-center gap-2 text-xs font-mono font-bold">
                <span
                  className={
                    wordsCount >= topic.minWords
                      ? "text-emerald-600 font-black"
                      : "text-amber-600"
                  }
                >
                  {wordsCount}
                </span>
                <span className="text-slate-400">
                  / {topic.minWords} từ tối thiểu
                </span>
                {wordsCount >= topic.minWords && (
                  <CheckCircle2 className="size-4 text-emerald-600" />
                )}
              </div>
            </div>

            <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  wordsCount >= topic.minWords
                    ? "bg-emerald-500"
                    : "bg-linear-to-r from-amber-400 to-emerald-400"
                }`}
                style={{ width: `${Math.max(progressPercent, 2)}%` }}
              />
            </div>
          </div>

          {/* MAIN ESSAY TEXTAREA */}
          <div className="space-y-2">
            <textarea
              rows={18}
              value={essayContent}
              onChange={(e) => setEssayContent(e.target.value)}
              placeholder="Bắt đầu viết bài luận hoặc bức thư của bạn tại đây... Hãy chú ý phân chia đoạn mở bài, thân bài và kết bài rõ ràng."
              className="w-full min-h-[420px] p-5 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-emerald-600 focus:bg-white dark:focus:bg-slate-900 focus:outline-none transition-colors leading-relaxed break-words font-sans resize-y"
            />
          </div>

          {/* ACTIONS TOOLBAR */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                if (
                  confirm(
                    "Bạn có chắc muốn xóa toàn bộ nội dung bài viết này để viết lại từ đầu?",
                  )
                ) {
                  setEssayContent("");
                }
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 cursor-pointer"
            >
              <RotateCcw className="size-3.5" />
              <span>Xóa viết lại</span>
            </button>

            <button
              type="button"
              onClick={handleSubmitEssay}
              disabled={isGrading}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-lg shadow-emerald-600/25 transition-all hover:scale-101 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isGrading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>AI Đang Chấm Điểm & Phân Tích...</span>
                </>
              ) : (
                <>
                  <Send className="size-4" />
                  <span>Nộp Bài & Chấm Điểm AI</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
