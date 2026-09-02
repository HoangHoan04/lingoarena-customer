"use client";

import { RANK_CONFIGS, useArenaStore } from "@/stores/useArenaStore";
import { Award, Crown, Flame, Medal, Trophy, UserCheck } from "lucide-react";
import React from "react";

export default function ArenaLeaderboard() {
  const { leaderboard, userStats } = useArenaStore();
  const top1 = leaderboard[0];
  const top2 = leaderboard[1];
  const top3 = leaderboard[2];

  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return (
    <div className="space-y-6 select-none">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base sm:text-lg font-extrabold text-foreground flex items-center gap-2">
            <Trophy className="size-5 text-amber-400" />
            <span>Bảng Xếp Hạng Đấu Thủ Mùa 4</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Cập nhật theo điểm Elo thời gian thực toàn hệ thống
          </p>
        </div>
      </div>

      {/* TOP 3 PODIUM HERO */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 items-end pt-8 pb-4">
        {/* TOP 2 (Silver) */}
        {top2 && (
          <div className="flex flex-col items-center text-center p-4 rounded-3xl bg-card border border-slate-400/30 shadow-md space-y-2 relative">
            <div className="absolute -top-6 size-10 rounded-full bg-slate-300 text-slate-900 font-black text-sm flex items-center justify-center border-4 border-card shadow-md">
              2
            </div>
            <img
              src={top2.avatar}
              alt={top2.name}
              className="size-14 sm:size-18 rounded-full object-cover border-2 border-slate-300 mt-2"
            />
            <div className="space-y-0.5">
              <h3 className="text-xs sm:text-sm font-extrabold text-foreground truncate max-w-28 sm:max-w-36">
                {top2.name}
              </h3>
              <p className="text-[11px] font-black text-slate-400">
                {formatNumber(top2.elo)} ELO
              </p>
              <span className="text-[10px] text-muted-foreground font-semibold block">
                Thắng {top2.winRate}%
              </span>
            </div>
          </div>
        )}

        {/* TOP 1 (Gold - Big Center) */}
        {top1 && (
          <div className="flex flex-col items-center text-center p-5 sm:p-6 rounded-3xl bg-linear-to-b from-amber-500/15 via-card to-card border-2 border-amber-400/50 shadow-xl space-y-2.5 relative -mt-4">
            <div className="absolute -top-7 size-12 rounded-full bg-amber-400 text-slate-950 font-black text-base flex items-center justify-center border-4 border-card shadow-lg">
              <Crown className="size-6 text-slate-950" />
            </div>
            <img
              src={top1.avatar}
              alt={top1.name}
              className="size-16 sm:size-22 rounded-full object-cover border-3 border-amber-400 mt-3 shadow-md"
            />
            <div className="space-y-0.5">
              <span className="px-2 py-0.2 rounded-md bg-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] font-black uppercase">
                {top1.badge || "QUÁN QUÂN"}
              </span>
              <h3 className="text-sm sm:text-base font-black text-foreground truncate max-w-32 sm:max-w-44">
                {top1.name}
              </h3>
              <p className="text-xs sm:text-sm font-black text-amber-500">
                {formatNumber(top1.elo)} ELO
              </p>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold block">
                🔥 {top1.winCount} Trận thắng ({top1.winRate}%)
              </span>
            </div>
          </div>
        )}

        {/* TOP 3 (Bronze) */}
        {top3 && (
          <div className="flex flex-col items-center text-center p-4 rounded-3xl bg-card border border-amber-700/30 shadow-md space-y-2 relative">
            <div className="absolute -top-6 size-10 rounded-full bg-amber-700 text-white font-black text-sm flex items-center justify-center border-4 border-card shadow-md">
              3
            </div>
            <img
              src={top3.avatar}
              alt={top3.name}
              className="size-14 sm:size-18 rounded-full object-cover border-2 border-amber-700 mt-2"
            />
            <div className="space-y-0.5">
              <h3 className="text-xs sm:text-sm font-extrabold text-foreground truncate max-w-28 sm:max-w-36">
                {top3.name}
              </h3>
              <p className="text-[11px] font-black text-amber-600 dark:text-amber-500">
                {formatNumber(top3.elo)} ELO
              </p>
              <span className="text-[10px] text-muted-foreground font-semibold block">
                Thắng {top3.winRate}%
              </span>
            </div>
          </div>
        )}
      </div>

      {/* LEADERBOARD TABLE (Top 4 - 100) */}
      <div className="rounded-3xl bg-card border border-border shadow-xs overflow-hidden">
        <div className="p-3.5 sm:px-5 bg-muted/50 border-b border-border text-[11px] font-extrabold text-muted-foreground uppercase tracking-wider grid grid-cols-12">
          <div className="col-span-2 sm:col-span-1 text-center">Hạng</div>
          <div className="col-span-6 sm:col-span-6">Đấu Thủ</div>
          <div className="col-span-4 sm:col-span-3 text-right">Điểm ELO</div>
          <div className="hidden sm:block sm:col-span-2 text-right">Tỷ Lệ Thắng</div>
        </div>

        <div className="divide-y divide-border">
          {leaderboard.map((player) => {
            const rankConfig = RANK_CONFIGS[player.rankTier];

            return (
              <div
                key={player.userId}
                className="p-3.5 sm:px-5 grid grid-cols-12 items-center hover:bg-muted/30 transition-colors text-xs font-semibold"
              >
                <div className="col-span-2 sm:col-span-1 text-center font-black text-sm">
                  {player.rank === 1 ? (
                    <span className="text-amber-400">#1</span>
                  ) : player.rank === 2 ? (
                    <span className="text-slate-400">#2</span>
                  ) : player.rank === 3 ? (
                    <span className="text-amber-700">#3</span>
                  ) : (
                    <span className="text-muted-foreground">#{player.rank}</span>
                  )}
                </div>

                <div className="col-span-6 sm:col-span-6 flex items-center gap-3 min-w-0 pr-2">
                  <img
                    src={player.avatar}
                    alt={player.name}
                    className="size-8 sm:size-9 rounded-full object-cover border border-border shrink-0"
                  />
                  <div className="min-w-0">
                    <span className="font-extrabold text-foreground truncate block text-xs sm:text-[13px]">
                      {player.name}
                    </span>
                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-black uppercase ${rankConfig.badgeColor}`}>
                      {rankConfig.tierName}
                    </span>
                  </div>
                </div>

                <div className="col-span-4 sm:col-span-3 text-right font-black text-primary text-xs sm:text-sm">
                  {formatNumber(player.elo)}
                </div>

                <div className="hidden sm:block sm:col-span-2 text-right text-emerald-600 dark:text-emerald-400 font-bold">
                  {player.winRate}% ({player.winCount}W)
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
