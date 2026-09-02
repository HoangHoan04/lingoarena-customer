"use client";

import { Link } from "@/i18n/routing";
import type { UserVocabStats } from "@/types/vocabulary";
import {
  BarChart3,
  CheckCircle2,
  Clock,
  Flame,
  Layers,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";

function StatItem({
  label,
  value,
  icon,
  colorClass,
  bgClass,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  colorClass: string;
  bgClass: string;
}) {
  return (
    <div className="flex items-center gap-3.5 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs hover:shadow-md transition-shadow">
      <div className={`p-3 rounded-xl shrink-0 ${bgClass} ${colorClass}`}>
        {icon}
      </div>
      <div>
        <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          {value}
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          {label}
        </div>
      </div>
    </div>
  );
}

export default function VocabStatsPanel({
  stats,
  guest,
}: {
  stats: UserVocabStats | null;
  guest?: boolean;
}) {
  const learning = stats?.learningCount ?? stats?.learningWords ?? 0;
  const review = stats?.reviewCount ?? 0;
  const mastered = stats?.masteredCount ?? stats?.totalMasteredWords ?? 0;
  const due = stats?.dueTodayCount ?? 0;
  const total =
    stats?.totalCards ?? learning + review + mastered + (stats?.newCount ?? 0);

  const bars = [
    {
      key: "learning",
      label: "Đang học (Learning)",
      value: learning,
      color: "bg-sky-500",
      textColor: "text-sky-600 dark:text-sky-400",
    },
    {
      key: "review",
      label: "Đang ôn tập (Review)",
      value: review,
      color: "bg-amber-500",
      textColor: "text-amber-600 dark:text-amber-400",
    },
    {
      key: "mastered",
      label: "Đã thành thạo (Mastered)",
      value: mastered,
      color: "bg-emerald-500",
      textColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      key: "total",
      label: "Tổng thẻ đã lưu",
      value: total,
      color: "bg-primary dark:bg-[#7b9bee]",
      textColor: "text-primary dark:text-[#7b9bee]",
    },
  ];

  const max = Math.max(...bars.map((item) => item.value), 1);

  return (
    <section className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40 p-5 sm:p-7 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
              Thống kê học tập SRS
            </h2>
            {due > 0 && !guest && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-xs font-bold">
                <Flame className="size-3 fill-current" /> {due} thẻ đến hạn
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Theo dõi phân bổ từ vựng theo trạng thái nhớ và hiệu suất ôn tập cá nhân.
          </p>
        </div>

        {guest ? (
          <Link
            href={`/login?redirect=${encodeURIComponent("/vocabulary")}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-sm hover:bg-primary/90 transition-colors shrink-0"
          >
            <Sparkles className="size-3.5 text-amber-300" />
            Đăng nhập để lưu tiến độ
          </Link>
        ) : (
          due > 0 && (
            <Link
              href="/vocabulary/review"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 text-white text-xs font-bold shadow-md shadow-amber-500/20 hover:bg-amber-600 transition-colors shrink-0"
            >
              <Clock className="size-3.5" />
              Ôn ngay {due} từ
            </Link>
          )
        )}
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* 4 Metric Cards */}
        <div className="lg:col-span-6 grid grid-cols-2 gap-3.5">
          <StatItem
            label="Thẻ đã nạp"
            value={guest ? "0" : total}
            icon={<Layers className="size-5" />}
            bgClass="bg-blue-50 dark:bg-blue-950/50"
            colorClass="text-blue-600 dark:text-blue-400"
          />
          <StatItem
            label="Lượt ôn tập"
            value={guest ? "0" : stats?.totalReviewed ?? stats?.totalSessions ?? 0}
            icon={<TrendingUp className="size-5" />}
            bgClass="bg-purple-50 dark:bg-purple-950/50"
            colorClass="text-purple-600 dark:text-purple-400"
          />
          <StatItem
            label="Từ đến hạn hôm nay"
            value={guest ? "0" : due}
            icon={<BarChart3 className="size-5" />}
            bgClass="bg-amber-50 dark:bg-amber-950/50"
            colorClass="text-amber-600 dark:text-amber-400"
          />
          <StatItem
            label="Tỉ lệ chính xác"
            value={guest ? "—" : `${stats?.accuracy ?? 0}%`}
            icon={<Target className="size-5" />}
            bgClass="bg-emerald-50 dark:bg-emerald-950/50"
            colorClass="text-emerald-600 dark:text-emerald-400"
          />
        </div>

        {/* Progress Breakdown Bars */}
        <div className="lg:col-span-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Phân bổ trạng thái ghi nhớ
            </span>
            {!guest && mastered > 0 && (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="size-3.5" /> {mastered} từ thành thạo
              </span>
            )}
          </div>

          <div className="space-y-3 pt-1">
            {bars.map((bar) => {
              const percent = guest || total === 0 ? 0 : Math.round((bar.value / total) * 100);
              return (
                <div key={bar.key} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-slate-600 dark:text-slate-300">
                      {bar.label}
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {guest ? "—" : `${bar.value} (${percent}%)`}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${bar.color}`}
                      style={{
                        width: guest ? "0%" : `${Math.max(bar.value > 0 ? 6 : 0, (bar.value / max) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
