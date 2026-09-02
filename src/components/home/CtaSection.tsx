"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/routing";
import { ArrowRight, ShieldCheck, Sparkles, Target, Zap } from "lucide-react";
import { useTranslations } from "next-intl";

export default function CtaSection() {
  const router = useRouter();
  const t = useTranslations("home.cta");

  return (
    <section className="py-16 sm:py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl sm:rounded-4xl overflow-hidden bg-linear-to-r from-[#1b2950] via-[#2b417e] to-[#1b2950] text-white p-8 sm:p-12 lg:p-16 shadow-2xl border border-[#2b417e]/40 text-center space-y-8">
          {/* Background Glows */}
          <div className="pointer-events-none absolute -top-32 left-1/2 -z-0 h-96 w-96 -translate-x-1/2 rounded-full bg-[#2b417e]/40 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 right-0 -z-0 h-96 w-96 rounded-full bg-[#4563b0]/30 blur-3xl" />

          {/* Badge */}
          <div className="relative z-10 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-[#a0baff]">
            <Sparkles className="size-3.5 text-amber-400" />
            LingoArena Pathway
          </div>

          {/* Heading */}
          <div className="relative z-10 max-w-3xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              {t("title")}
            </h2>
            <p className="text-sm sm:text-base text-slate-200 max-w-2xl mx-auto leading-relaxed">
              {t("subtitle")}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Button
              size="lg"
              className="w-full sm:w-auto px-10 py-6 rounded-2xl font-extrabold text-base bg-white text-[#2b417e] hover:bg-slate-100 shadow-xl shadow-black/20 hover:scale-105 transition-all cursor-pointer"
              onClick={() => router.push("/placement-test")}
            >
              <Target className="size-5 text-[#2b417e]" />
              {t("btnTest")}
              <ArrowRight className="size-4" />
            </Button>
            <Button
              size="lg"
              className="w-full sm:w-auto px-8 py-6 rounded-2xl font-bold text-base bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-sm shadow-md transition-all hover:scale-105 cursor-pointer"
              onClick={() => router.push("/practice")}
            >
              <Zap className="size-4 text-amber-300" />
              {t("btnPractice")}
            </Button>
          </div>

          {/* Guarantee Footer */}
          <div className="relative z-10 pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-300">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="size-4 text-emerald-400" /> 100% Guaranteed Results
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="size-4 text-[#a0baff]" /> Instant Personalized Roadmap
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
