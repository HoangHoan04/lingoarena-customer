import { extractApiData } from "@/lib/auth";
import type {
  GradeResult,
  PracticeAnswer,
  PracticeFilter,
  PublicQuestion,
  QuestionLookup,
} from "@/types/question";
import apiService from "./api.service";
import API_ENDPOINTS from "./endpoint";

function paginationPayload<T>(res: any) {
  const body = res?.data ?? res;
  if (Array.isArray(body?.data)) {
    return { data: body.data as T[], total: Number(body.total || 0) };
  }
  const inner = extractApiData<any>(res);
  if (Array.isArray(inner)) return { data: inner as T[], total: inner.length };
  return { data: (inner?.data || []) as T[], total: Number(inner?.total || 0) };
}

function asList<T>(res: any): T[] {
  const data = extractApiData<any>(res);
  return Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
}

export const questionService = {
  pagination: async (skip = 0, take = 20, where: PracticeFilter = {}) => {
    const res = await apiService.post(API_ENDPOINTS.QUESTION.QUESTIONS_PAGINATION, {
      skip,
      take,
      where,
    });
    return paginationPayload<PublicQuestion>(res);
  },

  getOne: async (id: string) => {
    const res = await apiService.get(API_ENDPOINTS.QUESTION.QUESTION_DETAIL(id));
    return extractApiData<PublicQuestion>(res);
  },

  lookupExamTypes: async () => {
    const res = await apiService.get(API_ENDPOINTS.QUESTION.LOOKUP_EXAM_TYPES);
    return asList<QuestionLookup>(res);
  },

  lookupSkills: async (examTypeId?: string) => {
    const res = await apiService.get(API_ENDPOINTS.QUESTION.LOOKUP_SKILLS, {
      params: examTypeId ? { examTypeId } : undefined,
    });
    return asList<QuestionLookup>(res);
  },

  lookupTypes: async () => {
    const res = await apiService.get(API_ENDPOINTS.QUESTION.LOOKUP_TYPES);
    return asList<QuestionLookup>(res);
  },

  lookupTopics: async () => {
    const res = await apiService.get(API_ENDPOINTS.QUESTION.LOOKUP_TOPICS);
    return asList<QuestionLookup>(res);
  },

  startPractice: async (filter: PracticeFilter) => {
    const res = await apiService.post(API_ENDPOINTS.QUESTION.PRACTICE_START, filter);
    const data = extractApiData<{ items?: PublicQuestion[]; total?: number }>(res);
    return { items: data?.items || [], total: Number(data?.total || 0) };
  },

  grade: async (payload: {
    questionId: string;
    questionVersionId: string;
    answerJson: PracticeAnswer;
  }) => {
    const res = await apiService.post(API_ENDPOINTS.QUESTION.PRACTICE_GRADE, payload);
    return extractApiData<GradeResult>(res);
  },
};
