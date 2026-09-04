"use client";

import { useToastStore } from "@/stores/useToastStore";
import type { ReadingPassage } from "@/types/reading";
import { Gauge, Pause, Play, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export function ReadingSpeedReader({ passages = [] }: { passages?: ReadingPassage[] }) {
  const { addToast } = useToastStore();
  const [selectedPassageIndex, setSelectedPassageIndex] = useState(0);
  const [wpm, setWpm] = useState(300);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const passage = passages[selectedPassageIndex];

  const allWords = useMemo(() => {
    if (!passage) return [];
    return passage.paragraphs
      .map((p) => p.englishText)
      .join(" ")
      .split(/\s+/)
      .filter(Boolean);
  }, [passage]);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isPlaying && allWords.length) {
      const intervalMs = (60 / wpm) * 1000;
      timer = setInterval(() => {
        setCurrentWordIndex((idx) => {
          if (idx + 1 >= allWords.length) {
            setIsPlaying(false);
            addToast("Đã hoàn thành lượt đọc tốc độ!", "success");
            return idx;
          }
          return idx + 1;
        });
      }, intervalMs);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, wpm, allWords.length, addToast]);

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentWordIndex(0);
  };

  const progressPercent = allWords.length ? Math.round((currentWordIndex / allWords.length) * 100) : 0;

  if (!passages.length) {
    return (
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-10 text-center space-y-2">
        <Gauge className="size-10 mx-auto text-slate-400" />
        <p className="font-bold">Chưa có bài đọc để luyện tốc độ</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-10 shadow-md space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-black">Phòng Luyện Đọc Tốc Độ</h3>
          <p className="text-xs text-slate-400">Rèn luyện phản xạ mắt với bài đọc đã xuất bản</p>
        </div>
        <select
          value={selectedPassageIndex}
          onChange={(e) => {
            setSelectedPassageIndex(Number(e.target.value));
            handleReset();
          }}
          className="h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
        >
          {passages.map((p, idx) => (
            <option key={p.id} value={idx}>
              {p.title}
            </option>
          ))}
        </select>
      </div>
      <div className="rounded-3xl border-2 border-cyan-500/40 bg-slate-950 text-white p-8 sm:p-14 text-center space-y-4">
        <div className="text-xs uppercase tracking-widest text-cyan-400 font-mono font-bold">
          Từ {allWords.length ? currentWordIndex + 1 : 0} / {allWords.length}
        </div>
        <div className="min-h-24 flex items-center justify-center">
          <div className="text-3xl sm:text-5xl font-black">{allWords[currentWordIndex] || "Bắt đầu"}</div>
        </div>
        <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden max-w-md mx-auto">
          <div className="h-full bg-cyan-400" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-cyan-600 text-white font-black text-xs cursor-pointer"
          >
            {isPlaying ? <Pause className="size-4" /> : <Play className="size-4" />}
            {isPlaying ? "Tạm dừng" : "Bắt đầu chạy"}
          </button>
          <button type="button" onClick={handleReset} className="p-3 rounded-2xl border border-slate-200 cursor-pointer">
            <RotateCcw className="size-4" />
          </button>
        </div>
        <div className="flex items-center gap-1.5">
          {[200, 300, 450, 600].map((speed) => (
            <button
              key={speed}
              type="button"
              onClick={() => setWpm(speed)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${wpm === speed ? "bg-cyan-600 text-white border-cyan-600" : "border-slate-200"}`}
            >
              {speed}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
