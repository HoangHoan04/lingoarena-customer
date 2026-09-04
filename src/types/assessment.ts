import type { PracticeAnswer, PublicQuestion } from "@/types/question";

export interface AssessmentSummary {
  id: string;
  examTypeId: string;
  assessmentType: string;
  title: string;
  titleEn?: string | null;
  slug: string;
  description?: string | null;
  descriptionEn?: string | null;
  durationSeconds: number;
  maxAttempts?: number | null;
  passingScore?: number | null;
  showAnswersPolicy?: string;
  status: string;
  isFree: boolean;
  examType?: { id: string; code?: string; name?: string; nameEn?: string | null } | null;
  sections?: AssessmentSection[];
}

export interface AssessmentSection {
  id: string;
  assessmentId: string;
  examSkillId: string;
  title: string;
  titleEn?: string | null;
  instructions?: string | null;
  instructionsEn?: string | null;
  durationSeconds?: number | null;
  sortOrder: number;
  examSkill?: { id: string; code?: string; name?: string; nameEn?: string | null } | null;
  items?: Array<{ id: string; questionId: string }>;
  attemptQuestions?: AttemptQuestion[];
}

export interface AttemptQuestion {
  id: string;
  attemptId: string;
  attemptSectionId: string;
  questionId: string;
  questionVersionId: string;
  questionSnapshotJson: PublicQuestion & { typeCode?: string };
  points: number;
  sortOrder: number;
  answer?: AttemptAnswer | null;
}

export interface AttemptAnswer {
  id: string;
  attemptQuestionId: string;
  answerJson?: PracticeAnswer;
  isCorrect?: boolean | null;
  scoreAwarded?: number | null;
  gradingStatus?: string;
  feedbackJson?: Record<string, unknown> | null;
}

export interface AssessmentAttempt {
  id: string;
  assessmentId: string;
  userId: string;
  attemptNumber: number;
  status: string;
  startedAt: string;
  expiresAt: string;
  submittedAt?: string | null;
  objectiveScore?: number | null;
  subjectiveScore?: number | null;
  totalScore?: number | null;
  convertedScore?: number | null;
  resultJson?: { items?: Array<Record<string, unknown>> } | null;
  assessment?: AssessmentSummary | null;
  attemptSections?: AssessmentSection[];
  attemptQuestions?: AttemptQuestion[];
}

export interface AssessmentPageResponse {
  data: AssessmentSummary[];
  total: number;
}
