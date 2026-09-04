"use client";

import { Link } from "@/i18n/routing";
import type { GrammarCategoryGroup } from "@/types/grammar";
import { ArrowRight, BookOpen, CheckCircle, ChevronRight, Layers, Sparkles } from "lucide-react";

interface GrammarCategoryListProps {
  categories: GrammarCategoryGroup[];
}

export function GrammarCategoryList({ categories }: GrammarCategoryListProps) {
  return (
    <div className="space-y-10">
      {categories.map((category) => {
        if (!category.topics || category.topics.length === 0) return null;

        return (
          <section key={category.id} className="space-y-4">
            {/* CATEGORY HEADER */}
            <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl p-2 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900 shadow-2xs">
                  {category.icon}
                </span>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                    {category.title}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {category.description}
                  </p>
                </div>
              </div>

              <span className="text-xs font-mono font-bold text-slate-400">
                {category.topics.length} chủ điểm
              </span>
            </div>

            {/* TOPICS CARDS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {category.topics.map((topic) => {
                const structures = topic.structures || [];
                const primaryFormula = structures[0]?.formula;

                return (
                  <Link
                    key={topic.id}
                    href={`/grammar/${topic.slug}`}
                    className="group rounded-3xl border-2 border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-500/60 transition-all p-5 sm:p-6 shadow-sm hover:shadow-xl flex flex-col justify-between space-y-4 cursor-pointer"
                  >
                    <div className="space-y-3">
                      {/* LEVEL BADGE & ICON */}
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 text-[10px] font-black uppercase">
                          CEFR {topic.cefrLevel || "B1"}
                        </span>

                        <span className="text-[11px] font-bold text-slate-400">
                          {structures.length} cấu trúc
                        </span>
                      </div>

                      {/* TITLE & DESCRIPTION */}
                      <div>
                        <h4 className="text-base font-black text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors leading-snug">
                          {topic.title}
                        </h4>
                        {topic.titleEn && (
                          <p className="text-[11px] text-slate-400 font-semibold italic">
                            {topic.titleEn}
                          </p>
                        )}
                        <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                          {topic.description}
                        </p>
                      </div>

                      {/* FORMULA HIGHLIGHT */}
                      {primaryFormula && (
                        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800 text-[11px] font-mono font-bold text-blue-700 dark:text-blue-300 truncate">
                          {primaryFormula}
                        </div>
                      )}
                    </div>

                    {/* ACTION LINK */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
                      <span>Học chi tiết & Luyện tập</span>
                      <ChevronRight className="size-4" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
