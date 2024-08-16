import type { FieldValues } from 'react-hook-form';
import type { UserAddress } from '@/types/shippingType';
import { baseAPI } from './interceptor/interceptor';

export const postAddress = async (payload: FieldValues) => {
  try {
    await baseAPI.post('/api/v1/shipping/address', {
      body: JSON.stringify(payload),
    });
  } catch (error) {
    throw error;
  }
};

export const getAddresses = async () => {
  try {
    const data = await baseAPI.get<UserAddress[]>('/api/v1/shipping/address');
    return data;
  } catch (error) {
    throw error;
  }
};

export const deleteAddress = async (addressId: number) => {
  try {
    await baseAPI.delete(`/api/v1/shipping/address/${addressId}`);
  } catch (error) {
    throw error;
  }
};

export const putAddress = async (payload: FieldValues) => {
  const { id, ...rest } = payload;

  try {
    await baseAPI.put(`/api/v1/shipping/address/${id}`, {
      body: JSON.stringify(rest),
    });
  } catch (error) {
    throw error;
  }
};
