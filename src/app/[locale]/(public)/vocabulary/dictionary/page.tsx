"use client";

import { WordRow } from "@/components/vocabulary";
import { CEFR_FILTERS, POS_FILTERS, cefrBadgeClass } from "@/lib/vocab";
import { vocabularyService } from "@/services/vocabulary.service";
import { useToastStore } from "@/stores/useToastStore";
import type { VocabWord } from "@/types/vocabulary";
import { BookOpen, Filter, RotateCcw, Search, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";

const POS_LABELS: Record<string, string> = {
  ALL: "Mọi từ loại",
  noun: "Danh từ (n)",
  verb: "Động từ (v)",
  adjective: "Tính từ (adj)",
  adverb: "Trạng từ (adv)",
  phrase: "Cụm từ (phrase)",
};

export default function VocabularyDictionaryPage() {
  const { addToast } = useToastStore();
  const [keyword, setKeyword] = useState("");
  const [cefr, setCefr] = useState<(typeof CEFR_FILTERS)[number]>("ALL");
  const [pos, setPos] = useState<(typeof POS_FILTERS)[number]>("ALL");
  const [words, setWords] = useState<VocabWord[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const delay = keyword ? 300 : 0;
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const where: { keyword?: string; cefrLevel?: string; partOfSpeech?: string } = {};
        if (keyword.trim()) where.keyword = keyword.trim();
        if (cefr !== "ALL") where.cefrLevel = cefr;
        if (pos !== "ALL") where.partOfSpeech = pos;
        const res = await vocabularyService.paginationWords(0, 40, where);
        setWords(res.data);
        setTotal(res.total);
      } catch (err: any) {
        addToast(err?.message || "Không tra cứu được từ", "error");
      } finally {
        setLoading(false);
      }
    }, delay);
    return () => clearTimeout(timer);
  }, [keyword, cefr, pos]);

  const handleClear = () => {
    setKeyword("");
    setCefr("ALL");
    setPos("ALL");
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-primary dark:text-[#7b9bee]">
          <BookOpen className="size-3.5" />
          <span>Tra Cứu Thông Minh</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Từ Điển Học Thuật & Giao Tiếp
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
          Tra cứu nhanh từ vựng, phát âm bản ngữ US/UK, phiên âm IPA, nghĩa tiếng Việt, collocations và câu ví dụ minh họa.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="relative">
        <Search className="size-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder="Nhập từ tiếng Anh hoặc nghĩa tiếng Việt (ví dụ: achieve, thành tựu, schedule...)"
          className="w-full h-13 pl-12 pr-12 rounded-3xl border-2 border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm sm:text-base font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-primary focus:outline-none transition-all shadow-sm"
        />
        {keyword && (
          <button
            type="button"
            onClick={() => setKeyword("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {/* Filters Area */}
      <div className="p-4 sm:p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3.5 shadow-2xs">
        {/* CEFR Level Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-400 mr-2 min-w-[70px]">Cấp độ CEFR:</span>
          {CEFR_FILTERS.map((item) => {
            const active = cefr === item;
            return (
              <button
                key={item}
                type="button"
                onClick={() => setCefr(item)}
                className={`px-3 py-1 rounded-full text-xs font-bold border transition-all duration-200 cursor-pointer ${
                  active
                    ? "bg-primary text-white border-primary shadow-sm shadow-primary/20 scale-102"
                    : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-primary/50"
                }`}
              >
                {item === "ALL" ? "Tất cả CEFR" : item}
              </button>
            );
          })}
        </div>

        {/* Part of Speech Filter */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs font-bold text-slate-400 mr-2 min-w-[70px]">Loại từ vựng:</span>
          {POS_FILTERS.map((item) => {
            const active = pos === item;
            return (
              <button
                key={item}
                type="button"
                onClick={() => setPos(item)}
                className={`px-3 py-1 rounded-full text-xs font-bold border transition-all duration-200 cursor-pointer ${
                  active
                    ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-sm scale-102"
                    : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-400"
                }`}
              >
                {POS_LABELS[item] || item}
              </button>
            );
          })}
        </div>
      </div>

      {/* Result Meta */}
      <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
        <span>
          Tìm thấy <strong className="text-primary dark:text-[#7b9bee]">{total}</strong> từ vựng phù hợp
        </span>
        {(keyword || cefr !== "ALL" || pos !== "ALL") && (
          <button
            type="button"
            onClick={handleClear}
            className="inline-flex items-center gap-1 text-primary dark:text-[#7b9bee] hover:underline cursor-pointer"
          >
            <RotateCcw className="size-3" /> Đặt lại bộ lọc
          </button>
        )}
      </div>

      {/* Results Container */}
      {loading ? (
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center space-y-3">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-bold text-slate-500">Đang tra cứu cơ sở dữ liệu từ vựng...</p>
        </div>
      ) : words.length > 0 ? (
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
          <div className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800">
            Từ vựng & Giải nghĩa chi tiết
          </div>
          {words.map((word) => (
            <WordRow key={word.id} word={word} />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 p-12 text-center space-y-3 bg-white dark:bg-slate-900/40">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <Search className="size-7" />
          </div>
          <h3 className="text-lg font-black text-slate-800 dark:text-slate-200">
            Không tìm thấy từ vựng nào
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            Hãy thử từ khóa khác hoặc bỏ chọn các bộ lọc cấp độ CEFR / Loại từ.
          </p>
          <button
            type="button"
            onClick={handleClear}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-sm hover:bg-primary/90 transition-colors cursor-pointer"
          >
            <RotateCcw className="size-3.5" /> Xóa toàn bộ bộ lọc
          </button>
        </div>
      )}
    </div>
  );
}
