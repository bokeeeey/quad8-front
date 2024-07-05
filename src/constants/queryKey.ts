export const QUERY_KEYS = {
  PRODUCT: {
    ALL: ['all'],
    LISTS: () => [...QUERY_KEYS.PRODUCT.ALL, 'lists'],
    LIST: (filter: string) => [...QUERY_KEYS.PRODUCT.LISTS(), filter],
  },
  LIKE: {
    ALL: ['all'],
    LISTS: () => [...QUERY_KEYS.LIKE.ALL, 'lists'],
  },
};
