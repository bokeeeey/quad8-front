import { getCookie } from '@/libs/manageCookie';
import type { FieldValues } from 'react-hook-form';

const BASE_URL = process.env.NEXT_PUBLIC_KEYDEUK_API_BASE_URL;

export const postAddress = async (payload: FieldValues) => {
  const token = await getCookie('accessToken');

  try {
    const res = await fetch(`${BASE_URL}/api/v1/shipping/address`, {
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

    throw new Error(result.message || '배송지 추가에 실패 하였습니다.');
  } catch (error) {
    throw error;
  }
};

export const getAddresses = async () => {
  const token = await getCookie('accessToken');

  try {
    const res = await fetch(`${BASE_URL}/api/v1/shipping/address`, {
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

    throw new Error(data.message || '배송지 정보를 가져오지 못했습니다.');
  } catch (error) {
    throw error;
  }
};

export const deleteAddress = async (addressId: number) => {
  const token = await getCookie('accessToken');

  try {
    const res = await fetch(`${BASE_URL}/api/v1/shipping/address/${addressId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await res.json();

    if (res.ok) {
      return result;
    }

    throw new Error(result.message || '배송지 삭제에 실패 하였습니다.');
  } catch (error) {
    throw error;
  }
};

export const putAddress = async (payload: FieldValues) => {
  const token = await getCookie('accessToken');
  const { id, ...rest } = payload;

  try {
    const res = await fetch(`${BASE_URL}/api/v1/shipping/address/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(rest),
    });

    const result = await res.json();

    if (res.ok) {
      return result;
    }

    throw new Error(result.message || '배송지 변경에 실패 하였습니다.');
  } catch (error) {
    throw error;
  }
};
