import type {
  NotificationPaginationDto,
  UpdateNotificationSettingDto,
} from "@/dto";
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
      return response.data;
    },
  });

  return {
    data: data?.data || [],
    total: data?.total || 0,
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
      return response.data;
    },
    refetchInterval: 5 * 60 * 1000,
  });

  return {
    count: data?.countAll || 0,
    isLoading,
    refetch,
  };
};

export const useMarkReadList = () => {
  const queryClient = useQueryClient();

  const { mutate: onMarkReadList, isPending } = useMutation({
    mutationFn: async (ids: string[]) => {
      const response = await apiService.post(API_ENDPOINTS.NOTIFY.SEEN_LIST, {
        lstId: ids,
      });
      return response.data;
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
      const response = await apiService.post(API_ENDPOINTS.NOTIFY.SEEN_ALL, {});
      return response.data;
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

export const useNotificationDetail = (id: string) => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["notification-detail", id],
    queryFn: async () => {
      const response = await apiService.post(
        `${API_ENDPOINTS.NOTIFY.PAGINATION.replace(
          "/pagination",
          "",
        )}/detail/${id}`,
        {},
      );
      return response.data;
    },
    enabled: !!id,
  });

  return {
    data: data?.data,
    isLoading,
    refetch,
  };
};

export const useNotificationSettings = () => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["notification-settings"],
    queryFn: async () => {
      const response = await apiService.post(
        `${API_ENDPOINTS.NOTIFY.PAGINATION.replace(
          "/pagination",
          "",
        )}/get-settings`,
        {},
      );
      return response.data;
    },
  });

  return {
    settings: data?.data,
    isLoading,
    refetch,
  };
};

export const useUpdateNotificationSettings = () => {
  const queryClient = useQueryClient();

  const { mutate: onUpdateSettings, isPending } = useMutation({
    mutationFn: async (data: UpdateNotificationSettingDto) => {
      const response = await apiService.post(
        `${API_ENDPOINTS.NOTIFY.PAGINATION.replace(
          "/pagination",
          "",
        )}/update-settings`,
        data,
      );
      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notification-settings"],
      });
    },
  });

  return { onUpdateSettings, isLoading: isPending };
};
