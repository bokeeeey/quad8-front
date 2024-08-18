import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { usePaymentConfirm } from './usePaymentConfirm';
import { usePaymentSuccess } from './usePaymentSuccess';

export const usePaymentProcess = () => {
  const searchParams = useSearchParams();

  const orderId = searchParams.get('paymentOrderId') || '';
  const orderIdFromParams = searchParams.get('orderId') || '';
  const paymentKey = searchParams.get('paymentKey') || '';
  const amount = searchParams.get('amount') || '';

  const {
    paymentSuccessMutation: { mutate: postPaymentSuccessMutation },
    isConfirmed,
  } = usePaymentSuccess({ orderId, orderIdFromParams, paymentKey, amount });

  const { mutate: postPaymentConfirmMutation } = usePaymentConfirm({
    orderId,
    orderIdFromParams,
    paymentKey,
    amount,
    postPaymentSuccessMutation,
  });

  useEffect(() => {
    if (orderId && paymentKey && orderIdFromParams && amount) {
      postPaymentConfirmMutation();
    }
  }, [amount, orderId, orderIdFromParams, paymentKey, postPaymentConfirmMutation]);

  return { isConfirmed };
};
