"use client";

import { WordRow } from "@/components/vocabulary";
import { Link, useRouter } from "@/i18n/routing";
import { SRS_STATE_LABELS } from "@/lib/vocab";
import { vocabularyService } from "@/services/vocabulary.service";
import { useAuthStore } from "@/stores/useAuthStore";
import { useToastStore } from "@/stores/useToastStore";
import type { NotebookWord, VocabSrsState } from "@/types/vocabulary";
import {
  BookMarked,
  Calendar,
  Clock3,
  Filter,
  Flame,
  Layers,
  LogIn,
  RotateCcw,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

const STATE_FILTERS: Array<{
  value: "" | VocabSrsState;
  label: string;
  colorClass: string;
}> = [
  { value: "", label: "Tất cả", colorClass: "text-slate-700 dark:text-slate-200" },
  { value: "new", label: "Mới (New)", colorClass: "text-blue-600 dark:text-blue-400" },
  { value: "learning", label: "Đang học", colorClass: "text-sky-600 dark:text-sky-400" },
  { value: "review", label: "Đang ôn tập", colorClass: "text-amber-600 dark:text-amber-400" },
  { value: "mastered", label: "Đã thành thạo", colorClass: "text-emerald-600 dark:text-emerald-400" },
  { value: "lapsed", label: "Hay quên (Lapsed)", colorClass: "text-rose-600 dark:text-rose-400" },
];

export default function VocabularyNotebookPage() {
  const { isAuthenticated } = useAuthStore();
  const { addToast } = useToastStore();
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [state, setState] = useState<"" | VocabSrsState>("");
  const [dueOnly, setDueOnly] = useState(false);
  const [rows, setRows] = useState<NotebookWord[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const load = async (nextKeyword = keyword, nextState = state, nextDue = dueOnly) => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const where: { keyword?: string; state?: string; dueOnly?: boolean } = {};
      if (nextKeyword.trim()) where.keyword = nextKeyword.trim();
      if (nextState) where.state = nextState;
      if (nextDue) where.dueOnly = true;
      const res = await vocabularyService.myNotebook(0, 50, where);
      setRows(res.data);
      setTotal(res.total);
    } catch (err: any) {
      addToast(err?.message || "Không tải được dữ liệu sổ tay", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    load();
  }, [isAuthenticated]);

  if (!mounted) {
    return (
      <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center space-y-3">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-bold text-slate-500">Đang tải sổ tay từ vựng...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-10 sm:p-16 text-center space-y-4 shadow-sm">
        <div className="w-16 h-16 rounded-3xl bg-amber-50 dark:bg-amber-950/50 text-amber-500 flex items-center justify-center mx-auto">
          <BookMarked className="size-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          Sổ Tay Từ Vựng Cá Nhân
        </h1>
        <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
          Đăng nhập tài khoản để lưu lại toàn bộ từ vựng đã học, theo dõi trạng thái SRS và ôn tập đúng hạn trên mọi thiết bị.
        </p>
        <Link
          href={`/login?redirect=${encodeURIComponent("/vocabulary/notebook")}`}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary text-white text-sm font-bold shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all cursor-pointer"
        >
          <LogIn className="size-4" /> Đăng nhập ngay
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-linear-to-r from-slate-900 via-primary/90 to-slate-900 text-white shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-amber-300">
            <Sparkles className="size-3.5" />
            <span>Sổ Tay Cá Nhân Của Bạn</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Sổ Tay Từ Vựng SRS
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Bạn đang lưu trữ <strong className="text-amber-300 font-bold">{total}</strong> từ vựng theo thuật toán lặp lại ngắt quãng.
          </p>
        </div>

        <button
          type="button"
          onClick={() => router.push("/vocabulary/review")}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white text-xs sm:text-sm font-black shadow-lg shadow-amber-500/30 transition-all cursor-pointer shrink-0 active:scale-98"
        >
          <Flame className="size-4 fill-current" /> Ôn tập thẻ đến hạn
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="size-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") load();
          }}
          placeholder="Tìm headword hoặc nghĩa trong sổ tay của bạn..."
          className="w-full h-12 pl-11 pr-4 rounded-2xl border-2 border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-primary focus:outline-none transition-colors shadow-2xs"
        />
      </div>

      {/* Filter Tabs & Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
        <div className="flex flex-wrap items-center gap-1.5">
          {STATE_FILTERS.map((item) => {
            const active = state === item.value;
            return (
              <button
                key={item.value || "all"}
                type="button"
                onClick={() => {
                  setState(item.value);
                  load(keyword, item.value, dueOnly);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all duration-200 cursor-pointer ${
                  active
                    ? "bg-primary text-white border-primary shadow-sm"
                    : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-primary/50"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Due Only Switch */}
        <button
          type="button"
          onClick={() => {
            const next = !dueOnly;
            setDueOnly(next);
            load(keyword, state, next);
          }}
          className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold border transition-all duration-200 cursor-pointer ${
            dueOnly
              ? "bg-amber-500 text-white border-amber-500 shadow-sm"
              : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-amber-500/50"
          }`}
        >
          <Flame className="size-3.5 fill-current" />
          <span>Chỉ xem thẻ đến hạn ôn</span>
        </button>
      </div>

      {/* List / Results */}
      {loading ? (
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center space-y-3">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-bold text-slate-500">Đang tải danh sách sổ tay...</p>
        </div>
      ) : rows.length > 0 ? (
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
          <div className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 flex justify-between">
            <span>Từ vựng & Trạng thái SRS</span>
            <span>Hiển thị {rows.length} từ</span>
          </div>
          {rows.map((word) => (
            <WordRow
              key={word.id}
              word={word}
              extra={
                <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-300">
                    {SRS_STATE_LABELS[word.srsState] || word.srsState}
                  </span>
                  {word.nextReviewAt && (
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="size-3" />
                      Ôn tiếp: {new Date(word.nextReviewAt).toLocaleDateString("vi-VN")}
                    </span>
                  )}
                  {typeof word.intervalDays === "number" && (
                    <span className="inline-flex items-center gap-1">
                      <Clock3 className="size-3" />
                      Giãn cách: {word.intervalDays} ngày
                    </span>
                  )}
                </div>
              }
            />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 p-12 text-center space-y-3 bg-white dark:bg-slate-900/40">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <BookMarked className="size-7" />
          </div>
          <h3 className="text-lg font-black text-slate-800 dark:text-slate-200">
            Sổ tay chưa có từ nào khớp
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            Hãy bắt đầu học một bộ thẻ từ vựng trong Catalog để tự động thêm từ vào sổ tay SRS.
          </p>
          <Link
            href="/vocabulary"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow-md hover:bg-primary/90 transition-colors"
          >
            <Layers className="size-3.5" /> Khám phá kho bộ thẻ
          </Link>
        </div>
      )}
    </div>
  );
}
