import type { CustomKeyboardSwitchTypes, CustomKeyboardPointKeyType } from './customKeyboardType';

interface NewOrderType {
  productId: number;
  switchOptionId: number | null;
  quantity: number;
}

interface SwitchOptionType {
  individualColor: Record<string, string>;
  customOption: {
    createdAt: string;
    updatedAt: string;
    id: number;
    layout: string;
    appearanceTexture: string;
    appearanceColor: string;
    baseKeyColor: string;
    keyboardSwitch: CustomKeyboardSwitchTypes;
    hasPointKey: boolean;
    pointKeyType: CustomKeyboardPointKeyType;
    pointSetColor: null | string;
    imgUrl: string;
    price: number;
  };
}

export type CreateOrderAPIType = NewOrderType[];

export interface CreateOrderResponseType {
  status: string;
  message: string;
  data: number;
}

export enum OrderStatus {
  READY = 'READY',
  PAYMENT_COMPLETED = 'PAYMENT_COMPLETED',
  PREPARING = 'PREPARING',
  SHIPPING = 'SHIPPING',
  DELIVERED = 'DELIVERED',
  CANCELED = 'CANCELED',
  CONFIRMED = 'CONFIRMED',
}

export interface OrderItem {
  productId: number;
  productImgUrl: string;
  productName: string;
  quantity: number;
  switchOption: string | SwitchOptionType;
  viewCount: number;
  price: number;
  category?: 'switch' | 'keyboard' | 'keycap' | 'etc';
}

export interface Order {
  orderId: number;
  orderItems: OrderItem[];
  orderStatus: OrderStatus;
  purchaseDate: string;
  confirmationDate: string;
  deliveryMessage: string;
}

export interface ShippingAddressResponse {
  address: string;
  detailAddress: string;
  id: number;
  isDefault: boolean;
  name: string;
  phone: string;
  zoneCode: string;
}

export interface OrderDetailData {
  orderId: number;
  orderItemResponses: OrderItem[];
  paymentOrderId: string;
  shippingAddressResponse: ShippingAddressResponse;
  totalPrice: number;
}

export interface OrderDataRequest {
  page: number;
  size: number;
  startDate: Date | null;
  endDate: Date | null;
}
