import { getCookie } from '@/libs/manageCookie';
import type { PaymentConfirmRequest } from '@/types/paymentsType';

const BASE_URL = process.env.NEXT_PUBLIC_KEYDEUK_API_BASE_URL;

export const postPaymentConfirm = async (payload: PaymentConfirmRequest) => {
  const token = await getCookie('accessToken');

  try {
    const res = await fetch(`${BASE_URL}/api/v1/payments/confirm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json();

    if (res.ok) {
      return result;
    }

    throw new Error(result.message || '결제 진행중 오류가 발생하였습니다. 잠시후 다시 시도해주세요.');
  } catch (error) {
    throw error;
  }
};

export const postPaymentSuccess = async (payload: PaymentConfirmRequest) => {
  const token = await getCookie('accessToken');

  try {
    const res = await fetch(`${BASE_URL}/api/v1/payments/success`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json();

    if (res.ok) {
      return result;
    }

    throw new Error(result.message || '결제 진행중 오류가 발생하였습니다. 잠시후 다시 시도해주세요.');
  } catch (error) {
    throw error;
  }
};
