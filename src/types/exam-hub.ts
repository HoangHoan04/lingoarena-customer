export type ExamTypeCode = "TOEIC" | "IELTS" | "VSTEP" | "APTIS";

export interface ExamSectionConfig {
  key: string;
  name: string;
  nameEn: string;
  durationMinutes: number;
  totalQuestions: number;
  partsCount?: number;
  scoreScale: string;
  description: string;
}

export interface ExamLookupItem {
  id: string;
  code: ExamTypeCode;
  name: string;
  fullName: string;
  organizer: string;
  totalDurationMinutes: number;
  totalQuestions: number;
  scoreScale: string;
  description: string;
  sections: ExamSectionConfig[];
  colorGradient: string;
  accentColor: string;
}

export interface StandardQuestionOption {
  key: string;
  content: string;
}

export interface StandardExamQuestion {
  id: string;
  part: number;
  partTitle?: string;
  sectionKey: string;
  prompt: string;
  instructions?: string;
  options?: StandardQuestionOption[];
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
  cueCardPoints?: string[];
  subQuestions?: {
    id: string;
    prompt: string;
    options?: StandardQuestionOption[];
    correctAnswer?: string;
  }[];
}

export interface StandardExamPackage {
  id: string;
  slug: string;
  code: string;
  examType: ExamTypeCode;
  title: string;
  titleEn: string;
  difficulty: string;
  totalDurationMinutes: number;
  sections: ExamSectionConfig[];
  questions: Record<string, StandardExamQuestion[]>;
}

export interface StandardExamResult {
  examId: string;
  examType: ExamTypeCode;
  examTitle: string;
  completedAt: string;
  totalTimeSpentSeconds: number;
  sectionScores: Record<
    string,
    {
      sectionKey: string;
      rawCorrect: number;
      totalQuestions: number;
      scaledScore: number | string;
      maxScore: number | string;
      bandOrLevel?: string;
      feedback?: string;
    }
  >;
  overallScore: number | string;
  overallBandOrLevel: string;
  scoreSummaryText: string;
}
