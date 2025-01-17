import { CouponResponse, CreateCouponType } from '@/types/couponType';
import { baseAPI } from './interceptor/interceptor';

export const postCreateCoupon = async (payload: CreateCouponType) => {
  try {
    const data = await baseAPI.post<CouponResponse>('/api/v1/coupon/create', {
      body: JSON.stringify(payload),
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const getCoupon = async (): Promise<CouponResponse[]> => {
  try {
    const { data } = await baseAPI.get<CouponResponse[]>(
      '/api/v1/user/coupon',
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
