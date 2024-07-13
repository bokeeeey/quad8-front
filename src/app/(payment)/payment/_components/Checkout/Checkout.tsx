import CheckoutForm from './CheckoutForm/CheckoutForm';

interface CheckoutProps {
  orderId: string;
}

export default function Checkout({ orderId }: CheckoutProps) {
  return <CheckoutForm orderId={orderId} />;
}
