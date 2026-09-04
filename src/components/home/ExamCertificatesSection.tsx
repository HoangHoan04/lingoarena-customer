"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/routing";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  FileCheck2,
  Headphones,
  Mic,
  PenTool,
  Sparkles,
  Timer,
} from "lucide-react";
import { useTranslations } from "next-intl";

export default function ExamCertificatesSection() {
  const router = useRouter();
  const t = useTranslations("home.examCertificates");

  const examCards = [
    {
      id: "toeic",
      code: t("toeic.code"),
      name: t("toeic.name"),
      targetScale: t("toeic.target"),
      description: t("toeic.description"),
      duration: t("toeic.duration"),
      questionCount: t("toeic.questions"),
      badge: t("popularBadge"),
      badgeColor: "bg-brand/10 text-brand dark:text-[#7b9bee] border-brand/20 dark:border-brand/30",
      skills: [
        { name: "Listening (Part 1-4)", icon: Headphones },
        { name: "Reading (Part 5-7)", icon: BookOpen },
      ],
      highlights: [
        t("toeic.highlights.0"),
        t("toeic.highlights.1"),
        t("toeic.highlights.2"),
      ],
      popular: true,
    },
    {
      id: "ielts",
      code: t("ielts.code"),
      name: t("ielts.name"),
      targetScale: t("ielts.target"),
      description: t("ielts.description"),
      duration: t("ielts.duration"),
      questionCount: t("ielts.questions"),
      badge: "Standard",
      badgeColor: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800",
      skills: [
        { name: "Listening", icon: Headphones },
        { name: "Reading", icon: BookOpen },
        { name: "Writing Task 1 & 2", icon: PenTool },
        { name: "Speaking 3 Parts", icon: Mic },
      ],
      highlights: [
        t("ielts.highlights.0"),
        t("ielts.highlights.1"),
        t("ielts.highlights.2"),
      ],
      popular: true,
    },
    {
      id: "vstep",
      code: t("vstep.code"),
      name: t("vstep.name"),
      targetScale: t("vstep.target"),
      description: t("vstep.description"),
      duration: t("vstep.duration"),
      questionCount: t("vstep.questions"),
      badge: "MOET",
      badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
      skills: [
        { name: "Listening (3 Parts)", icon: Headphones },
        { name: "Reading (4 Passages)", icon: BookOpen },
        { name: "Writing (Letter & Essay)", icon: PenTool },
        { name: "Speaking (3 Parts)", icon: Mic },
      ],
      highlights: [
        t("vstep.highlights.0"),
        t("vstep.highlights.1"),
        t("vstep.highlights.2"),
      ],
    },
    {
      id: "aptis",
      code: t("aptis.code"),
      name: t("aptis.name"),
      targetScale: t("aptis.target"),
      description: t("aptis.description"),
      duration: t("aptis.duration"),
      questionCount: t("aptis.questions"),
      badge: "British Council",
      badgeColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800",
      skills: [
        { name: "Grammar & Vocabulary", icon: FileCheck2 },
        { name: "Listening & Reading", icon: Headphones },
        { name: "Writing 4 Tasks", icon: PenTool },
        { name: "Speaking 4 Parts", icon: Mic },
      ],
      highlights: [
        t("aptis.highlights.0"),
        t("aptis.highlights.1"),
        t("aptis.highlights.2"),
      ],
    },
  ];

  return (
    <section className="py-16 sm:py-24 relative overflow-hidden bg-slate-50/50 dark:bg-slate-900/30 border-y border-slate-200/60 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-18 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand/10 dark:bg-brand/20 border border-brand/20 dark:border-brand/30 text-brand dark:text-[#7b9bee] text-xs font-bold uppercase tracking-wider">
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

        {/* Exam Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {examCards.map((exam) => (
            <div
              key={exam.id}
              className={`group relative rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 ${
                exam.popular
                  ? "bg-white dark:bg-slate-900 border-2 border-brand/50 dark:border-[#7b9bee]/50 shadow-xl shadow-brand/10 dark:shadow-brand/5"
                  : "bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700"
              }`}
            >
              {/* Card Top */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                    {exam.code}
                  </span>
                  <Badge variant="outline" className={`text-[11px] font-bold ${exam.badgeColor}`}>
                    {exam.badge}
                  </Badge>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-brand dark:group-hover:text-[#7b9bee] transition-colors">
                    {exam.name}
                  </h3>
                  <div className="inline-block mt-1.5 px-2.5 py-0.5 rounded-lg bg-brand/10 dark:bg-brand/20 text-brand dark:text-[#7b9bee] text-xs font-bold">
                    {exam.targetScale}
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {exam.description}
                </p>

                {/* Exam meta tags */}
                <div className="flex items-center gap-3 pt-1 text-[11px] font-medium text-slate-500 border-t border-slate-100 dark:border-slate-800">
                  <span className="flex items-center gap-1">
                    <Timer className="size-3.5 text-slate-400" /> {exam.duration}
                  </span>
                  <span>•</span>
                  <span>{exam.questionCount}</span>
                </div>

                {/* Skills Tested */}
                <div className="space-y-1.5 pt-1">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {t("skillsTitle")}
                  </p>
                  <div className="grid grid-cols-1 gap-1.5">
                    {exam.skills.map((skill, idx) => {
                      const Icon = skill.icon;
                      return (
                        <div
                          key={idx}
                          className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300"
                        >
                          <Icon className="size-3.5 text-brand dark:text-[#7b9bee] shrink-0" />
                          <span>{skill.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Key Highlights */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                  {exam.highlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-[11.5px] text-slate-600 dark:text-slate-400">
                      <CheckCircle2 className="size-3.5 text-emerald-500 mt-0.5 shrink-0" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Footer Action */}
              <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
                <Button
                  className={`w-full py-5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer ${
                    exam.popular
                      ? "bg-brand hover:bg-[#1e2f5e] text-white shadow-md shadow-brand/20"
                      : "bg-slate-100 dark:bg-slate-800 hover:bg-brand/10 text-slate-800 dark:text-slate-200 hover:text-brand dark:hover:text-[#7b9bee]"
                  }`}
                  onClick={() => router.push(`/practice?exam=${exam.id}`)}
                >
                  {t("startNow")}
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
