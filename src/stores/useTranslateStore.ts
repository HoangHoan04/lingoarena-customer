import { create } from "zustand";

export interface TranslateItem {
  id: string;
  sourceText: string;
  translatedText: string;
  sourceLang: string;
  targetLang: string;
  timestamp: number;
  isStarred?: boolean;
}

export type TranslateMode = "text" | "documents" | "images" | "websites";

interface TranslateState {
  isOpen: boolean;
  isFullscreen: boolean;
  mode: TranslateMode;
  sourceLang: string;
  targetLang: string;
  sourceText: string;
  translatedText: string;
  isTranslating: boolean;
  history: TranslateItem[];
  savedPhrases: TranslateItem[];
  showHistoryDrawer: boolean;
  showSavedDrawer: boolean;

  // Actions
  openTranslate: () => void;
  closeTranslate: () => void;
  toggleTranslate: () => void;
  toggleFullscreen: () => void;
  setFullscreen: (value: boolean) => void;
  setMode: (mode: TranslateMode) => void;
  setSourceLang: (lang: string) => void;
  setTargetLang: (lang: string) => void;
  setSourceText: (text: string) => void;
  setTranslatedText: (text: string) => void;
  setIsTranslating: (loading: boolean) => void;
  swapLanguages: () => void;
  addToHistory: (item: Omit<TranslateItem, "id" | "timestamp">) => void;
  toggleStarPhrase: (idOrItem: string | TranslateItem) => void;
  clearHistory: () => void;
  setShowHistoryDrawer: (show: boolean) => void;
  setShowSavedDrawer: (show: boolean) => void;
}

export const useTranslateStore = create<TranslateState>((set, get) => ({
  isOpen: false,
  isFullscreen: false,
  mode: "text",
  sourceLang: "auto",
  targetLang: "vi",
  sourceText: "",
  translatedText: "",
  isTranslating: false,
  history: [],
  savedPhrases: [],
  showHistoryDrawer: false,
  showSavedDrawer: false,

  openTranslate: () => set({ isOpen: true }),
  closeTranslate: () => set({ isOpen: false }),
  toggleTranslate: () => set((state) => ({ isOpen: !state.isOpen })),
  toggleFullscreen: () =>
    set((state) => ({ isFullscreen: !state.isFullscreen })),
  setFullscreen: (value) => set({ isFullscreen: value }),
  setMode: (mode) => set({ mode }),
  setSourceLang: (sourceLang) => set({ sourceLang }),
  setTargetLang: (targetLang) => set({ targetLang }),
  setSourceText: (sourceText) => set({ sourceText }),
  setTranslatedText: (translatedText) => set({ translatedText }),
  setIsTranslating: (isTranslating) => set({ isTranslating }),

  swapLanguages: () => {
    const { sourceLang, targetLang, sourceText, translatedText } = get();
    const effectiveSource = sourceLang === "auto" ? "en" : sourceLang;
    set({
      sourceLang: targetLang,
      targetLang: effectiveSource,
      sourceText: translatedText,
      translatedText: sourceText,
    });
  },

  addToHistory: (item) => {
    const newItem: TranslateItem = {
      ...item,
      id: `hist-${Date.now()}`,
      timestamp: Date.now(),
    };
    set((state) => ({
      history: [
        newItem,
        ...state.history.filter((h) => h.sourceText !== item.sourceText),
      ].slice(0, 30),
    }));
  },

  toggleStarPhrase: (idOrItem) => {
    set((state) => {
      let targetId = typeof idOrItem === "string" ? idOrItem : idOrItem.id;
      const historyItem = state.history.find((h) => h.id === targetId);

      const isAlreadySaved = state.savedPhrases.some((s) => s.id === targetId);
      let updatedSaved = [...state.savedPhrases];
      let updatedHistory = state.history.map((h) =>
        h.id === targetId ? { ...h, isStarred: !h.isStarred } : h,
      );

      if (isAlreadySaved) {
        updatedSaved = updatedSaved.filter((s) => s.id !== targetId);
      } else if (historyItem) {
        updatedSaved = [{ ...historyItem, isStarred: true }, ...updatedSaved];
      } else if (typeof idOrItem !== "string") {
        updatedSaved = [{ ...idOrItem, isStarred: true }, ...updatedSaved];
      }

      return {
        savedPhrases: updatedSaved,
        history: updatedHistory,
      };
    });
  },

  clearHistory: () => set({ history: [] }),
  setShowHistoryDrawer: (show) =>
    set({ showHistoryDrawer: show, showSavedDrawer: false }),
  setShowSavedDrawer: (show) =>
    set({ showSavedDrawer: show, showHistoryDrawer: false }),
}));
