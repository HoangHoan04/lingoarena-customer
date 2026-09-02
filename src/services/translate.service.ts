import { extractApiData } from "@/lib/auth";
import type { TranslateRequest, TranslateResponse } from "@/types/translate";
import type { AxiosRequestConfig } from "axios";
import apiService from "./api.service";
import API_ENDPOINTS from "./endpoint";

export const translateService = {
  translate: async (payload: TranslateRequest, config?: AxiosRequestConfig) => {
    const res = await apiService.post(API_ENDPOINTS.TRANSLATE.TEXT, payload, config);
    return extractApiData<TranslateResponse>(res);
  },
};
