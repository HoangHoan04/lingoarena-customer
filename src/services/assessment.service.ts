import { extractApiData } from "@/lib/auth";
import type { PracticeAnswer } from "@/types/question";
import type { AssessmentAttempt, AssessmentPageResponse, AssessmentSummary } from "@/types/assessment";
import apiService from "./api.service";

const ENDPOINTS = {
  PAGINATION: "/user/assessment/pagination",
  BY_SLUG: (slug: string) => `/user/assessment/by-slug/${slug}`,
  START: "/user/assessment/start",
  ATTEMPT: (id: string) => `/user/assessment/attempts/${id}`,
  HEARTBEAT: (id: string) => `/user/assessment/attempts/${id}/heartbeat`,
  ANSWERS: (id: string) => `/user/assessment/attempts/${id}/answers`,
  SUBMIT: (id: string) => `/user/assessment/attempts/${id}/submit`,
  RESULT: (id: string) => `/user/assessment/attempts/${id}/result`,
};

function paginationPayload(res: any): AssessmentPageResponse {
  const body = res?.data ?? res;
  if (Array.isArray(body?.data)) {
    return { data: body.data as AssessmentSummary[], total: Number(body.total || 0) };
  }
  const inner = extractApiData<any>(res);
  return { data: (inner?.data || []) as AssessmentSummary[], total: Number(inner?.total || 0) };
}

export const assessmentService = {
  list: async (where: Record<string, unknown> = {}, skip = 0, take = 50) => {
    const res = await apiService.post(ENDPOINTS.PAGINATION, { skip, take, where });
    return paginationPayload(res);
  },
  bySlug: async (slug: string) => {
    const res = await apiService.get(ENDPOINTS.BY_SLUG(slug));
    return extractApiData<AssessmentSummary>(res);
  },
  start: async (payload: { slug?: string; assessmentId?: string }) => {
    const res = await apiService.post(ENDPOINTS.START, payload);
    return extractApiData<AssessmentAttempt>(res);
  },
  attempt: async (id: string) => {
    const res = await apiService.get(ENDPOINTS.ATTEMPT(id));
    return extractApiData<AssessmentAttempt>(res);
  },
  heartbeat: async (id: string, payload: { focusLossCount?: number; clientClockSkewMs?: number } = {}) => {
    const res = await apiService.post(ENDPOINTS.HEARTBEAT(id), payload);
    return extractApiData(res);
  },
  saveAnswer: async (attemptId: string, payload: { attemptQuestionId: string; answerJson: PracticeAnswer }) => {
    const res = await apiService.post(ENDPOINTS.ANSWERS(attemptId), payload);
    return extractApiData(res);
  },
  submit: async (id: string) => {
    const res = await apiService.post(ENDPOINTS.SUBMIT(id));
    return extractApiData<AssessmentAttempt>(res);
  },
  result: async (id: string) => {
    const res = await apiService.get(ENDPOINTS.RESULT(id));
    return extractApiData<AssessmentAttempt>(res);
  },
};
