export type ThumbnailTypes = {
  id: number;
  imgUrl: string;
};

export type OptionTypes = {
  id: number;
  optionName: string;
};

export interface ProductType {
  id: number;
  name: string;
  price: number;
  reviewscount: number;
  views: number;
  scope: number;
  detailsImg: string;
  thubmnailList: ThumbnailTypes[];
  optionList: OptionTypes[];
  categoryName: 'switch' | 'keyboard' | 'keycap' | 'etc';
  isLiked: boolean;
}

export interface CartProductType {
  productId: number;
  switchOptionId: number | undefined;
  count: number;
}

export interface PostRecentProductsParams {
  uId: number;
  pId: number;
}

export interface RecentProductType {
  productId: number;
  name: string;
  thumbnail: string;
  price: number;
  category: 'switch' | 'keyboard' | 'keycap' | 'etc';
  reviewCount: number;
  liked: boolean;
}
