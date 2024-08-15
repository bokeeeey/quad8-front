import type { CustomKeyboardAPITypes } from './customKeyboardType';
import type { CategoryNameType } from './productType';

interface CustomDataType extends Omit<CustomKeyboardAPITypes, 'imgBase64' | 'option'> {
  id: number;
  productId: number;
  imgUrl: string;
  classification: 'CUSTOM';
}

export interface ShopDataType {
  id: number;
  productId: number;
  optionId: number | null;
  optionName: string | null;
  price: number;
  productTitle: string;
  thumbsnail: string;
  count: number;
  classification: 'SHOP';
  category: CategoryNameType;
}

export interface CartAPIDataType {
  CUSTOM: CustomDataType[];
  SHOP: ShopDataType[];
  totalCount: number;
}

export interface OptionChageAPIType {
  count: number;
  switchOptionId: number | null;
}

export interface CustomCardProps {
  type: 'custom';
  cardData: CustomDataType;
}

export interface ShopCardProps {
  type: 'shop';
  cardData: ShopDataType;
}
