"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "@/i18n/routing";
import {
  ArrowRight,
  Award,
  Bot,
  BrainCircuit,
  CheckCircle2,
  Flame,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Trophy,
  Users,
} from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useToastStore } from "@/stores/useToastStore";
import { useTranslations } from "next-intl";
import { useState } from "react";

export default function HeroSection() {
  const router = useRouter();
  const t = useTranslations("home.hero");
  const { isAuthenticated } = useAuthStore();
  const { addToast } = useToastStore();
  const [selectedExam, setSelectedExam] = useState<"TOEIC" | "IELTS" | "VSTEP" | "APTIS">("TOEIC");

  const handlePlacementTestClick = () => {
    if (isAuthenticated) {
      router.push("/placement-test");
    } else {
      addToast("Vui lòng đăng nhập để bắt đầu bài kiểm tra đầu vào!", "info");
      router.push("/login?redirect=/placement-test");
    }
  };

  const examHighlights = {
    TOEIC: {
      score: t("toeic.score"),
      label: t("toeic.label"),
      badge: t("toeic.badge"),
      skills: [
        t("toeic.skills.0"),
        t("toeic.skills.1"),
        t("toeic.skills.2"),
        t("toeic.skills.3"),
      ],
      color: "from-[#2b417e] to-[#4563b0]",
    },
    IELTS: {
      score: t("ielts.score"),
      label: t("ielts.label"),
      badge: t("ielts.badge"),
      skills: [
        t("ielts.skills.0"),
        t("ielts.skills.1"),
        t("ielts.skills.2"),
        t("ielts.skills.3"),
      ],
      color: "from-[#2b417e] to-[#c83b54]",
    },
    VSTEP: {
      score: t("vstep.score"),
      label: t("vstep.label"),
      badge: t("vstep.badge"),
      skills: [
        t("vstep.skills.0"),
        t("vstep.skills.1"),
        t("vstep.skills.2"),
        t("vstep.skills.3"),
      ],
      color: "from-[#2b417e] to-[#208b6d]",
    },
    APTIS: {
      score: t("aptis.score"),
      label: t("aptis.label"),
      badge: t("aptis.badge"),
      skills: [
        t("aptis.skills.0"),
        t("aptis.skills.1"),
        t("aptis.skills.2"),
        t("aptis.skills.3"),
      ],
      color: "from-[#2b417e] to-[#d97706]",
    },
  };

  const currentHighlight = examHighlights[selectedExam];

  return (
    <section className="relative overflow-hidden pt-6 pb-16 lg:py-16">
      {/* Background Glows */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-125 w-200 -translate-x-1/2 rounded-full bg-linear-to-tr from-[#2b417e]/15 via-[#4563b0]/10 to-[#2b417e]/15 blur-3xl dark:from-[#2b417e]/20 dark:via-[#7b9bee]/15 dark:to-[#2b417e]/20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Value Proposition & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Top Micro-badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2b417e]/10 dark:bg-[#2b417e]/20 border border-[#2b417e]/20 dark:border-[#2b417e]/30 shadow-2xs backdrop-blur-xs">
              <Sparkles className="size-4 text-[#2b417e] dark:text-[#7b9bee] animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#2b417e] dark:text-[#7b9bee]">
                {t("badge")}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
              {t("titlePart1")}{" "}
              <span className="bg-linear-to-r from-[#2b417e] via-[#405ea7] to-[#2b417e] bg-clip-text text-transparent dark:from-[#7b9bee] dark:via-[#a0baff] dark:to-[#7b9bee]">
                {t("titleHighlight")}
              </span>{" "}
              {t("titlePart2")}
            </h1>

            {/* Sub-headline */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              {t("subtitle")}
            </p>

            {/* Exam Selector Buttons */}
            <div className="pt-2">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">
                {t("examHighlightsTitle")}
              </p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-2">
                {(["TOEIC", "IELTS", "VSTEP", "APTIS"] as const).map((exam) => (
                  <button
                    key={exam}
                    type="button"
                    onClick={() => setSelectedExam(exam)}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer ${
                      selectedExam === exam
                        ? "bg-[#2b417e] text-white dark:bg-white dark:text-[#2b417e] shadow-md scale-105"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                    }`}
                  >
                    {exam}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <Button
                size="lg"
                className="w-full sm:w-auto px-8 py-6 rounded-2xl font-bold text-base shadow-xl shadow-[#2b417e]/25 hover:shadow-[#2b417e]/40 hover:scale-[1.02] transition-all bg-[#2b417e] hover:bg-[#1e2f5e] text-white cursor-pointer"
                onClick={handlePlacementTestClick}
              >
                <Target className="size-5" />
                {t("ctaPlacement")}
                <ArrowRight className="size-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto px-8 py-6 rounded-2xl font-bold text-base border-2 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                onClick={() => router.push("/practice")}
              >
                <PlayCircle className="size-5 text-[#2b417e] dark:text-[#7b9bee]" />
                {t("ctaExplore")}
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="size-4 text-emerald-500" /> ETS / Cambridge / MOET 2026
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <Bot className="size-4 text-[#2b417e] dark:text-[#7b9bee]" /> AI Writing & Speaking Rubric
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <Flame className="size-4 text-orange-500" /> 1.2M+ Mock Tests Taken
              </span>
            </div>
          </div>

          {/* Right Column: Interactive Simulator Preview Card */}
          <div className="lg:col-span-5 relative">
            {/* Background Decorative Rings */}
            <div className="absolute -inset-1 rounded-3xl bg-linear-to-r from-[#2b417e] via-[#405ea7] to-[#2b417e] opacity-20 blur-xl dark:opacity-30" />

            <div className="relative rounded-3xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6">
              {/* Header inside card */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-linear-to-br ${currentHighlight.color} flex items-center justify-center text-white font-black shadow-md`}>
                    {selectedExam[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">
                      {currentHighlight.label}
                    </h3>
                    <p className="text-xs text-slate-500">LingoArena Pathway</p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-[#2b417e]/10 dark:bg-[#2b417e]/20 text-[#2b417e] dark:text-[#7b9bee] font-semibold border-[#2b417e]/20 dark:border-[#2b417e]/30">
                  {currentHighlight.badge}
                </Badge>
              </div>

              {/* Progress & Target Score Metric */}
              <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-100 dark:border-slate-700/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{t("trustedScore")}</span>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <TrendingUp className="size-3.5" /> 98.2%
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <div className="text-3xl font-black text-slate-900 dark:text-white">
                    {currentHighlight.score}
                  </div>
                  <div className="text-xs font-medium text-slate-500">
                    <span className="font-bold text-[#2b417e] dark:text-[#7b9bee]">94.8% Reliability</span>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden mt-3">
                  <div className="bg-linear-to-r from-[#2b417e] to-[#4563b0] h-full w-[82%] rounded-full animate-pulse" />
                </div>
              </div>

              {/* Included Learning Modules */}
              <div className="space-y-2.5">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Core Skills & Modules:
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {currentHighlight.skills.map((skill, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-2.5 rounded-xl bg-white dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200"
                    >
                      <CheckCircle2 className="size-4 text-[#2b417e] dark:text-[#7b9bee] shrink-0" />
                      <span>{skill}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mini Interactive Widget Footer */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2 overflow-hidden">
                    <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-slate-900 bg-[#2b417e] text-[10px] text-white font-bold text-center leading-6">A</div>
                    <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-slate-900 bg-[#405ea7] text-[10px] text-white font-bold text-center leading-6">K</div>
                    <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-slate-900 bg-[#1b2950] text-[10px] text-white font-bold text-center leading-6">L</div>
                  </div>
                  <span className="text-slate-500 font-medium">1,420+ {t("activeLearners")}</span>
                </div>
                <div className="flex items-center gap-1 text-amber-500 font-bold">
                  <Star className="size-3.5 fill-amber-400" />
                  <span>4.9 / 5.0</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Key Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-16 pt-8 border-t border-slate-200/60 dark:border-slate-800">
          <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xs p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800 text-center sm:text-left flex flex-col sm:flex-row items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#2b417e]/10 text-[#2b417e] dark:text-[#7b9bee] flex items-center justify-center shrink-0">
              <Users className="size-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">1.2M+</div>
              <div className="text-xs font-medium text-slate-500">{t("activeLearners")}</div>
            </div>
          </div>

          <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xs p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800 text-center sm:text-left flex flex-col sm:flex-row items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#2b417e]/10 text-[#2b417e] dark:text-[#7b9bee] flex items-center justify-center shrink-0">
              <BrainCircuit className="size-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">50.000+</div>
              <div className="text-xs font-medium text-slate-500">{t("statQuestions")}</div>
            </div>
          </div>

          <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xs p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800 text-center sm:text-left flex flex-col sm:flex-row items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Trophy className="size-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">98.2%</div>
              <div className="text-xs font-medium text-slate-500">{t("statPassRate")}</div>
            </div>
          </div>

          <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xs p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800 text-center sm:text-left flex flex-col sm:flex-row items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Award className="size-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">4.9 / 5.0</div>
              <div className="text-xs font-medium text-slate-500">{t("statRating")}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
