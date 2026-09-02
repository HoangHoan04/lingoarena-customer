"use client";

import {
  type CourseSection,
  type Lesson,
  useCourseStore,
} from "@/stores/useCourseStore";
import {
  Bot,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FileQuestion,
  FileText,
  Lock,
  PlayCircle,
  Sparkles,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import React, { useState } from "react";

export default function CourseCurriculumAccordion({
  courseId,
  slug,
  sections,
  isEnrolled = false,
}: {
  courseId: string;
  slug: string;
  sections: CourseSection[];
  isEnrolled?: boolean;
}) {
  const { completedLessonIds } = useCourseStore();
  const completedList = completedLessonIds[courseId] || [];

  // Default expand all sections
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(
    () => {
      const initial: Record<string, boolean> = {};
      sections.forEach((sec, idx) => {
        initial[sec.id] = idx === 0 || idx === 1;
      });
      return initial;
    }
  );

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const getLessonIcon = (type: Lesson["type"]) => {
    switch (type) {
      case "video":
        return <PlayCircle className="size-4 text-primary" />;
      case "reading":
        return <FileText className="size-4 text-amber-500" />;
      case "quiz":
        return <FileQuestion className="size-4 text-emerald-500" />;
      case "ai_practice":
        return <Bot className="size-4 text-purple-500" />;
      default:
        return <PlayCircle className="size-4 text-primary" />;
    }
  };

  const getLessonTypeLabel = (type: Lesson["type"]) => {
    switch (type) {
      case "video":
        return "Video Bài Giảng";
      case "reading":
        return "Tài Liệu Đọc";
      case "quiz":
        return "Trắc Nghiệm";
      case "ai_practice":
        return "Thực Hành AI";
      default:
        return "Bài Học";
    }
  };

  if (sections.length === 0) {
    return (
      <div className="p-8 rounded-2xl bg-card border border-border text-center text-muted-foreground text-xs select-none">
        Nội dung chi tiết của khóa học đang được ban chuyên môn cập nhật.
      </div>
    );
  }

  return (
    <div className="space-y-3 select-none">
      {sections.map((sec, secIdx) => {
        const isExpanded = !!expandedSections[sec.id];
        const totalDuration = sec.lessons.reduce(
          (acc, l) => acc + l.durationMinutes,
          0
        );

        return (
          <div
            key={sec.id}
            className="rounded-2xl bg-card border border-border overflow-hidden transition-all shadow-2xs"
          >
            {/* Section Header Accordion Trigger */}
            <button
              type="button"
              onClick={() => toggleSection(sec.id)}
              className="w-full flex items-center justify-between p-4 sm:p-5 bg-muted/40 hover:bg-muted/70 transition-colors text-left cursor-pointer"
            >
              <div className="space-y-1">
                <h4 className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-2">
                  <span className="size-6 rounded-lg bg-primary/10 text-primary text-xs font-black flex items-center justify-center shrink-0">
                    {secIdx + 1}
                  </span>
                  <span>{sec.title}</span>
                </h4>
                {sec.description && (
                  <p className="text-xs text-muted-foreground font-normal pl-8">
                    {sec.description}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3 shrink-0 pl-2">
                <span className="text-[11px] text-muted-foreground font-medium hidden sm:inline">
                  {sec.lessons.length} bài học · {totalDuration} phút
                </span>
                {isExpanded ? (
                  <ChevronUp className="size-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="size-4 text-muted-foreground" />
                )}
              </div>
            </button>

            {/* Lesson List */}
            {isExpanded && (
              <div className="divide-y divide-border">
                {sec.lessons.map((lesson) => {
                  const isCompleted = completedList.includes(lesson.id);
                  const canAccess = isEnrolled || lesson.isPreview;

                  return (
                    <div
                      key={lesson.id}
                      className="p-3.5 sm:px-5 flex items-center justify-between hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0 pr-2">
                        {/* Status Checkbox or Lock */}
                        {isCompleted ? (
                          <CheckCircle2 className="size-4.5 text-emerald-500 shrink-0" />
                        ) : canAccess ? (
                          getLessonIcon(lesson.type)
                        ) : (
                          <Lock className="size-4 text-muted-foreground/60 shrink-0" />
                        )}

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs sm:text-[13px] font-semibold text-foreground truncate block">
                              {lesson.title}
                            </span>
                            {lesson.isPreview && !isEnrolled && (
                              <span className="px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black shrink-0">
                                Học thử
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-muted-foreground font-medium block">
                            {getLessonTypeLabel(lesson.type)} ·{" "}
                            {lesson.durationMinutes} phút
                          </span>
                        </div>
                      </div>

                      {/* Action Link */}
                      {canAccess ? (
                        <Link
                          href={`/courses/${slug}/learn/${lesson.id}`}
                          className="px-3 py-1 rounded-xl bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground text-xs font-bold transition-all shrink-0 cursor-pointer"
                        >
                          {isEnrolled ? "Học ngay" : "Xem thử"}
                        </Link>
                      ) : (
                        <span className="text-xs text-muted-foreground/50 font-medium">
                          Khóa
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
