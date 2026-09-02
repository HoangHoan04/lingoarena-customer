import { extractApiData } from "@/lib/auth";
import type {
  NotebookWord,
  StudyAnswerResult,
  StudySessionResult,
  StudySessionStart,
  UserVocabStats,
  VocabDeck,
  VocabStudyMode,
  VocabWord,
} from "@/types/vocabulary";
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

export const vocabularyService = {
  paginationDecks: async (
    skip = 0,
    take = 20,
    where: { keyword?: string; level?: string; exam?: string } = {},
  ) => {
    const res = await apiService.post(API_ENDPOINTS.VOCABULARY.DECKS_PAGINATION, { skip, take, where });
    return paginationPayload<VocabDeck>(res);
  },

  getDeckBySlug: async (slug: string) => {
    const res = await apiService.get(API_ENDPOINTS.VOCABULARY.DECK_BY_SLUG(slug));
    return extractApiData<VocabDeck>(res);
  },

  paginationWords: async (
    skip = 0,
    take = 20,
    where: { keyword?: string; cefrLevel?: string; partOfSpeech?: string } = {},
  ) => {
    const res = await apiService.post(API_ENDPOINTS.VOCABULARY.WORDS_PAGINATION, { skip, take, where });
    return paginationPayload<VocabWord>(res);
  },

  getWord: async (id: string) => {
    const res = await apiService.get(API_ENDPOINTS.VOCABULARY.WORD_DETAIL(id));
    return extractApiData<VocabWord>(res);
  },

  myStats: async () => {
    const res = await apiService.get(API_ENDPOINTS.VOCABULARY.ME_STATS);
    return extractApiData<UserVocabStats>(res);
  },

  myNotebook: async (
    skip = 0,
    take = 20,
    where: { keyword?: string; state?: string; dueOnly?: boolean } = {},
  ) => {
    const res = await apiService.post(API_ENDPOINTS.VOCABULARY.ME_NOTEBOOK, { skip, take, where });
    return paginationPayload<NotebookWord>(res);
  },

  startSession: async (deckId: string | undefined, mode: VocabStudyMode, limit = 12) => {
    const payload: { mode: VocabStudyMode; limit: number; deckId?: string } = { mode, limit };
    if (deckId) payload.deckId = deckId;
    const res = await apiService.post(API_ENDPOINTS.VOCABULARY.SESSIONS, payload);
    return extractApiData<StudySessionStart>(res);
  },

  answer: async (
    sessionId: string,
    payload: { vocabularyId: string; rating?: string; optionId?: string; responseTimeMs?: number },
  ) => {
    const res = await apiService.post(API_ENDPOINTS.VOCABULARY.SESSION_ANSWER(sessionId), payload);
    return extractApiData<StudyAnswerResult>(res);
  },

  complete: async (sessionId: string) => {
    const res = await apiService.post(API_ENDPOINTS.VOCABULARY.SESSION_COMPLETE(sessionId));
    return extractApiData<StudySessionResult>(res);
  },
};

export default vocabularyService;
