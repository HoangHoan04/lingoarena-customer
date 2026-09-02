import { create } from "zustand";

export interface FileAttachment {
  id: string;
  name: string;
  size: string;
  type: string;
  url?: string;
  previewUrl?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
  mode?: AiChatMode;
  model?: string;
  attachments?: FileAttachment[];
  feedback?: {
    score?: string;
    bandCefr?: string;
    grammarFixes?: { original: string; corrected: string; reason: string }[];
    vocabUpgrades?: { original: string; better: string; cefr: string }[];
    criteria?: { label: string; score: string; note: string }[];
  };
  rating?: "like" | "dislike";
  isBookmarked?: boolean;
}

export type AiChatMode =
  | "tutor"
  | "writing_grader"
  | "speaking_partner"
  | "grammar_explainer"
  | "roadmap";

export type AiModelId =
  | "gemini-2.5-flash"
  | "gemini-pro-vision"
  | "ielts-examiner-9.0"
  | "toeic-trap-master";

export interface ChatSession {
  id: string;
  title: string;
  mode: AiChatMode;
  model: AiModelId;
  createdAt: number;
  updatedAt: number;
  messages: ChatMessage[];
}

interface AiChatState {
  isOpen: boolean;
  isFullscreen: boolean;
  isMinimized: boolean;
  mode: AiChatMode;
  selectedModel: AiModelId;
  webSearchActive: boolean;
  deepThinkingActive: boolean;
  currentSessionId: string;
  sessions: ChatSession[];
  isStreaming: boolean;
  inputMessage: string;
  pendingAttachments: FileAttachment[];

  // Actions
  openChat: () => void;
  closeChat: () => void;
  toggleOpen: () => void;
  toggleFullscreen: () => void;
  setFullscreen: (value: boolean) => void;
  toggleMinimize: () => void;
  setMode: (mode: AiChatMode) => void;
  setSelectedModel: (model: AiModelId) => void;
  toggleWebSearch: () => void;
  toggleDeepThinking: () => void;
  setInputMessage: (msg: string) => void;
  addAttachment: (file: FileAttachment) => void;
  removeAttachment: (id: string) => void;
  clearAttachments: () => void;
  createNewSession: (mode?: AiChatMode) => void;
  switchSession: (sessionId: string) => void;
  deleteSession: (sessionId: string) => void;
  clearCurrentSession: () => void;
  rateMessage: (messageId: string, rating: "like" | "dislike") => void;
  toggleBookmarkMessage: (messageId: string) => void;
  sendMessage: (text: string) => Promise<void>;
  regenerateLastMessage: () => Promise<void>;
}

const INITIAL_SESSIONS: ChatSession[] = [
  {
    id: "session-default",
    title: "Cuộc trò chuyện mới",
    mode: "tutor",
    model: "gemini-2.5-flash",
    createdAt: Date.now(),
    updatedAt: Date.now(),
    messages: [],
  },
];

export const useAiChatStore = create<AiChatState>((set, get) => ({
  isOpen: false,
  isFullscreen: false,
  isMinimized: false,
  mode: "tutor",
  selectedModel: "gemini-2.5-flash",
  webSearchActive: false,
  deepThinkingActive: true,
  currentSessionId: "session-default",
  sessions: INITIAL_SESSIONS,
  isStreaming: false,
  inputMessage: "",
  pendingAttachments: [],

  openChat: () => set({ isOpen: true, isMinimized: false }),
  closeChat: () => set({ isOpen: false }),
  toggleOpen: () =>
    set((state) => ({ isOpen: !state.isOpen, isMinimized: false })),
  toggleFullscreen: () =>
    set((state) => ({ isFullscreen: !state.isFullscreen })),
  setFullscreen: (isFullscreen) => set({ isFullscreen }),
  toggleMinimize: () => set((state) => ({ isMinimized: !state.isMinimized })),
  setMode: (mode) => set({ mode }),
  setSelectedModel: (selectedModel) => set({ selectedModel }),
  toggleWebSearch: () =>
    set((state) => ({ webSearchActive: !state.webSearchActive })),
  toggleDeepThinking: () =>
    set((state) => ({ deepThinkingActive: !state.deepThinkingActive })),
  setInputMessage: (inputMessage) => set({ inputMessage }),

  addAttachment: (file) =>
    set((state) => ({
      pendingAttachments: [...state.pendingAttachments, file],
    })),

  removeAttachment: (id) =>
    set((state) => ({
      pendingAttachments: state.pendingAttachments.filter((f) => f.id !== id),
    })),

  clearAttachments: () => set({ pendingAttachments: [] }),

  createNewSession: (customMode) => {
    const mode = customMode || get().mode;
    const model = get().selectedModel;
    const newSessionId = `session-${Date.now()}`;
    const newSession: ChatSession = {
      id: newSessionId,
      title: "Cuộc trò chuyện mới",
      mode,
      model,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: [],
    };

    set((state) => ({
      sessions: [newSession, ...state.sessions],
      currentSessionId: newSessionId,
      mode,
      pendingAttachments: [],
    }));
  },

  switchSession: (sessionId) => {
    const session = get().sessions.find((s) => s.id === sessionId);
    if (session) {
      set({
        currentSessionId: sessionId,
        mode: session.mode,
        selectedModel: session.model || "gemini-2.5-flash",
      });
    }
  },

  deleteSession: (sessionId) => {
    set((state: any) => {
      const remaining = state.sessions.filter(
        (s: ChatSession) => s.id !== sessionId,
      );
      const fallbackSessions =
        remaining.length > 0
          ? remaining
          : [
              {
                id: `session-${Date.now()}`,
                title: "Cuộc trò chuyện mới",
                mode: "tutor",
                model: "gemini-2.5-flash",
                createdAt: Date.now(),
                updatedAt: Date.now(),
                messages: [],
              },
            ];

      return {
        sessions: fallbackSessions,
        currentSessionId: fallbackSessions[0].id,
      };
    });
  },

  clearCurrentSession: () => {
    const { currentSessionId } = get();
    set((state) => ({
      sessions: state.sessions.map((s) =>
        s.id === currentSessionId
          ? {
              ...s,
              messages: [],
              updatedAt: Date.now(),
            }
          : s,
      ),
      pendingAttachments: [],
    }));
  },

  rateMessage: (messageId, rating) => {
    const { currentSessionId } = get();
    set((state) => ({
      sessions: state.sessions.map((s) =>
        s.id === currentSessionId
          ? {
              ...s,
              messages: s.messages.map((m) =>
                m.id === messageId
                  ? { ...m, rating: m.rating === rating ? undefined : rating }
                  : m,
              ),
            }
          : s,
      ),
    }));
  },

  toggleBookmarkMessage: (messageId) => {
    const { currentSessionId } = get();
    set((state) => ({
      sessions: state.sessions.map((s) =>
        s.id === currentSessionId
          ? {
              ...s,
              messages: s.messages.map((m) =>
                m.id === messageId
                  ? { ...m, isBookmarked: !m.isBookmarked }
                  : m,
              ),
            }
          : s,
      ),
    }));
  },

  sendMessage: async (text: string) => {
    const cleanText = text.trim();
    const { pendingAttachments, currentSessionId, mode, selectedModel } = get();

    if (!cleanText && pendingAttachments.length === 0) return;

    const userMsgId = `msg-user-${Date.now()}`;
    const userMessage: ChatMessage = {
      id: userMsgId,
      role: "user",
      content:
        cleanText ||
        (pendingAttachments.length > 0 ? "Đã gửi tệp đính kèm phân tích" : ""),
      timestamp: Date.now(),
      mode,
      attachments: [...pendingAttachments],
    };

    set((state) => ({
      inputMessage: "",
      pendingAttachments: [],
      isStreaming: true,
      sessions: state.sessions.map((s) => {
        if (s.id !== currentSessionId) return s;
        const isFirst =
          s.messages.filter((m) => m.role === "user").length === 0;
        const titleText =
          cleanText || (pendingAttachments[0]?.name ?? "Phân tích tài liệu");
        return {
          ...s,
          title: isFirst
            ? titleText.slice(0, 32) + (titleText.length > 32 ? "..." : "")
            : s.title,
          updatedAt: Date.now(),
          messages: [...s.messages, userMessage],
        };
      }),
    }));
  },

  regenerateLastMessage: async () => {
    const { sessions, currentSessionId } = get();
    const currentSession = sessions.find((s) => s.id === currentSessionId);
    if (!currentSession) return;

    const userMsgs = currentSession.messages.filter((m) => m.role === "user");
    if (userMsgs.length === 0) return;

    const lastUserMsg = userMsgs[userMsgs.length - 1];

    set((state) => ({
      sessions: state.sessions.map((s) => {
        if (s.id !== currentSessionId) return s;
        return {
          ...s,
          messages: s.messages.slice(0, -1),
        };
      }),
    }));

    await get().sendMessage(lastUserMsg.content);
  },
}));
