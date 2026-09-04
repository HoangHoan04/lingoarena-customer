// API_ENDPOINTS keys used here: /user/arena/me/rating, /user/arena/me/matches, /user/arena/challenges, /user/arena/queue, /user/arena/queue/:id, /user/arena/practice-match, /user/arena/matches/:id, /user/arena/matches/:id/answers, /user/arena/matches/:id/finish
import { extractApiData } from "@/lib/auth";
import type { PublicQuestion } from "@/types/question";
import apiService from "./api.service";
import API_ENDPOINTS from "./endpoint";

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
  eloRating?: number | null;
  user?: {
    id?: string;
    fullName?: string;
    displayName?: string;
    email?: string;
    avatarUrl?: string;
  } | null;
}

export interface ArenaMatch {
  id: string;
  status: string;
  matchMode: string;
  questionCount: number;
  createdAt?: string;
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
    const res = await apiService.get(API_ENDPOINTS.ARENA.ME_RATING, { params: { examSkillId } });
    return extractApiData(res);
  },

  myMatches: async (skip = 0, take = 20, where: Record<string, unknown> = {}) => {
    const res = await apiService.get(API_ENDPOINTS.ARENA.ME_MATCHES, {
      params: { skip, take },
      data: { skip, take, where },
    });
    const body = (res as any)?.data ?? res;
    if (Array.isArray(body?.data)) {
      return { data: body.data as ArenaMatch[], total: Number(body.total || 0) };
    }
    const inner = extractApiData<{ data?: ArenaMatch[]; total?: number } | ArenaMatch[]>(res);
    if (Array.isArray(inner)) return { data: inner, total: inner.length };
    return { data: inner?.data || [], total: Number(inner?.total || 0) };
  },

  createChallenge: async (opponentUserId: string, examSkillId: string, message?: string) => {
    const res = await apiService.post(API_ENDPOINTS.ARENA.CHALLENGES, {
      opponentUserId,
      examSkillId,
      message,
    });
    return extractApiData(res);
  },

  queue: async (examSkillId: string, matchMode = "RANKED") => {
    const res = await apiService.post(API_ENDPOINTS.ARENA.QUEUE, { examSkillId, matchMode });
    return extractApiData<ArenaQueueTicket>(res);
  },

  queueTicket: async (id: string) => {
    const res = await apiService.get(API_ENDPOINTS.ARENA.QUEUE_TICKET(id));
    return extractApiData<ArenaQueueTicket>(res);
  },

  practiceMatch: async (examSkillId: string, questionCount = 5) => {
    const res = await apiService.post(API_ENDPOINTS.ARENA.PRACTICE_MATCH, { examSkillId, questionCount });
    return extractApiData<ArenaMatch>(res);
  },

  match: async (id: string) => {
    const res = await apiService.get(API_ENDPOINTS.ARENA.MATCH(id));
    return extractApiData<ArenaMatch>(res);
  },

  answer: async (matchId: string, arenaMatchQuestionId: string, answerJson: Record<string, unknown>, timeTakenMs = 0) => {
    const res = await apiService.post(API_ENDPOINTS.ARENA.MATCH_ANSWERS(matchId), {
      arenaMatchQuestionId,
      answerJson,
      timeTakenMs,
    });
    return extractApiData(res);
  },

  finish: async (matchId: string) => {
    const res = await apiService.post(API_ENDPOINTS.ARENA.MATCH_FINISH(matchId));
    return extractApiData<ArenaMatch>(res);
  },
};
