export interface PaymentConfirmRequest {
  orderId: number;
  paymentKey: string;
  paymentOrderId: string;
  amount: number;
  currency: 'KRW';
}
