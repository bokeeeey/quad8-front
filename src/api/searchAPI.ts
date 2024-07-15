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
