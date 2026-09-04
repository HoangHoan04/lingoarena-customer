"use client";

import type { AptisSectionInfo, AptisSectionKey } from "@/types/aptis";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Headphones,
  Mic,
  PenTool,
  Sparkles,
} from "lucide-react";

const SECTION_ICONS: Record<AptisSectionKey, any> = {
  grammar_vocab: Sparkles,
  listening: Headphones,
  reading: BookOpen,
  writing: PenTool,
  speaking: Mic,
};

interface AptisSectionStepperProps {
  sections: AptisSectionInfo[];
  currentSectionKey: AptisSectionKey;
  completedSections: AptisSectionKey[];
  onSelectSection?: (key: AptisSectionKey) => void;
  allowManualSwitch?: boolean;
}

export function AptisSectionStepper({
  sections,
  currentSectionKey,
  completedSections,
  onSelectSection,
  allowManualSwitch = false,
}: AptisSectionStepperProps) {
  return (
    <div className="w-full rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 p-3 sm:p-4 shadow-sm backdrop-blur-xl">
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3">
        {sections.map((section, idx) => {
          const Icon = SECTION_ICONS[section.key] || Sparkles;
          const isCurrent = section.key === currentSectionKey;
          const isDone = completedSections.includes(section.key);

          return (
            <button
              key={section.key}
              type="button"
              disabled={!allowManualSwitch && !isDone && !isCurrent}
              onClick={() => onSelectSection && onSelectSection(section.key)}
              className={`relative flex items-center gap-2.5 p-2.5 sm:p-3 rounded-2xl border-2 transition-all text-left ${
                isCurrent
                  ? "border-brand dark:border-[#7b9bee] bg-brand/10 dark:bg-brand/25 text-brand dark:text-[#7b9bee] shadow-md ring-2 ring-brand/20"
                  : isDone
                    ? "border-emerald-300 dark:border-emerald-800/80 bg-emerald-50/70 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 cursor-pointer"
                    : "border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-850 text-slate-400 opacity-60 cursor-not-allowed"
              }`}
            >
              <div
                className={`p-2 rounded-xl shrink-0 transition-transform ${
                  isCurrent
                    ? "bg-brand text-white shadow-xs scale-105"
                    : isDone
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-200 dark:bg-slate-800 text-slate-400"
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="size-4" />
                ) : (
                  <Icon className="size-4" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Phần {idx + 1}
                  </span>
                  <span className="text-[10px] font-mono font-bold flex items-center gap-0.5 text-slate-500">
                    <Clock className="size-2.5" />
                    {section.durationMinutes}p
                  </span>
                </div>
                <div className="text-xs font-black truncate leading-tight mt-0.5">
                  {section.title}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
