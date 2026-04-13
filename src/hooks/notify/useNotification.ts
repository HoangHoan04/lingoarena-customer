import type { NotificationPaginationDto } from "@/dto";
import { API_ENDPOINTS } from "@/services/api-route";
import apiService from "@/services/api.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const usePaginationNotification = (
  params: NotificationPaginationDto,
) => {
  const { data, isLoading, refetch, error } = useQuery({
    queryKey: [API_ENDPOINTS.NOTIFY.PAGINATION, params],
    queryFn: async () => {
      const response = await apiService.post(
        API_ENDPOINTS.NOTIFY.PAGINATION,
        params,
      );
      return (response as any) ?? { data: [], total: 0 };
    },
  });

  return {
    data: (data as any)?.data || [],
    total: (data as any)?.total || 0,
    isLoading,
    refetch,
    error,
  };
};

export const useUnreadCount = () => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: [API_ENDPOINTS.NOTIFY.COUNT_NOT_SEEN],
    queryFn: async () => {
      const response = await apiService.post(
        API_ENDPOINTS.NOTIFY.COUNT_NOT_SEEN,
        {},
      );
      return (response as any) ?? { countAll: 0 };
    },
    refetchInterval: 5 * 60 * 1000,
  });

  return {
    count: (data as any)?.countAll || 0,
    isLoading,
    refetch,
  };
};

export const useMarkReadList = () => {
  const queryClient = useQueryClient();

  const { mutate: onMarkReadList, isPending } = useMutation({
    mutationFn: async (ids: string[]) => {
      return apiService.post(API_ENDPOINTS.NOTIFY.SEEN_LIST, { lstId: ids });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.NOTIFY.PAGINATION],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.NOTIFY.COUNT_NOT_SEEN],
      });
    },
  });

  return { onMarkReadList, isLoading: isPending };
};

export const useMarkAllRead = () => {
  const queryClient = useQueryClient();

  const { mutate: onMarkAllRead, isPending } = useMutation({
    mutationFn: async () => {
      return apiService.post(API_ENDPOINTS.NOTIFY.SEEN_ALL, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.NOTIFY.PAGINATION],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.NOTIFY.COUNT_NOT_SEEN],
      });
    },
  });

  return { onMarkAllRead, isLoading: isPending };
};
