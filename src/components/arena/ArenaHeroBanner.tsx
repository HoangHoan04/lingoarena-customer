"use client";

import { useArenaStore } from "@/stores/useArenaStore";
import {
  Award,
  Crown,
  Flame,
  Gamepad2,
  Hourglass,
  Sparkles,
  Swords,
  Timer,
  Trophy,
  Zap,
} from "lucide-react";
import React from "react";

export default function ArenaHeroBanner() {
  const { currentSeason } = useArenaStore();

  return (
    <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#121226] via-[#1a1c3d] to-[#2d1b4e] text-white p-6 sm:p-10 shadow-2xl border border-purple-500/20 select-none mb-8">
      {/* Dynamic ambient energy glows */}
      <div className="absolute -top-20 -right-20 size-80 rounded-full bg-purple-600/25 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 size-80 rounded-full bg-rose-600/25 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl space-y-6">
        {/* Top Mini Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-linear-to-r from-purple-500/20 to-rose-500/20 backdrop-blur-md border border-purple-400/30 text-xs font-black text-amber-300 shadow-inner">
          <Flame className="size-4 fill-amber-400 text-amber-400 animate-pulse" />
          <span>ĐẤU TRƯỜNG 1V1 REAL-TIME · MÙA {currentSeason.number}</span>
        </div>

        {/* Main Headline */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight uppercase">
            Đấu Trí Tranh Tài ·{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-400 via-rose-400 to-purple-400">
              Vinh Danh Bảng Vàng
            </span>
          </h1>
          <p className="text-xs sm:text-base text-purple-200/90 leading-relaxed font-normal max-w-2xl">
            Thách đấu trực tiếp 1v1 với hàng ngàn cao thủ tiếng Anh trên toàn quốc. Trả lời nhanh, chuẩn xác, giữ vững chuỗi Combo để leo Rank Thách Đấu và nhận phần thưởng mùa giải!
          </p>
        </div>

        {/* Season Rewards & Countdown Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-4 border-t border-white/15">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
            <div className="size-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Trophy className="size-5" />
            </div>
            <div>
              <p className="text-xs text-purple-200 font-semibold">Mùa Giải</p>
              <p className="text-sm sm:text-base font-black text-white">Mùa {currentSeason.number}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
            <div className="size-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
              <Award className="size-5" />
            </div>
            <div>
              <p className="text-xs text-purple-200 font-semibold">Tổng Giải Thưởng</p>
              <p className="text-xs sm:text-sm font-black text-amber-300 truncate max-w-28 sm:max-w-36">
                50.000.000đ
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
            <div className="size-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
              <Hourglass className="size-5" />
            </div>
            <div>
              <p className="text-xs text-purple-200 font-semibold">Kết Thúc Mùa</p>
              <p className="text-xs sm:text-sm font-black text-white">{currentSeason.endDate}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
            <div className="size-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Zap className="size-5" />
            </div>
            <div>
              <p className="text-xs text-purple-200 font-semibold">Đang Tranh Đấu</p>
              <p className="text-sm sm:text-base font-black text-emerald-400">1.420+ Online</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
