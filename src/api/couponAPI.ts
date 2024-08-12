import { getCookie } from '@/libs/manageCookie';
import { CouponResponse, CreateCouponType } from '@/types/couponTypes';

const BASE_URL = process.env.NEXT_PUBLIC_KEYDEUK_API_BASE_URL;

export const postCreateCoupon = async (payload: CreateCouponType) => {
  const token = await getCookie('accessToken');

  try {
    const response = await fetch(`${BASE_URL}/api/v1/coupon/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const errorData = await response.json(); // 서버에서 반환된 에러 메시지를 추출
      throw new Error(errorData.message || '쿠폰 생성에 실패했습니다.'); // 에러 메시지를 포함시켜 에러 던지기
    }

    return response;
  } catch (error) {
    throw error;
  }
};

export const getCoupon = async (): Promise<CouponResponse[]> => {
  const token = await getCookie('accessToken');

  try {
    const response = await fetch(`${BASE_URL}/api/v1/user/coupon`, {
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
};
