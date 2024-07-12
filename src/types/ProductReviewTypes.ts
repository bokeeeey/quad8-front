export interface ReviewImage {
  id: number;
  imageUrl: string;
  reviewId: number;
}

export interface ReviewWriter {
  id: number;
  nickname: string;
  imgUrl: string;
}

export interface ReviewDto {
  id: number;
  orderId: number;
  switchOption: string;
  productCategoryId: number;
  writer: ReviewWriter;
  content: string;
  score: number;
  option1: number;
  option2: number;
  option3: number;
  reviewImgs: ReviewImage[];
  likeCount: number;
  likedByUser: boolean;
  userId: number;
  productId: number;
  updatedAt: Date;
}

export interface ReviewResponse extends ReviewSearchParams {
  reviewDtoList: ReviewDto[];
}

export interface ReviewSearchParams {
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  currentPage: number;
}

export type OptionRatio = Record<string, number>;

export type KeywordStatistics = Record<string, OptionRatio>;

export type ProductReviewPreview = {
  averageScore: number;
  totalElements: number;
  reviewStatistics: KeywordStatistics & { scoreRatios: OptionRatio };
};

export interface ProductReviewType extends ProductReviewPreview {
  reviewDtoList: ReviewDto[];
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  currentPage: number;
}

type Keyword = Record<string, string[]>;

export type ReviewKeywordType = Record<'키보드' | '키캡' | '스위치' | '기타용품', Keyword>;

export interface ProductReviewParams {
  productId?: number;
  sort?: string;
  page?: string;
  size?: string;
  startDate?: string;
  endDate?: string;
}

export interface ReviewParamsType {
  page?: string;
  size?: string;
}
