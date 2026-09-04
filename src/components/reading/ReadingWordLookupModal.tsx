"use client";

import type { DictionaryEntry } from "@/types/reading";
import { useToastStore } from "@/stores/useToastStore";
import { useTranslateStore } from "@/stores/useTranslateStore";
import {
  Bookmark,
  BookmarkCheck,
  Check,
  ExternalLink,
  Globe,
  Lightbulb,
  Sparkles,
  Volume2,
  X,
} from "lucide-react";
import { useState } from "react";

interface ReadingWordLookupModalProps {
  entry: DictionaryEntry | null;
  sentenceContext?: string;
  onClose: () => void;
}

export function ReadingWordLookupModal({
  entry,
  sentenceContext,
  onClose,
}: ReadingWordLookupModalProps) {
  const { addToast } = useToastStore();
  const { openTranslate, setSourceText } = useTranslateStore();

  const [isSaved, setIsSaved] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  if (!entry) return null;

  const handleSpeak = (text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 0.9;
      setIsPlayingAudio(true);
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    } else {
      addToast("Trình duyệt không hỗ trợ phát âm thanh.", "info");
    }
  };

  const handleSaveToNotebook = () => {
    setIsSaved(true);
    try {
      const saved = JSON.parse(localStorage.getItem("lingoarena_notebook_words") || "[]");
      if (!saved.some((item: any) => item.word === entry.word)) {
        saved.push({
          word: entry.word,
          meaning: entry.meaningVi,
          phonetic: entry.phonetic,
          level: entry.level,
          savedAt: new Date().toISOString(),
        });
        localStorage.setItem("lingoarena_notebook_words", JSON.stringify(saved));
      }
      addToast(`Đã lưu "${entry.word}" vào Sổ tay từ vựng của bạn!`, "success");
    } catch {
      addToast(`Đã lưu "${entry.word}" vào sổ tay!`, "success");
    }
  };

  const handleOpenGoogleTranslate = () => {
    setSourceText(sentenceContext || entry.word);
    openTranslate();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-5 shadow-2xl animate-in zoom-in-95 my-8">
        {/* TOP HEADER */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300">
              <Globe className="size-4" />
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Từ Điển & Dịch Nghĩa Trực Tiếp
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* WORD TITLE, PHONETICS & AUDIO */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 dark:bg-slate-850 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white capitalize">
                {entry.word}
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300 text-[10px] font-black uppercase">
                {entry.level}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-bold italic">
                {entry.partOfSpeech}
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono font-bold text-slate-500">
              <span>US: {entry.phonetic}</span>
              {entry.ukPhonetic && <span>· UK: {entry.ukPhonetic}</span>}
            </div>
          </div>

          {/* SPEAK BUTTON */}
          <button
            type="button"
            onClick={() => handleSpeak(entry.word)}
            className={`p-3 rounded-2xl transition-all cursor-pointer shadow-md ${
              isPlayingAudio
                ? "bg-cyan-600 text-white animate-pulse"
                : "bg-cyan-600 hover:bg-cyan-700 text-white"
            }`}
            title="Phát âm từ này (Audio)"
          >
            <Volume2 className="size-5" />
          </button>
        </div>

        {/* VIETNAMESE MEANING */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Nghĩa tiếng Việt:
          </span>
          <div className="p-3.5 rounded-2xl bg-cyan-50/70 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-900/60 text-sm font-bold text-cyan-950 dark:text-cyan-200 leading-relaxed">
            {entry.meaningVi}
          </div>
        </div>

        {/* ENGLISH DEFINITION */}
        {entry.definitionEn && (
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Định nghĩa học thuật (English):
            </span>
            <p className="text-xs text-slate-600 dark:text-slate-400 italic">
              "{entry.definitionEn}"
            </p>
          </div>
        )}

        {/* BILINGUAL EXAMPLES */}
        {entry.examples && entry.examples.length > 0 && (
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Ví dụ minh họa song ngữ:
            </span>
            <div className="space-y-2 max-h-36 overflow-y-auto pr-1 custom-scrollbar text-xs">
              {entry.examples.map((ex, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800 space-y-1"
                >
                  <p className="font-bold text-slate-900 dark:text-white font-sans">
                    💬 "{ex.en}"
                  </p>
                  <p className="text-slate-500 italic">
                    ➜ {ex.vi}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* COLLOCATIONS PILLS */}
        {entry.collocations && entry.collocations.length > 0 && (
          <div className="space-y-1.5 pt-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Cụm từ hay gặp (Collocations):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {entry.collocations.map((col, cIdx) => (
                <span
                  key={cIdx}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-semibold"
                >
                  {col}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* BOTTOM ACTION BUTTONS */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={handleSaveToNotebook}
            className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              isSaved
                ? "bg-emerald-50 text-emerald-700 border-emerald-400 dark:bg-emerald-950/60 dark:text-emerald-300 font-black"
                : "border-slate-200 dark:border-slate-700 hover:bg-slate-100 text-slate-700 dark:text-slate-300"
            }`}
          >
            {isSaved ? <BookmarkCheck className="size-4 text-emerald-600" /> : <Bookmark className="size-4" />}
            <span>{isSaved ? "Đã lưu sổ tay" : "Lưu vào sổ tay"}</span>
          </button>

          <button
            type="button"
            onClick={handleOpenGoogleTranslate}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black shadow-md cursor-pointer"
          >
            <ExternalLink className="size-3.5" />
            <span>Mở Google Dịch Toàn Văn</span>
          </button>
        </div>
      </div>
    </div>
  );
}
