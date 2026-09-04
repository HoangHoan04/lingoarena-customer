import type { AccentType, AiTutorPersona } from "@/types/ai-conversation";
import type { ConversationRecord, ConversationMessageRecord, AiTutorPersonaApi } from "@/types/conversation";
import type { CheatSheetItem, GrammarCategoryGroup, GrammarQuizQuestion, GrammarStructure, GrammarTopic } from "@/types/grammar";
import type { YoutubeSentence, YoutubeVideoItem } from "@/types/listening-youtube";
import type { PublicQuestion, QuestionGroup } from "@/types/question";
import type { DictionaryEntry, ReadingLevel, ReadingPassage, ReadingQuestion, QuestionType } from "@/types/reading";
import type { VocabWord } from "@/types/vocabulary";
import type { ParaphraseExercise, WritingTopic } from "@/types/writing";
import type { SpeakingLevel, SpeakingParticipant, SpeakingRoom } from "@/types/speaking-room";

type ExamCode = "IELTS" | "TOEIC" | "VSTEP" | "APTIS" | "GENERAL";

function examCodeOf(value?: string | null): ExamCode {
  const code = (value || "").toUpperCase();
  if (code.includes("IELTS")) return "IELTS";
  if (code.includes("TOEIC")) return "TOEIC";
  if (code.includes("VSTEP")) return "VSTEP";
  if (code.includes("APTIS")) return "APTIS";
  return "GENERAL";
}

function topicNamesOf(topics?: Array<{ name?: string; label?: string } | null> | null) {
  return (topics || [])
    .map((item) => item?.name || item?.label || "")
    .filter(Boolean);
}

function mapQuestionType(code?: string | null): QuestionType {
  const value = (code || "").toUpperCase();
  if (value.includes("TRUE") || value.includes("FALSE")) return "true_false_not_given";
  if (value.includes("MATCH")) return "matching_headings";
  if (value.includes("FILL") || value.includes("SUMMARY")) return "summary_completion";
  return "multiple_choice";
}

export function mapGroupToReadingPassage(group: QuestionGroup): ReadingPassage {
  const examType = examCodeOf(group.examType?.code || group.examType?.name);
  const paragraphs =
    (group.segments || []).length > 0
      ? (group.segments || []).map((seg, index) => ({
          index,
          label: seg.label || `Paragraph ${String.fromCharCode(65 + index)}`,
          englishText: seg.text || "",
          vietnameseText: seg.translationVi || "",
        }))
      : (group.passageText || "")
          .split(/\n{2,}/)
          .filter(Boolean)
          .map((text, index) => ({
            index,
            label: `Paragraph ${String.fromCharCode(65 + index)}`,
            englishText: text,
            vietnameseText: "",
          }));

  const questions: ReadingQuestion[] = (group.questions || []).map((q, index) => ({
    id: q.id,
    questionNumber: index + 1,
    questionText: q.prompt,
    questionType: mapQuestionType(q.questionType?.code || q.questionType?.name),
    options: (q.options || []).map((opt) => opt.content),
    correctAnswer: "",
    explanationVi: q.instructions || "",
  }));

  const keyVocab = (group.keyVocabJson || []).map((item) => ({
    word: String(item.word || item.headword || ""),
    phonetic: item.phonetic ? String(item.phonetic) : undefined,
    meaning: String(item.meaning || item.meaningVi || ""),
    level: (String(item.level || "B2") as "B2" | "C1" | "C2") || "B2",
  }));

  return {
    id: group.id,
    title: group.title || "Reading passage",
    examType: examType === "GENERAL" ? "ALL" : examType,
    category: group.examType?.name || group.examStructure?.name || "Reading",
    level: ((group.cefrLevel || "B1") as ReadingLevel) || "B1",
    wordCount: Number(group.wordCount || 0),
    recommendedTimeMin: Number(group.recommendedTimeMin || 20),
    coverImage: group.coverImageUrl || group.imageUrl || undefined,
    paragraphs,
    questions,
    keyVocab,
    summaryVi: group.summaryVi || "",
    tags: [...topicNamesOf(group.topics), examType, group.cefrLevel || "B1"].filter(Boolean),
    topics: topicNamesOf(group.topics),
  };
}

export function mapGroupToYoutubeVideo(group: QuestionGroup): YoutubeVideoItem {
  const sentences: YoutubeSentence[] = (group.segments || []).map((seg, index) => ({
    id: seg.id || `${group.id}-${index}`,
    sentenceIndex: index + 1,
    startSec: Number(seg.startSec || 0),
    endSec: Number(seg.endSec || 0),
    text: seg.text || "",
    translationVi: seg.translationVi || "",
    explanation: seg.explanation || undefined,
    keyVocab: Array.isArray(seg.keyVocabJson)
      ? seg.keyVocabJson.map((item) => ({
          word: String(item.word || ""),
          phonetic: item.phonetic ? String(item.phonetic) : undefined,
          meaningVi: String(item.meaningVi || item.meaning || ""),
        }))
      : undefined,
  }));

  const isYoutube = Boolean(group.youtubeId);
  const audioUrl = group.audioUrl || undefined;

  // If this is a YouTube video but has no segments, auto-generate sentences so the studio and player work seamlessly!
  if (isYoutube && sentences.length === 0) {
    const rawText = group.transcript || group.passageText || group.title || "Listening practice";
    const parts = rawText
      .split(/(?<=[.?!])\s+|\n+/)
      .map((s: string) => s.trim())
      .filter(Boolean);
    if (parts.length > 0) {
      parts.forEach((p: string, idx: number) => {
        sentences.push({
          id: `${group.id}-s-${idx}`,
          sentenceIndex: idx + 1,
          startSec: idx * 5,
          endSec: (idx + 1) * 5,
          text: p,
          translationVi: "",
        });
      });
    } else {
      sentences.push({
        id: `${group.id}-default`,
        sentenceIndex: 1,
        startSec: 0,
        endSec: Number(group.durationSec || 60),
        text: rawText,
        translationVi: group.summaryVi || "",
      });
    }
  }

  return {
    id: group.id,
    youtubeId: group.youtubeId || "",
    audioUrl,
    mediaType: isYoutube ? "youtube" : "audio",
    title: group.title || "Listening",
    channel: group.channelName || group.examType?.code || group.examType?.name || "LingoArena",
    channelAvatarUrl: group.channelAvatarUrl || undefined,
    thumbnailUrl: group.thumbnailUrl || group.coverImageUrl || group.imageUrl || "",
    durationSec: Number(group.durationSec || 0),
    topic: topicNamesOf(group.topics)[0] || group.examType?.name || group.examStructure?.name || "Listening",
    difficulty: ((group.cefrLevel || "B1") as YoutubeVideoItem["difficulty"]) || "B1",
    description: group.summaryVi || group.instructions || "",
    sentences,
    questionsCount: group.questionsCount ?? (group.questions || []).length,
    questions: group.questions || [],
    examType: group.examType,
  };
}

export function mapQuestionToWritingTopic(q: PublicQuestion): WritingTopic {
  const contentJson = (q.contentJson || {}) as Record<string, any>;
  const prompt = q.prompt || "Write an essay discussing the given topic.";
  const examType = examCodeOf(q.examType?.code || q.examType?.name);
  return {
    id: q.id,
    title: prompt.length > 70 ? `${prompt.slice(0, 70)}...` : prompt,
    examType,
    category: q.topics?.[0]?.name || q.examSection?.name || "Essay",
    level: ((q.cefrLevel || "B2") as WritingTopic["level"]) || "B2",
    prompt,
    imageUrl: q.imageUrl || undefined,
    minWords: Number(contentJson.minWords || 150),
    maxWords: contentJson.maxWords ? Number(contentJson.maxWords) : undefined,
    timeLimitMin: Number(contentJson.timeLimitMin || 40),
    tags: [...topicNamesOf(q.topics), examType, q.cefrLevel || "B2"].filter(Boolean),
    outlineIdeas: Array.isArray(contentJson.outlineIdeas) ? contentJson.outlineIdeas : [],
    suggestedVocab: Array.isArray(contentJson.suggestedVocab) ? contentJson.suggestedVocab : [],
    sampleAnswer: String(contentJson.sampleAnswer || contentJson.sampleBand8 || ""),
    sampleBand: String(contentJson.sampleBand || ""),
    sampleAnalysisVi: String(contentJson.sampleAnalysisVi || q.instructions || ""),
  };
}

export function mapQuestionToParaphrase(q: PublicQuestion): ParaphraseExercise {
  const contentJson = (q.contentJson || {}) as Record<string, any>;
  return {
    id: q.id,
    original: q.prompt,
    keyword: String(contentJson.keyword || contentJson.targetKeyword || ""),
    targetStructure: String(contentJson.targetStructure || q.instructions || ""),
    sampleAnswers: Array.isArray(contentJson.sampleAnswers) ? contentJson.sampleAnswers : [],
    explanationVi: String(q.instructions || contentJson.explanationVi || ""),
    level: ((q.cefrLevel || "B2") as ParaphraseExercise["level"]) || "B2",
  };
}

export function groupGrammarTopics(topics: GrammarTopic[]): GrammarCategoryGroup[] {
  const byParent = new Map<string, GrammarCategoryGroup>();
  const orphans: GrammarTopic[] = [];
  for (const topic of topics) {
    const parent = topic.parent;
    if (parent?.id) {
      const existing = byParent.get(parent.id);
      if (existing) {
        existing.topics.push(topic);
      } else {
        byParent.set(parent.id, {
          id: parent.id,
          title: parent.title,
          titleEn: parent.titleEn || parent.title,
          icon: "📘",
          description: parent.description || "",
          color: "from-blue-600 to-indigo-600",
          topics: [topic],
        });
      }
    } else {
      orphans.push(topic);
    }
  }
  const groups = [...byParent.values()];
  if (orphans.length) {
    groups.push({
      id: "ungrouped",
      title: "Chủ điểm ngữ pháp",
      titleEn: "Grammar topics",
      icon: "📗",
      description: "Các chủ điểm đã xuất bản",
      color: "from-blue-600 to-indigo-600",
      topics: orphans,
    });
  }
  return groups;
}

export function mapStructuresToCheatSheet(structures: GrammarStructure[]): CheatSheetItem[] {
  return structures.map((item) => {
    const examples = item.examples || [];
    return {
      name: item.title,
      formulaAffirmative: item.formula || "",
      formulaNegative: "",
      formulaQuestion: "",
      signalWords: [],
      example: examples[0]?.sentence || "",
      level: item.grammarTopic?.cefrLevel || "",
      category: item.grammarTopic?.title || item.title,
    };
  });
}

export function mapStructuresToQuiz(structures: GrammarStructure[]): GrammarQuizQuestion[] {
  const questions: GrammarQuizQuestion[] = [];
  for (const structure of structures) {
    const examples = structure.examples || [];
    examples.forEach((example, index) => {
      const record = example as unknown as Record<string, unknown>;
      const options = Array.isArray(record.options) ? (record.options as string[]) : [];
      const correctAnswerIndex = Number(record.correctAnswerIndex ?? record.correctIndex ?? -1);
      if (options.length >= 2 && correctAnswerIndex >= 0) {
        questions.push({
          id: example.id || `${structure.id}-${index}`,
          topicTitle: structure.title,
          level: structure.grammarTopic?.cefrLevel || "",
          question: String(record.question || example.sentence),
          options,
          correctAnswerIndex,
          explanationVi: example.explanation || example.translation || "",
        });
      }
    });
  }
  return questions;
}

export function mapConversationToSpeakingRoom(item: ConversationRecord): SpeakingRoom {
  const cefr = (item.cefrLevel || "").toUpperCase();
  let level: SpeakingLevel = "ALL";
  if (cefr.startsWith("A")) level = "A1-A2";
  else if (cefr.startsWith("B")) level = "B1-B2";
  else if (cefr.startsWith("C")) level = "C1-C2";

  const participants: SpeakingParticipant[] = (item.participants || []).map((part) => ({
    id: part.userId || part.id,
    name: part.user?.fullName || part.user?.displayName || "Học viên",
    username: part.user?.username || part.userId?.slice(0, 8) || "user",
    avatarUrl: part.user?.avatarUrl || "",
    level: item.cefrLevel || "",
    isHost: part.role === "HOST" || part.userId === item.hostUserId,
    isMuted: Boolean(part.isMuted),
    isSpeaking: Boolean(part.isSpeaking),
    hasHandRaised: Boolean(part.hasHandRaised),
    joinedAt: part.joinedAt || "",
  }));

  return {
    id: item.id,
    name: item.title || "Phòng luyện nói",
    topic: item.topic || "Free talk",
    level,
    maxParticipants: Number(item.maxParticipants || 8),
    participants,
    isPrivate: Boolean(item.isPrivate),
    createdAt: item.createdAt || "",
    tags: [item.cefrLevel, item.topic].filter(Boolean) as string[],
    icebreakers: item.icebreakersJson || [],
    hostId: item.hostUserId || "",
  };
}

export function mapPersonaToUi(item: AiTutorPersonaApi): AiTutorPersona {
  const accent = String(item.accent || "US").toUpperCase();
  const prompts = (item.samplePromptsJson || []).map((row) => {
    const rec = row as Record<string, unknown>;
    return {
      en: String(rec.en || rec.prompt || rec.text || ""),
      vi: String(rec.vi || rec.promptVi || ""),
    };
  });
  return {
    id: item.id,
    name: item.name,
    title: item.title,
    gender: String(item.gender || "").toLowerCase() === "male" ? "male" : "female",
    accent: (["US", "UK", "AUS"].includes(accent) ? accent : "US") as AccentType,
    accentLabel: item.accentLabel || accent,
    avatar: item.avatarUrl || "",
    coverImage: item.coverImageUrl || undefined,
    roleDescription: item.roleDescription || "",
    personality: item.personality || "",
    tagline: item.tagline || "",
    topics: item.topicsJson || [],
    speechRate: Number(item.speechRate || 1),
    speechPitch: Number(item.speechPitch || 1),
    voiceLang: item.voiceLang || "en-US",
    animeId: item.animeId as AiTutorPersona["animeId"],
    welcomeMessage: item.welcomeMessage || "",
    welcomeMessageVi: item.welcomeMessageVi || "",
    samplePromptSuggestions: prompts,
  };
}

export function mapConversationMessage(item: ConversationMessageRecord) {
  const role = String(item.senderRole || "").toUpperCase();
  return {
    id: item.id,
    sender: role === "USER" ? ("user" as const) : ("ai" as const),
    content: item.content,
    translationVi: item.translationVi || undefined,
    timestamp: item.sentAt ? new Date(item.sentAt).getTime() : Date.now(),
    audioDurationSeconds: item.audioDurationSeconds ? Number(item.audioDurationSeconds) : undefined,
  };
}

export function mapVocabWordToDictionary(word: VocabWord): DictionaryEntry {
  return {
    word: word.headword,
    phonetic: word.ipaUs || word.ipaUk || "",
    ukPhonetic: word.ipaUk || undefined,
    partOfSpeech: word.partOfSpeech || "",
    level: word.cefrLevel || "",
    meaningVi: word.meaningVi || word.definitionVi || "",
    definitionEn: word.definitionEn || "",
    examples: (word.examples || []).map((ex) => ({ en: ex.sentence, vi: ex.translation })),
    collocations: (word.collocations || []).map((item) => item.collocation),
  };
}
