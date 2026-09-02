"use client";

import { useTranslateStore, type TranslateItem } from "@/stores/useTranslateStore";
import {
  Clock,
  Copy,
  History,
  RotateCcw,
  Search,
  Star,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";

export default function TranslateHistoryDrawer({
  isOpen,
  onClose,
  type,
}: {
  isOpen: boolean;
  onClose: () => void;
  type: "history" | "saved";
}) {
  const {
    history,
    savedPhrases,
    clearHistory,
    toggleStarPhrase,
    setSourceText,
    setTranslatedText,
    setSourceLang,
    setTargetLang,
  } = useTranslateStore();

  const [search, setSearch] = useState("");

  if (!isOpen) return null;

  const items = type === "history" ? history : savedPhrases;

  const filteredItems = items.filter(
    (item) =>
      item.sourceText.toLowerCase().includes(search.toLowerCase()) ||
      item.translatedText.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSelect = (item: TranslateItem) => {
    setSourceText(item.sourceText);
    setTranslatedText(item.translatedText);
    setSourceLang(item.sourceLang);
    setTargetLang(item.targetLang);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50/70 dark:bg-slate-800/40">
          <div className="flex items-center gap-2">
            {type === "history" ? (
              <History className="size-5 text-primary dark:text-[#7b9bee]" />
            ) : (
              <Star className="size-5 text-amber-500 fill-amber-500" />
            )}
            <h3 className="font-black text-base sm:text-lg text-slate-900 dark:text-white">
              {type === "history" ? "Lịch sử dịch" : "Cụm từ đã lưu (Saved)"}
            </h3>
          </div>

          <div className="flex items-center gap-1">
            {type === "history" && items.length > 0 && (
              <button
                type="button"
                onClick={clearHistory}
                className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold transition-colors cursor-pointer"
                title="Xóa toàn bộ lịch sử"
              >
                <Trash2 className="size-4" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* Search */}
        {items.length > 0 && (
          <div className="p-3.5 border-b border-slate-100 dark:border-slate-800">
            <div className="relative">
              <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm kiếm trong danh sách..."
                className="w-full h-9 pl-9 pr-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => handleSelect(item)}
                className="group relative p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-850 hover:border-primary/50 hover:shadow-md transition-all cursor-pointer space-y-2"
              >
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                  <span className="uppercase tracking-wider">
                    {item.sourceLang} → {item.targetLang}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleStarPhrase(item);
                    }}
                    className="p-1 rounded-md text-slate-400 hover:text-amber-500 cursor-pointer"
                  >
                    <Star
                      className={`size-3.5 ${
                        item.isStarred ? "text-amber-500 fill-amber-500" : ""
                      }`}
                    />
                  </button>
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 line-clamp-2">
                    {item.sourceText}
                  </p>
                  <p className="text-xs font-bold text-primary dark:text-[#7b9bee] line-clamp-2 mt-1">
                    {item.translatedText}
                  </p>
                </div>

                <div className="text-[10px] text-slate-400 pt-1 flex items-center gap-1">
                  <Clock className="size-2.5" />
                  <span>{new Date(item.timestamp).toLocaleDateString("vi-VN")}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="py-16 text-center space-y-3 text-slate-400">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                {type === "history" ? <History className="size-6" /> : <Star className="size-6" />}
              </div>
              <p className="text-xs font-medium">
                {type === "history" ? "Chưa có lịch sử dịch gần đây" : "Chưa có cụm từ nào được lưu"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
