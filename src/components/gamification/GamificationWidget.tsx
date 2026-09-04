"use client";

import { pickLocaleText } from "@/lib/locale-text";
import { gamificationService } from "@/services/gamification.service";
import { useAuthStore } from "@/stores/useAuthStore";
import type { DailyChallenge, GamificationStats } from "@/types/gamification";
import { Flame, Target, Trophy } from "lucide-react";
import { useLocale } from "next-intl";
import { useEffect, useState } from "react";

export default function GamificationWidget() {
  const locale = useLocale();
  const { isAuthenticated } = useAuthStore();
  const [stats, setStats] = useState<GamificationStats | null>(null);
  const [challenges, setChallenges] = useState<DailyChallenge[]>([]);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !isAuthenticated) return;
    setLoading(true);
    Promise.all([gamificationService.myStats(), gamificationService.challengesToday()])
      .then(([nextStats, nextChallenges]) => {
        setStats(nextStats);
        setChallenges(nextChallenges);
      })
      .catch(() => {
        setStats(null);
        setChallenges([]);
      })
      .finally(() => setLoading(false));
  }, [mounted, isAuthenticated]);

  if (!mounted || !isAuthenticated) return null;

  return (
    <section className="rounded-3xl border border-border bg-card p-6 space-y-4">
      <div className="flex items-center gap-2">
        <Trophy className="size-5 text-amber-500" />
        <h2 className="text-lg font-black">Điểm thưởng & thử thách</h2>
      </div>

      {loading && <p className="text-sm text-muted-foreground">Đang tải gamification...</p>}

      {!loading && (
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-2xl bg-muted/50 p-3 text-center">
            <p className="text-[10px] uppercase font-bold text-muted-foreground">Điểm</p>
            <p className="text-xl font-black text-primary">{stats?.totalPoints ?? 0}</p>
          </div>
          <div className="rounded-2xl bg-muted/50 p-3 text-center">
            <p className="text-[10px] uppercase font-bold text-muted-foreground flex items-center justify-center gap-1">
              <Flame className="size-3 text-orange-500" /> Streak
            </p>
            <p className="text-xl font-black">{stats?.currentStreakDays ?? 0}</p>
          </div>
          <div className="rounded-2xl bg-muted/50 p-3 text-center">
            <p className="text-[10px] uppercase font-bold text-muted-foreground">Kỷ lục</p>
            <p className="text-xl font-black">{stats?.longestStreakDays ?? 0}</p>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
          <Target className="size-3.5" /> Thử thách hôm nay
        </p>
        {!loading && challenges.length === 0 && (
          <p className="text-sm text-muted-foreground">Chưa có dữ liệu</p>
        )}
        {challenges.map((item) => {
          const current = item.progress?.progressCount ?? 0;
          const target = item.progress?.targetCount || item.targetCount || 1;
          return (
            <div key={item.id} className="rounded-2xl border border-border p-3 space-y-1">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-bold">
                  {pickLocaleText(locale, item.title, item.titleEn)}
                </p>
                <span className="text-xs font-black text-primary">+{item.rewardPoints || 0}</span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                {current}/{target}
                {item.progress?.completedAt ? " · Đã hoàn thành" : ""}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
