export type ToeicSectionKey = "listening" | "reading" | "speaking" | "writing";

export interface ToeicPartConfig {
  partNumber: number;
  partName: string;
  partNameVi: string;
  sectionKey: ToeicSectionKey;
  questionStart: number;
  questionEnd: number;
  totalQuestions: number;
  description: string;
}

export interface ToeicSectionInfo {
  key: ToeicSectionKey;
  name: string;
  nameEn: string;
  durationMinutes: number;
  totalQuestions: number;
  scoreScale: string;
  description: string;
}

export interface ToeicQuestionOption {
  key: "A" | "B" | "C" | "D";
  content: string;
}

export interface ToeicQuestion {
  id: string;
  number: number;
  part: number;
  partTitle?: string;
  sectionKey: ToeicSectionKey;
  prompt: string;
  instructions?: string;
  options?: ToeicQuestionOption[];
  correctAnswer?: string;
  explanation?: string;
  imageUrl?: string;
  audioUrl?: string;
  passageText?: string;
  scheduleText?: string; // For Speaking Q8-10
  requiredKeywords?: string[]; // For Writing Q1-5 (2 words required)
  minWords?: number; // For Writing Q8 (≥ 300 words)
  prepTimeSeconds?: number;
  speakTimeSeconds?: number;
  subQuestions?: {
    id: string;
    prompt: string;
    prepTimeSeconds?: number;
    speakTimeSeconds?: number;
  }[];
}

export interface ToeicExam {
  id: string;
  slug: string;
  code: string;
  title: string;
  titleEn: string;
  totalDurationMinutes: number;
  sections: ToeicSectionInfo[];
  questions: Record<ToeicSectionKey, ToeicQuestion[]>;
}

export interface ToeicExamResult {
  examId: string;
  examTitle: string;
  completedAt: string;
  totalTimeSpentSeconds: number;
  // Listening & Reading
  listeningRawScore: number;
  listeningScaledScore: number; // 5 - 495
  readingRawScore: number;
  readingScaledScore: number; // 5 - 495
  totalLRScore: number; // 10 - 990
  // Speaking & Writing
  speakingRawScore: number;
  speakingScaledScore: number; // 0 - 200
  writingRawScore: number;
  writingScaledScore: number; // 0 - 200
  totalSWScore: number; // 0 - 400
  estimatedLevel: string;
  feedback: string;
}
