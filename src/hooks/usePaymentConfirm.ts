import { postPaymentConfirm } from '@/api/paymentAPI';
import { ROUTER } from '@/constants/route';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

interface UsePaymentConfirmProps {
  orderId: string;
  paymentKey: string;
  orderIdFromParams: string;
  amount: string;
  postPaymentSuccessMutation: () => void;
}

export const usePaymentConfirm = ({
  orderId,
  paymentKey,
  orderIdFromParams,
  amount,
  postPaymentSuccessMutation,
}: UsePaymentConfirmProps) => {
  const router = useRouter();

  return useMutation({
    mutationFn: () => postPaymentConfirm({ orderId, paymentKey, paymentOrderId: orderIdFromParams, amount }),
    onSuccess: () => {
      postPaymentSuccessMutation();
    },
    onError: (error) => {
      router.replace(`${ROUTER.MY_PAGE.CHECKOUT_FAIL}?orderId=${orderId}&message=${error.message}`);
    },
    retry: 0,
  });
};
