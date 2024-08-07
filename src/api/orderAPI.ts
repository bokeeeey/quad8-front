import { getCookie } from '@/libs/manageCookie';
import type { CreateOrderAPIType, OrderDataRequest } from '@/types/OrderTypes';
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

export const getOrdersData = async ({ page = 0, size = 10, startDate, endDate }: OrderDataRequest) => {
  const token = await getCookie('accessToken');
  const initialDate = new Date();
  const initialStartDate = new Date();
  initialStartDate.setMonth(initialStartDate.getMonth() - 1);

  const formattedStartDate = startDate || initialStartDate.toISOString().split('.')[0];
  const formattedEndDate = endDate || initialDate.toISOString().split('.')[0];

  try {
    const res = await fetch(
      `${BASE_URL}/api/v1/order?page=${page}&size=${size}&startDate=${formattedStartDate}&endDate=${formattedEndDate}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = await res.json();

    if (res.ok) {
      return data;
    }

    throw new Error('에러발생 끼얏호우!');
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export const getPayment = async (orderId?: string) => {
  const token = await getCookie('accessToken');

  try {
    const res = await fetch(`${BASE_URL}/api/v1/order/${orderId}/payment`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (res.ok) {
      return data;
    }

    throw new Error('상품 정보를 가져오는것에 실패하였습니다.');
  } catch (error) {
    throw error;
  }
};

export const putPayment = async (orderId?: string, payload?: FieldValues) => {
  const token = await getCookie('accessToken');

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
