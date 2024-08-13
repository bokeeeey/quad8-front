export interface CouponDataType {
  data: CouponResponse;
  status: string;
  message: string;
}

export interface CreateCouponType {
  name: string;
  price: number;
  minPrice: number;
  expiredDate: Date;
  isWelcome: boolean;
}

export interface CouponResponse {
  id: number;
  name: string;
  price: number;
  minPrice: number;
  expiredAt: string;
  isExpired: boolean;
}
