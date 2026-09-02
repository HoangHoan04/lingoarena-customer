// API_ENDPOINTS keys used here: /user/arena/me/rating, /user/arena/queue, /user/arena/queue/:id, /user/arena/practice-match, /user/arena/matches/:id, /user/arena/matches/:id/answers, /user/arena/matches/:id/finish
import { extractApiData } from "@/lib/auth";
import type { PublicQuestion } from "@/types/question";
import apiService from "./api.service";

export interface ArenaMatchQuestion {
  id: string;
  sortOrder: number;
  question?: PublicQuestion | null;
}

export interface ArenaParticipant {
  id: string;
  userId: string;
  correctCount: number;
  totalAnswered: number;
  score: number;
  result?: string | null;
  eloChange?: number | null;
}

export interface ArenaMatch {
  id: string;
  status: string;
  matchMode: string;
  questionCount: number;
  matchQuestions?: ArenaMatchQuestion[];
  participants?: ArenaParticipant[];
}

export interface ArenaQueueTicket {
  id: string;
  status: string;
  matchedMatchId?: string | null;
}

export const arenaService = {
  rating: async (examSkillId: string) => {
    const res = await apiService.get("/user/arena/me/rating", { params: { examSkillId } });
    return extractApiData(res);
  },

  queue: async (examSkillId: string, matchMode = "RANKED") => {
    const res = await apiService.post("/user/arena/queue", { examSkillId, matchMode });
    return extractApiData<ArenaQueueTicket>(res);
  },

  queueTicket: async (id: string) => {
    const res = await apiService.get(`/user/arena/queue/${id}`);
    return extractApiData<ArenaQueueTicket>(res);
  },

  practiceMatch: async (examSkillId: string, questionCount = 5) => {
    const res = await apiService.post("/user/arena/practice-match", { examSkillId, questionCount });
    return extractApiData<ArenaMatch>(res);
  },

  match: async (id: string) => {
    const res = await apiService.get(`/user/arena/matches/${id}`);
    return extractApiData<ArenaMatch>(res);
  },

  answer: async (matchId: string, arenaMatchQuestionId: string, answerJson: Record<string, unknown>, timeTakenMs = 0) => {
    const res = await apiService.post(`/user/arena/matches/${matchId}/answers`, {
      arenaMatchQuestionId,
      answerJson,
      timeTakenMs,
    });
    return extractApiData(res);
  },

  finish: async (matchId: string) => {
    const res = await apiService.post(`/user/arena/matches/${matchId}/finish`);
    return extractApiData<ArenaMatch>(res);
  },
};
