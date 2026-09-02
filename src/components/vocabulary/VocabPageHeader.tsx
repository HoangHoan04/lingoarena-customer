"use client";

import { Link } from "@/i18n/routing";
import { BookMarked, Flame, Gamepad2, HelpCircle, Sparkles } from "lucide-react";

export default function VocabPageHeader() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-slate-900 via-[#1e2f5e] to-slate-900 text-white p-6 sm:p-10 border border-slate-800 shadow-xl">
      {/* Background Decorative Glow */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold uppercase tracking-wider text-blue-200">
          <Sparkles className="size-3.5 text-amber-400 animate-pulse" />
          <span>Hệ Thống Luyện Từ Vựng Thông Minh</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
          Học từ vựng nhớ lâu với{" "}
          <span className="bg-linear-to-r from-blue-300 via-indigo-200 to-sky-300 bg-clip-text text-transparent">
            Spaced Repetition (SRS)
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
          Chinh phục hơn 5.000+ từ vựng cốt lõi TOEIC, IELTS, Oxford và Giao tiếp. Thuật toán khoa học SM-2 nhắc bạn ôn tập đúng thời điểm trí nhớ bắt đầu phai mờ.
        </p>

        {/* Quick Access Action Badges */}
        <div className="pt-2 flex flex-wrap gap-2.5">
          <Link
            href="/vocabulary/review"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs sm:text-sm font-bold shadow-lg shadow-amber-500/30 transition-all hover:scale-102"
          >
            <Flame className="size-4 fill-current" />
            <span>Ôn thẻ đến hạn</span>
          </Link>
          <Link
            href="/vocabulary/notebook"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 text-white text-xs sm:text-sm font-bold transition-colors"
          >
            <BookMarked className="size-4 text-sky-300" />
            <span>Sổ tay từ vựng</span>
          </Link>
          <Link
            href="/vocabulary/games"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 text-white text-xs sm:text-sm font-bold transition-colors"
          >
            <Gamepad2 className="size-4 text-emerald-300" />
            <span>Trò chơi nối nghĩa</span>
          </Link>
          <Link
            href="/vocabulary/srs"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 text-white text-xs sm:text-sm font-bold transition-colors"
          >
            <HelpCircle className="size-4 text-purple-300" />
            <span>SRS là gì?</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
