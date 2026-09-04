import { extractApiData } from "@/lib/auth";
import type {
  GrammarMasteryResult,
  GrammarStructure,
  GrammarStructureFilter,
  GrammarTopic,
  GrammarTopicFilter,
} from "@/types/grammar";
import apiService from "./api.service";
import API_ENDPOINTS from "./endpoint";

type GrammarEndpointMap = {
  TOPICS_PAGINATION: string;
  TOPIC_BY_SLUG: (slug: string) => string;
  STRUCTURES_PAGINATION: string;
  STRUCTURE_DETAIL: (id: string) => string;
  ME_MASTERY: string;
};

/*
Parent must add API_ENDPOINTS.GRAMMAR keys:
TOPICS_PAGINATION, TOPIC_BY_SLUG, STRUCTURES_PAGINATION, STRUCTURE_DETAIL, ME_MASTERY.
*/
const GRAMMAR = ((API_ENDPOINTS as unknown as { GRAMMAR?: GrammarEndpointMap })
  .GRAMMAR || {
  TOPICS_PAGINATION: "/user/grammar/topics/pagination",
  TOPIC_BY_SLUG: (slug: string) => `/user/grammar/topics/by-slug/${slug}`,
  STRUCTURES_PAGINATION: "/user/grammar/structures/pagination",
  STRUCTURE_DETAIL: (id: string) => `/user/grammar/structures/${id}`,
  ME_MASTERY: "/user/grammar/me/mastery",
}) satisfies GrammarEndpointMap;

function paginationPayload<T>(res: unknown) {
  const body = ((res as { data?: unknown })?.data ?? res) as {
    data?: unknown;
    total?: unknown;
  };
  if (Array.isArray(body?.data))
    return { data: body.data as T[], total: Number(body.total || 0) };
  const inner = extractApiData<unknown>(res) as
    | { data?: unknown; total?: unknown }
    | unknown[];
  if (Array.isArray(inner)) return { data: inner as T[], total: inner.length };
  return {
    data: ((inner as { data?: unknown })?.data || []) as T[],
    total: Number((inner as { total?: unknown })?.total || 0),
  };
}

export const grammarService = {
  paginationTopics: async (
    skip = 0,
    take = 20,
    where: GrammarTopicFilter = {},
  ) => {
    const res = await apiService.post(GRAMMAR.TOPICS_PAGINATION, {
      skip,
      take,
      where,
    });
    return paginationPayload<GrammarTopic>(res);
  },
  getTopicBySlug: async (slug: string) => {
    const res = await apiService.get(GRAMMAR.TOPIC_BY_SLUG(slug));
    return extractApiData<GrammarTopic>(res);
  },
  paginationStructures: async (
    skip = 0,
    take = 20,
    where: GrammarStructureFilter = {},
  ) => {
    const res = await apiService.post(GRAMMAR.STRUCTURES_PAGINATION, {
      skip,
      take,
      where,
    });
    return paginationPayload<GrammarStructure>(res);
  },
  getStructure: async (id: string) => {
    const res = await apiService.get(GRAMMAR.STRUCTURE_DETAIL(id));
    return extractApiData<GrammarStructure>(res);
  },
  updateMastery: async (grammarStructureId: string, isCorrect: boolean) => {
    const res = await apiService.post(GRAMMAR.ME_MASTERY, {
      grammarStructureId,
      isCorrect,
    });
    return extractApiData<GrammarMasteryResult>(res);
  },
};
