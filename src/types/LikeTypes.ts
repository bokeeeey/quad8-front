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

export interface WishlistPageProps {
  searchParams: { [key: string]: string | undefined };
}
