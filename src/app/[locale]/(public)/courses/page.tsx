"use client";

import {
  CourseCatalogCard,
  CourseFilterBar,
  CourseHeroBanner,
  MyCourseProgressCard,
} from "@/components/course";
import { useCourseStore } from "@/stores/useCourseStore";
import {
  Award,
  BookOpen,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import React, { useEffect, useMemo } from "react";

export default function CourseCatalogPage() {
  const {
    courses,
    isLoading,
    error,
    searchQuery,
    selectedExamType,
    selectedCefrLevel,
    selectedPriceType,
    sortBy,
    loadCourses,
    loadMyEnrollments,
  } = useCourseStore();

  useEffect(() => {
    loadCourses();
    loadMyEnrollments();
  }, [loadCourses, loadMyEnrollments]);

  const filteredCourses = useMemo(() => {
    let list = [...courses];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.shortDescription.toLowerCase().includes(q) ||
          c.instructor.name.toLowerCase().includes(q)
      );
    }

    // Exam Type
    if (selectedExamType !== "all") {
      list = list.filter((c) => c.examType === selectedExamType);
    }

    // CEFR Level
    if (selectedCefrLevel !== "all") {
      list = list.filter(
        (c) =>
          c.levelFrom === selectedCefrLevel || c.levelTo === selectedCefrLevel
      );
    }

    // Price Type
    if (selectedPriceType === "free") {
      list = list.filter((c) => c.isFree);
    } else if (selectedPriceType === "pro") {
      list = list.filter((c) => !c.isFree && !c.hasMentor);
    } else if (selectedPriceType === "mentor") {
      list = list.filter((c) => c.hasMentor);
    }

    // Sorting
    if (sortBy === "popular") {
      list.sort((a, b) => b.studentCount - a.studentCount);
    } else if (sortBy === "rating") {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "price_asc") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price_desc") {
      list.sort((a, b) => b.price - a.price);
    }

    return list;
  }, [
    courses,
    searchQuery,
    selectedExamType,
    selectedCefrLevel,
    selectedPriceType,
    sortBy,
  ]);

  return (
    <div className="min-h-screen bg-background text-foreground py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Hero Banner */}
        <CourseHeroBanner />

        {/* My Enrolled Course Progress (if any) */}
        <MyCourseProgressCard />

        {/* Multi-Dimensional Filter Bar */}
        <CourseFilterBar />

        {/* Course Catalog Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-extrabold text-foreground">
              Danh Sách Khóa Học ({filteredCourses.length})
            </h2>
          </div>

          {isLoading ? (
            <div className="p-12 rounded-3xl bg-card border border-border text-center text-xs text-muted-foreground">
              Đang tải danh sách khóa học...
            </div>
          ) : error ? (
            <div className="p-12 rounded-3xl bg-card border border-border text-center text-xs text-rose-500">
              {error}
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="p-12 rounded-3xl bg-card border border-border text-center space-y-3 shadow-xs">
              <div className="size-12 rounded-2xl bg-muted text-muted-foreground flex items-center justify-center mx-auto">
                <BookOpen className="size-6" />
              </div>
              <h3 className="font-bold text-foreground text-sm sm:text-base">
                Không tìm thấy khóa học phù hợp
              </h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Hãy thử thay đổi từ khóa tìm kiếm hoặc chọn lại các bộ lọc chứng chỉ.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <CourseCatalogCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </div>

        {/* Bottom Feature Value Props */}
        <div className="pt-12 border-t border-border grid grid-cols-1 md:grid-cols-3 gap-6 select-none">
          <div className="p-6 rounded-3xl bg-card border border-border space-y-2 shadow-xs">
            <div className="size-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <Sparkles className="size-5" />
            </div>
            <h4 className="font-bold text-sm sm:text-base text-foreground">
              Công Nghệ AI LingoBot 24/7
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Chấm bài Writing và chỉnh sửa phát âm Speaking tức thì theo ma trận tiêu chí chấm thi quốc tế.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-card border border-border space-y-2 shadow-xs">
            <div className="size-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Award className="size-5" />
            </div>
            <h4 className="font-bold text-sm sm:text-base text-foreground">
              Giáo Trình Bản Quyền
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Biên soạn độc quyền từ các chuyên gia IELTS 8.5+ và TOEIC 990, cập nhật sát xu hướng ra đề 2026.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-card border border-border space-y-2 shadow-xs">
            <div className="size-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <CheckCircle2 className="size-5" />
            </div>
            <h4 className="font-bold text-sm sm:text-base text-foreground">
              Cam Kết Đầu Ra Bằng Hợp Đồng
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Học lại miễn phí 100% nếu hoàn thành giáo trình nhưng không đạt điểm mục tiêu đã cam kết.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
