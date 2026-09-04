export type CefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type FlashcardRating = "AGAIN" | "HARD" | "GOOD" | "EASY";

export type VocabStudyMode = "FLASHCARD" | "QUIZ";

/** Chế độ hiển thị trên UI học (một số chạy client-only). */
export type VocabStudyModeUI =
  | "FILL_BLANK"
  | "FLASHCARD"
  | "QUIZ"
  | "QUIZ_REVERSE"
  | "REPEAT";

export type VocabSrsState = "new" | "learning" | "review" | "mastered" | "lapsed";

export interface VocabExample {
  id?: string;
  sentence: string;
  translation: string;
  sortOrder?: number;
}

export interface VocabCollocation {
  id?: string;
  collocation: string;
  meaningVi?: string | null;
  exampleSentence?: string | null;
  sortOrder?: number;
}

export interface VocabRelation {
  id?: string;
  relationType: string;
  relatedVocabularyId: string;
  relatedHeadword?: string | null;
  relatedMeaningVi?: string | null;
  relatedPartOfSpeech?: string | null;
}

export interface VocabLookup {
  id: string;
  code?: string;
  name: string;
  nameEn?: string | null;
}

export interface VocabWord {
  id: string;
  headword: string;
  normalizedWord?: string;
  partOfSpeech: string;
  ipaUk?: string | null;
  ipaUs?: string | null;
  audioUkUrl?: string | null;
  audioUsUrl?: string | null;
  definitionEn: string;
  definitionVi?: string | null;
  meaningVi: string;
  imageUrl?: string | null;
  thumbnailUrl?: string | null;
  cefrLevel?: CefrLevel | string | null;
  status?: string;
  frequencyLevel?: number;
  exampleEn?: string | null;
  exampleVi?: string | null;
  examples?: VocabExample[];
  collocations?: VocabCollocation[];
  relations?: VocabRelation[];
  topics?: VocabLookup[];
  examTypes?: VocabLookup[];
  quiz?: QuizQuestion;
}

export interface NotebookWord extends VocabWord {
  srsState: VocabSrsState;
  nextReviewAt?: string | null;
  intervalDays?: number;
  repetitionCount?: number;
}

export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  vocabularyId: string;
  prompt: string;
  promptIpa?: string | null;
  partOfSpeech?: string;
  question: string;
  options: QuizOption[];
}

export interface DeckProgress {
  total: number;
  newCount: number;
  dueCount: number;
  learningCount: number;
  masteredCount: number;
  percentMastered: number;
}

export interface VocabDeck {
  id: string;
  title: string;
  titleEn?: string | null;
  slug: string;
  description?: string | null;
  descriptionEn?: string | null;
  thumbnailUrl?: string | null;
  visibility?: string;
  ownerType?: string;
  examTypeId?: string | null;
  examType?: VocabLookup | null;
  cefrLevel?: CefrLevel | string | null;
  level?: CefrLevel | string | null;
  itemCount: number;
  estimatedMinutes: number;
  progress?: DeckProgress;
  words?: VocabWord[];
}

export interface UserVocabStats {
  dueTodayCount: number;
  learningWords: number;
  totalMasteredWords: number;
  totalReviewed: number;
  streakDays?: number;
  totalCards?: number;
  totalSessions?: number;
  newCount?: number;
  learningCount?: number;
  reviewCount?: number;
  masteredCount?: number;
  accuracy?: number;
}

export interface StudySessionStart {
  sessionId: string;
  mode: VocabStudyMode;
  deck: VocabDeck;
  cards: VocabWord[];
  total: number;
}

export interface StudyAnswerResult {
  correct: boolean;
  rating: FlashcardRating;
  explanation: {
    headword: string;
    meaningVi: string;
    definitionVi?: string | null;
    definitionEn: string;
    exampleEn?: string | null;
    exampleVi?: string | null;
    collocations?: { collocation: string; meaningVi?: string | null }[];
  };
  nextReviewAt?: string;
  state?: VocabSrsState;
  session: {
    cardsReviewed: number;
    cardsCorrect: number;
    cardsDue: number;
  };
}

export interface StudySessionResult {
  sessionId: string;
  cardsReviewed: number;
  cardsCorrect: number;
  cardsDue: number;
  accuracy: number;
}
