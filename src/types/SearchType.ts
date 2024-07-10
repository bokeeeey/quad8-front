export interface SuggestionDataType {
  name: string;
  range: number[];
}

interface PageType {
  pageNumber: number;
  pageSize: number;
  sort: Record<'empty' | 'unsorted' | 'sorted', boolean>;
  offset: number;
  unpaged: boolean;
  paged: boolean;
}

interface ContentType {
  productId: number;
  name: string;
  thumbnail: string;
  price: number;
  reviewCount: number;
  category: 'keyboard' | 'keycap' | 'switch' | 'etc';
  liked: boolean;
}

export interface SearchResultType {
  content: ContentType[];
  pageable: PageType;
  totalElements: number;
  totalPage: number;
  last: boolean;
  size: number;
  sort: Record<'empty' | 'unsorted' | 'sorted', boolean>;
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}
