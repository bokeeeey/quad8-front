import { getCookie } from '@/libs/manageCookie';
import type { CreateOrderAPIType } from '@/types/OrderTypes';
import { FieldValues } from 'react-hook-form';

const BASE_URL = process.env.NEXT_PUBLIC_KEYDEUK_API_BASE_URL;

export const postCreateOrder = async (orderData: CreateOrderAPIType) => {
  const token = await getCookie('accessToken');
  try {
    const res = await fetch(`${BASE_URL}/api/v1/order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    });
    const data = await res.json();

    return data;
  } catch (error) {
    throw error;
  }
};

export const getOrdersData = async () => {
  const token = await getCookie('accessToken');

  if (!token) {
    return null;
  }

  try {
    const res = await fetch(
      `${BASE_URL}/api/v1/order?page=0&size=10&startDate=2024-07-01T00:00:00&endDate=2024-07-30T23:59:59`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = await res.json();

    if (data.status === 'FAIL') {
      return null;
    }

    return data;
  } catch (error) {
    throw error;
  }
};

export const getPayment = async (orderId?: string) => {
  const token = await getCookie('accessToken');

  if (!token || !orderId) {
    return null;
  }

  try {
    const res = await fetch(`${BASE_URL}/api/v1/order/${orderId}/payment`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (data.status === 'FAIL') {
      return null;
    }

    return data;
  } catch (error) {
    throw error;
  }
};

export const putPayment = async (orderId?: string, payload?: FieldValues) => {
  const token = await getCookie('accessToken');

  if (!token) {
    return null;
  }

  try {
    const res = await fetch(`${BASE_URL}/api/v1/order/${orderId}/payment`, {
      method: 'PUT',
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

    throw new Error(result.message || '결제 진행중 문제가 발생하였습니다.');
  } catch (error) {
    throw error;
  }
};
