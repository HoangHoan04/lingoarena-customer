export interface GrammarLookup {
  id: string;
  label?: string;
  name?: string;
  value?: string;
  slug?: string;
  cefrLevel?: string;
  canonicalTopicId?: string | null;
}

export interface GrammarCategoryGroup {
  id: string;
  title: string;
  titleEn: string;
  icon: string;
  description: string;
  color: string;
  topics: GrammarTopic[];
}

export interface GrammarQuizQuestion {
  id: string;
  topicTitle: string;
  level: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanationVi: string;
}

export interface CheatSheetItem {
  name: string;
  formulaAffirmative: string;
  formulaNegative: string;
  formulaQuestion: string;
  signalWords: string[];
  example: string;
  level: string;
  category: string;
}

export interface GrammarExample {
  id: string;
  grammarStructureId: string;
  sentence: string;
  translation: string;
  explanation?: string | null;
  isNegativeExample?: boolean;
  sortOrder?: number;
}

export interface GrammarStructure {
  id: string;
  grammarTopicId: string;
  title: string;
  titleEn?: string | null;
  formula: string;
  meaningVi: string;
  meaningEn?: string | null;
  usageContent: string;
  usageContentEn?: string | null;
  commonMistakes?: string | null;
  commonMistakesEn?: string | null;
  status?: string;
  grammarTopic?: GrammarTopic | null;
  examples?: GrammarExample[];
  examplesJson?: Array<Record<string, unknown> | GrammarExample>;
}

export interface GrammarTopic {
  id: string;
  parentId?: string | null;
  title: string;
  titleEn?: string | null;
  slug: string;
  cefrLevel?: string | null;
  description?: string | null;
  descriptionEn?: string | null;
  sortOrder?: number;
  canonicalTopicId?: string | null;
  parent?: GrammarTopic | null;
  structures?: GrammarStructure[];
}

export interface GrammarTopicFilter {
  keyword?: string;
  parentId?: string;
  cefrLevel?: string;
}

export interface GrammarStructureFilter {
  keyword?: string;
  grammarTopicId?: string;
}

export interface GrammarMasteryResult {
  id: string;
  userId: string;
  grammarStructureId: string;
  masteryScore: number;
  correctCount: number;
  incorrectCount: number;
  lastPracticedAt?: string;
  nextReviewAt?: string;
}
