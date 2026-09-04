"use client";

import { leaderboardService } from "@/services/leaderboard.service";
import type { LeaderboardRow } from "@/types/learning";
import { Crown, Medal, Trophy } from "lucide-react";
import { useEffect, useState } from "react";

export default function LeaderboardPage() {
  const [rows, setRows] = useState<LeaderboardRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    leaderboardService
      .snapshots("STUDY_POINTS", "ALL_TIME")
      .then(setRows)
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 space-y-8">
      <section className="rounded-3xl border border-border bg-linear-to-br from-amber-500/15 via-card to-card p-8 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="rounded-3xl bg-amber-500 p-4 text-white shadow-lg shadow-amber-500/25">
            <Trophy className="size-8" />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-500">
              Leaderboard
            </p>
            <h1 className="text-3xl sm:text-4xl font-black">
              Bảng xếp hạng học tập
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Xếp hạng live theo tổng điểm gamification khi chưa có snapshot
              được lưu.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-border bg-card p-4 sm:p-6">
        {loading && (
          <p className="p-6 text-sm text-muted-foreground">
            Đang tải bảng xếp hạng...
          </p>
        )}
        {!loading && !rows.length && (
          <p className="p-6 text-sm text-muted-foreground">
            Chưa có dữ liệu xếp hạng.
          </p>
        )}
        <div className="space-y-3">
          {rows.map((row) => (
            <div
              key={`${row.userId}-${row.rank}`}
              className="flex items-center justify-between rounded-2xl border border-border bg-background p-4"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`flex size-11 items-center justify-center rounded-2xl font-black ${row.rank <= 3 ? "bg-amber-500 text-white" : "bg-muted text-muted-foreground"}`}
                >
                  {row.rank <= 3 ? <Medal className="size-5" /> : row.rank}
                </div>
                <div>
                  <p className="font-black">
                    {row.metadataJson?.username || `Learner ${row.rank}`}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Streak {row.metadataJson?.currentStreakDays || 0} ngày
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-black text-primary">
                  {Number(row.score || 0).toLocaleString("vi-VN")}
                </p>
                <p className="text-xs text-muted-foreground">điểm</p>
              </div>
              {row.rank === 1 && (
                <Crown className="hidden size-6 text-amber-500 sm:block" />
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
