import { courseService } from "@/services/course.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const COURSE_QUERY_KEYS = {
  all: ["courses"] as const,
  list: (params: Record<string, unknown>) => ["courses", "list", params] as const,
  detail: (slug: string) => ["courses", "detail", slug] as const,
  enrollments: () => ["courses", "enrollments"] as const,
  lesson: (lessonId: string) => ["courses", "lesson", lessonId] as const,
};

export function useCoursesQuery(skip = 0, take = 50, where: Record<string, unknown> = {}) {
  return useQuery({
    queryKey: COURSE_QUERY_KEYS.list({ skip, take, ...where }),
    queryFn: () => courseService.pagination(skip, take, where),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCourseBySlugQuery(slug: string) {
  return useQuery({
    queryKey: COURSE_QUERY_KEYS.detail(slug),
    queryFn: () => courseService.bySlug(slug),
    enabled: Boolean(slug),
    staleTime: 5 * 60 * 1000,
  });
}

export function useMyEnrollmentsQuery() {
  return useQuery({
    queryKey: COURSE_QUERY_KEYS.enrollments(),
    queryFn: () => courseService.myEnrollments(),
    staleTime: 3 * 60 * 1000,
  });
}

export function useLessonDetailQuery(lessonId: string) {
  return useQuery({
    queryKey: COURSE_QUERY_KEYS.lesson(lessonId),
    queryFn: () => courseService.lesson(lessonId),
    enabled: Boolean(lessonId),
  });
}

export function useEnrollCourseMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (courseId: string) => courseService.enroll(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COURSE_QUERY_KEYS.enrollments() });
    },
  });
}

export function useLessonProgressMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      lessonId,
      payload,
    }: {
      lessonId: string;
      payload: { status?: string; progressPercent?: number; lastBlockId?: string };
    }) => courseService.progress(lessonId, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: COURSE_QUERY_KEYS.lesson(variables.lessonId) });
      queryClient.invalidateQueries({ queryKey: COURSE_QUERY_KEYS.enrollments() });
    },
  });
}
