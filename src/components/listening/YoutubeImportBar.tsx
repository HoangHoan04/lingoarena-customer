"use client";

import { extractYoutubeId } from "@/lib/youtube";
import { useToastStore } from "@/stores/useToastStore";
import { Link2, Play, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { YoutubeIcon } from "./YoutubeIcon";

interface YoutubeImportBarProps {
  onAnalyzeUrl: (youtubeUrl: string) => void;
  isLoading?: boolean;
}

export function YoutubeImportBar({ onAnalyzeUrl, isLoading }: YoutubeImportBarProps) {
  const [inputUrl, setInputUrl] = useState("");
  const { addToast } = useToastStore();

  const handleAnalyze = () => {
    const clean = inputUrl.trim();
    if (!clean) {
      addToast("Vui lòng dán đường link YouTube cần phân tích.", "error");
      return;
    }

    const ytId = extractYoutubeId(clean);
    if (!ytId) {
      addToast("Đường dẫn YouTube không hợp lệ. Vui lòng kiểm tra lại URL.", "error");
      return;
    }

    onAnalyzeUrl(clean);
  };

  const handleQuickPaste = (sampleUrl: string) => {
    setInputUrl(sampleUrl);
    onAnalyzeUrl(sampleUrl);
  };

  return (
    <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 p-5 sm:p-7 shadow-sm backdrop-blur-xl space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
            <YoutubeIcon className="size-6" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span>Nhập Link Video YouTube Để Phân Tích & Luyện Nghe</span>
              <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 text-[10px] font-black uppercase">
                AI Auto-Transcript
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              Dán bất kỳ link YouTube nào để hệ thống tự động bóc tách phụ đề, dịch nghĩa và tạo bài tập chép chính tả
            </p>
          </div>
        </div>
      </div>

      {/* INPUT FORM */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative w-full flex items-center">
          <Link2 className="absolute left-4 size-4.5 text-slate-400 pointer-events-none" />
          <input
            type="url"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
            placeholder="Dán link YouTube (ví dụ: https://www.youtube.com/watch?v=UF8uR6Z6KLc hoặc youtu.be/...)"
            className="w-full h-13 pl-12 pr-10 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/70 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-rose-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none transition-colors"
          />
          {inputUrl && (
            <button
              type="button"
              onClick={() => setInputUrl("")}
              className="absolute right-3.5 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        <button
          type="button"
          disabled={isLoading}
          onClick={handleAnalyze}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 h-13 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-black shadow-lg shadow-rose-600/25 transition-all hover:scale-102 cursor-pointer active:scale-98 shrink-0 disabled:opacity-50"
        >
          <Sparkles className="size-4" />
          <span>{isLoading ? "Đang phân tích..." : "Phân tích & Luyện nghe"}</span>
        </button>
      </div>

      {/* QUICK SUGGESTIONS */}
      <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
        <span className="text-slate-400 font-bold mr-1">Video mẫu nổi bật:</span>
        <button
          type="button"
          onClick={() => handleQuickPaste("https://www.youtube.com/watch?v=UF8uR6Z6KLc")}
          className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 hover:border-rose-300 dark:hover:border-rose-800 text-slate-700 dark:text-slate-300 text-[11px] font-bold cursor-pointer transition-colors"
        >
          🎓 Steve Jobs Stanford Speech
        </button>
        <button
          type="button"
          onClick={() => handleQuickPaste("https://www.youtube.com/watch?v=w-HYZv6HzAs")}
          className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 hover:border-rose-300 dark:hover:border-rose-800 text-slate-700 dark:text-slate-300 text-[11px] font-bold cursor-pointer transition-colors"
        >
          💡 TED-Ed: Boost Your Confidence
        </button>
        <button
          type="button"
          onClick={() => handleQuickPaste("https://www.youtube.com/watch?v=7Pq-S557XQU")}
          className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 hover:border-rose-300 dark:hover:border-rose-800 text-slate-700 dark:text-slate-300 text-[11px] font-bold cursor-pointer transition-colors"
        >
          🤖 BBC 6-Minute English: AI Art
        </button>
      </div>
    </div>
  );
}
