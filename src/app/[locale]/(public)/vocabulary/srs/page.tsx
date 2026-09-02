"use client";

import { SrsExplainer } from "@/components/vocabulary";
import { Link } from "@/i18n/routing";
import { useAuthStore } from "@/stores/useAuthStore";
import { BrainCircuit, Layers, LogIn, Sparkles } from "lucide-react";

export default function VocabularySrsPage() {
  const { isAuthenticated } = useAuthStore();
  const reviewHref = "/vocabulary/review";
  const reviewLink = isAuthenticated
    ? reviewHref
    : `/login?redirect=${encodeURIComponent(reviewHref)}`;

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-slate-900 via-primary to-slate-900 text-white p-6 sm:p-10 shadow-xl">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-blue-200">
            <BrainCircuit className="size-3.5 text-amber-300" />
            <span>Khoa Học & Phương Pháp Học Tập</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Spaced Repetition (SRS) Là Gì?
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Khám phá nguyên lý lặp lại ngắt quãng SM-2 trên LingoArena giúp bạn nạp hàng ngàn từ vựng tiếng Anh vào trí nhớ dài hạn với thời gian tối thiểu.
          </p>
        </div>
      </div>

      <SrsExplainer />

      {/* Bottom CTA Banner */}
      <div className="p-8 sm:p-10 rounded-3xl bg-linear-to-r from-primary to-[#405ea7] text-white text-center space-y-4 shadow-xl">
        <Sparkles className="size-8 mx-auto text-amber-300 animate-pulse" />
        <h3 className="text-2xl font-black">Sẵn Sàng Trải Nghiệm Học Từ Vựng Hiệu Quả?</h3>
        <p className="text-xs sm:text-sm text-blue-100 max-w-lg mx-auto leading-relaxed">
          Ôn đúng hạn trên sổ tay, hoặc khám phá bộ thẻ công khai. SRS và notebook cần đăng nhập.
        </p>
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <Link
            href={reviewLink}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-amber-400 text-slate-900 text-sm font-black shadow-lg hover:bg-amber-300 transition-all cursor-pointer"
          >
            {isAuthenticated ? <Sparkles className="size-4" /> : <LogIn className="size-4" />}
            {isAuthenticated ? "Ôn tập SRS hôm nay" : "Đăng nhập để ôn SRS"}
          </Link>
          <Link
            href="/vocabulary"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white text-primary text-sm font-black shadow-lg hover:bg-slate-50 transition-all cursor-pointer"
          >
            <Layers className="size-4" /> Khám phá các bộ thẻ từ vựng
          </Link>
        </div>
      </div>
    </div>
  );
}
