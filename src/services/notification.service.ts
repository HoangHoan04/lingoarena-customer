import { extractApiData } from "@/lib/auth";
import type { NotificationPreference, UserNotification } from "@/types/notification";
import apiService from "./api.service";
import API_ENDPOINTS from "./endpoint";

function paginationPayload<T>(res: any) {
  const body = res?.data ?? res;
  if (Array.isArray(body?.data)) return { data: body.data as T[], total: Number(body.total || 0) };
  const inner = extractApiData<any>(res);
  if (Array.isArray(inner)) return { data: inner as T[], total: inner.length };
  return { data: (inner?.data || []) as T[], total: Number(inner?.total || 0) };
}

function flattenPreferences(raw: unknown): NotificationPreference[] {
  if (Array.isArray(raw)) {
    return raw.map((item) => ({
      id: item.id || `${item.channel}:${item.eventType}`,
      channel: item.channel,
      eventType: item.eventType,
      isEnabled: Boolean(item.isEnabled ?? item.enabled),
    }));
  }
  if (!raw || typeof raw !== "object") return [];
  const items: NotificationPreference[] = [];
  for (const [channel, events] of Object.entries(raw as Record<string, Record<string, boolean>>)) {
    if (!events || typeof events !== "object") continue;
    for (const [eventType, enabled] of Object.entries(events)) {
      items.push({
        id: `${channel}:${eventType}`,
        channel,
        eventType,
        isEnabled: Boolean(enabled),
      });
    }
  }
  return items;
}

export const notificationService = {
  mePagination: async (skip = 0, take = 20, where: Record<string, unknown> = {}) => {
    const res = await apiService.post(API_ENDPOINTS.NOTIFICATION.ME_PAGINATION, {
      skip,
      take,
      where,
    });
    return paginationPayload<UserNotification>(res);
  },

  markRead: async (id: string) => {
    const res = await apiService.put(API_ENDPOINTS.NOTIFICATION.READ(id));
    return extractApiData<UserNotification>(res);
  },

  preferences: async () => {
    const res = await apiService.get(API_ENDPOINTS.NOTIFICATION.PREFERENCES);
    return flattenPreferences(extractApiData(res));
  },

  upsertPreferences: async (items: Array<{ eventType: string; channel: string; isEnabled: boolean }>) => {
    const res = await apiService.put(API_ENDPOINTS.NOTIFICATION.PREFERENCES, {
      items: items.map((item) => ({
        channel: item.channel,
        eventType: item.eventType,
        enabled: item.isEnabled,
      })),
    });
    return flattenPreferences(extractApiData(res));
  },
};

export default notificationService;
