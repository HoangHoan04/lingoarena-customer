"use client";

import { RANK_CONFIGS, useArenaStore } from "@/stores/useArenaStore";
import { useAuthStore } from "@/stores/useAuthStore";
import {
  Award,
  Crown,
  Flame,
  Percent,
  Shield,
  Sparkles,
  Swords,
  Timer,
  Trophy,
  Zap,
} from "lucide-react";
import React, { useEffect, useState } from "react";

export default function ArenaUserRankCard() {
  const [mounted, setMounted] = useState(false);
  const { userStats } = useArenaStore();
  const { user } = useAuthStore();
  const rank = RANK_CONFIGS[userStats.rankTier];

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="rounded-3xl bg-card border border-border p-6 sm:p-7 shadow-xl space-y-6 animate-pulse select-none">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="size-16 rounded-2xl bg-muted" />
            <div className="space-y-2">
              <div className="h-5 w-40 bg-muted rounded-lg" />
              <div className="h-4 w-24 bg-muted rounded-lg" />
            </div>
          </div>
          <div className="h-16 w-48 bg-muted rounded-2xl" />
        </div>
        <div className="h-2 w-full bg-muted rounded-full" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 bg-muted rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const total = userStats.winCount + userStats.lossCount;
  const winRate = total > 0 ? Math.round((userStats.winCount / total) * 100) : 0;

  // Calculate Elo progress in current tier
  const eloRange = rank.maxElo - rank.minElo;
  const currentEloInTier = Math.max(0, userStats.elo - rank.minElo);
  const eloProgress = Math.min(100, Math.round((currentEloInTier / eloRange) * 100));

  const displayName = user?.fullName || "Đấu Thủ LingoArena";
  const displayAvatar =
    user?.avatarUrl ||
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80";

  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return (
    <div className="rounded-3xl bg-card border border-border p-6 sm:p-7 shadow-xl space-y-6 select-none relative overflow-hidden">
      {/* Background soft glow */}
      <div className="absolute -top-16 -right-16 size-48 rounded-full bg-primary/10 blur-2xl pointer-events-none" />

      {/* Top Header: Avatar + Rank Badge + Name */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={displayAvatar}
              alt="Avatar"
              className="size-16 rounded-2xl object-cover border-2 border-primary/30 shadow-md"
            />
            <div className="absolute -bottom-1 -right-1 size-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-black border-2 border-card">
              ✓
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-foreground">
                {displayName}
              </h2>
              <span className={`px-2.5 py-0.5 rounded-lg text-xs font-black uppercase border ${rank.badgeColor}`}>
                {rank.tierName} {rank.division}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {userStats.seasonRank > 0
                ? `Hạng #${userStats.seasonRank}`
                : "Chưa có hạng mùa từ API"}
            </p>
          </div>
        </div>

        {/* Current Elo Big Badge */}
        <div className="flex items-center gap-3 p-3 px-5 rounded-2xl bg-linear-to-r from-primary/10 to-purple-500/10 border border-primary/20">
          <Trophy className="size-6 text-amber-400" />
          <div>
            <span className="text-[11px] text-muted-foreground font-bold block">
              Điểm Đấu Trường Elo
            </span>
            <span className="text-xl sm:text-2xl font-black text-primary">
              {formatNumber(userStats.elo)} ELO
            </span>
          </div>
        </div>
      </div>

      {/* Elo Progress Bar to next Tier */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-muted-foreground flex items-center gap-1">
            <span>Tiến độ lên Rank:</span>
            <span className="text-foreground">{rank.tierName} {rank.division}</span>
          </span>
          <span className="text-primary">{userStats.elo} / {rank.maxElo} ELO ({eloProgress}%)</span>
        </div>
        <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-linear-to-r from-primary via-indigo-500 to-purple-500 transition-all duration-500 shadow-sm"
            style={{ width: `${eloProgress}%` }}
          />
        </div>
      </div>

      {/* 4 Performance Metric Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
        <div className="p-3.5 rounded-2xl bg-muted/50 border border-border space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold">
            <Flame className="size-4 text-amber-500 fill-amber-500" />
            <span>Chuỗi Thắng</span>
          </div>
          <p className="text-lg font-black text-foreground">{userStats.winStreak} Trận 🔥</p>
        </div>

        <div className="p-3.5 rounded-2xl bg-muted/50 border border-border space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold">
            <Percent className="size-4 text-emerald-500" />
            <span>Tỷ Lệ Thắng</span>
          </div>
          <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">{winRate}%</p>
        </div>

        <div className="p-3.5 rounded-2xl bg-muted/50 border border-border space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold">
            <Swords className="size-4 text-purple-500" />
            <span>Tổng Số Trận</span>
          </div>
          <p className="text-lg font-black text-foreground">
            {userStats.totalMatches} <span className="text-xs text-muted-foreground font-normal">({userStats.winCount}W / {userStats.lossCount}L)</span>
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-muted/50 border border-border space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold">
            <Timer className="size-4 text-sky-500" />
            <span>Tốc Độ Phản Xạ</span>
          </div>
          <p className="text-lg font-black text-foreground">{(userStats.averageResponseTimeMs / 1000).toFixed(1)}s / câu</p>
        </div>
      </div>
    </div>
  );
}
