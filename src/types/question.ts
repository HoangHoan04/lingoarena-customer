export interface QuestionLookup {
  id: string;
  code?: string;
  name: string;
  label?: string;
  value?: string;
  examTypeId?: string;
  examSkillId?: string;
}

export interface QuestionOption {
  id?: string;
  optionKey: string;
  content: string;
  isCorrect?: boolean;
  feedback?: string;
  sortOrder?: number;
}

export interface PublicQuestion {
  id: string;
  currentVersionId?: string;
  prompt: string;
  instructions?: string | null;
  imageUrl?: string | null;
  audioUrl?: string | null;
  cefrLevel?: string | null;
  difficultyLevel?: number;
  examType?: QuestionLookup | null;
  examSkill?: QuestionLookup | null;
  examSection?: QuestionLookup | null;
  questionType?: QuestionLookup | null;
  questionGroup?: {
    id: string;
    title?: string | null;
    instructions?: string | null;
    stimulusType?: string | null;
    passageText?: string | null;
    imageUrl?: string | null;
    audioUrl?: string | null;
  } | null;
  options?: QuestionOption[];
  topics?: QuestionLookup[];
  contentJson?: Record<string, unknown> | null;
}

export interface PracticeFilter {
  examTypeId?: string;
  examSkillId?: string;
  examSectionId?: string;
  questionTypeId?: string;
  topicId?: string;
  cefrLevel?: string;
  limit?: number;
}

export interface GradeResult {
  questionId: string;
  isCorrect: boolean;
  explanation?: string | null;
  correctAnswerJson?: Record<string, unknown>;
  options?: QuestionOption[];
}

export interface PracticeAnswer {
  optionKey?: string;
  optionKeys?: string[];
  value?: string;
  blanks?: string[];
  pairs?: Record<string, string>;
}
