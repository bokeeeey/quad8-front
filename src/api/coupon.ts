import { getCookie } from '@/libs/manageCookie';

const BASE_URL = process.env.NEXT_PUBLIC_KEYDEUK_API_BASE_URL;

export const getCoupons = async () => {
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
    return data;
  } catch (error) {
    throw error;
  }
};
