import { API_ENDPOINTS } from "@/services/api-route";
import apiService from "@/services/api.service";
import { useMutation } from "@tanstack/react-query";

interface UploadResponse {
  fileName: string;
  fileUrl: string;
}

interface UploadResult {
  data: UploadResponse;
  message: string;
}

export const useUploadSingle = () => {
  const { isError, data, error, mutateAsync, mutate, isPending } = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const response = await apiService.post<UploadResult>(
        API_ENDPOINTS.UPLOAD_FILE.SINGLE,
        formData,
      );
      return response;
    },
  });

  return {
    isError,
    data: data?.data,
    error,
    mutate,
    uploadAsync: mutateAsync,
    isLoading: isPending,
  };
};

export const useUploadMultiple = () => {
  const { isError, data, error, mutateAsync, mutate, isPending } = useMutation({
    mutationFn: async (files: File[]) => {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });

      const response = await apiService.post<{ data: UploadResponse[] }>(
        API_ENDPOINTS.UPLOAD_FILE.MULTI,
        formData,
      );
      return response;
    },
  });

  return {
    isError,
    data: data?.data,
    error,
    mutate,
    uploadAsync: mutateAsync,
    isLoading: isPending,
  };
};
