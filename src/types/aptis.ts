export type AptisSectionKey =
  | "grammar_vocab"
  | "listening"
  | "reading"
  | "writing"
  | "speaking";

export interface AptisSectionInfo {
  key: AptisSectionKey;
  title: string;
  titleEn: string;
  durationMinutes: number;
  totalQuestions: number;
  description: string;
  partsCount: number;
  scoreScale: string;
}

export interface AptisQuestionOption {
  key: string;
  content: string;
}

export interface AptisQuestion {
  id: string;
  part: number;
  partTitle?: string;
  sectionKey: AptisSectionKey;
  prompt: string;
  instructions?: string;
  options?: AptisQuestionOption[];
  correctAnswer?: string | string[] | Record<string, string>;
  explanation?: string;
  audioUrl?: string;
  imageUrl?: string;
  image2Url?: string;
  passageText?: string;
  minWords?: number;
  maxWords?: number;
  prepTimeSeconds?: number;
  speakTimeSeconds?: number;
  subQuestions?: {
    id: string;
    prompt: string;
    options?: AptisQuestionOption[];
    correctAnswer?: string;
  }[];
}

export interface AptisExam {
  id: string;
  slug: string;
  title: string;
  titleEn?: string;
  code: string;
  difficulty: string;
  totalDurationMinutes: number;
  sections: AptisSectionInfo[];
  questions: Record<AptisSectionKey, AptisQuestion[]>;
}

export interface AptisAnswerRecord {
  sectionKey: AptisSectionKey;
  answers: Record<string, any>; // questionId -> answer (string, array, object, text, or recorded audio)
  flaggedQuestionIds: string[];
  timeSpentSeconds: number;
  isCompleted: boolean;
}

export interface AptisSectionScore {
  sectionKey: AptisSectionKey;
  score: number; // 0 - 50
  maxScore: number; // 50
  correctCount: number;
  totalCount: number;
  cefrBand: "A1" | "A2" | "B1" | "B2" | "C1" | "C2" | "C";
  feedback: string;
}

export interface AptisExamResult {
  examId: string;
  examTitle: string;
  completedAt: string;
  totalTimeSpentSeconds: number;
  sectionScores: Record<AptisSectionKey, AptisSectionScore>;
  overallCefr: "A1" | "A2" | "B1" | "B2" | "C1" | "C2" | "C";
  overallScaledScore: number; // 0 - 200 (Listening + Reading + Writing + Speaking)
  grammarVocabScore: number; // 0 - 50
  candidateName?: string;
}
