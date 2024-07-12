import { getCookie } from '@/libs/manageCookie';

import type { CreateOrderAPIType } from '@/types/OrderTypes';

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

export const getPaymentData = async (orderId: string | undefined) => {
  const token = await getCookie('accessToken');

  if (!token) {
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
