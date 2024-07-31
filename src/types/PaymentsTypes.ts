import { OrderItem, ShippingAddressResponse } from './OrderTypes';

interface PaymentResponse {
  id: number;
  orderId: number;
  paymentOrderId: string;
  paymentKey: string;
  method: string;
  totalAmount: number;
  status: string;
  requestedAt: string;
  approvedAt: string;
  lastTransactionKey: string;
}

interface OrderDetailResponse {
  orderId: number;
  orderItems: OrderItem[];
  shippingAddress: ShippingAddressResponse;
  deliveryMessage: string;
  totalAmount: number;
  purchaseDate: string;
  confirmationDate: string;
}

export interface PaymentConfirmRequest {
  orderId: string;
  paymentKey: string;
  paymentOrderId: string;
  amount: string;
}

export interface PaymentSuccessRequest {
  paymentResponse: PaymentResponse;
  orderDetailResponse: OrderDetailResponse;
}
