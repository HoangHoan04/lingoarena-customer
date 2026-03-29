import { useToast } from "@/context/ToastContext";
import { useMutation } from "@tanstack/react-query";
import { API_ENDPOINTS } from "../../services/api-route";
import apiService from "../../services/api.service";

interface NewsletterResponse {
  success: boolean;
  message: string;
}

const subscribeNewsletter = async (
  email: string,
): Promise<NewsletterResponse> => {
  const response = await apiService.post<NewsletterResponse>(
    API_ENDPOINTS.NEWSLETTER.SUBSCRIBE,
    { email },
  );
  return response.data;
};

const unsubscribeNewsletter = async (
  email: string,
): Promise<NewsletterResponse> => {
  const response = await apiService.post<NewsletterResponse>(
    API_ENDPOINTS.NEWSLETTER.UNSUBSCRIBE,
    { email },
  );
  return response.data;
};

export const useSubscribeNewsletter = () => {
  const { showToast } = useToast();
  return useMutation({
    mutationFn: subscribeNewsletter,
    onSuccess: (data) => {
      showToast({
        type: data.success ? "success" : "error",
        message: data.message,
      });
    },
  });
};

export const useUnsubscribeNewsletter = () => {
  const { showToast } = useToast();
  return useMutation({
    mutationFn: unsubscribeNewsletter,
    onSuccess: (data) => {
      showToast({
        type: data.success ? "success" : "error",
        message: data.message,
      });
    },
  });
};
