import type { GetProductLikesParams, ProductLikeResponse } from '@/types/likeType';
import { baseAPI } from './interceptor/interceptor';

export const postProductLikes = async (productId: number) => {
  try {
    await baseAPI.post(`/api/v1/likes/${productId}`);
  } catch (error) {
    throw error;
  }
};

export async function getProductLikes({ page, size }: GetProductLikesParams) {
  try {
    const { data } = await baseAPI.get<ProductLikeResponse>(`/api/v1/likes/products?page=${page}&size=${size}`, {
      cache: 'no-cache',
    });
    return data;
  } catch (error) {
    throw error;
  }
}

export const deleteProductLikes = async (productIds: number[]) => {
  try {
    await baseAPI.delete('/api/v1/likes', {
      body: JSON.stringify({ productIds }),
    });
  } catch (error) {
    throw error;
  }
};

export const postCommunityLikes = async (communityId: number) => {
  try {
    await baseAPI.post(`/api/v1/community/likes/${communityId}`);
  } catch (error) {
    throw error;
  }
};

export const deleteCommunityLikes = async (communityId: number) => {
  try {
    await baseAPI.delete(`/api/v1/community/likes/${communityId}`);
  } catch (error) {
    throw error;
  }
};

export const postReviewLikes = async (reviewId: number) => {
  try {
    await baseAPI.post(`/api/v1/reviews/likes/${reviewId}`);
  } catch (error) {
    throw error;
  }
};

export const deleteReviewLikes = async (reviewId: number) => {
  try {
    await baseAPI.delete(`/api/v1/reviews/likes/${reviewId}`);
  } catch (error) {
    throw error;
  }
};
