"use client";

import { ALL_LANGUAGES, type LanguageOption } from "./TranslateLanguages";
import { Check, Globe2, Search, X } from "lucide-react";
import { useMemo, useState } from "react";

export default function TranslateLanguagePicker({
  isOpen,
  onClose,
  selectedLang,
  onSelectLang,
  isSource,
}: {
  isOpen: boolean;
  onClose: () => void;
  selectedLang: string;
  onSelectLang: (code: string) => void;
  isSource?: boolean;
}) {
  const [search, setSearch] = useState("");

  const filteredLanguages = useMemo(() => {
    if (!search.trim()) return ALL_LANGUAGES;
    const q = search.toLowerCase().trim();
    return ALL_LANGUAGES.filter(
      (lang) =>
        lang.name.toLowerCase().includes(q) ||
        lang.nativeName.toLowerCase().includes(q) ||
        lang.code.toLowerCase().includes(q),
    );
  }, [search]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50/70 dark:bg-slate-800/40">
          <div className="flex items-center gap-2">
            <Globe2 className="size-5 text-primary dark:text-[#7b9bee]" />
            <h3 className="font-black text-base sm:text-lg text-slate-900 dark:text-white">
              {isSource ? "Chọn ngôn ngữ nguồn" : "Chọn ngôn ngữ đích"}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Search input */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800">
          <div className="relative">
            <Search className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm ngôn ngữ (Tiếng Anh, Japanese, Pháp...)"
              className="w-full h-11 pl-10 pr-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-primary focus:bg-white dark:focus:bg-slate-900 focus:outline-none transition-colors"
              autoFocus
            />
          </div>
        </div>

        {/* Languages List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {isSource && (
            <button
              type="button"
              onClick={() => {
                onSelectLang("auto");
                onClose();
              }}
              className={`flex items-center justify-between p-3 rounded-2xl border text-left text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                selectedLang === "auto"
                  ? "bg-primary text-white border-primary shadow-sm"
                  : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200"
              }`}
            >
              <span>🌐 Phát hiện ngôn ngữ</span>
              {selectedLang === "auto" && <Check className="size-4 text-white shrink-0" />}
            </button>
          )}

          {filteredLanguages.map((lang) => {
            const isSelected = selectedLang === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => {
                  onSelectLang(lang.code);
                  onClose();
                }}
                className={`flex items-center justify-between p-3 rounded-2xl border text-left text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-primary text-white border-primary shadow-sm"
                    : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200"
                }`}
              >
                <div className="min-w-0 pr-2">
                  <span className="block truncate">
                    {lang.flag} {lang.name}
                  </span>
                  <span
                    className={`block text-[10px] font-normal truncate ${
                      isSelected ? "text-white/80" : "text-slate-400"
                    }`}
                  >
                    {lang.nativeName}
                  </span>
                </div>
                {isSelected && <Check className="size-4 text-white shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
