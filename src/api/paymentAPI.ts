import type { PaymentConfirmRequest, PaymentSuccessResponse } from '@/types/paymentsType';
import { baseAPI } from './interceptor/interceptor';

export const postPaymentConfirm = async (payload: PaymentConfirmRequest) => {
  try {
    await baseAPI.post('/api/v1/payments/confirm', {
      body: JSON.stringify(payload),
    });
  } catch (error) {
    throw error;
  }
};

export const postPaymentSuccess = async (payload: PaymentConfirmRequest) => {
  try {
    const data = await baseAPI.post<PaymentSuccessResponse>('/api/v1/payments/success', {
      body: JSON.stringify(payload),
    });
    return data;
  } catch (error) {
    throw error;
  }
};
