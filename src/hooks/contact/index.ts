import type { ContactDto, SendContactResponse } from "@/dto";
import { API_ENDPOINTS } from "@/services/api-route";
import apiService from "@/services/api.service";
import { useMutation } from "@tanstack/react-query";

const sendContact = async (data: ContactDto): Promise<SendContactResponse> => {
  const response = await apiService.post<SendContactResponse>(
    API_ENDPOINTS.EMAIL.SEND_CONTACT,
    data,
  );
  return response.data;
};

export const useSendContact = () => {
  return useMutation({
    mutationFn: sendContact,
  });
};
