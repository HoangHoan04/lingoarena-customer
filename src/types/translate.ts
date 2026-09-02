export interface TranslateDictionaryData {
  headword: string;
  ipa?: string;
  partOfSpeech?: string;
  meanings: {
    pos: string;
    definitions: {
      definition: string;
      example?: string;
      synonyms?: string[];
    }[];
  }[];
  alternateTranslations?: {
    translation: string;
    reverseTranslation: string[];
    frequency: 1 | 2 | 3;
  }[];
  examples?: {
    source: string;
    target: string;
  }[];
}

export interface TranslateRequest {
  text: string;
  sourceLang: string;
  targetLang: string;
}

export interface TranslateResponse {
  translatedText: string;
  detectedSourceLang?: string;
  provider?: string;
  dictionary?: TranslateDictionaryData | null;
}
