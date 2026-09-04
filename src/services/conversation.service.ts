import { extractApiData } from "@/lib/auth";
import type {
  AiTutorPersonaApi,
  ConversationRecord,
  ConversationMessageRecord,
  CreateSpeakingRoomPayload,
  SpeakingRoomFilter,
} from "@/types/conversation";
import apiService from "./api.service";
import API_ENDPOINTS from "./endpoint";

function paginationPayload<T>(res: unknown) {
  const body = ((res as { data?: unknown })?.data ?? res) as { data?: unknown; total?: unknown };
  if (Array.isArray(body?.data)) return { data: body.data as T[], total: Number(body.total || 0) };
  const inner = extractApiData<unknown>(res) as { data?: unknown; total?: unknown } | unknown[];
  if (Array.isArray(inner)) return { data: inner as T[], total: inner.length };
  return {
    data: ((inner as { data?: unknown })?.data || []) as T[],
    total: Number((inner as { total?: unknown })?.total || 0),
  };
}

function asList<T>(res: unknown): T[] {
  const data = extractApiData<unknown>(res);
  if (Array.isArray(data)) return data as T[];
  if (data && typeof data === "object" && Array.isArray((data as { data?: unknown }).data)) {
    return (data as { data: T[] }).data;
  }
  return [];
}

export const conversationService = {
  listPersonas: async () => {
    const res = await apiService.get(API_ENDPOINTS.CONVERSATION.PERSONAS);
    return asList<AiTutorPersonaApi>(res);
  },

  paginationSpeakingRooms: async (skip = 0, take = 20, where: SpeakingRoomFilter = {}) => {
    const res = await apiService.post(API_ENDPOINTS.CONVERSATION.SPEAKING_ROOMS_PAGINATION, {
      skip,
      take,
      where,
    });
    return paginationPayload<ConversationRecord>(res);
  },

  createSpeakingRoom: async (payload: CreateSpeakingRoomPayload) => {
    const res = await apiService.post(API_ENDPOINTS.CONVERSATION.SPEAKING_ROOMS_CREATE, payload);
    return extractApiData<ConversationRecord>(res);
  },

  joinSpeakingRoom: async (id: string, password?: string) => {
    const res = await apiService.post(API_ENDPOINTS.CONVERSATION.SPEAKING_ROOM_JOIN(id), {
      password,
    });
    return extractApiData<ConversationRecord>(res);
  },

  startAiSession: async (personaId: string) => {
    const res = await apiService.post(API_ENDPOINTS.CONVERSATION.AI_SESSIONS, { personaId });
    return extractApiData<ConversationRecord>(res);
  },

  paginationAiSessions: async (skip = 0, take = 20, where: Record<string, unknown> = {}) => {
    const res = await apiService.post(API_ENDPOINTS.CONVERSATION.AI_SESSIONS_PAGINATION, {
      skip,
      take,
      where,
    });
    return paginationPayload<ConversationRecord>(res);
  },

  getConversation: async (id: string) => {
    const res = await apiService.get(API_ENDPOINTS.CONVERSATION.CONVERSATION(id));
    return extractApiData<ConversationRecord>(res);
  },

  postMessage: async (
    id: string,
    payload: { content: string; translationVi?: string; audioUrl?: string; audioDurationSeconds?: number },
  ) => {
    const res = await apiService.post(API_ENDPOINTS.CONVERSATION.CONVERSATION_MESSAGES(id), payload);
    return extractApiData<ConversationMessageRecord>(res);
  },

  closeConversation: async (id: string) => {
    const res = await apiService.post(API_ENDPOINTS.CONVERSATION.CONVERSATION_CLOSE(id));
    return extractApiData<ConversationRecord>(res);
  },
};

export default conversationService;
