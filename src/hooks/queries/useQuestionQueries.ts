import { questionService } from "@/services/question.service";
import type { GradeResult, PracticeAnswer, PracticeFilter, PublicQuestion } from "@/types/question";
import { useMutation, useQuery } from "@tanstack/react-query";

export const QUESTION_QUERY_KEYS = {
  all: ["questions"] as const,
  list: (params: Record<string, unknown>) => ["questions", "list", params] as const,
  detail: (id: string) => ["questions", "detail", id] as const,
  lookups: () => ["questions", "lookups"] as const,
  topics: () => ["questions", "topics"] as const,
  practice: (filter: PracticeFilter) => ["questions", "practice", filter] as const,
};

export function useQuestionsListQuery(skip = 0, take = 20, where: PracticeFilter = {}) {
  return useQuery({
    queryKey: QUESTION_QUERY_KEYS.list({ skip, take, ...where }),
    queryFn: () => questionService.pagination(skip, take, where),
    staleTime: 2 * 60 * 1000,
  });
}

export function useQuestionDetailQuery(id: string) {
  return useQuery({
    queryKey: QUESTION_QUERY_KEYS.detail(id),
    queryFn: () => questionService.getOne(id),
    enabled: Boolean(id),
  });
}

export function useLookupsQuery() {
  return useQuery({
    queryKey: QUESTION_QUERY_KEYS.lookups(),
    queryFn: async () => {
      const [examTypes, skills, types, topics] = await Promise.all([
        questionService.lookupExamTypes(),
        questionService.lookupSkills(),
        questionService.lookupTypes(),
        questionService.lookupTopics(),
      ]);
      return { examTypes, skills, types, topics };
    },
    staleTime: 10 * 60 * 1000,
  });
}

export function useTopicsQuery() {
  return useQuery({
    queryKey: QUESTION_QUERY_KEYS.topics(),
    queryFn: () => questionService.lookupTopics(),
    staleTime: 10 * 60 * 1000,
  });
}

export function useQuestionsPracticeQuery(filter: PracticeFilter) {
  return useQuery({
    queryKey: QUESTION_QUERY_KEYS.practice(filter),
    queryFn: async () => {
      const res = await questionService.startPractice(filter);
      if (res?.items && res.items.length > 0) return res.items;

      // Fallback to pagination endpoint if startPractice returns empty
      const listRes = await questionService.pagination(0, filter.limit || 20, filter);
      return listRes.data || [];
    },
    staleTime: 60 * 1000,
  });
}

export function useGradeQuestionMutation() {
  return useMutation({
    mutationFn: ({
      questionId,
      questionVersionId,
      answer,
    }: {
      questionId: string;
      questionVersionId?: string;
      answer: PracticeAnswer;
    }) => questionService.grade({ questionId, questionVersionId, answerJson: answer }),
  });
}
