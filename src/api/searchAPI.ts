import { getCookie } from '@/libs/manageCookie';

const BASE_URL = process.env.NEXT_PUBLIC_KEYDEUK_API_BASE_URL;

export const getSearchSuggestion = async () => {
  try {
    const res = await fetch(`${BASE_URL}/api/v1/search/all/products-name`, {
      cache: 'no-store',
    });
    const { data } = await res.json();
    return data;
  } catch (error) {
    throw error;
  }
};

export const getSearchResult = async (keyword: string, page: number, size = 16) => {
  const token = await getCookie('accessToken');

  try {
    const res = await fetch(`${BASE_URL}/api/v1/search?search=${keyword}&size=${size}&page=${page}`, {
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
      },
    });
    const { data } = await res.json();
    return data;
  } catch (error) {
    throw error;
  }
};
