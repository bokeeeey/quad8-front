import type { CustomKeyboardAPITypes } from './customKeyboardType';

interface NewOrderType {
  productId: number;
  switchOptionId: number | null;
  quantity: number;
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
  switchOption: CustomKeyboardAPITypes;
  viewCount: number;
  price: number;
}

export interface Order {
  orderId: number | string;
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

export interface OrdersRequest {
  page: number;
  size: number;
  startDate: Date | null;
  endDate: Date | null;
}

export interface OrderResponse extends Order {
  shippingAddress: ShippingAddressResponse;
  totalAmount: number;
  paymentOrderId: string;
}
