import type { CouponTypes } from '@/types/couponType';
import { baseAPI } from './interceptor/interceptor';

export const getCoupons = async () => {
  try {
    const { data } = await baseAPI.get<CouponTypes[]>('/api/v1/user/coupon', {
      cache: 'no-cache',
    });
    return data;
  } catch (error) {
    throw error;
  }
};
