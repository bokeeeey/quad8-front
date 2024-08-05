import { formatDateToQueryString } from '@/libs/formatDateToQueryString';
import { getCookie } from '@/libs/manageCookie';
import type { ProductReviewParams, ProductReviewType, ReviewResponse } from '@/types/ProductReviewTypes';

const BASE_URL = process.env.NEXT_PUBLIC_KEYDEUK_API_BASE_URL;

export const getProductReviews = async (params: ProductReviewParams): Promise<ProductReviewType> => {
  const { productId, sort = 'createdAt', page = 0, size = 10 } = params;
  const token = await getCookie('accessToken');

  try {
    const res = await fetch(
      `${BASE_URL}/api/v1/reviews?productId=${productId}&sort=${sort}&page=${page}&size=${size}`,
      {
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
      },
    );
    const { data } = await res.json();

    return data;
  } catch {
    throw new Error(`상품을 조회할 수 없습니다. `);
  }
};

export const postProductReviews = async ({ productId, formData }: { productId: number; formData: FormData }) => {
  const token = await getCookie('accessToken');

  try {
    await fetch(`${BASE_URL}/api/v1/reviews?productId=${productId}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
  } catch (error) {
    throw error;
  }
};

export const getUserProductReviews = async (params: ProductReviewParams): Promise<ReviewResponse> => {
  const {
    sort = 'createdAt',
    page = '0',
    size = '10',
    startDate = '2024-01-01T00:00:00',
    endDate = formatDateToQueryString('end', new Date()),
  } = params;
  const token = await getCookie('accessToken');

  try {
    const res = await fetch(
      `${BASE_URL}/api/v1/reviews/user?sort=${sort}&page=${page}&size=${size}&startDate=${startDate}&endDate=${endDate}`,
      {
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
      },
    );
    const { data } = await res.json();

    return data;
  } catch {
    throw new Error(`상품을 조회할 수 없습니다. `);
  }
};

export const deleteUserProductReview = async (reviewId: number) => {
  const token = await getCookie('accessToken');

  try {
    await fetch(`${BASE_URL}/api/v1/reviews/${reviewId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    throw error;
  }
};

export const putUserProductReview = async ({ reviewId, formData }: { reviewId: number; formData: FormData }) => {
  const token = await getCookie('accessToken');

  try {
    await fetch(`${BASE_URL}/api/v1/reviews/${reviewId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
  } catch (error) {
    throw error;
  }
};
