export type VstepSectionKey = "listening" | "reading" | "writing" | "speaking";

export interface VstepSectionConfig {
  key: VstepSectionKey;
  name: string;
  nameEn: string;
  durationMinutes: number;
  totalQuestions: number;
  partsCount: number;
  scoreScale: string;
  description: string;
}

export interface VstepQuestionOption {
  key: string;
  content: string;
}

export interface VstepQuestion {
  id: string;
  part: number; // Part 1 - 3 (Listening) or Bài 1 - 4 (Reading) or Task 1 - 2 (Writing) or Part 1 - 3 (Speaking)
  partTitle?: string;
  sectionKey: VstepSectionKey;
  prompt: string;
  instructions?: string;
  options?: VstepQuestionOption[];
  correctAnswer?: string | string[];
  explanation?: string;
  audioUrl?: string;
  passageText?: string;
  minWords?: number;
  cueCardPoints?: string[];
  prepTimeSeconds?: number;
  speakTimeSeconds?: number;
  subQuestions?: {
    id: string;
    prompt: string;
    options?: VstepQuestionOption[];
    correctAnswer?: string;
  }[];
}

export interface VstepExam {
  id: string;
  slug: string;
  code: string;
  title: string;
  titleEn: string;
  difficulty: string;
  totalDurationMinutes: number;
  sections: VstepSectionConfig[];
  questions: Record<VstepSectionKey, VstepQuestion[]>;
}

export interface VstepSkillScore {
  sectionKey: VstepSectionKey;
  rawCorrect: number;
  totalQuestions: number;
  score10: number; // 0 - 10 (step 0.5)
  feedback: string;
}

export interface VstepExamResult {
  examId: string;
  examTitle: string;
  completedAt: string;
  totalTimeSpentSeconds: number;
  skillScores: Record<VstepSectionKey, VstepSkillScore>;
  overallScore10: number; // 0 - 10 (làm tròn 0.5)
  cefrLevel: "Không đạt" | "Bậc 3 (B1)" | "Bậc 4 (B2)" | "Bậc 5 (C1)";
  feedback: string;
}
