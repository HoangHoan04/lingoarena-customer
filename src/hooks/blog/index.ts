import {
  PageResponse,
  type PaginationDto,
  type SuccessResponse,
} from "@/dto/base.dto";
import type {
  BlogCommentDto,
  BlogCommentFilterDto,
  BlogDto,
  BlogFilterDto,
  CreateBlogCommentDto,
  UpdateBlogCommentDto,
} from "@/dto/blog.dto";
import { API_ENDPOINTS } from "@/services/api-route";
import apiService from "@/services/api.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

/**
 * Lấy danh sách bài viết đã xuất bản (cho user)
 */
export const usePaginationBlog = (params: PaginationDto<BlogFilterDto>) => {
  const { data, isLoading, refetch, error } = useQuery<PageResponse<BlogDto>>({
    queryKey: [API_ENDPOINTS.BLOG.PAGINATION, params],
    queryFn: async () =>
      await apiService.post(API_ENDPOINTS.BLOG.PAGINATION, params),
  });

  return {
    data: data?.data || [],
    total: data?.total || 0,
    isLoading,
    refetch,
    error,
  };
};

/**
 * Lấy chi tiết bài viết theo slug
 */
export const useBlogBySlug = (slug: string | undefined | null) => {
  const { data, isLoading, refetch, error } = useQuery({
    queryKey: [API_ENDPOINTS.BLOG.FIND_BY_SLUG, slug],
    queryFn: async () => {
      const res = await apiService.post(API_ENDPOINTS.BLOG.FIND_BY_SLUG, {
        slug,
      });
      return res;
    },
    enabled: !!slug,
  });

  return {
    data: data?.data,
    isLoading,
    refetch,
    error,
  };
};

/**
 * Lấy bài viết liên quan
 */
export const useRelatedBlogs = (id: string | undefined, limit: number = 5) => {
  const { data, isLoading } = useQuery({
    queryKey: [API_ENDPOINTS.BLOG.RELATED, id, limit],
    queryFn: async () => {
      const res = await apiService.post(API_ENDPOINTS.BLOG.RELATED, {
        id,
        limit,
      });
      return res;
    },
    enabled: !!id,
  });

  return {
    data: data?.data || [],
    isLoading,
  };
};

/**
 * Lấy bài viết phổ biến
 */
export const usePopularBlogs = (limit: number = 10) => {
  const { data, isLoading } = useQuery({
    queryKey: [API_ENDPOINTS.BLOG.POPULAR, limit],
    queryFn: async () => {
      const res = await apiService.post(API_ENDPOINTS.BLOG.POPULAR, {
        limit,
      });
      return res;
    },
  });

  return {
    data: data?.data || [],
    isLoading,
  };
};

/**
 * Lấy bài viết mới nhất
 */
export const useLatestBlogs = (limit: number = 10) => {
  const { data, isLoading } = useQuery({
    queryKey: [API_ENDPOINTS.BLOG.LATEST, limit],
    queryFn: async () => {
      const res = await apiService.post(API_ENDPOINTS.BLOG.LATEST, {
        limit,
      });
      return res;
    },
  });

  return {
    data: data?.data || [],
    isLoading,
  };
};

/**
 * Tìm kiếm bài viết
 */
export const useSearchBlogs = (
  keyword: string,
  params: PaginationDto<BlogFilterDto>,
) => {
  const { data, isLoading, refetch } = useQuery<PageResponse<BlogDto>>({
    queryKey: [API_ENDPOINTS.BLOG.SEARCH, keyword, params],
    queryFn: async () =>
      await apiService.post(API_ENDPOINTS.BLOG.SEARCH, {
        keyword,
        ...params,
      }),
    enabled: !!keyword,
  });

  return {
    data: data?.data || [],
    total: data?.total || 0,
    isLoading,
    refetch,
  };
};

/**
 * Lấy bài viết theo category
 */
export const useBlogsByCategory = (
  category: string,
  params: PaginationDto<BlogFilterDto>,
) => {
  const { data, isLoading, refetch } = useQuery<PageResponse<BlogDto>>({
    queryKey: [API_ENDPOINTS.BLOG.BY_CATEGORY, category, params],
    queryFn: async () =>
      await apiService.post(API_ENDPOINTS.BLOG.BY_CATEGORY, {
        category,
        ...params,
      }),
    enabled: !!category,
  });

  return {
    data: data?.data || [],
    total: data?.total || 0,
    isLoading,
    refetch,
  };
};

/**
 * Lấy bài viết theo tag
 */
export const useBlogsByTag = (
  tag: string,
  params: PaginationDto<BlogFilterDto>,
) => {
  const { data, isLoading, refetch } = useQuery<PageResponse<BlogDto>>({
    queryKey: [API_ENDPOINTS.BLOG.BY_TAG, tag, params],
    queryFn: async () =>
      await apiService.post(API_ENDPOINTS.BLOG.BY_TAG, {
        tag,
        ...params,
      }),
    enabled: !!tag,
  });

  return {
    data: data?.data || [],
    total: data?.total || 0,
    isLoading,
    refetch,
  };
};

/**
 * Lấy danh sách categories
 */
export const useCategories = () => {
  const { data, isLoading } = useQuery({
    queryKey: [API_ENDPOINTS.BLOG.CATEGORIES],
    queryFn: async () => {
      const res = await apiService.post(API_ENDPOINTS.BLOG.CATEGORIES, {});
      return res;
    },
  });

  return {
    data: data?.data || [],
    isLoading,
  };
};

/**
 * Lấy danh sách tags
 */
export const useTags = () => {
  const { data, isLoading } = useQuery({
    queryKey: [API_ENDPOINTS.BLOG.TAGS],
    queryFn: async () => {
      const res = await apiService.post(API_ENDPOINTS.BLOG.TAGS, {});
      return res;
    },
  });

  return {
    data: data?.data || [],
    isLoading,
  };
};

/**
 * Like bài viết
 */
export const useLikeBlog = () => {
  const queryClient = useQueryClient();

  const { mutate: likeBlog, isPending } = useMutation({
    mutationFn: (id: string) =>
      apiService.post(API_ENDPOINTS.BLOG.LIKE, {
        id,
      }) as Promise<SuccessResponse>,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.BLOG.FIND_BY_SLUG],
      });
    },
  });

  return { likeBlog, isLoading: isPending };
};

/**
 * Unlike bài viết
 */
export const useUnlikeBlog = () => {
  const queryClient = useQueryClient();

  const { mutate: unlikeBlog, isPending } = useMutation({
    mutationFn: (id: string) =>
      apiService.post(API_ENDPOINTS.BLOG.UNLIKE, {
        id,
      }) as Promise<SuccessResponse>,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.BLOG.FIND_BY_SLUG],
      });
    },
  });

  return { unlikeBlog, isLoading: isPending };
};

/**
 * Lấy danh sách bình luận theo postId
 */
export const useBlogComments = (
  postId: string | undefined,
  params?: Partial<PaginationDto<BlogCommentFilterDto>>,
) => {
  const { data, isLoading, refetch, error } = useQuery<
    PageResponse<BlogCommentDto>
  >({
    queryKey: [API_ENDPOINTS.BLOG.COMMENTS_BY_POST, postId, params],
    queryFn: async () =>
      await apiService.post(API_ENDPOINTS.BLOG.COMMENTS_BY_POST, {
        postId,
        skip: params?.skip || 0,
        take: params?.take || 100,
      }),
    enabled: !!postId,
  });

  return {
    data: data?.data || [],
    total: data?.total || 0,
    isLoading,
    refetch,
    error,
  };
};

/**
 * Tạo bình luận mới
 */
export const useCreateBlogComment = () => {
  const queryClient = useQueryClient();

  const { mutate: createComment, isPending } = useMutation({
    mutationFn: (body: CreateBlogCommentDto) =>
      apiService.post(
        API_ENDPOINTS.BLOG.CREATE_COMMENT,
        body,
      ) as Promise<SuccessResponse>,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.BLOG.COMMENTS_BY_POST],
      });
    },
  });

  return { createComment, isLoading: isPending };
};

/**
 * Cập nhật bình luận
 */
export const useUpdateBlogComment = () => {
  const queryClient = useQueryClient();

  const { mutate: updateComment, isPending } = useMutation({
    mutationFn: (data: { id: string } & UpdateBlogCommentDto) => {
      return apiService.post(
        API_ENDPOINTS.BLOG.UPDATE_COMMENT,
        data,
      ) as Promise<SuccessResponse>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.BLOG.COMMENTS_BY_POST],
      });
    },
  });

  return { updateComment, isLoading: isPending };
};

/**
 * Xóa bình luận
 */
export const useDeleteBlogComment = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: deleteComment, isPending: isLoading } = useMutation({
    mutationFn: (id: string) =>
      apiService.post(API_ENDPOINTS.BLOG.DELETE_COMMENT, {
        id,
      }) as Promise<SuccessResponse>,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.BLOG.COMMENTS_BY_POST],
      });
    },
  });

  return {
    deleteComment,
    isLoading,
  };
};

/**
 * Khôi phục bình luận
 */
export const useRestoreBlogComment = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: restoreComment, isPending: isLoading } = useMutation({
    mutationFn: (id: string) =>
      apiService.post(API_ENDPOINTS.BLOG.RESTORE_COMMENT, {
        id,
      }) as Promise<SuccessResponse>,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.BLOG.COMMENTS_BY_POST],
      });
    },
  });

  return {
    restoreComment,
    isLoading,
  };
};
