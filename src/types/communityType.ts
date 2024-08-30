import type { CustomKeyboardPointKeyType, CustomKeyboardSwitchTypes } from '@/types/customKeyboardType';

export interface CommunityParamsType {
  sort: string;
  page?: string;
  size?: string;
}

export interface CommunityPostCardDataType {
  userId: number;
  id: number;
  title: string;
  likeCount: number;
  commentCount: number;
  nickName: string;
  userImage: string | null;
  thumbnail: string | string[];
  isLiked: boolean;
  updateAt: string;
}

export interface CommunityPostListResponse {
  content: CommunityPostCardDataType[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

export interface CommunityAllPostCardDataType {
  content: CommunityPostCardDataType[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

export interface CommunityPostCardDetailDataType extends Omit<CommunityPostCardDataType, 'thumbnail' | 'updateAt'> {
  userId: number;
  comments: CommentType[];
  content: string;
  createdAt: string;
  updatedAt: string;
  reviewImages: { id: number; imgUrl: string }[];
  isLiked: boolean;
  liked: boolean;
  custom: PostCardDetailModalCustomKeyboardType;
}

export interface CommentType {
  id: number;
  nickName: string;
  content: string;
  createdAt: string;
  imgUrl: string | null;
  userId: number;
}

export interface CommentResponseType {
  status: string;
  message: string;
  data: CommunityPostCardDetailDataType;
}

export interface PostCardDetailModalCustomKeyboardType {
  productId: number;
  type: string;
  texture: string;
  boardColor: string;
  switchType: CustomKeyboardSwitchTypes;
  baseKeyColor: string;
  hasPointKeyCap: boolean;
  pointKeyType: CustomKeyboardPointKeyType;
  pointSetColor: string;
  imgUrl: string;
  price: number;
  individualColor: Record<string, string>;
}

export interface PostCustomReviewResponse {
  status: string;
  message: string;
  data: CommunityPostCardDetailDataType;
}
