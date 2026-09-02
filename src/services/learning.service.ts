// API_ENDPOINTS keys used here: /user/learning/goals, /user/learning/goals/current, /user/learning/paths/generate, /user/learning/paths/current, /user/learning/items/:id/complete, /user/learning/errors, /user/learning/activity/today
import { extractApiData } from "@/lib/auth";
import type { LearningGoal, LearningPath, UserDailyActivity, UserErrorItem } from "@/types/learning";
import apiService from "./api.service";

function paginationPayload<T>(res: any) {
  const body = res?.data ?? res;
  return { data: (body?.data || []) as T[], total: Number(body?.total || 0) };
}

export const learningService = {
  createGoal: async (payload: {
    examTypeId: string;
    currentScore?: number;
    targetScore: number;
    examDate?: string;
    minutesPerDay?: number;
    daysPerWeek?: number;
  }) => {
    const res = await apiService.post("/user/learning/goals", payload);
    return extractApiData<LearningGoal>(res);
  },

  currentGoal: async () => {
    const res = await apiService.get("/user/learning/goals/current");
    return extractApiData<LearningGoal>(res);
  },

  generatePath: async () => {
    const res = await apiService.post("/user/learning/paths/generate");
    return extractApiData<LearningPath>(res);
  },

  currentPath: async () => {
    const res = await apiService.get("/user/learning/paths/current");
    return extractApiData<LearningPath>(res);
  },

  completeItem: async (id: string) => {
    const res = await apiService.put(`/user/learning/items/${id}/complete`, {});
    return extractApiData(res);
  },

  errors: async (skip = 0, take = 10) => {
    const res = await apiService.post("/user/learning/errors", { skip, take, where: {} });
    return paginationPayload<UserErrorItem>(res);
  },

  todayActivity: async () => {
    const res = await apiService.get("/user/learning/activity/today");
    return extractApiData<UserDailyActivity>(res);
  },
};
