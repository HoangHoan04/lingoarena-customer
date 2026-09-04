export type AccentType = "US" | "UK" | "AUS";

export type AiStatusState = "idle" | "listening" | "thinking" | "speaking";

export interface AiTutorPersona {
  id: string;
  name: string;
  title: string;
  gender: "female" | "male";
  accent: AccentType;
  accentLabel: string;
  avatar: string;
  coverImage?: string;
  roleDescription: string;
  personality: string;
  tagline: string;
  topics: string[];
  speechRate: number; // e.g. 0.95
  speechPitch: number; // e.g. 1.0
  voiceLang: string; // e.g. "en-US", "en-GB", "en-AU"
  animeId?: "yuki-sarah" | "kaito-david" | "duo-mascot" | "hana-emma" | "ren-james";
  welcomeMessage: string;
  welcomeMessageVi: string;
  samplePromptSuggestions: {
    en: string;
    vi: string;
  }[];
}

export interface AiGrammarFeedback {
  originalText: string;
  improvedText: string;
  explanationVi: string;
  highlightedRule?: string;
}

export interface AiConversationMessage {
  id: string;
  sender: "user" | "ai";
  content: string;
  translationVi?: string;
  timestamp: number;
  audioDurationSeconds?: number;
  feedback?: AiGrammarFeedback;
}

export type ViewMode = "call" | "split";
