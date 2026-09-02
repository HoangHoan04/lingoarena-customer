"use client";

import { BookCheck, Clock, Globe2, Sparkles, Users } from "lucide-react";
import { useTranslations } from "next-intl";

export default function AboutSection() {
  const t = useTranslations("home.about");

  const highlights = [
    {
      icon: BookCheck,
      title: "Standardized Exam Prep",
      description: "50,000+ official questions strictly following TOEIC ETS, Cambridge IELTS, and VSTEP formats.",
    },
    {
      icon: Sparkles,
      title: "Personalized AI Pathways",
      description: "Adaptive algorithms automatically target weaknesses and optimize your daily study hours.",
    },
    {
      icon: Clock,
      title: "Spaced Repetition (SRS)",
      description: "Scientifically proven memory methodology to permanently remember thousands of vocabulary words.",
    },
    {
      icon: Users,
      title: "IELTS 8.5+ Instructors",
      description: "Experienced educators evaluating Writing and Speaking according to international rubrics.",
    },
  ];

  return (
    <section className="py-16 sm:py-24 relative overflow-hidden bg-slate-50/50 dark:bg-slate-900/30 border-t border-slate-200/60 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#2b417e]/10 dark:bg-[#2b417e]/20 border border-[#2b417e]/20 dark:border-[#2b417e]/30 text-[#2b417e] dark:text-[#7b9bee] text-xs font-bold uppercase tracking-wider">
              <Globe2 className="size-3.5" />
              {t("badge")}
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              {t("title")}
            </h2>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              {t("description")}
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs text-left">
                <div className="text-2xl sm:text-3xl font-black text-[#2b417e] dark:text-[#7b9bee]">{t("stat1Number")}</div>
                <div className="text-xs text-slate-500 mt-1 font-medium">{t("stat1Label")}</div>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs text-left">
                <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">{t("stat2Number")}</div>
                <div className="text-xs text-slate-500 mt-1 font-medium">{t("stat2Label")}</div>
              </div>
            </div>
          </div>

          {/* Right Column: 4 Grid Highlights */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {highlights.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#2b417e]/10 dark:bg-[#2b417e]/20 text-[#2b417e] dark:text-[#7b9bee] flex items-center justify-center">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
