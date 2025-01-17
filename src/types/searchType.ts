import type { CategoryNameType } from './productType';

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

export interface ContentType {
  productId: number;
  name: string;
  thumbnail: string;
  price: number;
  reviewCount: number;
  category: CategoryNameType;
  liked: boolean;
}

export interface SearchResultType {
  content: ContentType[];
  pageable: PageType;
  totalElements: number;
  totalPages: number;
  last: boolean;
  size: number;
  number: number;
  sort: Record<'empty' | 'unsorted' | 'sorted', boolean>;
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}
