import { extractApiData } from "@/lib/auth";
import type { DailyChallenge, GamificationStats } from "@/types/gamification";
import apiService from "./api.service";
import API_ENDPOINTS from "./endpoint";

function unwrapList<T>(data: T[] | { data?: T[] } | null | undefined): T[] {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

export const gamificationService = {
  myStats: async () => {
    const res = await apiService.get(API_ENDPOINTS.GAMIFICATION.ME_STATS);
    return extractApiData<GamificationStats>(res);
  },

  challengesToday: async () => {
    const res = await apiService.get(API_ENDPOINTS.GAMIFICATION.CHALLENGES_TODAY);
    return unwrapList<DailyChallenge>(extractApiData(res));
  },

  progressChallenge: async (code: string, increment = 1) => {
    const res = await apiService.post(API_ENDPOINTS.GAMIFICATION.CHALLENGE_PROGRESS(code), {
      increment,
    });
    return extractApiData(res);
  },

  awardPracticePoints: async (payload: Record<string, unknown> = {}) => {
    const res = await apiService.post(API_ENDPOINTS.GAMIFICATION.PRACTICE_POINTS, payload);
    return extractApiData(res);
  },
};

export default gamificationService;
