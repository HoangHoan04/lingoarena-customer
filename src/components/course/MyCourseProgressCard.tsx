"use client";

import { useCourseStore } from "@/stores/useCourseStore";
import { ArrowRight, BookOpen, Clock, PlayCircle, Trophy } from "lucide-react";
import { Link } from "@/i18n/routing";
import React from "react";

export default function MyCourseProgressCard() {
  const { courses, enrolledCourseIds, getCourseProgress } = useCourseStore();

  const enrolledCourses = courses.filter((c) =>
    enrolledCourseIds.includes(c.id)
  );

  if (enrolledCourses.length === 0) return null;

  return (
    <div className="mb-10 space-y-4 select-none">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Trophy className="size-4.5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-foreground leading-tight">
              Khóa Học Của Tôi ({enrolledCourses.length})
            </h2>
            <p className="text-xs text-muted-foreground">
              Tiếp tục bài học dở dang để duy trì chuỗi học tập
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {enrolledCourses.map((course) => {
          const progress = getCourseProgress(course.id);
          const firstLessonId = course.sections[0]?.lessons[0]?.id || "lesson-1";

          return (
            <div
              key={course.id}
              className="group relative flex flex-col sm:flex-row gap-4 p-4 rounded-3xl bg-card border border-border shadow-md hover:border-primary/40 hover:shadow-xl transition-all"
            >
              {/* Thumbnail */}
              <div className="relative w-full sm:w-44 h-28 sm:h-auto rounded-2xl overflow-hidden shrink-0">
                <img
                  src={course.thumbnailUrl}
                  alt={course.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/25 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <PlayCircle className="size-10 text-white drop-shadow-md" />
                </div>
              </div>

              {/* Info & Progress */}
              <div className="flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider">
                    {course.examType.toUpperCase()}
                  </span>
                  <h3 className="text-sm font-bold text-foreground mt-1 line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                    {course.title}
                  </h3>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="text-muted-foreground">Tiến độ học tập</span>
                    <span className="text-primary">{progress}% Hoàn thành</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-linear-to-r from-primary to-indigo-500 transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Action button */}
                <div className="pt-1">
                  <Link
                    href={`/courses/${course.slug}/learn/${firstLessonId}`}
                    className="w-full inline-flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold shadow-md shadow-primary/20 transition-all hover:scale-101 active:scale-98"
                  >
                    <span>Tiếp tục học bài</span>
                    <ArrowRight className="size-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
