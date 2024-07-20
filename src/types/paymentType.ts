export interface PaymentConfirmRequest {
  orderId: string;
  paymentKey: string;
  paymentOrderId: string;
  amount: string;
}
