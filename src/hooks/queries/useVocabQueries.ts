import { vocabularyService } from "@/services/vocabulary.service";
import type { FlashcardRating, VocabStudyMode } from "@/types/vocabulary";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const VOCAB_QUERY_KEYS = {
  all: ["vocab"] as const,
  decks: (params: Record<string, unknown>) => ["vocab", "decks", params] as const,
  deckDetail: (slug: string) => ["vocab", "deck", slug] as const,
  words: (params: Record<string, unknown>) => ["vocab", "words", params] as const,
  wordDetail: (id: string) => ["vocab", "word", id] as const,
  notebook: (params: Record<string, unknown>) => ["vocab", "notebook", params] as const,
  stats: () => ["vocab", "stats"] as const,
};

export function usePublicDecksQuery(
  skip = 0,
  take = 20,
  where: { keyword?: string; level?: string; exam?: string } = {},
) {
  return useQuery({
    queryKey: VOCAB_QUERY_KEYS.decks({ skip, take, ...where }),
    queryFn: () => vocabularyService.paginationDecks(skip, take, where),
    staleTime: 5 * 60 * 1000,
  });
}

export function useDeckDetailQuery(slug: string) {
  return useQuery({
    queryKey: VOCAB_QUERY_KEYS.deckDetail(slug),
    queryFn: () => vocabularyService.getDeckBySlug(slug),
    enabled: Boolean(slug),
    staleTime: 5 * 60 * 1000,
  });
}

export function useVocabWordsQuery(
  skip = 0,
  take = 20,
  where: { keyword?: string; cefrLevel?: string; partOfSpeech?: string } = {},
) {
  return useQuery({
    queryKey: VOCAB_QUERY_KEYS.words({ skip, take, ...where }),
    queryFn: () => vocabularyService.paginationWords(skip, take, where),
    staleTime: 5 * 60 * 1000,
  });
}

export function useWordDetailQuery(id: string) {
  return useQuery({
    queryKey: VOCAB_QUERY_KEYS.wordDetail(id),
    queryFn: () => vocabularyService.getWord(id),
    enabled: Boolean(id),
  });
}

export function useMyNotebookQuery(
  skip = 0,
  take = 20,
  where: { keyword?: string; state?: string; dueOnly?: boolean } = {},
) {
  return useQuery({
    queryKey: VOCAB_QUERY_KEYS.notebook({ skip, take, ...where }),
    queryFn: () => vocabularyService.myNotebook(skip, take, where),
    staleTime: 60 * 1000,
  });
}

export function useVocabStatsQuery() {
  return useQuery({
    queryKey: VOCAB_QUERY_KEYS.stats(),
    queryFn: () => vocabularyService.myStats(),
    staleTime: 2 * 60 * 1000,
  });
}

export function useStartStudySessionMutation() {
  return useMutation({
    mutationFn: ({
      deckId,
      mode,
      limit = 12,
    }: {
      deckId?: string;
      mode: VocabStudyMode;
      limit?: number;
    }) => vocabularyService.startSession(deckId, mode, limit),
  });
}

export function useAnswerStudySessionMutation() {
  return useMutation({
    mutationFn: ({
      sessionId,
      payload,
    }: {
      sessionId: string;
      payload: { vocabularyId: string; rating?: FlashcardRating; optionId?: string; responseTimeMs?: number };
    }) => vocabularyService.answer(sessionId, payload),
  });
}

export function useCompleteStudySessionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (sessionId: string) => vocabularyService.complete(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VOCAB_QUERY_KEYS.stats() });
      queryClient.invalidateQueries({ queryKey: ["vocab", "notebook"] });
    },
  });
}
