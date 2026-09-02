"use client";

import { cefrBadgeClass } from "@/lib/vocab";
import type { PracticeAnswer, PublicQuestion } from "@/types/question";
import {
  BookOpen,
  CheckCircle2,
  FileQuestion,
  Headphones,
  HelpCircle,
  ImageIcon,
  Send,
  Sparkles,
  Volume2,
  ZoomIn,
} from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";

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
  disabled,
  onSubmit,
}: {
  question: PublicQuestion;
  disabled?: boolean;
  onSubmit: (answer: PracticeAnswer) => void;
}) {
  const [selected, setSelected] = useState<string>("");
  const [multi, setMulti] = useState<string[]>([]);
  const [text, setText] = useState("");
  const [pairs, setPairs] = useState<Record<string, string>>({});
  const [showImageZoom, setShowImageZoom] = useState(false);

  const typeCode = question.questionType?.code || "SINGLE_CHOICE";
  const options = useMemo(
    () => [...(question.options || [])].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)),
    [question.options],
  );

  const matching = useMemo(() => matchingSides(question), [question]);

  const handleSubmit = () => {
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

  const passage = question.questionGroup?.passageText;
  const audio = question.audioUrl || question.questionGroup?.audioUrl;
  const image = question.imageUrl || question.questionGroup?.imageUrl;

  return (
    <div className="space-y-6">
      {/* READING PASSAGE / STIMULUS (If applicable) */}
      {passage && (
        <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <BookOpen className="size-4 text-primary dark:text-[#7b9bee]" />
              <span className="text-xs font-black uppercase tracking-wider text-primary dark:text-[#7b9bee]">
                Ngữ Liệu Đoạn Văn Đọc Hiểu
              </span>
            </div>
            {question.questionGroup?.title && (
              <span className="text-xs font-bold text-slate-500">
                {question.questionGroup.title}
              </span>
            )}
          </div>

          <div className="prose dark:prose-invert max-w-none text-sm sm:text-base leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-wrap font-serif">
            {passage}
          </div>
        </div>
      )}

      {/* AUDIO PLAYER (If applicable) */}
      {audio && (
        <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            <Headphones className="size-4" />
            <span>Audio Nghe Đính Kèm</span>
          </div>
          <audio controls src={audio} className="w-full rounded-xl focus:outline-none" />
        </div>
      )}

      {/* IMAGE MEDIA (If applicable) */}
      {image && (
        <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm overflow-hidden flex flex-col items-center">
          <div className="relative max-h-80 w-full overflow-hidden rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center cursor-pointer" onClick={() => setShowImageZoom(!showImageZoom)}>
            <img
              src={image}
              alt="Question illustration"
              className={`rounded-2xl object-contain transition-transform duration-300 ${
                showImageZoom ? "max-h-[500px]" : "max-h-72"
              }`}
            />
          </div>
          <button
            type="button"
            onClick={() => setShowImageZoom(!showImageZoom)}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-400 hover:text-primary mt-2 cursor-pointer"
          >
            <ZoomIn className="size-3.5" />
            <span>{showImageZoom ? "Thu nhỏ ảnh" : "Xem ảnh lớn hơn"}</span>
          </button>
        </div>
      )}

      {/* QUESTION MAIN CARD */}
      <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-6 shadow-xl">
        {/* Meta badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-2">
            {question.examType && (
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary dark:text-[#7b9bee] text-xs font-black tracking-wider uppercase">
                {question.examType.name}
              </span>
            )}
            {question.examSkill && (
              <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold">
                {question.examSkill.name}
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
        </div>

        {/* Prompt */}
        <div className="space-y-2">
          <h2 className="text-base sm:text-lg lg:text-xl font-black text-slate-900 dark:text-white leading-relaxed whitespace-pre-wrap">
            {question.prompt}
          </h2>

          {question.instructions && (
            <p className="text-xs sm:text-sm text-slate-500 italic pl-3 border-l-2 border-primary/30">
              {question.instructions}
            </p>
          )}
        </div>

        {/* ANSWERS CONTAINER */}
        <div className="space-y-3 pt-2">
          {typeCode === "MATCHING" ? (
            <div className="space-y-3">
              {matching.left.length === 0 ? (
                <p className="text-sm text-slate-500">Câu nối cặp chưa có cặp trái/phải.</p>
              ) : (
                matching.left.map((left) => (
                  <div
                    key={left.key}
                    className="grid sm:grid-cols-[1fr_auto_1fr] gap-2 items-center rounded-2xl border border-slate-200 dark:border-slate-800 p-3"
                  >
                    <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                      <span className="mr-2 text-xs font-black text-primary">{left.key}.</span>
                      {left.content}
                    </div>
                    <span className="hidden sm:block text-slate-400 text-xs font-bold">→</span>
                    <select
                      disabled={disabled}
                      value={pairs[left.key] || ""}
                      onChange={(event) =>
                        setPairs((prev) => ({ ...prev, [left.key]: event.target.value }))
                      }
                      className="h-11 w-full rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm font-semibold focus:border-primary focus:outline-none"
                    >
                      <option value="">Chọn đáp án</option>
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
            <div className="space-y-2">
              <input
                value={text}
                disabled={disabled}
                onChange={(event) => setText(event.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && canSubmit && !disabled) handleSubmit();
                }}
                placeholder="Gõ đáp án của bạn tại đây..."
                className="w-full h-13 px-5 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-sm sm:text-base font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-primary focus:bg-white dark:focus:bg-slate-900 focus:outline-none transition-colors"
                autoFocus
              />
              <p className="text-[11px] text-slate-400 pl-1">Nhấn Enter để nộp bài nhanh</p>
            </div>
          ) : typeCode === "TRUE_FALSE_NG" && options.length === 0 ? (
            <div className="grid sm:grid-cols-3 gap-3">
              {[
                { key: "TRUE", label: "TRUE", desc: "Đúng theo ngữ liệu" },
                { key: "FALSE", label: "FALSE", desc: "Sai so với ngữ liệu" },
                { key: "NOT_GIVEN", label: "NOT GIVEN", desc: "Không được đề cập" },
              ].map((item) => {
                const active = selected === item.key;
                return (
                  <button
                    key={item.key}
                    type="button"
                    disabled={disabled}
                    onClick={() => setSelected(item.key)}
                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 font-black transition-all cursor-pointer disabled:cursor-default select-none ${
                      active
                        ? "border-primary bg-primary/10 text-primary dark:text-[#7b9bee] shadow-md ring-2 ring-primary/30"
                        : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:border-primary/50"
                    }`}
                  >
                    <span className="text-base">{item.label}</span>
                    <span className="text-[10px] font-normal text-slate-400 mt-0.5">
                      {item.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="grid gap-3">
              {options.map((item) => {
                const active =
                  typeCode === "MULTI_CHOICE"
                    ? multi.includes(item.optionKey)
                    : selected === item.optionKey;

                return (
                  <button
                    key={item.optionKey}
                    type="button"
                    disabled={disabled}
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
                    className={`group flex items-center gap-3.5 w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer disabled:cursor-default select-none ${
                      active
                        ? "border-primary bg-primary/10 text-slate-900 dark:text-white shadow-md ring-2 ring-primary/30"
                        : "border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:border-primary/60 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    <span
                      className={`flex items-center justify-center size-8 rounded-xl text-xs font-black transition-colors shrink-0 ${
                        active
                          ? "bg-primary text-white"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-primary group-hover:text-white"
                      }`}
                    >
                      {item.optionKey}
                    </span>
                    <span className="text-sm sm:text-base font-semibold flex-1 leading-snug">
                      {item.content}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* SUBMIT BUTTON */}
        <div className="pt-2">
          <button
            type="button"
            disabled={disabled || !canSubmit}
            onClick={handleSubmit}
            className="w-full inline-flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-sm sm:text-base shadow-xl shadow-primary/25 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer active:scale-98"
          >
            <Send className="size-4" />
            <span>Xác nhận & Nộp đáp án</span>
          </button>
        </div>
      </div>
    </div>
  );
}
