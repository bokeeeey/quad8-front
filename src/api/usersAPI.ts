import { getCookie } from '@/libs/manageCookie';

const BASE_URL = process.env.NEXT_PUBLIC_KEYDEUK_API_BASE_URL;

export const getUserData = async () => {
  const token = await getCookie('accessToken');

  try {
    const res = await fetch(`${BASE_URL}/api/v1/users/me`, {
      method: 'GET',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (res.ok) {
      return data;
    }

    throw new Error(data.message || '인증에 실패 하였습니다.');
  } catch (error) {
    throw error;
  }
};

export const putEditProfile = async (formData: FormData) => {
  const token = await getCookie('accessToken');

  try {
    const res = await fetch(`${BASE_URL}/api/v1/users/me`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await res.json();

    if (res.ok) {
      return result;
    }

    throw new Error(result.message);
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
