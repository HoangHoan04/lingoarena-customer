export type WritingExamType = "ALL" | "IELTS" | "TOEIC" | "VSTEP" | "APTIS" | "GENERAL";

export type WritingCategory =
  | "ALL"
  | "Task 1 (Report/Letter)"
  | "Task 2 (Essay)"
  | "Business Email"
  | "Social Opinion"
  | "Daily Communication";

export interface WritingVocabItem {
  word: string;
  meaning: string;
  example?: string;
  level?: "B2" | "C1" | "C2";
}

export interface WritingTopic {
  id: string;
  title: string;
  examType: WritingExamType;
  category: string;
  level: "A2" | "B1" | "B2" | "C1" | "C2";
  prompt: string;
  imageUrl?: string;
  minWords: number;
  maxWords?: number;
  timeLimitMin: number;
  tags: string[];
  outlineIdeas: string[];
  suggestedVocab: WritingVocabItem[];
  sampleAnswer: string;
  sampleBand: string;
  sampleAnalysisVi: string;
}

export interface WritingGrammarError {
  originalText: string;
  correctedText: string;
  type: "grammar" | "spelling" | "punctuation" | "word_choice";
  explanationVi: string;
}

export interface WritingVocabUpgrade {
  originalPhrase: string;
  upgradedPhrase: string;
  level: "C1" | "C2";
  explanationVi: string;
}

export interface WritingScoreResult {
  overallBand: number; // e.g. 7.0 or score out of 100
  scoreLabel: string;
  wordCount: number;
  targetWords: number;
  timeSpentSec: number;
  criteria: {
    taskResponse: { score: number; maxScore: number; feedback: string };
    coherenceCohesion: { score: number; maxScore: number; feedback: string };
    lexicalResource: { score: number; maxScore: number; feedback: string };
    grammaticalAccuracy: { score: number; maxScore: number; feedback: string };
  };
  errors: WritingGrammarError[];
  vocabUpgrades: WritingVocabUpgrade[];
  generalFeedbackVi: string;
  improvedVersion: string;
}

export interface ParaphraseExercise {
  id: string;
  original: string;
  keyword: string;
  targetStructure: string;
  sampleAnswers: string[];
  explanationVi: string;
  level: "B1" | "B2" | "C1";
}
