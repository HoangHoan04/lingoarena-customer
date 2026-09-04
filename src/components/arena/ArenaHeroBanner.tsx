"use client";

import { useArenaStore } from "@/stores/useArenaStore";
import {
  Flame,
  Swords,
  Trophy,
  Zap,
} from "lucide-react";
import React from "react";

export default function ArenaHeroBanner() {
  const { currentSeason, leaderboard } = useArenaStore();

  return (
    <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#121226] via-[#1a1c3d] to-[#2d1b4e] text-white p-6 sm:p-10 shadow-2xl border border-purple-500/20 select-none mb-8">
      <div className="absolute -top-20 -right-20 size-80 rounded-full bg-purple-600/25 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 size-80 rounded-full bg-rose-600/25 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-linear-to-r from-purple-500/20 to-rose-500/20 backdrop-blur-md border border-purple-400/30 text-xs font-black text-amber-300 shadow-inner">
          <Flame className="size-4 fill-amber-400 text-amber-400 animate-pulse" />
          <span>ĐẤU TRƯỜNG 1V1 · DỮ LIỆU THỰC</span>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight uppercase">
            Đấu Trí Tranh Tài ·{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-400 via-rose-400 to-purple-400">
              Leo hạng Arena
            </span>
          </h1>
          <p className="text-xs sm:text-base text-purple-200/90 leading-relaxed font-normal max-w-2xl">
            Ghép trận luyện với bot hoặc xếp hàng đấu xếp hạng. Điểm Elo, lịch sử trận và bảng xếp hạng lấy từ API, không dùng số liệu giả.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 pt-4 border-t border-white/15">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
            <div className="size-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Trophy className="size-5" />
            </div>
            <div>
              <p className="text-xs text-purple-200 font-semibold">Mùa giải</p>
              <p className="text-sm sm:text-base font-black text-white">
                {currentSeason?.title || "Theo kỹ năng thi"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
            <div className="size-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
              <Swords className="size-5" />
            </div>
            <div>
              <p className="text-xs text-purple-200 font-semibold">Bảng xếp hạng</p>
              <p className="text-sm sm:text-base font-black text-white">
                {leaderboard.length ? `${leaderboard.length} đấu thủ` : "Chưa có dữ liệu"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs col-span-2 sm:col-span-1">
            <div className="size-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Zap className="size-5" />
            </div>
            <div>
              <p className="text-xs text-purple-200 font-semibold">Chế độ</p>
              <p className="text-sm sm:text-base font-black text-emerald-400">Practice / Ranked</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
