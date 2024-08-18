import { getCookie } from '@/libs/manageCookie';
import { CouponTypes } from '@/types/couponType';

const BASE_URL = process.env.NEXT_PUBLIC_KEYDEUK_API_BASE_URL;

export const getCoupons = async (): Promise<CouponTypes[] | null> => {
  const token = await getCookie('accessToken');

  if (!token) {
    return null;
  }

  try {
    const res = await fetch(`${BASE_URL}/api/v1/user/coupon`, {
      cache: 'no-cache',
      headers: {
        'Cache-Control': 'no-cache',
        Authorization: `Bearer ${token}`,
      },
    });
    const { data } = await res.json();

    if (res.ok) {
      return data;
    }

    throw new Error(data.message || '쿠폰을 가져오는데 실패하였습니다.');
  } catch (error) {
    throw error;
  }
};
