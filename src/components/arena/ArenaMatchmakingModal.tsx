"use client";

import { useArenaStore } from "@/stores/useArenaStore";
import { useAuthStore } from "@/stores/useAuthStore";
import {
  Flame,
  Loader2,
  Radio,
  Sparkles,
  Swords,
  Users,
  X,
  Zap,
} from "lucide-react";
import { useRouter } from "@/i18n/routing";
import React, { useEffect, useState } from "react";

export default function ArenaMatchmakingModal() {
  const [mounted, setMounted] = useState(false);
  const {
    matchmakingStatus,
    cancelMatchmaking,
    matchedOpponent,
    activeMatch,
  } = useArenaStore();
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Navigate when match is ready
  useEffect(() => {
    if (matchmakingStatus === "CONNECTING" && activeMatch) {
      const timer = setTimeout(() => {
        router.push(`/arena/match/${activeMatch.matchId}`);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [matchmakingStatus, activeMatch, router]);

  if (matchmakingStatus === "IDLE") return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in select-none">
      <div className="relative w-full max-w-lg rounded-3xl bg-card border border-purple-500/30 shadow-2xl p-6 sm:p-8 overflow-hidden text-center space-y-6">
        {/* Top Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 size-60 rounded-full bg-purple-600/30 blur-3xl pointer-events-none" />

        {/* Close / Cancel Button */}
        {matchmakingStatus === "SEARCHING" && (
          <button
            type="button"
            onClick={cancelMatchmaking}
            className="absolute top-4 right-4 p-2 rounded-xl bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            title="Hủy tìm trận"
          >
            <X className="size-4" />
          </button>
        )}

        {/* STATUS 1: SEARCHING RADAR */}
        {matchmakingStatus === "SEARCHING" && (
          <div className="space-y-6 animate-in fade-in">
            {/* Radar Animation Ring */}
            <div className="relative size-32 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-purple-500/20 animate-ping" />
              <div className="absolute inset-2 rounded-full border border-purple-500/40 animate-pulse" />
              <div className="size-20 rounded-full bg-linear-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-xl shadow-purple-600/40">
                <Swords className="size-10 text-white animate-bounce" />
              </div>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg sm:text-xl font-black text-foreground">
                Đang Tìm Kiếm Đối Thủ...
              </h3>
              <p className="text-xs text-muted-foreground">
                Hệ thống đang quét người chơi có điểm Elo tương đương
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={cancelMatchmaking}
                className="px-6 py-2.5 rounded-xl bg-muted hover:bg-accent text-foreground text-xs font-bold border border-border transition-colors cursor-pointer"
              >
                Hủy Tìm Trận
              </button>
            </div>
          </div>
        )}

        {/* STATUS 2: MATCH FOUND (VS REVEAL) */}
        {(matchmakingStatus === "MATCH_FOUND" ||
          matchmakingStatus === "CONNECTING") &&
          matchedOpponent && (
            <div className="space-y-6 animate-in zoom-in-95 duration-300">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-black uppercase">
                <Sparkles className="size-3.5" />
                <span>ĐÃ TÌM THẤY ĐỐI THỦ!</span>
              </div>

              {/* 1V1 VS BATTLE BOX */}
              <div className="grid grid-cols-5 items-center gap-2 p-4 rounded-3xl bg-muted/40 border border-border">
                {/* User (Left) */}
                <div className="col-span-2 flex flex-col items-center space-y-1.5">
                  <img
                    src={
                      mounted && user?.avatarUrl
                        ? user.avatarUrl
                        : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
                    }
                    alt="Me"
                    className="size-14 sm:size-16 rounded-full object-cover border-2 border-primary shadow-md"
                  />
                  <span className="font-black text-xs sm:text-sm text-foreground truncate max-w-24">
                    {mounted && user?.fullName ? user.fullName : "Bạn"}
                  </span>
                  <span className="text-[10.5px] font-bold text-primary">
                    2,180 ELO
                  </span>
                </div>

                {/* VS Center */}
                <div className="col-span-1 flex flex-col items-center justify-center">
                  <div className="size-10 rounded-full bg-linear-to-tr from-amber-500 to-rose-500 text-white font-black text-sm flex items-center justify-center shadow-lg shadow-rose-500/30">
                    VS
                  </div>
                </div>

                {/* Opponent (Right) */}
                <div className="col-span-2 flex flex-col items-center space-y-1.5">
                  <img
                    src={matchedOpponent.avatar}
                    alt={matchedOpponent.name}
                    className="size-14 sm:size-16 rounded-full object-cover border-2 border-rose-500 shadow-md"
                  />
                  <span className="font-black text-xs sm:text-sm text-foreground truncate max-w-24">
                    {matchedOpponent.name}
                  </span>
                  <span className="text-[10.5px] font-bold text-rose-500">
                    {matchedOpponent.elo} ELO
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs font-bold text-muted-foreground">
                <Loader2 className="size-4 animate-spin text-primary" />
                <span>Đang kết nối phòng đấu... Sẵn sàng!</span>
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
