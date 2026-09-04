export interface QuestionLookup {
  id: string;
  code?: string;
  name: string;
  nameEn?: string | null;
  label?: string;
  value?: string;
  examTypeId?: string;
  examSkillId?: string;
  description?: string | null;
  descriptionEn?: string | null;
  hubContentJson?: Record<string, unknown> | null;
}

export interface QuestionOption {
  id?: string;
  optionKey: string;
  content: string;
  isCorrect?: boolean;
  feedback?: string;
  feedbackEn?: string | null;
  sortOrder?: number;
}

export interface PublicQuestion {
  id: string;
  currentVersionId?: string;
  prompt: string;
  instructions?: string | null;
  instructionsEn?: string | null;
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
    titleEn?: string | null;
    instructions?: string | null;
    instructionsEn?: string | null;
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
  questionType?: string;
  questionTypeId?: string;
  topicId?: string;
  keyword?: string;
  cefrLevel?: string;
  limit?: number;
}

export interface QuestionGroupSegment {
  id: string;
  sortOrder?: number;
  label?: string | null;
  text: string;
  translationVi?: string | null;
  explanation?: string | null;
  startSec?: number | null;
  endSec?: number | null;
  keyVocabJson?: Array<Record<string, unknown>> | null;
}

export interface QuestionGroup {
  id: string;
  title?: string | null;
  titleEn?: string | null;
  instructions?: string | null;
  instructionsEn?: string | null;
  stimulusType?: string | null;
  passageText?: string | null;
  transcript?: string | null;
  summaryVi?: string | null;
  wordCount?: number | null;
  recommendedTimeMin?: number | null;
  cefrLevel?: string | null;
  coverImageUrl?: string | null;
  imageUrl?: string | null;
  audioUrl?: string | null;
  youtubeId?: string | null;
  channelName?: string | null;
  channelAvatarUrl?: string | null;
  thumbnailUrl?: string | null;
  durationSec?: number | null;
  keyVocabJson?: Array<Record<string, unknown>> | null;
  examType?: QuestionLookup | null;
  examStructure?: QuestionLookup | null;
  topics?: QuestionLookup[];
  segments?: QuestionGroupSegment[];
  questions?: PublicQuestion[];
  questionsCount?: number;
}

export interface QuestionGroupFilter {
  keyword?: string;
  examTypeId?: string;
  examStructureId?: string;
  examSectionId?: string;
  stimulusType?: string;
  cefrLevel?: string;
  topicId?: string;
  hasAudio?: boolean;
}

export interface GradeResult {
  questionId: string;
  isCorrect: boolean;
  explanation?: string | null;
  explanationEn?: string | null;
  correctAnswerJson?: Record<string, unknown>;
  options?: QuestionOption[];
}

export interface PracticeAnswer {
  optionKey?: string;
  optionKeys?: string[];
  value?: string;
  text?: string;
  blanks?: string[];
  pairs?: Record<string, string>;
}
