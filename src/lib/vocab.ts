import type {
  CefrLevel,
  VocabDeck,
  VocabStudyModeUI,
  VocabWord,
} from "@/types/vocabulary";

export function estimateMinutes(wordCount: number) {
  return Math.max(3, Math.ceil((wordCount || 0) * 0.4));
}

export function cefrBadgeClass(level?: string | null) {
  const map: Record<string, string> = {
    A1: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300",
    A2: "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/50 dark:text-teal-300",
    B1: "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/50 dark:text-sky-300",
    B2: "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/50 dark:text-indigo-300",
    C1: "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/50 dark:text-violet-300",
    C2: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300",
  };
  return (
    map[(level || "").toUpperCase()] ||
    "bg-slate-100 text-slate-600 border-slate-200"
  );
}

export function deckCefrLevel(
  deck: Pick<VocabDeck, "cefrLevel" | "level">,
) {
  return deck.cefrLevel || deck.level || "";
}

export function formatIpa(word: Pick<VocabWord, "ipaUs" | "ipaUk">) {
  return word.ipaUs || word.ipaUk || "";
}

export function resolveMediaUrl(raw?: string | null): string {
  if (!raw) return "";
  const trimmed = raw.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
  if (trimmed.startsWith("/")) {
    const apiBase = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4300/api").replace(/\/api\/?$/, "");
    return `${apiBase}${trimmed}`;
  }
  return trimmed;
}

export function wordImageUrl(
  word: Pick<VocabWord, "imageUrl" | "thumbnailUrl">,
) {
  return resolveMediaUrl(word.imageUrl || word.thumbnailUrl);
}

export function hasVocabAudio(
  word: Pick<VocabWord, "audioUsUrl" | "audioUkUrl">,
) {
  return Boolean(word.audioUsUrl || word.audioUkUrl);
}

export function playVocabAudio(
  word: Pick<VocabWord, "audioUsUrl" | "audioUkUrl">,
  accent?: "us" | "uk",
) {
  const url =
    accent === "uk"
      ? word.audioUkUrl || word.audioUsUrl
      : accent === "us"
        ? word.audioUsUrl || word.audioUkUrl
        : word.audioUsUrl || word.audioUkUrl;
  if (!url || typeof window === "undefined") return;
  const audio = new Audio(url);
  void audio.play().catch(() => undefined);
}

export function masteredPercent(deck: VocabDeck) {
  return deck.progress?.percentMastered ?? 0;
}

export const RELATION_LABELS: Record<string, string> = {
  synonym: "Đồng nghĩa",
  antonym: "Trái nghĩa",
  word_family: "Họ từ",
  confusable: "Dễ nhầm",
};

export function relationLabel(type?: string | null) {
  if (!type) return "";
  return RELATION_LABELS[type] || type;
}

export const CEFR_FILTERS: Array<CefrLevel | "ALL"> = [
  "ALL",
  "A1",
  "A2",
  "B1",
  "B2",
  "C1",
  "C2",
];
export const POS_FILTERS = [
  "ALL",
  "noun",
  "verb",
  "adjective",
  "adverb",
  "phrase",
] as const;

export const SRS_STATE_LABELS: Record<string, string> = {
  new: "Mới",
  learning: "Đang học",
  review: "Ôn tập",
  mastered: "Đã thuộc",
  lapsed: "Quên",
};

export const VOCAB_RESERVED_SLUGS = [
  "notebook",
  "dictionary",
  "games",
  "srs",
  "review",
];

export const STUDY_MODES: {
  key: VocabStudyModeUI;
  label: string;
  hint: string;
}[] = [
  { key: "FILL_BLANK", label: "Điền từ", hint: "Đoán từ điền vào ví dụ" },
  { key: "FLASHCARD", label: "Flashcard", hint: "Lật thẻ SRS" },
  { key: "QUIZ", label: "Trắc nghiệm", hint: "Chọn nghĩa tiếng Việt" },
  { key: "QUIZ_REVERSE", label: "Trắc nghiệm đảo", hint: "Nghĩa → chọn từ" },
  { key: "REPEAT", label: "Lặp lại", hint: "Nghe và nhắc lại" },
];

export function deckCoverUrl(deck: Pick<VocabDeck, "slug" | "thumbnailUrl">) {
  return resolveMediaUrl(deck.thumbnailUrl);
}

export function buildClozeSentence(word: VocabWord) {
  const sentence = word.exampleEn || word.examples?.[0]?.sentence || "";
  if (!sentence) {
    return {
      before: "Hoàn thành câu với từ thích hợp: ",
      after: ".",
      answer: word.headword,
      hasExample: false,
    };
  }

  const escaped = word.headword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  let pattern = new RegExp(`\\b${escaped}\\b`, "i");
  let match = sentence.match(pattern);

  if (!match) {
    const stem = escaped.replace(/(ing|ed|es|s|d|ly|tion|er|est)$/i, "");
    if (stem.length >= 3) {
      pattern = new RegExp(`\\b${stem}\\w*\\b`, "i");
      match = sentence.match(pattern);
    }
  }

  if (!match) {
    pattern = new RegExp(escaped, "i");
    match = sentence.match(pattern);
  }

  if (!match || match.index === undefined) {
    return {
      before: `${sentence} [`,
      after: "]",
      answer: word.headword,
      hasExample: true,
    };
  }

  return {
    before: sentence.slice(0, match.index),
    after: sentence.slice(match.index + match[0].length),
    answer: match[0],
    hasExample: true,
  };
}

export function parseStudyMode(raw?: string | null): VocabStudyModeUI {
  const key = (raw || "FLASHCARD").toUpperCase();
  if (key === "FILL_BLANK" || key === "QUIZ_REVERSE" || key === "REPEAT")
    return key;
  if (key === "QUIZ") return "QUIZ";
  return "FLASHCARD";
}

export function isApiStudyMode(mode: VocabStudyModeUI) {
  return mode === "FLASHCARD" || mode === "QUIZ";
}
