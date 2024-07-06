export interface ProductLike {
  productId: number; // 제품 ID
  productImg: string; // 제품 이미지 URL
  productName: string; // 제품 이름
  price: number; // 제품 가격
}

// export interface GetProductLikesResponse {
//   status: string; // 응답 상태
//   message: string | null; // 응답 메시지
//   data: ProductLike[]; // 좋아요한 제품 리스트
// }

export interface GetProductLikesParams {
  page?: string;
  size?: string;
}

export interface WishlistPageProps {
  searchParams: { [key: string]: string | undefined };
}
