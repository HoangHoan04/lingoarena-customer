import { extractApiData } from "@/lib/auth";
import apiService from "./api.service";
import API_ENDPOINTS from "./endpoint";

function paginationPayload<T>(res: any) {
  const body = res?.data ?? res;
  if (Array.isArray(body?.data)) return { data: body.data as T[], total: Number(body.total || 0) };
  const inner = extractApiData<any>(res);
  if (Array.isArray(inner)) return { data: inner as T[], total: inner.length };
  return { data: (inner?.data || []) as T[], total: Number(inner?.total || 0) };
}

export const courseService = {
  pagination: async (skip = 0, take = 20, where: Record<string, unknown> = {}) => {
    const res = await apiService.post("/user/course/pagination", { skip, take, where });
    return paginationPayload<any>(res);
  },
  bySlug: async (slug: string) => {
    const res = await apiService.get(`/user/course/by-slug/${slug}`);
    return extractApiData<any>(res);
  },
  enroll: async (courseId: string) => {
    const res = await apiService.post(`/user/course/enroll/${courseId}`);
    return extractApiData<any>(res);
  },
  myEnrollments: async () => {
    const res = await apiService.get("/user/course/me/enrollments");
    return paginationPayload<any>(res);
  },
  lesson: async (lessonId: string) => {
    const res = await apiService.get(`/user/course/lessons/${lessonId}`);
    return extractApiData<any>(res);
  },
  progress: async (
    lessonId: string,
    payload: { status?: string; progressPercent?: number; lastBlockId?: string },
  ) => {
    const res = await apiService.post(`/user/course/lessons/${lessonId}/progress`, payload);
    return extractApiData<any>(res);
  },
  reviews: async (courseId: string, payload: { rating: number; comment?: string }) => {
    const res = await apiService.post(API_ENDPOINTS.COURSES.REVIEWS(courseId), payload);
    return extractApiData<any>(res);
  },
};

export default courseService;
