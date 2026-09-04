"use client";

import {
  ArenaCustomRoomModal,
  ArenaGameModesGrid,
  ArenaHeroBanner,
  ArenaLeaderboard,
  ArenaMatchHistory,
  ArenaMatchmakingModal,
  ArenaUserRankCard,
} from "@/components/arena";
import { useArenaStore } from "@/stores/useArenaStore";
import {
  Award,
  Crown,
  Flame,
  Gamepad2,
  HelpCircle,
  Shield,
  Sparkles,
  Swords,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import React, { useEffect, useState } from "react";

export default function ArenaLobbyPage() {
  const [isCustomRoomOpen, setIsCustomRoomOpen] = useState(false);
  const { fetchLeaderboard, fetchUserStats, fetchMatchHistory } = useArenaStore();

  useEffect(() => {
    fetchLeaderboard();
    fetchUserStats();
    fetchMatchHistory();
  }, [fetchLeaderboard, fetchUserStats, fetchMatchHistory]);

  return (
    <div className="min-h-screen bg-background text-foreground py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* 1. TOP HERO BANNER */}
        <ArenaHeroBanner />

        {/* 2. USER RANK PROFILE CARD */}
        <ArenaUserRankCard />

        {/* 3. 4 BATTLE MODES GRID */}
        <ArenaGameModesGrid
          onOpenCustomRoom={() => setIsCustomRoomOpen(true)}
        />

        {/* 4. LEADERBOARD & RECENT MATCHES (2 COLUMNS) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-4">
          {/* Left: Season Leaderboard (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <ArenaLeaderboard />
          </div>

          {/* Right: Recent Match History (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <ArenaMatchHistory />
          </div>
        </div>

        {/* 5. ARENA RULES & VALUE PROPS HIGHLIGHT */}
        <div className="pt-12 border-t border-border grid grid-cols-1 md:grid-cols-3 gap-6 select-none">
          <div className="p-6 rounded-3xl bg-card border border-border space-y-2 shadow-xs">
            <div className="size-10 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
              <Zap className="size-5" />
            </div>
            <h4 className="font-bold text-sm sm:text-base text-foreground">
              Hệ Thống Điểm ELO Chuẩn
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Thuật toán xếp hạng chuẩn Elo quốc tế, đảm bảo công bằng khi ghép trận với đối thủ cùng trình độ.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-card border border-border space-y-2 shadow-xs">
            <div className="size-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Trophy className="size-5" />
            </div>
            <h4 className="font-bold text-sm sm:text-base text-foreground">
              Phần Thưởng Mùa Giải Hấp Dẫn
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Top 100 đấu thủ cuối mùa nhận vinh danh huy hiệu độc quyền, tiền mặt và gói học bổng VIP 1 năm.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-card border border-border space-y-2 shadow-xs">
            <div className="size-10 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <Shield className="size-5" />
            </div>
            <h4 className="font-bold text-sm sm:text-base text-foreground">
              Ngân Hàng 50.000+ Câu Hỏi
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Câu hỏi ngẫu nhiên được kiểm duyệt bởi ban chuyên môn, chống gian lận và tối ưu tốc độ phản xạ.
            </p>
          </div>
        </div>
      </div>

      {/* 6. MATCHMAKING RADAR & VS POPUP MODAL */}
      <ArenaMatchmakingModal />

      {/* 7. CUSTOM ROOM CREATION MODAL */}
      <ArenaCustomRoomModal
        isOpen={isCustomRoomOpen}
        onClose={() => setIsCustomRoomOpen(false)}
      />
    </div>
  );
}
