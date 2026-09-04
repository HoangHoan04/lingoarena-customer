export interface DictionaryEntry {
  word: string;
  phonetic: string;
  ukPhonetic?: string;
  partOfSpeech: string;
  level: string;
  meaningVi: string;
  definitionEn: string;
  examples: { en: string; vi: string }[];
  synonyms?: string[];
  collocations?: string[];
}

export type ReadingExamType = "ALL" | "IELTS" | "TOEIC" | "VSTEP" | "APTIS" | "ACADEMIC" | "NEWS";

export type ReadingLevel = "A2" | "B1" | "B2" | "C1" | "C2";

export type QuestionType =
  | "multiple_choice"
  | "true_false_not_given"
  | "matching_headings"
  | "summary_completion";

export interface ReadingQuestion {
  id: string;
  questionNumber: number;
  questionText: string;
  questionType: QuestionType;
  options?: string[];
  correctAnswer: string | number; // index or string
  explanationVi: string;
  evidenceParagraphIndex?: number; // paragraph where answer is found
  evidenceSnippet?: string;
}

export interface ReadingVocabHint {
  word: string;
  phonetic?: string;
  meaning: string;
  level: "B2" | "C1" | "C2";
}

export interface ReadingParagraph {
  index: number;
  label?: string; // e.g. "Paragraph A"
  englishText: string;
  vietnameseText: string;
}

export interface ReadingPassage {
  id: string;
  title: string;
  examType: ReadingExamType;
  category: string;
  level: ReadingLevel;
  wordCount: number;
  recommendedTimeMin: number;
  coverImage?: string;
  paragraphs: ReadingParagraph[];
  questions: ReadingQuestion[];
  keyVocab: ReadingVocabHint[];
  summaryVi: string;
  tags: string[];
  topics?: string[];
}

export interface ReadingUserAnswer {
  questionId: string;
  selectedAnswer: string | number;
}

export interface ReadingScoreReport {
  passageId: string;
  totalQuestions: number;
  correctCount: number;
  scorePercent: number;
  timeSpentSec: number;
  wordsPerMinute: number;
  answers: {
    questionId: string;
    isCorrect: boolean;
    userAnswer: string | number;
    correctAnswer: string | number;
  }[];
}
