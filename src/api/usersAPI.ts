import type { Users } from '@/types/userType';
import { baseAPI } from './interceptor/interceptor';

const BASE_URL = process.env.NEXT_PUBLIC_KEYDEUK_API_BASE_URL;

export const getUserData = async () => {
  try {
    const data = await baseAPI.get<Users>('/api/v1/users/me', {
      cache: 'no-cache',
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const putEditProfile = async (formData: FormData) => {
  try {
    await baseAPI.put('/api/v1/users/me', {
      body: formData,
    });
  } catch (error) {
    throw error;
  }
};

export const checkNickname = async (nickname: string) => {
  try {
    const res = await fetch(`${BASE_URL}/api/v1/users/check/nickname?nickname=${nickname}`);

    const result = await res.json();

    if (res.ok) {
      return result;
    }

    throw new Error(result.message || '이미 사용중인 닉네임 입니다.');
  } catch (error) {
    throw error;
  }
};

export const getOthersInfo = async (userId: number) => {
  try {
    const res = await fetch(`${BASE_URL}/api/v1/users/${userId}`);
    const { data } = await res.json();
    return data;
  } catch (error) {
    throw error;
  }
};
