"use client";

import { type Course } from "@/stores/useCourseStore";
import { pickLocaleText } from "@/lib/locale-text";
import {
  Award,
  BookOpen,
  Clock,
  Flame,
  GraduationCap,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { useLocale } from "next-intl";
import React from "react";

export default function CourseCatalogCard({ course }: { course: Course }) {
  const locale = useLocale();
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const formatPrice = (amount: number) => {
    return `${formatNumber(amount)} ₫`;
  };

  return (
    <div className="group relative flex flex-col rounded-3xl bg-card border border-border shadow-sm hover:border-primary/50 hover:shadow-xl transition-all duration-300 overflow-hidden select-none">
      {/* Thumbnail Container */}
      <Link
        href={`/courses/${course.slug}`}
        className="relative aspect-16/9 w-full overflow-hidden bg-muted block"
      >
        <img
          src={course.thumbnailUrl}
          alt={pickLocaleText(locale, course.title, course.titleEn)}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-106"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-60" />

        {/* Badge (Top Left) */}
        {course.badge && (
          <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-xl bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-wider shadow-md">
            <Sparkles className="size-3 text-amber-300" />
            <span>{course.badge}</span>
          </div>
        )}

        {/* CEFR Level Pill (Top Right) */}
        <div className="absolute top-3 right-3 px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-md text-white text-[11px] font-black border border-white/20">
          {course.levelFrom} ➜ {course.levelTo}
        </div>

        {/* Duration & Lessons (Bottom Left) */}
        <div className="absolute bottom-2.5 left-3 flex items-center gap-3 text-white/90 text-xs font-semibold drop-shadow-md">
          <span className="flex items-center gap-1">
            <Clock className="size-3 text-amber-300" />
            <span>{course.totalDurationHours} giờ</span>
          </span>
          <span className="flex items-center gap-1">
            <BookOpen className="size-3 text-blue-300" />
            <span>{course.totalLessons} bài học</span>
          </span>
        </div>
      </Link>

      {/* Course Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-2">
          {/* Exam Type & Rating */}
          <div className="flex items-center justify-between text-xs">
            <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10.5px] font-black uppercase tracking-wider">
              {course.examType.toUpperCase()}
            </span>
            <div className="flex items-center gap-1 font-bold text-slate-800 dark:text-slate-200">
              <Star className="size-3.5 fill-amber-400 text-amber-400" />
              <span>{course.rating.toFixed(1)}</span>
              <span className="text-[11px] text-muted-foreground font-normal">
                ({formatNumber(course.reviewCount)})
              </span>
            </div>
          </div>

          {/* Title */}
          <Link href={`/courses/${course.slug}`}>
            <h3 className="font-extrabold text-sm sm:text-base text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors">
              {pickLocaleText(locale, course.title, course.titleEn)}
            </h3>
          </Link>

          {/* Short Description */}
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed font-normal">
            {pickLocaleText(locale, course.shortDescription, course.shortDescriptionEn)}
          </p>
        </div>

        {/* Instructor & Student Count */}
        <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <img
              src={course.instructor.avatar}
              alt={course.instructor.name}
              className="size-6 rounded-full object-cover border border-border"
            />
            <span className="font-semibold text-foreground text-[11.5px] truncate max-w-28">
              {course.instructor.name}
            </span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-muted-foreground font-medium">
            <Users className="size-3 text-muted-foreground" />
            <span>{formatNumber(course.studentCount)} học viên</span>
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="pt-2 flex items-center justify-between">
          <div>
            {course.isFree ? (
              <span className="text-base sm:text-lg font-black text-emerald-600 dark:text-emerald-400">
                Miễn Phí 100%
              </span>
            ) : (
              <div className="flex items-baseline gap-1.5">
                <span className="text-base sm:text-lg font-black text-primary">
                  {formatPrice(course.price)}
                </span>
                {course.originalPrice && (
                  <span className="text-[11px] text-muted-foreground line-through font-normal">
                    {formatPrice(course.originalPrice)}
                  </span>
                )}
              </div>
            )}
          </div>

          <Link
            href={`/courses/${course.slug}`}
            className="px-3.5 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold transition-all shadow-xs hover:scale-102 active:scale-98"
          >
            {course.isFree ? "Học Ngay" : "Xem Chi Tiết"}
          </Link>
        </div>
      </div>
    </div>
  );
}
