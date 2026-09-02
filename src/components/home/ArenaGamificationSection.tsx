"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/routing";
import {
  ArrowRight,
  Crown,
  Flame,
  Gamepad2,
  Swords,
  Timer,
  Trophy,
} from "lucide-react";
import { useTranslations } from "next-intl";

export default function ArenaGamificationSection() {
  const router = useRouter();
  const t = useTranslations("home.arenaGamification");

  const leaderboardPreview = [
    { rank: 1, name: "Minh Trang", score: "2,850 pts", streak: "48d", badge: "IELTS 8.0", avatar: "MT", color: "bg-amber-500" },
    { rank: 2, name: "Hoàng Nam", score: "2,710 pts", streak: "35d", badge: "TOEIC 920", avatar: "HN", color: "bg-slate-400" },
    { rank: 3, name: "Thu Hà", score: "2,640 pts", streak: "29d", badge: "VSTEP B2", avatar: "TH", color: "bg-amber-700" },
  ];

  return (
    <section className="py-16 sm:py-24 relative overflow-hidden">
      {/* Background Accent Gradients */}
      <div className="pointer-events-none absolute -bottom-20 right-0 -z-10 h-100 w-100 rounded-full bg-linear-to-bl from-orange-500/10 via-[#2b417e]/10 to-[#4563b0]/10 blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Value Proposition */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-50 dark:bg-orange-950/60 border border-orange-200 dark:border-orange-800 text-orange-600 dark:text-orange-400 text-xs font-bold uppercase tracking-wider">
              <Swords className="size-3.5" />
              {t("badge")}
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              {t("title")}
            </h2>

            <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              {t("subtitle")}
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3.5 text-left">
                <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0">
                  <Gamepad2 className="size-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{t("feature1Title")}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{t("feature1Desc")}</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 text-left">
                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <Flame className="size-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{t("feature2Title")}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{t("feature2Desc")}</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 text-left">
                <div className="w-10 h-10 rounded-xl bg-[#2b417e]/10 dark:bg-[#2b417e]/20 text-[#2b417e] dark:text-[#7b9bee] flex items-center justify-center shrink-0">
                  <Trophy className="size-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{t("feature3Title")}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{t("feature3Desc")}</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Button
                size="lg"
                className="px-8 py-6 rounded-2xl font-bold bg-orange-600 hover:bg-orange-700 text-white shadow-xl shadow-orange-500/20 cursor-pointer"
                onClick={() => router.push("/arena")}
              >
                <Swords className="size-5 mr-1" />
                {t("enterArena")}
                <ArrowRight className="size-4 ml-1" />
              </Button>
            </div>
          </div>

          {/* Right Column: Live Battle Arena Mockup */}
          <div className="lg:col-span-6">
            <div className="rounded-3xl bg-slate-900 text-white p-6 sm:p-8 shadow-2xl border border-slate-800 space-y-6">
              {/* Battle Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <div className="size-3 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-xs font-bold text-slate-300">Live 1v1 Battle Arena</span>
                </div>
                <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-[11px]">
                  1,480 {t("onlineNow")}
                </Badge>
              </div>

              {/* 1v1 Match Card */}
              <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/60 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-12 rounded-2xl bg-linear-to-tr from-[#2b417e] to-[#405ea7] flex items-center justify-center font-black text-white text-base shadow-md">
                    YOU
                  </div>
                  <div>
                    <h5 className="font-bold text-sm">Player (You)</h5>
                    <p className="text-xs text-emerald-400 font-semibold">Streak: 12 Match Won</p>
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <span className="text-xs font-black text-orange-400 uppercase tracking-widest">VS</span>
                  <span className="text-[10px] font-mono text-slate-400 mt-1">Round 3/5</span>
                </div>

                <div className="flex items-center gap-3 text-right">
                  <div>
                    <h5 className="font-bold text-sm">Alex Tran</h5>
                    <p className="text-xs text-amber-400 font-semibold">Diamond Rank</p>
                  </div>
                  <div className="size-12 rounded-2xl bg-linear-to-tr from-purple-600 to-indigo-600 flex items-center justify-center font-black text-white text-base shadow-md">
                    AT
                  </div>
                </div>
              </div>

              {/* Leaderboard Table Mini */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <Crown className="size-3.5 text-amber-400" />
                    {t("leaderboardTitle")}
                  </span>
                  <span className="text-orange-400">Top Weekly LP</span>
                </div>

                <div className="space-y-2">
                  {leaderboardPreview.map((item) => (
                    <div
                      key={item.rank}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-700/40 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-black text-slate-400 w-4">{item.rank}</span>
                        <div className={`size-7 rounded-lg ${item.color} flex items-center justify-center font-black text-[10px]`}>
                          {item.avatar}
                        </div>
                        <div>
                          <span className="font-bold text-slate-200">{item.name}</span>
                          <span className="text-[10px] text-slate-400 ml-2">({item.badge})</span>
                        </div>
                      </div>

                      <div className="text-right font-mono font-bold text-amber-400">
                        {item.score}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
