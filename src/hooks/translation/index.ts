import { API_ENDPOINTS } from "@/services/api-route";
import apiService from "@/services/api.service";
import { useMutation, useQuery } from "@tanstack/react-query";

export interface TranslationResult {
  translatedText: string;
  detectedLanguage?: string;
}

export interface TranslateDto {
  text: string;
  to: string;
  from?: string;
}

export interface TranslateBatchDto {
  texts: string[];
  to: string;
  from?: string;
}

export const useSupportedLanguages = () => {
  return useQuery({
    queryKey: ["languages"],
    queryFn: async () => {
      const response = await apiService.get(
        API_ENDPOINTS.TRANSLATION.LANGUAGES,
      );
      return response?.data || response;
    },
    staleTime: Infinity,
  });
};

export const useTranslateBatch = () => {
  return useMutation({
    mutationFn: async (
      payload: TranslateBatchDto,
    ): Promise<TranslationResult[]> => {
      const response = await apiService.post(
        API_ENDPOINTS.TRANSLATION.TRANSLATE_BATCH,
        payload,
      );
      return response.data;
    },
  });
};

export const useTranslateText = () => {
  return useMutation({
    mutationFn: async (payload: TranslateDto): Promise<TranslationResult> => {
      const response = await apiService.post(
        API_ENDPOINTS.TRANSLATION.TRANSLATE,
        payload,
      );
      const data = response?.data ?? response;
      if (!data) throw new Error("API bốc hơi không trả về gì cả!");
      return data;
    },
  });
};

export const useDetectLanguage = (text: string) => {
  return useQuery({
    queryKey: ["detect-language", text],
    queryFn: async () => {
      const response = await apiService.post(API_ENDPOINTS.TRANSLATION.DETECT, {
        text,
      });
      const data = response?.data ?? response;
      return data ?? { language: "unknown" };
    },
    enabled: !!text && text.length > 3,
  });
};
