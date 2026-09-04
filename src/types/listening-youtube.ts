export type DictationDifficulty = "easy" | "normal" | "hard";

export interface YoutubeVocab {
  word: string;
  phonetic?: string;
  meaningVi: string;
}

export interface YoutubeSentence {
  id: string;
  sentenceIndex: number;
  startSec: number;
  endSec: number;
  text: string;
  translationVi: string;
  explanation?: string;
  keyVocab?: YoutubeVocab[];
}

export interface YoutubeVideoItem {
  id: string;
  youtubeId?: string;
  audioUrl?: string;
  mediaType: "youtube" | "audio";
  title: string;
  channel: string;
  channelAvatarUrl?: string;
  thumbnailUrl: string;
  durationSec: number;
  topic: string;
  difficulty: "A2" | "B1" | "B2" | "C1";
  description: string;
  sentences: YoutubeSentence[];
  questionsCount?: number;
  questions?: any[];
  examType?: { code?: string; name?: string } | null;
}

export interface StudioSettings {
  autoRevealWords: boolean;
  showExplanation: boolean;
  soundEffects: boolean;
  playbackSpeed: number;
}
