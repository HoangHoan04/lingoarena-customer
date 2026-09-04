"use client";

import type { CheatSheetItem } from "@/types/grammar";
import { FileText } from "lucide-react";
import { useMemo, useState } from "react";

interface GrammarCheatSheetProps {
  keyword: string;
  items?: CheatSheetItem[];
}

export function GrammarCheatSheet({ keyword, items = [] }: GrammarCheatSheetProps) {
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const categories = useMemo(
    () => ["ALL", ...Array.from(new Set(items.map((item) => item.category).filter(Boolean)))],
    [items],
  );

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (selectedCategory !== "ALL" && item.category !== selectedCategory) return false;
      if (keyword.trim()) {
        const q = keyword.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesSignal = item.signalWords.some((w) => w.toLowerCase().includes(q));
        const matchesFormula = item.formulaAffirmative.toLowerCase().includes(q);
        if (!matchesName && !matchesSignal && !matchesFormula) return false;
      }
      return true;
    });
  }, [items, selectedCategory, keyword]);

  if (!items.length) {
    return (
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-10 text-center space-y-2">
        <FileText className="size-10 mx-auto text-slate-400" />
        <p className="font-bold">Chưa có công thức ngữ pháp</p>
        <p className="text-sm text-slate-500">Sổ tay sẽ hiển thị khi cấu trúc đã được xuất bản.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              selectedCategory === cat
                ? "bg-blue-600 text-white border-blue-600 shadow-xs font-black"
                : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50"
            }`}
          >
            {cat === "ALL" ? "Tất cả công thức" : cat}
          </button>
        ))}
      </div>

      {filteredItems.length === 0 ? (
        <p className="text-sm text-slate-500 text-center py-8">Không có công thức khớp bộ lọc.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredItems.map((item, idx) => (
            <div
              key={`${item.name}-${idx}`}
              className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h4 className="text-base font-black text-slate-900 dark:text-white">{item.name}</h4>
                  <span className="text-[11px] font-bold text-slate-400">{item.category}</span>
                </div>
                {item.level ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 text-[10px] font-black uppercase">
                    {item.level}
                  </span>
                ) : null}
              </div>
              <div className="space-y-2 text-xs font-mono">
                {item.formulaAffirmative ? (
                  <div className="p-2.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/60 text-emerald-900 dark:text-emerald-200">
                    <strong className="text-emerald-700 dark:text-emerald-400 font-sans font-black mr-2">(+):</strong>
                    {item.formulaAffirmative}
                  </div>
                ) : null}
                {item.formulaNegative ? (
                  <div className="p-2.5 rounded-xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200/60 text-rose-900 dark:text-rose-200">
                    <strong className="text-rose-700 dark:text-rose-400 font-sans font-black mr-2">(-):</strong>
                    {item.formulaNegative}
                  </div>
                ) : null}
                {item.formulaQuestion ? (
                  <div className="p-2.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/60 text-blue-900 dark:text-blue-200">
                    <strong className="text-blue-700 dark:text-blue-400 font-sans font-black mr-2">(?):</strong>
                    {item.formulaQuestion}
                  </div>
                ) : null}
              </div>
              {item.signalWords.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {item.signalWords.map((sig) => (
                    <span key={sig} className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold">
                      {sig}
                    </span>
                  ))}
                </div>
              )}
              {item.example ? (
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 text-xs italic">
                  💬 <strong>Ví dụ:</strong> "{item.example}"
                </div>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
