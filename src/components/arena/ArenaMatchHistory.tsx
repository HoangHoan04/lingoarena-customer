"use client";

import { useArenaStore } from "@/stores/useArenaStore";
import { History, Swords, TrendingDown, TrendingUp, Trophy } from "lucide-react";
import React from "react";

export default function ArenaMatchHistory() {
  const { matchHistory } = useArenaStore();

  if (matchHistory.length === 0) {
    return (
      <div className="p-8 rounded-3xl bg-card border border-border text-center text-xs text-muted-foreground select-none">
        Chưa có lịch sử thi đấu nào. Hãy tham gia trận đấu đầu tiên!
      </div>
    );
  }

  return (
    <div className="space-y-4 select-none">
      <div className="flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-extrabold text-foreground flex items-center gap-2">
          <History className="size-5 text-primary" />
          <span>Lịch Sử Đấu Gần Đây</span>
        </h2>
      </div>

      <div className="space-y-3">
        {matchHistory.map((item) => {
          const isVictory = item.result === "WIN";
          const isDraw = item.result === "DRAW";

          return (
            <div
              key={item.id}
              className={`p-4 rounded-3xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all shadow-2xs ${
                isVictory
                  ? "bg-emerald-500/5 border-emerald-500/30 hover:border-emerald-500"
                  : isDraw
                  ? "bg-muted/40 border-border"
                  : "bg-rose-500/5 border-rose-500/30 hover:border-rose-500"
              }`}
            >
              {/* Left: Result Badge + Mode + Opponent */}
              <div className="flex items-center gap-3.5">
                <div
                  className={`size-11 rounded-2xl flex items-center justify-center font-black text-xs shrink-0 ${
                    isVictory
                      ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                      : isDraw
                      ? "bg-muted text-foreground"
                      : "bg-rose-500 text-white shadow-md shadow-rose-500/20"
                  }`}
                >
                  {isVictory ? "THẮNG" : isDraw ? "HÒA" : "THUA"}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.2 rounded-md bg-muted text-muted-foreground text-[10px] font-black uppercase">
                      {item.mode}
                    </span>
                    <span className="text-[11px] text-muted-foreground font-medium">
                      {item.playedAt}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-bold text-foreground">VS</span>
                    <img
                      src={item.opponentAvatar}
                      alt={item.opponentName}
                      className="size-5 rounded-full object-cover border border-border"
                    />
                    <span className="text-xs sm:text-sm font-extrabold text-foreground">
                      {item.opponentName}
                    </span>
                    <span className="text-[11px] text-muted-foreground font-semibold">
                      ({item.opponentElo} ELO)
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Scores + Elo & XP Change */}
              <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 pt-2 sm:pt-0 border-border">
                {/* Score Ratio */}
                <div className="text-left sm:text-right">
                  <span className="text-[10.5px] text-muted-foreground font-bold block">
                    Tỉ Số Điểm
                  </span>
                  <span className="text-sm font-black text-foreground">
                    <span className={isVictory ? "text-emerald-500" : ""}>{item.myScore}</span>
                    <span className="text-muted-foreground mx-1">:</span>
                    <span className={!isVictory && !isDraw ? "text-rose-500" : ""}>{item.opponentScore}</span>
                  </span>
                </div>

                {/* Elo Change */}
                <div className="text-right min-w-20">
                  <span className="text-[10.5px] text-muted-foreground font-bold block">
                    Biến Động ELO
                  </span>
                  <div className="flex items-center justify-end gap-1">
                    {item.eloChange > 0 ? (
                      <span className="text-sm font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                        <TrendingUp className="size-3.5" />
                        +{item.eloChange}
                      </span>
                    ) : item.eloChange < 0 ? (
                      <span className="text-sm font-black text-rose-600 dark:text-rose-400 flex items-center gap-0.5">
                        <TrendingDown className="size-3.5" />
                        {item.eloChange}
                      </span>
                    ) : (
                      <span className="text-sm font-black text-muted-foreground">0</span>
                    )}
                  </div>
                </div>

                {/* XP Earned */}
                <div className="hidden sm:block text-right min-w-16">
                  <span className="text-[10.5px] text-muted-foreground font-bold block">
                    Thưởng XP
                  </span>
                  <span className="text-xs font-black text-amber-500">
                    +{item.xpEarned} XP
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
