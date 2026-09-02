// API_ENDPOINTS keys used here: /user/leaderboard/snapshots
import { extractApiData } from "@/lib/auth";
import type { LeaderboardRow } from "@/types/learning";
import apiService from "./api.service";

export const leaderboardService = {
  snapshots: async (boardType = "STUDY_POINTS", period = "ALL_TIME") => {
    const res = await apiService.get("/user/leaderboard/snapshots", {
      params: { boardType, period },
    });
    const data = extractApiData<LeaderboardRow[] | { data?: LeaderboardRow[] }>(res);
    return Array.isArray(data) ? data : data?.data || [];
  },
};
