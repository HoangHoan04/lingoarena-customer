import type { CefrLevel, VocabDeck, VocabStudyModeUI, VocabWord } from "@/types/vocabulary";

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
  return map[(level || "").toUpperCase()] || "bg-slate-100 text-slate-600 border-slate-200";
}

export function examFromDeck(deck: Pick<VocabDeck, "slug" | "title" | "examType">) {
  const fromType = (deck.examType?.code || deck.examType?.name || "").toUpperCase();
  if (fromType.includes("TOEIC")) return "TOEIC";
  if (fromType.includes("IELTS")) return "IELTS";
  if (fromType.includes("VSTEP")) return "VSTEP";
  if (fromType.includes("APTIS")) return "APTIS";
  if (fromType.includes("GENERAL") || fromType.includes("DAILY")) return "DAILY";
  const hay = `${deck.slug} ${deck.title}`.toLowerCase();
  if (hay.includes("toeic")) return "TOEIC";
  if (hay.includes("ielts")) return "IELTS";
  if (hay.includes("vstep")) return "VSTEP";
  if (hay.includes("aptis")) return "APTIS";
  return "DAILY";
}

export function deckTheme(deck: Pick<VocabDeck, "slug" | "title" | "examType">) {
  const exam = examFromDeck(deck);
  if (exam === "TOEIC") {
    return { gradient: "from-[#1e3a6e] to-[#2b417e]", accent: "text-[#2b417e]", exam };
  }
  if (exam === "IELTS") {
    return { gradient: "from-[#3b2d6b] to-[#5b4b8a]", accent: "text-[#5b4b8a]", exam };
  }
  return { gradient: "from-[#0f4c5c] to-[#1b6b7a]", accent: "text-[#1b6b7a]", exam };
}

export function formatIpa(word: Pick<VocabWord, "ipaUs" | "ipaUk">) {
  return word.ipaUs || word.ipaUk || "";
}

export function hasVocabAudio(word: Pick<VocabWord, "audioUsUrl" | "audioUkUrl">) {
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

export const CEFR_FILTERS: Array<CefrLevel | "ALL"> = ["ALL", "A1", "A2", "B1", "B2", "C1", "C2"];
export const EXAM_FILTERS = ["ALL", "TOEIC", "IELTS", "VSTEP", "DAILY"] as const;
export const POS_FILTERS = ["ALL", "noun", "verb", "adjective", "adverb", "phrase"] as const;

export const SRS_STATE_LABELS: Record<string, string> = {
  new: "Mới",
  learning: "Đang học",
  review: "Ôn tập",
  mastered: "Đã thuộc",
  lapsed: "Quên",
};

export const VOCAB_RESERVED_SLUGS = ["notebook", "dictionary", "games", "srs", "review"];

export const VOCAB_TAGS = [
  "Tất cả",
  "TOEIC",
  "IELTS",
  "Oxford",
  "Giao tiếp",
  "Học thuật",
  "A1",
  "A2",
  "B1",
  "B2",
  "C1",
] as const;

export type VocabTag = (typeof VOCAB_TAGS)[number];

export const STUDY_MODES: { key: VocabStudyModeUI; label: string; hint: string }[] = [
  { key: "FILL_BLANK", label: "Điền từ", hint: "Đoán từ điền vào ví dụ" },
  { key: "FLASHCARD", label: "Flashcard", hint: "Lật thẻ SRS" },
  { key: "QUIZ", label: "Trắc nghiệm", hint: "Chọn nghĩa tiếng Việt" },
  { key: "QUIZ_REVERSE", label: "Trắc nghiệm đảo", hint: "Nghĩa → chọn từ" },
  { key: "REPEAT", label: "Lặp lại", hint: "Nghe và nhắc lại" },
];

export interface DeckCatalogGroup {
  id: string;
  title: string;
  subtitle?: string;
  match: (deck: VocabDeck) => boolean;
}

export const DECK_CATALOG_GROUPS: DeckCatalogGroup[] = [
  {
    id: "common",
    title: "Từ vựng tiếng Anh thông dụng",
    subtitle: "Giao tiếp hằng ngày, đời sống",
    match: (deck) => examFromDeck(deck) === "DAILY",
  },
  {
    id: "oxford",
    title: "Từ vựng Oxford",
    subtitle: "Học thuật theo cấp CEFR",
    match: (deck) => examFromDeck(deck) === "IELTS" || (deck.level || "").startsWith("B"),
  },
  {
    id: "toeic",
    title: "Từ vựng TOEIC",
    subtitle: "Văn phòng, kinh doanh, công việc",
    match: (deck) => examFromDeck(deck) === "TOEIC",
  },
  {
    id: "ielts",
    title: "Từ vựng IELTS",
    subtitle: "Academic & General Training",
    match: (deck) => examFromDeck(deck) === "IELTS",
  },
];

export function deckLearnerCount(deck: Pick<VocabDeck, "slug" | "itemCount">) {
  let hash = 0;
  for (let i = 0; i < deck.slug.length; i += 1) hash = (hash + deck.slug.charCodeAt(i) * 17) % 997;
  return 1200 + hash * 3 + (deck.itemCount || 0) * 11;
}

export function deckCoverUrl(deck: Pick<VocabDeck, "slug" | "thumbnailUrl">) {
  if (deck.thumbnailUrl) return deck.thumbnailUrl;
  const palette = ["2b417e", "1b6b7a", "5b4b8a", "0f4c5c", "405ea7"];
  let hash = 0;
  for (let i = 0; i < deck.slug.length; i += 1) hash += deck.slug.charCodeAt(i);
  const color = palette[hash % palette.length];
  return `https://placehold.co/640x360/${color}/ffffff?text=${encodeURIComponent(deck.slug.replace(/-/g, " "))}`;
}

export function matchDeckTag(deck: VocabDeck, tag: VocabTag) {
  if (tag === "Tất cả") return true;
  const exam = examFromDeck(deck);
  const level = (deck.level || "").toUpperCase();
  if (tag === "TOEIC") return exam === "TOEIC";
  if (tag === "IELTS") return exam === "IELTS";
  if (tag === "Oxford") return exam === "IELTS" || level.startsWith("B");
  if (tag === "Giao tiếp") return exam === "DAILY";
  if (tag === "Học thuật") return exam === "IELTS";
  if (["A1", "A2", "B1", "B2", "C1"].includes(tag)) return level === tag;
  return true;
}

export function groupDecks(decks: VocabDeck[]) {
  const assigned = new Set<string>();
  const groups = DECK_CATALOG_GROUPS.map((group) => {
    const items = decks.filter((deck) => {
      if (assigned.has(deck.id)) return false;
      if (!group.match(deck)) return false;
      assigned.add(deck.id);
      return true;
    });
    return { ...group, decks: items };
  }).filter((group) => group.decks.length > 0);

  const rest = decks.filter((deck) => !assigned.has(deck.id));
  if (rest.length) {
    groups.push({
      id: "other",
      title: "Bộ thẻ khác",
      subtitle: "Khám phá thêm",
      match: () => true,
      decks: rest,
    });
  }
  return groups;
}

export function buildClozeSentence(word: VocabWord) {
  const sentence = word.exampleEn || word.examples?.[0]?.sentence || "";
  if (!sentence) return { before: "", after: "", answer: word.headword };
  const pattern = new RegExp(`\\b${word.headword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
  const match = sentence.match(pattern);
  if (!match || match.index === undefined) {
    return { before: sentence, after: "", answer: word.headword };
  }
  return {
    before: sentence.slice(0, match.index),
    after: sentence.slice(match.index + match[0].length),
    answer: match[0],
  };
}

export function parseStudyMode(raw?: string | null): VocabStudyModeUI {
  const key = (raw || "FLASHCARD").toUpperCase();
  if (key === "FILL_BLANK" || key === "QUIZ_REVERSE" || key === "REPEAT") return key;
  if (key === "QUIZ") return "QUIZ";
  return "FLASHCARD";
}

export function isApiStudyMode(mode: VocabStudyModeUI) {
  return mode === "FLASHCARD" || mode === "QUIZ";
}
