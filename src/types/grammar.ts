export interface GrammarLookup {
  id: string;
  label?: string;
  name?: string;
  value?: string;
  slug?: string;
  cefrLevel?: string;
  canonicalTopicId?: string | null;
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
  formula: string;
  meaningVi: string;
  usageContent: string;
  commonMistakes?: string | null;
  status?: string;
  grammarTopic?: GrammarTopic | null;
  examples?: GrammarExample[];
}

export interface GrammarTopic {
  id: string;
  parentId?: string | null;
  title: string;
  slug: string;
  cefrLevel?: string | null;
  description?: string | null;
  sortOrder?: number;
  canonicalTopicId?: string | null;
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
