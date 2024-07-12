import { getCookie } from '@/libs/manageCookie';
import { GetProductLikesParams, ProductLike } from '@/types/LikeTypes';

const BASE_URL = process.env.NEXT_PUBLIC_KEYDEUK_API_BASE_URL;

export const postProductLikes = async (productId: number) => {
  const token = await getCookie('accessToken');

  try {
    await fetch(`${BASE_URL}/api/v1/likes/${productId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    throw error;
  }
};

export async function getProductLikes({ page, size }: GetProductLikesParams): Promise<ProductLike[]> {
  const token = await getCookie('accessToken');

  try {
    const response = await fetch(`${BASE_URL}/api/v1/likes/products?page=${page}&size=${size}`, {
      cache: 'no-cache',
      headers: {
        'Cache-Control': 'no-cache',
        Authorization: token ? `Bearer ${token}` : '',
      },
    });
    const rawData = await response.json();

    return rawData.data;
  } catch (error) {
    throw error;
  }
}

export const deleteProductLikes = async (productId: number[]) => {
  const token = await getCookie('accessToken');

  try {
    await fetch(`${BASE_URL}/api/v1/likes`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        productIds: productId,
      }),
    });
  } catch (error) {
    throw error;
  }
};

export const postCommunityLikes = async (communityId: number) => {
  const token = await getCookie('accessToken');

  try {
    await fetch(`${BASE_URL}/api/v1/community/likes/${communityId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    throw error;
  }
};

export const deleteCommunityLikes = async (communityId: number) => {
  const token = await getCookie('accessToken');

  try {
    await fetch(`${BASE_URL}/api/v1/community/likes/${communityId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    throw error;
  }
};

export const postReviewLikes = async (reviewId: number) => {
  const token = await getCookie('accessToken');

  try {
    await fetch(`${BASE_URL}/api/v1/reviews/likes/${reviewId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    throw error;
  }
};

export const deleteReviewLikes = async (reviewId: number) => {
  const token = await getCookie('accessToken');

  try {
    await fetch(`${BASE_URL}/api/v1/reviews/likes/${reviewId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    throw error;
  }
};
