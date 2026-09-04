"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MessageCircleQuestion } from "lucide-react";
import { useTranslations } from "next-intl";

export default function FaqSection() {
  const t = useTranslations("home.faq");

  const faqs = [
    {
      id: "faq-1",
      question: t("item1.q"),
      answer: t("item1.a"),
    },
    {
      id: "faq-2",
      question: t("item2.q"),
      answer: t("item2.a"),
    },
    {
      id: "faq-3",
      question: t("item3.q"),
      answer: t("item3.a"),
    },
    {
      id: "faq-4",
      question: t("item4.q"),
      answer: t("item4.a"),
    },
    {
      id: "faq-5",
      question: t("item5.q"),
      answer: t("item5.a"),
    },
    {
      id: "faq-6",
      question: t("item6.q"),
      answer: t("item6.a"),
    },
  ];

  return (
    <section
      id="faq"
      className="py-16 sm:py-24 relative overflow-hidden bg-slate-50/50 dark:bg-slate-900/30 border-b border-slate-200/60 dark:border-slate-800"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand/10 dark:bg-brand/20 border border-brand/20 dark:border-brand/30 text-brand dark:text-[#7b9bee] text-xs font-bold uppercase tracking-wider">
            <MessageCircleQuestion className="size-3.5" />
            {t("badge")}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t("title")}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            {t("subtitle")}
          </p>
        </div>

        {/* Accordion List */}
        <Accordion className="w-full space-y-4">
          {faqs.map((faq) => (
            <AccordionItem
              key={faq.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-1 shadow-2xs transition-all data-open:border-brand/50 data-open:shadow-md"
            >
              <AccordionTrigger className="text-left font-bold text-sm sm:text-base text-slate-900 dark:text-white hover:text-brand dark:hover:text-[#7b9bee] transition-colors py-4">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pb-5 pt-1">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
