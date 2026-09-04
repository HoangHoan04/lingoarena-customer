"use client";

import type { DictionaryEntry, ReadingPassage, ReadingScoreReport } from "@/types/reading";
import { questionService } from "@/services/question.service";
import { vocabularyService } from "@/services/vocabulary.service";
import { useToastStore } from "@/stores/useToastStore";
import { mapVocabWordToDictionary } from "@/lib/skill-mappers";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock,
  FileCheck2,
  Globe,
  HelpCircle,
  Languages,
  RotateCcw,
  Send,
  Sparkles,
  Type,
  Volume2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { ReadingWordLookupModal } from "./ReadingWordLookupModal";

interface ReadingStudioProps {
  passage: ReadingPassage;
  onBackToCatalog: () => void;
  onSubmitResult: (report: ReadingScoreReport) => void;
}

export function ReadingStudio({
  passage,
  onBackToCatalog,
  onSubmitResult,
}: ReadingStudioProps) {
  const { addToast } = useToastStore();

  // Settings & Reading state
  const [isBilingual, setIsBilingual] = useState(false);
  const [fontSize, setFontSize] = useState<"sm" | "base" | "lg">("base");
  const [userAnswers, setUserAnswers] = useState<Record<string, string | number>>({});

  // Active word lookup modal
  const [activeLookupEntry, setActiveLookupEntry] = useState<DictionaryEntry | null>(null);
  const [activeSentenceContext, setActiveSentenceContext] = useState<string>("");

  // Timer
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsElapsed((sec) => sec + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleSelectAnswer = (questionId: string, value: string | number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleWordClick = async (rawWord: string, sentence: string) => {
    const keyword = rawWord.replace(/[^a-zA-Z'-]/g, "").trim();
    if (!keyword) return;
    try {
      const res = await vocabularyService.paginationWords(0, 5, { keyword });
      const match =
        res.data.find((item) => item.headword.toLowerCase() === keyword.toLowerCase()) || res.data[0];
      if (match) {
        setActiveLookupEntry(mapVocabWordToDictionary(match));
        setActiveSentenceContext(sentence);
        return;
      }
    } catch {
      // fall through to empty lookup
    }
    setActiveLookupEntry({
      word: keyword,
      phonetic: "",
      partOfSpeech: "",
      level: "",
      meaningVi: "Không tìm thấy trong ngân hàng từ vựng.",
      definitionEn: "",
      examples: [],
    });
    setActiveSentenceContext(sentence);
  };

  const handleSubmit = async () => {
    const answeredCount = Object.keys(userAnswers).length;
    if (answeredCount < passage.questions.length) {
      if (
        !confirm(
          `Bạn mới trả lời ${answeredCount}/${passage.questions.length} câu hỏi. Bạn có chắc muốn nộp bài ngay không?`,
        )
      ) {
        return;
      }
    }

    const answerResults = [];
    let correctCount = 0;
    for (const q of passage.questions) {
      const uAns = userAnswers[q.id];
      let isCorrect = false;
      let correctAnswer: string | number = q.correctAnswer;
      try {
        const option = q.options?.[typeof uAns === "number" ? uAns : q.options.findIndex((opt) => opt === String(uAns))];
        const result = await questionService.grade({
          questionId: q.id,
          answerJson: { optionKey: option ? String.fromCharCode(65 + (q.options || []).indexOf(option)) : String(uAns ?? ""), value: String(uAns ?? "") },
        });
        isCorrect = Boolean(result.isCorrect);
        if (isCorrect) correctCount += 1;
        const fromJson = result.correctAnswerJson?.optionKey ?? result.correctAnswerJson?.value;
        correctAnswer =
          typeof fromJson === "string" || typeof fromJson === "number" ? fromJson : q.correctAnswer;
      } catch {
        isCorrect = uAns !== undefined && String(uAns) === String(q.correctAnswer);
        if (isCorrect) correctCount += 1;
      }
      answerResults.push({
        questionId: q.id,
        isCorrect,
        userAnswer: uAns ?? "Chưa trả lời",
        correctAnswer,
      });
    }

    const total = Math.max(1, passage.questions.length);
    const report: ReadingScoreReport = {
      passageId: passage.id,
      totalQuestions: passage.questions.length,
      correctCount,
      scorePercent: Math.round((correctCount / total) * 100),
      timeSpentSec: secondsElapsed,
      wordsPerMinute: Math.round((passage.wordCount / Math.max(10, secondsElapsed)) * 60),
      answers: answerResults,
    };

    onSubmitResult(report);
    addToast("Đã hoàn thành bài đọc hiểu! Hãy xem phân tích chi tiết.", "success");
  };

  const answeredCount = Object.keys(userAnswers).length;

  return (
    <div className="space-y-6 pb-20">
      {/* HEADER BAR */}
      <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 p-4 sm:p-5 shadow-md flex flex-wrap items-center justify-between gap-4 backdrop-blur-xl sticky top-4 z-40">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToCatalog}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-600 hover:text-cyan-600 dark:text-slate-300 transition-colors cursor-pointer bg-slate-100 dark:bg-slate-800 hover:bg-slate-200"
          >
            <ArrowLeft className="size-4" />
            <span>Thư viện đọc</span>
          </button>

          <span className="hidden sm:inline text-slate-300">|</span>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white truncate max-w-sm lg:max-w-md">
                {passage.title}
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800 dark:bg-cyan-950/60 dark:text-cyan-300 text-[10px] font-black uppercase">
                {passage.examType}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {passage.category} · {passage.wordCount} từ
            </p>
          </div>
        </div>

        {/* CONTROLS: BILINGUAL TOGGLE & FONT SIZE & TIMER */}
        <div className="flex items-center gap-3">
          {/* BILINGUAL TOGGLE */}
          <button
            type="button"
            onClick={() => setIsBilingual(!isBilingual)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              isBilingual
                ? "border-cyan-500 bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300 shadow-2xs font-black"
                : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50"
            }`}
            title="Bật/Tắt bản dịch song ngữ tiếng Việt"
          >
            <Languages className="size-3.5 text-cyan-600" />
            <span>{isBilingual ? "Song ngữ: BẬT" : "Song ngữ: TẮT"}</span>
          </button>

          {/* FONT SIZE TOGGLE */}
          <div className="hidden sm:flex items-center border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden text-xs font-bold">
            <button
              type="button"
              onClick={() => setFontSize("sm")}
              className={`px-2.5 py-1.5 cursor-pointer ${fontSize === "sm" ? "bg-cyan-600 text-white" : "bg-white dark:bg-slate-900 text-slate-600"}`}
            >
              A-
            </button>
            <button
              type="button"
              onClick={() => setFontSize("base")}
              className={`px-2.5 py-1.5 cursor-pointer ${fontSize === "base" ? "bg-cyan-600 text-white" : "bg-white dark:bg-slate-900 text-slate-600"}`}
            >
              A
            </button>
            <button
              type="button"
              onClick={() => setFontSize("lg")}
              className={`px-2.5 py-1.5 cursor-pointer ${fontSize === "lg" ? "bg-cyan-600 text-white" : "bg-white dark:bg-slate-900 text-slate-600"}`}
            >
              A+
            </button>
          </div>

          {/* TIMER */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-mono font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            <Clock className="size-3.5 text-amber-500" />
            <span>{formatTime(secondsElapsed)}</span>
          </div>
        </div>
      </div>

      {/* 2-COLUMN READING ARENA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: READING PASSAGE TEXT (6 / 12 COLS) */}
        <div className="lg:col-span-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm space-y-6 max-h-[820px] overflow-y-auto custom-scrollbar">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <BookOpen className="size-4 text-cyan-600" />
              <span>Văn Bản Bài Đọc</span>
              <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-normal lowercase">
                (Click vào bất kỳ từ nào để tra nghĩa & phát âm)
              </span>
            </span>
            <span className="text-xs font-mono text-slate-400">
              {passage.wordCount} words
            </span>
          </div>

          {/* PARAGRAPHS WITH CLICKABLE WORDS */}
          <div
            className={`space-y-6 font-sans text-slate-800 dark:text-slate-200 leading-relaxed ${
              fontSize === "sm"
                ? "text-xs leading-6"
                : fontSize === "lg"
                  ? "text-base leading-8"
                  : "text-sm leading-7"
            }`}
          >
            {passage.paragraphs.map((p) => {
              // Split into clickable words while preserving punctuation
              const words = p.englishText.split(/\s+/);

              return (
                <div key={p.index} className="space-y-2">
                  {p.label && (
                    <span className="text-xs font-black uppercase tracking-wider text-cyan-600 dark:text-cyan-400 block font-mono">
                      [{p.label}]
                    </span>
                  )}
                  <p className="font-normal select-text">
                    {words.map((w, wIdx) => (
                      <span
                        key={wIdx}
                        onClick={() => handleWordClick(w, p.englishText)}
                        className="inline-block hover:bg-cyan-100 dark:hover:bg-cyan-950/80 hover:text-cyan-900 dark:hover:text-cyan-200 rounded px-0.5 transition-colors cursor-pointer"
                        title="Click để tra từ & nghe phát âm"
                      >
                        {w}{" "}
                      </span>
                    ))}
                  </p>

                  {/* BILINGUAL TRANSLATION (IF TOGGLED) */}
                  {isBilingual && (
                    <div className="p-3.5 rounded-2xl bg-cyan-50/50 dark:bg-cyan-950/20 border border-cyan-100 dark:border-cyan-900 text-xs italic text-slate-600 dark:text-slate-400 leading-relaxed">
                      💬 {p.vietnameseText}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* KEY VOCABULARY SECTION */}
          {passage.keyVocab && passage.keyVocab.length > 0 && (
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Sparkles className="size-3.5 text-amber-500" />
                <span>Từ Vựng Trọng Tâm Trong Bài (Click để xem chi tiết):</span>
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {passage.keyVocab.map((voc, vIdx) => (
                  <button
                    key={vIdx}
                    type="button"
                    onClick={() => handleWordClick(voc.word, passage.paragraphs[0]?.englishText || "")}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 hover:bg-cyan-50/60 dark:hover:bg-cyan-950/40 border border-slate-200/60 dark:border-slate-800 text-left text-xs space-y-0.5 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {voc.word}
                      </span>
                      <span className="px-1.5 py-0.5 rounded-md bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300 text-[9px] font-black uppercase">
                        {voc.level}
                      </span>
                    </div>
                    {voc.phonetic && (
                      <span className="text-[10px] text-slate-400 font-mono block">
                        {voc.phonetic}
                      </span>
                    )}
                    <span className="text-slate-600 dark:text-slate-400 text-[11px] block">
                      {voc.meaning}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: QUESTIONS & ANSWER FORM (6 / 12 COLS) */}
        <div className="lg:col-span-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm space-y-6 max-h-[820px] overflow-y-auto custom-scrollbar">
          {/* QUESTIONS HEADER & PROGRESS */}
          <div className="space-y-2 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <FileCheck2 className="size-4 text-cyan-600" />
                <span>Bảng Câu Hỏi Trả Lời</span>
              </span>

              <span className="text-xs font-mono font-bold text-slate-500">
                Đã trả lời: <strong className="text-cyan-600 dark:text-cyan-400 font-black">{answeredCount}</strong>/{passage.questions.length}
              </span>
            </div>

            <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-cyan-500 transition-all duration-300"
                style={{ width: `${Math.round((answeredCount / passage.questions.length) * 100)}%` }}
              />
            </div>
          </div>

          {/* QUESTIONS LIST */}
          <div className="space-y-6">
            {passage.questions.map((q) => {
              const selectedVal = userAnswers[q.id];

              return (
                <div
                  key={q.id}
                  className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-850/40 space-y-3"
                >
                  <div className="flex items-start gap-2.5">
                    <span className="flex items-center justify-center size-6 rounded-lg bg-cyan-600 text-white text-xs font-black shrink-0 mt-0.5">
                      {q.questionNumber}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                      {q.questionText}
                    </h4>
                  </div>

                  {/* OPTIONS */}
                  <div className="space-y-2 pt-1 pl-8">
                    {q.options?.map((opt, oIdx) => {
                      const isOptionSelected =
                        q.questionType === "true_false_not_given"
                          ? selectedVal === opt
                          : selectedVal === oIdx;

                      return (
                        <button
                          key={oIdx}
                          type="button"
                          onClick={() =>
                            handleSelectAnswer(
                              q.id,
                              q.questionType === "true_false_not_given" ? opt : oIdx,
                            )
                          }
                          className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between text-xs font-semibold ${
                            isOptionSelected
                              ? "border-cyan-600 bg-cyan-50 dark:bg-cyan-950/60 text-cyan-900 dark:text-cyan-200 ring-1 ring-cyan-500 font-bold"
                              : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50"
                          }`}
                        >
                          <span>{opt}</span>
                          {isOptionSelected && (
                            <CheckCircle2 className="size-4 text-cyan-600 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ACTIONS */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => {
                if (confirm("Bạn có chắc muốn xóa tất cả câu trả lời để làm lại từ đầu?")) {
                  setUserAnswers({});
                }
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 cursor-pointer"
            >
              <RotateCcw className="size-3.5" />
              <span>Làm lại</span>
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-cyan-600 hover:bg-cyan-700 text-white font-black text-xs sm:text-sm shadow-lg shadow-cyan-600/25 transition-all hover:scale-101 cursor-pointer"
            >
              <Send className="size-4" />
              <span>Nộp Bài & Chấm Điểm</span>
            </button>
          </div>
        </div>
      </div>

      {/* WORD LOOKUP & DICTIONARY MODAL */}
      <ReadingWordLookupModal
        entry={activeLookupEntry}
        sentenceContext={activeSentenceContext}
        onClose={() => setActiveLookupEntry(null)}
      />
    </div>
  );
}
