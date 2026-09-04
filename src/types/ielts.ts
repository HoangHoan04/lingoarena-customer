export type IeltsSectionKey = "listening" | "reading" | "writing" | "speaking";

export interface IeltsSectionConfig {
  key: IeltsSectionKey;
  name: string;
  nameEn: string;
  durationMinutes: number;
  totalQuestions: number;
  partsCount: number;
  scoreScale: string;
  description: string;
}

export interface IeltsQuestionOption {
  key: string;
  content: string;
}

export interface IeltsQuestion {
  id: string;
  part: number; // Part 1 - 4 (Listening/Speaking) or Passage 1 - 3 (Reading) or Task 1 - 2 (Writing)
  partTitle?: string;
  sectionKey: IeltsSectionKey;
  prompt: string;
  instructions?: string;
  options?: IeltsQuestionOption[];
  correctAnswer?: string | string[];
  explanation?: string;
  audioUrl?: string;
  imageUrl?: string;
  passageText?: string;
  minWords?: number;
  cueCardPoints?: string[];
  prepTimeSeconds?: number;
  speakTimeSeconds?: number;
  subQuestions?: {
    id: string;
    prompt: string;
    options?: IeltsQuestionOption[];
    correctAnswer?: string;
  }[];
}

export interface IeltsExam {
  id: string;
  slug: string;
  code: string;
  title: string;
  titleEn: string;
  difficulty: string;
  totalDurationMinutes: number;
  sections: IeltsSectionConfig[];
  questions: Record<IeltsSectionKey, IeltsQuestion[]>;
}

export interface IeltsSkillScore {
  sectionKey: IeltsSectionKey;
  rawCorrect: number;
  totalQuestions: number;
  bandScore: number; // 0.0 - 9.0 (step 0.5)
  feedback: string;
}

export interface IeltsExamResult {
  examId: string;
  examTitle: string;
  completedAt: string;
  totalTimeSpentSeconds: number;
  skillScores: Record<IeltsSectionKey, IeltsSkillScore>;
  overallBand: number; // 0.0 - 9.0 (step 0.5)
  bandDescription: string; // e.g. "Expert User (Band 9.0)", "Very Good User (Band 8.0)", "Good User (Band 7.0)", "Competent User (Band 6.0)"
}
