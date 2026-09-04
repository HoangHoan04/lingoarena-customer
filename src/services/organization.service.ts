import { extractApiData } from "@/lib/auth";
import apiService from "./api.service";
import API_ENDPOINTS from "./endpoint";

export const organizationService = {
  me: async () => {
    const res = await apiService.get(API_ENDPOINTS.ORGANIZATION.ME);
    const data = extractApiData<any[] | { data?: any[] }>(res);
    return Array.isArray(data) ? data : data?.data || [];
  },
};

export default organizationService;
