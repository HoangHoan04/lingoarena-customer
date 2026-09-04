"use client";

import { cefrBadgeClass } from "@/lib/vocab";
import { pickLocaleText } from "@/lib/locale-text";
import type { GradeResult, PracticeAnswer, PublicQuestion } from "@/types/question";
import {
  BookOpen,
  Check,
  CheckCircle2,
  FileQuestion,
  Headphones,
  HelpCircle,
  ImageIcon,
  RotateCcw,
  Send,
  Sparkles,
  Volume2,
  X,
  XCircle,
  ZoomIn,
} from "lucide-react";
import { useLocale } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { QuestionAudioPlayer } from "./QuestionAudioPlayer";

type MatchingItem = { key: string; content: string };

function toMatchingItems(raw: unknown): MatchingItem[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item, index) => {
      if (typeof item === "string") return { key: String(index + 1), content: item };
      const record = (item || {}) as Record<string, unknown>;
      return {
        key: String(record.key || record.optionKey || record.id || index + 1),
        content: String(record.content || record.text || record.label || ""),
      };
    })
    .filter((item) => item.content);
}

function matchingSides(question: PublicQuestion): { left: MatchingItem[]; right: MatchingItem[] } {
  const json = (question.contentJson || {}) as Record<string, unknown>;
  let left = toMatchingItems(json.left || json.leftItems || json.prompts);
  let right = toMatchingItems(json.right || json.rightItems || json.choices);
  const options = [...(question.options || [])].sort(
    (a, b) => (a.sortOrder || 0) - (b.sortOrder || 0),
  );
  if (!right.length && options.length) {
    right = options.map((item) => ({ key: item.optionKey, content: item.content }));
  }
  if (!left.length && options.length >= 2) {
    const mid = Math.ceil(options.length / 2);
    left = options.slice(0, mid).map((item) => ({ key: item.optionKey, content: item.content }));
    right = options.slice(mid).map((item) => ({ key: item.optionKey, content: item.content }));
  }
  return { left, right };
}

export default function PracticePlayer({
  question,
  grade,
  disabled,
  submitting,
  onSubmit,
  onReset,
  hideStimulus = false,
  hideSubmitButton = false,
}: {
  question: PublicQuestion;
  grade?: GradeResult | null;
  disabled?: boolean;
  submitting?: boolean;
  onSubmit: (answer: PracticeAnswer) => void;
  onReset?: () => void;
  hideStimulus?: boolean;
  hideSubmitButton?: boolean;
}) {
  const locale = useLocale();
  const [selected, setSelected] = useState<string>("");
  const [multi, setMulti] = useState<string[]>([]);
  const [text, setText] = useState("");
  const [pairs, setPairs] = useState<Record<string, string>>({});
  const [showImageZoom, setShowImageZoom] = useState(false);
  const [textSize, setTextSize] = useState<"sm" | "base" | "lg">("base");

  const typeCode = question.questionType?.code || "SINGLE_CHOICE";
  const options = useMemo(
    () => [...(question.options || [])].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)),
    [question.options],
  );

  const matching = useMemo(() => matchingSides(question), [question]);

  // Sync / Reset local state when question changes
  useEffect(() => {
    setSelected("");
    setMulti([]);
    setText("");
    setPairs({});
    setShowImageZoom(false);
  }, [question.id]);

  const handleSubmit = () => {
    if (disabled || submitting || grade) return;
    if (typeCode === "MULTI_CHOICE") onSubmit({ optionKeys: multi });
    else if (typeCode === "FILL_BLANK") onSubmit({ blanks: [text], value: text });
    else if (typeCode === "TRUE_FALSE_NG") onSubmit({ value: selected, optionKey: selected });
    else if (typeCode === "MATCHING") onSubmit({ pairs });
    else onSubmit({ optionKey: selected });
  };

  const canSubmit =
    typeCode === "MULTI_CHOICE"
      ? multi.length > 0
      : typeCode === "FILL_BLANK"
        ? Boolean(text.trim())
        : typeCode === "MATCHING"
          ? matching.left.length > 0 && matching.left.every((item) => Boolean(pairs[item.key]))
          : Boolean(selected);

  // Keyboard shortcut listener for Single Choice
  useEffect(() => {
    if (disabled || grade || typeCode !== "SINGLE_CHOICE") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) return;

      const key = e.key.toUpperCase();
      const numKey = parseInt(e.key, 10);

      // Check number keys 1,2,3,4
      if (!isNaN(numKey) && numKey >= 1 && numKey <= options.length) {
        const opt = options[numKey - 1];
        if (opt) setSelected(opt.optionKey);
      }
      // Check letter keys A, B, C, D
      const found = options.find((opt) => opt.optionKey.toUpperCase() === key);
      if (found) {
        setSelected(found.optionKey);
      }

      if (e.key === "Enter" && canSubmit) {
        handleSubmit();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [disabled, grade, typeCode, options, canSubmit]);

  const passage = question.questionGroup?.passageText;
  const audio = question.audioUrl || question.questionGroup?.audioUrl;
  const image = question.imageUrl || question.questionGroup?.imageUrl;

  // Grade helper data
  const gradedOptionsMap = useMemo(() => {
    if (!grade?.options) return {};
    return grade.options.reduce((acc, opt) => {
      acc[opt.optionKey] = opt;
      return acc;
    }, {} as Record<string, typeof grade.options[0]>);
  }, [grade]);

  return (
    <div className="space-y-6">
      {!hideStimulus && (
        <>
          {/* AUDIO PLAYER (If applicable) */}
          {audio && (
            <QuestionAudioPlayer
              src={audio}
              title={
                pickLocaleText(locale, question.questionGroup?.title, question.questionGroup?.titleEn) ||
                "Audio Nghe Đính Kèm"
              }
            />
          )}

          {/* READING PASSAGE / STIMULUS (If applicable) */}
          {passage && (
            <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-7 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-xl bg-primary/10 text-primary dark:text-[#7b9bee]">
                    <BookOpen className="size-4" />
                  </div>
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-primary dark:text-[#7b9bee] block">
                      Đoạn Văn Đọc Hiểu
                    </span>
                    {pickLocaleText(locale, question.questionGroup?.title, question.questionGroup?.titleEn) && (
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                        {pickLocaleText(locale, question.questionGroup?.title, question.questionGroup?.titleEn)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Font Size Adjuster */}
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300">
                  <span className="px-1 text-[11px] text-slate-400">Cỡ chữ:</span>
                  <button
                    type="button"
                    onClick={() => setTextSize("sm")}
                    className={`px-2 py-0.5 rounded-lg cursor-pointer ${textSize === "sm" ? "bg-white dark:bg-slate-700 shadow-2xs text-primary" : ""}`}
                  >
                    A-
                  </button>
                  <button
                    type="button"
                    onClick={() => setTextSize("base")}
                    className={`px-2 py-0.5 rounded-lg cursor-pointer ${textSize === "base" ? "bg-white dark:bg-slate-700 shadow-2xs text-primary" : ""}`}
                  >
                    A
                  </button>
                  <button
                    type="button"
                    onClick={() => setTextSize("lg")}
                    className={`px-2 py-0.5 rounded-lg cursor-pointer ${textSize === "lg" ? "bg-white dark:bg-slate-700 shadow-2xs text-primary" : ""}`}
                  >
                    A+
                  </button>
                </div>
              </div>

              <div
                className={`prose dark:prose-invert max-w-none leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-wrap font-serif ${
                  textSize === "sm" ? "text-xs sm:text-sm" : textSize === "lg" ? "text-base sm:text-lg" : "text-sm sm:text-base"
                }`}
              >
                {passage}
              </div>
            </div>
          )}

          {/* IMAGE MEDIA (If applicable) */}
          {image && (
            <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 shadow-xs overflow-hidden flex flex-col items-center">
              <div
                className="relative max-h-96 w-full overflow-hidden rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center cursor-pointer group"
                onClick={() => setShowImageZoom(!showImageZoom)}
              >
                <img
                  src={image}
                  alt="Question stimulus illustration"
                  className={`rounded-2xl object-contain transition-all duration-300 ${
                    showImageZoom ? "max-h-[600px] scale-105" : "max-h-72 group-hover:scale-101"
                  }`}
                />
                <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-xl bg-black/60 backdrop-blur-md text-white text-[11px] font-bold flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                  <ZoomIn className="size-3" />
                  <span>{showImageZoom ? "Thu nhỏ" : "Phóng to"}</span>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* QUESTION MAIN CARD */}
      <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-8 space-y-6 shadow-sm">
        {/* Meta badges & difficulty */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-2">
            {question.examType && (
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary dark:text-[#7b9bee] text-xs font-black tracking-wider uppercase">
                {pickLocaleText(locale, question.examType.name, question.examType.nameEn)}
              </span>
            )}
            {question.examSkill && (
              <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold">
                {pickLocaleText(locale, question.examSkill.name, question.examSkill.nameEn)}
              </span>
            )}
            {question.cefrLevel && (
              <span
                className={`px-2.5 py-0.5 rounded-full border text-xs font-black uppercase ${cefrBadgeClass(
                  question.cefrLevel,
                )}`}
              >
                CEFR {question.cefrLevel}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400">
              {typeCode === "MULTI_CHOICE"
                ? "Chọn nhiều đáp án"
                : typeCode === "FILL_BLANK"
                  ? "Điền từ vào chỗ trống"
                  : typeCode === "TRUE_FALSE_NG"
                    ? "True / False / Not Given"
                    : typeCode === "MATCHING"
                      ? "Nối cặp trái — phải"
                      : "Trắc nghiệm 1 đáp án"}
            </span>

            {/* Difficulty stars */}
            <div className="flex items-center gap-0.5" title={`Độ khó: ${question.difficultyLevel || 1}/5`}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`size-1.5 rounded-full ${
                    star <= (question.difficultyLevel || 1)
                      ? "bg-amber-400"
                      : "bg-slate-200 dark:bg-slate-700"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Question Prompt */}
        <div className="space-y-2">
          <h2 className="text-base sm:text-lg lg:text-xl font-black text-slate-900 dark:text-white leading-relaxed whitespace-pre-wrap">
            {question.prompt}
          </h2>

          {pickLocaleText(locale, question.instructions, question.instructionsEn) && (
            <p className="text-xs sm:text-sm text-slate-500 italic pl-3.5 border-l-2 border-primary/40">
              {pickLocaleText(locale, question.instructions, question.instructionsEn)}
            </p>
          )}
        </div>

        {/* ANSWERS CONTAINER */}
        <div className="space-y-3 pt-2">
          {typeCode === "MATCHING" ? (
            <div className="space-y-3">
              {matching.left.length === 0 ? (
                <p className="text-sm text-slate-500">Câu nối cặp chưa có đủ dữ liệu.</p>
              ) : (
                matching.left.map((left) => (
                  <div
                    key={left.key}
                    className="grid sm:grid-cols-[1fr_auto_1fr] gap-2.5 items-center rounded-2xl border border-slate-200 dark:border-slate-800 p-3.5 bg-slate-50/50 dark:bg-slate-800/30"
                  >
                    <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      <span className="mr-2 text-xs font-black text-primary">{left.key}.</span>
                      {left.content}
                    </div>
                    <span className="hidden sm:block text-slate-400 text-xs font-bold">→</span>
                    <select
                      disabled={disabled || Boolean(grade)}
                      value={pairs[left.key] || ""}
                      onChange={(event) =>
                        setPairs((prev) => ({ ...prev, [left.key]: event.target.value }))
                      }
                      className="h-11 w-full rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm font-semibold focus:border-primary focus:outline-none"
                    >
                      <option value="">Chọn đáp án ghép</option>
                      {matching.right.map((right) => (
                        <option key={right.key} value={right.key}>
                          {right.key}. {right.content}
                        </option>
                      ))}
                    </select>
                  </div>
                ))
              )}
            </div>
          ) : typeCode === "FILL_BLANK" ? (
            <div className="space-y-3">
              <div className="relative">
                <input
                  value={text}
                  disabled={disabled || Boolean(grade)}
                  onChange={(event) => setText(event.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && canSubmit && !disabled && !grade) handleSubmit();
                  }}
                  placeholder="Gõ đáp án của bạn tại đây..."
                  className={`w-full h-14 px-5 rounded-2xl border-2 text-sm sm:text-base font-semibold placeholder:text-slate-400 focus:outline-none transition-all ${
                    grade
                      ? grade.isCorrect
                        ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-100"
                        : "border-rose-500 bg-rose-50/50 dark:bg-rose-950/30 text-rose-900 dark:text-rose-100"
                      : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:border-primary focus:bg-white dark:focus:bg-slate-900"
                  }`}
                  autoFocus
                />
                {grade && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 font-bold text-xs">
                    {grade.isCorrect ? (
                      <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="size-4" /> Chính xác
                      </span>
                    ) : (
                      <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1">
                        <XCircle className="size-4" /> Chưa đúng
                      </span>
                    )}
                  </div>
                )}
              </div>
              {!grade && <p className="text-[11px] text-slate-400 pl-1">Nhấn Enter để nộp bài nhanh</p>}
            </div>
          ) : typeCode === "TRUE_FALSE_NG" && options.length === 0 ? (
            <div className="grid sm:grid-cols-3 gap-3">
              {[
                { key: "TRUE", label: "TRUE", desc: "Đúng theo ngữ liệu" },
                { key: "FALSE", label: "FALSE", desc: "Sai so với ngữ liệu" },
                { key: "NOT_GIVEN", label: "NOT GIVEN", desc: "Không được đề cập" },
              ].map((item) => {
                const isSelectedByUser = selected === item.key;
                const isCorrectAnswer =
                  grade?.correctAnswerJson?.value === item.key ||
                  grade?.correctAnswerJson?.optionKey === item.key;

                let cardStyle =
                  "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:border-primary/50";

                if (grade) {
                  if (isSelectedByUser) {
                    cardStyle = grade.isCorrect
                      ? "border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/30"
                      : "border-rose-500 bg-rose-50/80 dark:bg-rose-950/50 text-rose-900 dark:text-rose-200 ring-2 ring-rose-500/30";
                  } else if (isCorrectAnswer) {
                    cardStyle =
                      "border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500/40";
                  }
                } else if (isSelectedByUser) {
                  cardStyle =
                    "border-primary bg-primary/10 text-primary dark:text-[#7b9bee] shadow-md ring-2 ring-primary/30";
                }

                return (
                  <button
                    key={item.key}
                    type="button"
                    disabled={disabled || Boolean(grade)}
                    onClick={() => setSelected(item.key)}
                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 font-black transition-all cursor-pointer disabled:cursor-default select-none ${cardStyle}`}
                  >
                    <span className="text-base">{item.label}</span>
                    <span className="text-[10px] font-normal text-slate-400 mt-0.5">
                      {item.desc}
                    </span>
                    {grade && isCorrectAnswer && (
                      <span className="mt-1.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                        ✓ Đáp án chính xác
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="grid gap-3">
              {options.map((item, idx) => {
                const isSelectedByUser =
                  typeCode === "MULTI_CHOICE"
                    ? multi.includes(item.optionKey)
                    : selected === item.optionKey;

                const gradedOpt = gradedOptionsMap[item.optionKey];
                const isCorrectOption =
                  gradedOpt?.isCorrect ??
                  (grade?.correctAnswerJson?.optionKey === item.optionKey ||
                    (Array.isArray(grade?.correctAnswerJson?.optionKeys) &&
                      grade.correctAnswerJson.optionKeys.includes(item.optionKey)));

                let itemCardClass =
                  "border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:border-primary/60 hover:bg-slate-50/70 dark:hover:bg-slate-800/70";
                let badgeClass =
                  "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-primary group-hover:text-white";

                if (grade) {
                  if (isSelectedByUser) {
                    if (isCorrectOption || (grade.isCorrect && !gradedOpt)) {
                      itemCardClass =
                        "border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40 text-slate-900 dark:text-white shadow-sm ring-2 ring-emerald-500/30";
                      badgeClass = "bg-emerald-600 text-white font-black";
                    } else {
                      itemCardClass =
                        "border-rose-500 bg-rose-50/80 dark:bg-rose-950/40 text-slate-900 dark:text-white shadow-sm ring-2 ring-rose-500/30";
                      badgeClass = "bg-rose-600 text-white font-black";
                    }
                  } else if (isCorrectOption) {
                    itemCardClass =
                      "border-emerald-400 bg-emerald-50/40 dark:bg-emerald-950/20 text-slate-900 dark:text-white ring-1 ring-emerald-400/50";
                    badgeClass = "bg-emerald-500 text-white font-black";
                  } else {
                    itemCardClass =
                      "border-slate-200/60 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/40 text-slate-400 opacity-60";
                    badgeClass = "bg-slate-100 dark:bg-slate-800 text-slate-400";
                  }
                } else if (isSelectedByUser) {
                  itemCardClass =
                    "border-primary bg-primary/10 text-slate-900 dark:text-white shadow-md ring-2 ring-primary/30";
                  badgeClass = "bg-primary text-white";
                }

                return (
                  <div key={item.optionKey} className="space-y-1.5">
                    <button
                      type="button"
                      disabled={disabled || Boolean(grade)}
                      onClick={() => {
                        if (typeCode === "MULTI_CHOICE") {
                          setMulti((prev) =>
                            prev.includes(item.optionKey)
                              ? prev.filter((key) => key !== item.optionKey)
                              : [...prev, item.optionKey],
                          );
                        } else {
                          setSelected(item.optionKey);
                        }
                      }}
                      className={`group flex items-center gap-3.5 w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer disabled:cursor-default select-none ${itemCardClass}`}
                    >
                      <span
                        className={`flex items-center justify-center size-8 rounded-xl text-xs font-black transition-colors shrink-0 ${badgeClass}`}
                      >
                        {grade && isSelectedByUser ? (
                          isCorrectOption ? (
                            <Check className="size-4 stroke-[3]" />
                          ) : (
                            <X className="size-4 stroke-[3]" />
                          )
                        ) : (
                          item.optionKey || String.fromCharCode(65 + idx)
                        )}
                      </span>

                      <span className="text-sm sm:text-base font-semibold flex-1 leading-snug">
                        {item.content}
                      </span>

                      {/* Graded indicator label */}
                      {grade && (
                        <div className="shrink-0 text-xs font-bold">
                          {isSelectedByUser ? (
                            isCorrectOption ? (
                              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                <CheckCircle2 className="size-4" /> Bạn đã chọn đúng
                              </span>
                            ) : (
                              <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1">
                                <XCircle className="size-4" /> Bạn đã chọn sai
                              </span>
                            )
                          ) : isCorrectOption ? (
                            <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 className="size-4" /> Đáp án chính xác
                            </span>
                          ) : null}
                        </div>
                      )}
                    </button>

                    {/* Option Feedback (if returned by backend) */}
                    {grade && gradedOpt && pickLocaleText(locale, gradedOpt.feedback, gradedOpt.feedbackEn) && (
                      <div className="pl-12 pr-4 py-1 text-xs text-slate-500 italic">
                        {pickLocaleText(locale, gradedOpt.feedback, gradedOpt.feedbackEn)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* SUBMIT OR RESET ACTION BAR */}
        {!hideSubmitButton && (
          <div className="pt-3 flex flex-wrap items-center gap-3">
            {!grade ? (
              <button
                type="button"
                disabled={disabled || submitting || !canSubmit}
                onClick={handleSubmit}
                className="w-full inline-flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-sm sm:text-base shadow-xl shadow-primary/25 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer active:scale-98"
              >
                {submitting ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Đang chấm điểm...</span>
                  </span>
                ) : (
                  <>
                    <Send className="size-4" />
                    <span>Kiểm tra đáp án / Nộp bài</span>
                  </>
                )}
              </button>
            ) : (
              onReset && (
                <button
                  type="button"
                  onClick={() => {
                    setSelected("");
                    setMulti([]);
                    setText("");
                    setPairs({});
                    onReset();
                  }}
                  className="inline-flex items-center justify-center gap-2 py-3 px-5 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-primary font-bold text-xs sm:text-sm cursor-pointer transition-all"
                >
                  <RotateCcw className="size-4" />
                  <span>Làm lại câu này</span>
                </button>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
