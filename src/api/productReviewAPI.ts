import { getCookie } from '@/libs/manageCookie';
import type { ProductReviewParams, ProductReviewType, ReviewDto } from '@/types/ProductReviewTypes';

export const getProductReviews = async (params: ProductReviewParams): Promise<ProductReviewType> => {
  const { productId, sort = 'likes', page = 0, size = 10 } = params;
  const token = await getCookie('accessToken');

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_KEYDEUK_API_BASE_URL}/api/v1/reviews?productId=${productId}&sort=${sort}&page=${page}&size=${size}`,
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

export const getUserProductReviews = async (params: ProductReviewParams): Promise<ReviewDto[]> => {
  const {
    sort = 'createdAt',
    page = 0,
    size = 10,
    startDate = '2024-01-01T00:00:00',
    endDate = '2024-12-31T23:59:59',
  } = params;
  const token = await getCookie('accessToken');

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_KEYDEUK_API_BASE_URL}/api/v1/reviews/user?sort=${sort}&page=${page}&size=${size}&startDate=${startDate}&endDate=${endDate}`, //= 2024-01-01T00%3A00%3A00&endDate=2024-12-31T23%3A59%3A59`,
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

  if (!token) {
    return null;
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_KEYDEUK_API_BASE_URL}/api/v1/community/update/${productId}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    const data = await res.json();
    return data;
  } catch (error) {
    throw error;
  }
};
