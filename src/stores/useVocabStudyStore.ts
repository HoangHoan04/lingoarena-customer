import { vocabularyService } from "@/services/vocabulary.service";
import type {
  FlashcardRating,
  StudyAnswerResult,
  StudySessionResult,
  VocabDeck,
  VocabStudyMode,
  VocabWord,
} from "@/types/vocabulary";
import { create } from "zustand";

export type StudyLog = {
  vocabularyId: string;
  headword: string;
  correct: boolean;
  rating: string;
};

interface VocabStudyState {
  sessionId: string | null;
  mode: VocabStudyMode | null;
  deck: VocabDeck | null;
  cards: VocabWord[];
  index: number;
  logs: StudyLog[];
  lastAnswer: StudyAnswerResult | null;
  result: StudySessionResult | null;
  loading: boolean;
  startedAt: number;
  reset: () => void;
  start: (deckId: string | undefined, mode: VocabStudyMode) => Promise<void>;
  submitFlashcard: (rating: FlashcardRating) => Promise<StudyAnswerResult>;
  submitQuiz: (optionId: string) => Promise<StudyAnswerResult>;
  next: () => void;
  finish: () => Promise<StudySessionResult | null>;
}

const empty = {
  sessionId: null,
  mode: null,
  deck: null,
  cards: [] as VocabWord[],
  index: 0,
  logs: [] as StudyLog[],
  lastAnswer: null,
  result: null,
  loading: false,
  startedAt: 0,
};

export const useVocabStudyStore = create<VocabStudyState>((set, get) => ({
  ...empty,

  reset: () => set({ ...empty }),

  start: async (deckId, mode) => {
    set({ ...empty, loading: true });
    try {
      const session = await vocabularyService.startSession(deckId, mode);
      set({
        sessionId: session.sessionId,
        mode: session.mode,
        deck: session.deck,
        cards: session.cards || [],
        index: 0,
        logs: [],
        lastAnswer: null,
        result: null,
        loading: false,
        startedAt: Date.now(),
      });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  submitFlashcard: async (rating) => {
    const { sessionId, cards, index, startedAt, logs } = get();
    const card = cards[index];
    if (!sessionId || !card) throw new Error("Phiên học chưa sẵn sàng");
    const answer = await vocabularyService.answer(sessionId, {
      vocabularyId: card.id,
      rating,
      responseTimeMs: Date.now() - startedAt,
    });
    set({
      lastAnswer: answer,
      logs: [...logs, { vocabularyId: card.id, headword: card.headword, correct: answer.correct, rating: answer.rating }],
      startedAt: Date.now(),
    });
    return answer;
  },

  submitQuiz: async (optionId) => {
    const { sessionId, cards, index, startedAt, logs } = get();
    const card = cards[index];
    if (!sessionId || !card) throw new Error("Phiên học chưa sẵn sàng");
    const answer = await vocabularyService.answer(sessionId, {
      vocabularyId: card.id,
      optionId,
      responseTimeMs: Date.now() - startedAt,
    });
    set({
      lastAnswer: answer,
      logs: [...logs, { vocabularyId: card.id, headword: card.headword, correct: answer.correct, rating: answer.rating }],
      startedAt: Date.now(),
    });
    return answer;
  },

  next: () => {
    const { index, cards } = get();
    if (index + 1 < cards.length) {
      set({ index: index + 1, lastAnswer: null });
    }
  },

  finish: async () => {
    const { sessionId } = get();
    if (!sessionId) return null;
    const result = await vocabularyService.complete(sessionId);
    set({ result });
    return result;
  },
}));
