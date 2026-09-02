"use client";

import { CourseLessonPlayer } from "@/components/course";
import { useRouter } from "@/i18n/routing";
import { useAuthStore } from "@/stores/useAuthStore";
import { useCourseStore } from "@/stores/useCourseStore";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";

export default function CourseLearningRoomPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const lessonId = params?.lessonId as string;

  const { isAuthenticated } = useAuthStore();
  const { getCourseBySlug, loadCourseBySlug, loadLesson, isLoading, error } = useCourseStore();
  const course = getCourseBySlug(slug);

  useEffect(() => {
    if (!slug || !lessonId) return;
    const href = `/courses/${slug}/learn/${lessonId}`;
    if (!isAuthenticated) {
      router.replace(`/login?redirect=${encodeURIComponent(href)}`);
      return;
    }
    loadCourseBySlug(slug).then(() => loadLesson(slug, lessonId)).catch(() => undefined);
  }, [slug, lessonId, isAuthenticated, router, loadCourseBySlug, loadLesson]);

  if (!isAuthenticated) {
    return <div className="min-h-screen py-20 text-center text-sm text-muted-foreground">Đang chuyển đến đăng nhập...</div>;
  }

  if (isLoading && !course) {
    return <div className="min-h-screen py-20 text-center text-sm text-muted-foreground">Đang tải bài học...</div>;
  }

  if (!course) {
    return <div className="min-h-screen py-20 text-center text-sm text-muted-foreground">{error || "Không tìm thấy bài học."}</div>;
  }

  return <CourseLessonPlayer course={course} currentLessonId={lessonId} />;
}
