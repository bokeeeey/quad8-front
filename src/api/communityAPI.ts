import type {
  CommentResponseType,
  CommunityAllPostCardDataType,
  CommunityParamsType,
  CommunityPostCardDetailDataType,
  PostCardDetailModalCustomKeyboardType,
  PostCustomReviewResponse,
} from '@/types/communityType';
import { baseAPI } from './interceptor/interceptor';

const BASE_URL = process.env.NEXT_PUBLIC_KEYDEUK_API_BASE_URL;

export const getAllCommunityPost = async ({ sort, page, size }: CommunityParamsType) => {
  try {
    const { data } = await baseAPI.get<CommunityAllPostCardDataType>(
      `/api/v1/community/all?sort=${sort}&page=${page}&size=${size}`,
      {
        cache: 'no-cache',
      },
      true,
    );
    return data;
  } catch (error) {
    throw error;
  }
};

export const getMyPosts = async ({ sort, page, size }: CommunityParamsType) => {
  try {
    const { data } = await baseAPI.get<CommunityAllPostCardDataType>(
      `/api/v1/community/user?sort=${sort}&page=${page}&size=${size}`,
      {
        cache: 'no-cache',
      },
    );
    return data;
  } catch (error) {
    throw error;
  }
};

export const getPostDetail = async (id: number) => {
  try {
    const data = await baseAPI.get<CommunityPostCardDetailDataType>(
      `/api/v1/community/${id}`,
      {
        cache: 'no-cache',
      },
      true,
    );
    return data;
  } catch (error) {
    throw error;
  }
};

export const getCommentsInfiniteScroll = async ({
  communityId,
  commentId,
}: {
  communityId: number;
  commentId: number;
}) => {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/community/comment/${communityId}/${commentId}`, {
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message);
    }
    return data;
  } catch (error) {
    throw error;
  }
};

export const postComment = async ({ id, content }: { id: number; content: string }) => {
  try {
    await baseAPI.post<CommentResponseType>(`/api/v1/community/comment/${id}`, {
      cache: 'no-cache',
      body: JSON.stringify({ content }),
    });
  } catch (error) {
    throw error;
  }
};

export const deleteComment = async (id: number) => {
  try {
    await baseAPI.delete<CommentResponseType>(`/api/v1/community/comment/${id}`, {
      cache: 'no-cache',
    });
  } catch (error) {
    throw error;
  }
};

export const getCustomOrderList = async () => {
  try {
    const data = await baseAPI.get<PostCardDetailModalCustomKeyboardType[]>('/api/v1/community/purchase-history', {
      cache: 'no-cache',
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const postCreateCustomReview = async (formData: FormData) => {
  try {
    await baseAPI.post<PostCustomReviewResponse>('/api/v1/community/create', {
      headers: {
        'Content-Type': 'application/json',
      },
      body: formData,
    });
  } catch (error) {
    throw error;
  }
};

export const putEditCustomReview = async ({ id, formData }: { id: number; formData: FormData }) => {
  try {
    await baseAPI.put<PostCustomReviewResponse>(`/api/v1/community/update/${id}`, {
      body: formData,
    });
  } catch (error) {
    throw error;
  }
};

export const deletePostCard = async (postId: number) => {
  try {
    const data = await baseAPI.delete<PostCustomReviewResponse>(`/api/v1/community/delete/${postId}`);
    return data;
  } catch (error) {
    throw error;
  }
};
