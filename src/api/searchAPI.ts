import type { SearchResultType } from '@/types/searchType';
import { baseAPI } from './interceptor/interceptor';

const BASE_URL = process.env.NEXT_PUBLIC_KEYDEUK_API_BASE_URL;

export const getSearchSuggestion = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/search/all/products-name`, {
      cache: 'no-store',
    });
    const { data, message } = await response.json();
    if (!response.ok) {
      throw new Error(message);
    }
    return data;
  } catch (error) {
    throw error;
  }
};

export const getSearchResult = async (keyword: string, page: number, size = 16) => {
  try {
    const { data } = await baseAPI.get<SearchResultType>(`/api/v1/search?search=${keyword}&size=${size}&page=${page}`, {
      cache: 'no-cache',
    });
    return data;
  } catch (error) {
    throw error;
  }
};
