import type { PaginationDto } from "@/dto";
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

export const useTranslateWebsite = () => {
  return useMutation({
    mutationFn: async (payload: {
      url: string;
      to: string;
    }): Promise<string> => {
      const response = await apiService.post(
        API_ENDPOINTS.TRANSLATION.WEBSITE,
        payload,
      );
      const data = response?.data ?? response;
      return data;
    },
  });
};

export const useTranslateImage = () => {
  return useMutation({
    mutationFn: async (payload: { image: File; to: string }): Promise<any> => {
      const formData = new FormData();
      formData.append("image", payload.image);
      formData.append("to", payload.to);

      const response = await apiService.post(
        API_ENDPOINTS.TRANSLATION.IMAGE,
        formData,
      );
      const data = response?.data ?? response;
      return data;
    },
  });
};

export const useTranslateDocument = () => {
  return useMutation({
    mutationFn: async (payload: {
      sourceUrl: string;
      to: string;
    }): Promise<any> => {
      const response = await apiService.post(
        API_ENDPOINTS.TRANSLATION.DOCUMENT,
        payload,
      );
      const data = response?.data ?? response;
      return data;
    },
  });
};

export const useDictionaryLookup = (
  text: string,
  from: string,
  to: string,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: ["dictionary-lookup", text, from, to],
    queryFn: async () => {
      const response = await apiService.get(
        API_ENDPOINTS.TRANSLATION.DICTIONARY_LOOKUP,
        {
          params: { text, from, to },
        },
      );
      return response?.data ?? response ?? [];
    },
    enabled: !!text && !!from && !!to && options?.enabled !== false,
  });
};

export const useTransliterate = () => {
  return useMutation({
    mutationFn: async (payload: {
      text: string;
      lang: string;
      fromScript: string;
      toScript: string;
    }): Promise<any> => {
      const response = await apiService.post(
        API_ENDPOINTS.TRANSLATION.TRANSLITERATE,
        payload,
      );
      const data = response?.data ?? response;
      return data;
    },
  });
};

export const useHistoryTranslation = () => {
  return useMutation({
    mutationFn: async (
      payload: PaginationDto<any>,
    ): Promise<{ items: any[]; total: number }> => {
      const response = await apiService.post(
        API_ENDPOINTS.TRANSLATION.HISTORY,
        payload,
      );
      return response?.data ?? response;
    },
  });
};

export const useSavedTranslationList = () => {
  return useMutation({
    mutationFn: async (
      payload: PaginationDto<any>,
    ): Promise<{ items: any[]; total: number }> => {
      const response = await apiService.post(
        API_ENDPOINTS.TRANSLATION.SAVED_LIST,
        payload,
      );
      return response?.data ?? response;
    },
  });
};

export const useToggleSavedTranslation = () => {
  return useMutation({
    mutationFn: async (payload: {
      originalText: string;
      translatedText: string;
      fromLanguage?: string;
      toLanguage: string;
      dictionaryData?: any;
    }): Promise<any> => {
      const response = await apiService.post(
        API_ENDPOINTS.TRANSLATION.SAVED_TOGGLE,
        payload,
      );
      return response?.data ?? response;
    },
  });
};
