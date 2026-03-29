import type { BannerDto } from "@/dto";
import { API_ENDPOINTS } from "@/services/api-route";
import apiService from "@/services/api.service";
import { useQuery } from "@tanstack/react-query";

const fetchBanners = async (type?: string): Promise<BannerDto[]> => {
  const response = await apiService.post(API_ENDPOINTS.BANNER.GET_BY_TYPE, {
    type,
  });
  return response.data || [];
};

export const useBanners = (type?: string) => {
  return useQuery({
    queryKey: ["banners", type],
    queryFn: () => fetchBanners(type),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
