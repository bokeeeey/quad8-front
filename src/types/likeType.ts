export interface ProductLike {
  productId: number;
  productImg: string;
  productName: string;
  price: number;
}

export interface GetProductLikesParams {
  page?: string;
  size?: string;
}

export interface ProductLikeResponse {
  likedProductsResponses: ProductLike[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  first: boolean;
  last: boolean;
}

export interface CommunityLikeResponse {
  id: number;
  userId: number;
  communityId: number;
}

export interface CommunityDeleteLikeResponse {
  status: string;
  message: string;
  data: number;
}

export interface WishlistPageProps {
  searchParams: { [key: string]: string | undefined };
}
