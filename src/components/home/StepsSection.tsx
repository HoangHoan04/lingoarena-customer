"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/routing";
import {
  ArrowRight,
  BrainCircuit,
  Compass,
  FileCheck,
  GraduationCap,
  Sparkles,
  Trophy,
} from "lucide-react";
import { useTranslations } from "next-intl";

export default function StepsSection() {
  const router = useRouter();
  const t = useTranslations("home.steps");

  const steps = [
    {
      number: t("step1.number"),
      badge: "STEP 01",
      title: t("step1.title"),
      description: t("step1.desc"),
      icon: Compass,
    },
    {
      number: t("step2.number"),
      badge: "STEP 02",
      title: t("step2.title"),
      description: t("step2.desc"),
      icon: BrainCircuit,
    },
    {
      number: t("step3.number"),
      badge: "STEP 03",
      title: t("step3.title"),
      description: t("step3.desc"),
      icon: FileCheck,
    },
    {
      number: t("step4.number"),
      badge: "STEP 04",
      title: t("step4.title"),
      description: t("step4.desc"),
      icon: Trophy,
    },
  ];

  return (
    <section className="py-16 sm:py-24 relative overflow-hidden bg-slate-50/60 dark:bg-slate-900/40 border-b border-slate-200/60 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#2b417e]/10 dark:bg-[#2b417e]/20 border border-[#2b417e]/20 dark:border-[#2b417e]/30 text-[#2b417e] dark:text-[#7b9bee] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="size-3.5" />
            {t("badge")}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t("title")}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            {t("subtitle")}
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="relative bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:shadow-xl hover:border-[#2b417e]/40 dark:hover:border-[#7b9bee]/40 transition-all duration-300 flex flex-col justify-between group"
              >
                {/* Step Top Badge and Number */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-[#2b417e]/10 dark:bg-[#2b417e]/20 text-[#2b417e] dark:text-[#7b9bee] flex items-center justify-center group-hover:bg-[#2b417e] group-hover:text-white transition-all duration-300 shadow-2xs">
                      <Icon className="size-6" />
                    </div>
                    <span className="text-3xl font-black text-slate-200 dark:text-slate-800 group-hover:text-[#2b417e]/30 dark:group-hover:text-[#7b9bee]/30 transition-colors">
                      {step.number}
                    </span>
                  </div>

                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#2b417e] dark:text-[#7b9bee] block mb-1.5">
                    {step.badge}
                  </span>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 group-hover:text-[#2b417e] dark:group-hover:text-[#7b9bee] transition-colors">
                    {step.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Bottom connector indicator on desktop */}
                <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold">{idx + 1} / 4</span>
                  <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform text-[#2b417e] dark:text-[#7b9bee]" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="mt-14 text-center">
          <Button
            size="lg"
            className="px-10 py-6 rounded-2xl font-bold text-sm bg-[#2b417e] text-white hover:bg-[#1e2f5e] dark:bg-white dark:text-[#2b417e] dark:hover:bg-slate-100 shadow-xl shadow-[#2b417e]/20 cursor-pointer"
            onClick={() => router.push("/placement-test")}
          >
            <GraduationCap className="size-5 mr-1" />
            {t("title")}
            <ArrowRight className="size-4 ml-1" />
          </Button>
        </div>
      </div>
    </section>
  );
}
