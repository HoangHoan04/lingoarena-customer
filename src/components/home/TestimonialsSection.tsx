"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { leaderboardService } from "@/services/leaderboard.service";
import type { LeaderboardRow } from "@/types/learning";
import { Quote, Star, Trophy } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export default function TestimonialsSection() {
  const t = useTranslations("home.testimonials");
  const [rows, setRows] = useState<LeaderboardRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    leaderboardService
      .snapshots("STUDY_POINTS", "ALL_TIME")
      .then((data) => setRows(Array.isArray(data) ? data.slice(0, 6) : []))
      .catch(() => setRows([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-16 sm:py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Star className="size-3.5 fill-amber-400" />
            {t("badge")}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t("title")}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            {t("subtitle")}
          </p>
        </div>

        {loading && (
          <p className="text-center text-sm text-slate-500">
            Đang tải bảng điểm...
          </p>
        )}

        {!loading && rows.length === 0 && (
          <div className="mx-auto max-w-lg rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-10 text-center space-y-2">
            <Trophy className="mx-auto size-10 text-slate-400" />
            <p className="font-bold text-slate-900 dark:text-white">
              Chưa có dữ liệu
            </p>
            <p className="text-sm text-slate-500">
              Bảng xếp hạng sẽ hiện khi có điểm học tập từ API.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {rows.map((item) => {
            const name =
              item.metadataJson?.username || `Học viên #${item.rank}`;
            const initials = name.slice(0, 2).toUpperCase();
            return (
              <div
                key={item.id || `${item.userId}-${item.rank}`}
                className="relative bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-amber-500">
                      #{item.rank}
                    </span>
                    <Quote className="size-8 text-slate-200 dark:text-slate-800" />
                  </div>
                  <p className="text-2xl font-black text-brand dark:text-[#7b9bee]">
                    {Number(item.score || 0).toLocaleString("vi-VN")} điểm
                  </p>
                  <p className="text-xs text-slate-500">
                    Streak {item.metadataJson?.currentStreakDays || 0} ngày
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-brand text-white font-bold text-xs">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {name}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Bảng xếp hạng học tập
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
