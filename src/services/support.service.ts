import { extractApiData } from "@/lib/auth";
import apiService from "./api.service";
import API_ENDPOINTS from "./endpoint";

export interface ContactPayload {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

function paginationPayload<T>(res: any) {
  const body = res?.data ?? res;
  if (Array.isArray(body?.data)) return { data: body.data as T[], total: Number(body.total || 0) };
  const inner = extractApiData<any>(res);
  if (Array.isArray(inner)) return { data: inner as T[], total: inner.length };
  return { data: (inner?.data || []) as T[], total: Number(inner?.total || 0) };
}

export const supportService = {
  contact: async (payload: ContactPayload) => {
    const res = await apiService.post(API_ENDPOINTS.SUPPORT.CONTACT, payload);
    return extractApiData(res);
  },

  tickets: async (skip = 0, take = 20, where: Record<string, unknown> = {}) => {
    const res = await apiService.post(`${API_ENDPOINTS.SUPPORT.TICKETS}/pagination`, {
      skip,
      take,
      where,
    });
    return paginationPayload<any>(res);
  },

  createTicket: async (payload: {
    category: string;
    subject: string;
    message: string;
    priority?: string;
  }) => {
    const res = await apiService.post(API_ENDPOINTS.SUPPORT.TICKETS, payload);
    return extractApiData(res);
  },

  ticket: async (id: string) => {
    const res = await apiService.get(API_ENDPOINTS.SUPPORT.TICKET(id));
    return extractApiData(res);
  },

  addMessage: async (id: string, message: string) => {
    const res = await apiService.post(API_ENDPOINTS.SUPPORT.TICKET_MESSAGES(id), { message });
    return extractApiData(res);
  },
};

export default supportService;
