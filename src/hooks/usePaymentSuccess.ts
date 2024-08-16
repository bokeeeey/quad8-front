import { postPaymentSuccess } from '@/api/paymentAPI';
import { ROUTER } from '@/constants/route';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import JSConfetti from 'js-confetti';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface UsePaymentSuccessProps {
  orderId: string;
  paymentKey: string;
  orderIdFromParams: string;
  amount: string;
}

export const usePaymentSuccess = ({ orderId, paymentKey, orderIdFromParams, amount }: UsePaymentSuccessProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const jsConfetti = new JSConfetti();

  const [isConfirmed, setIsConfirmed] = useState(false);

  const paymentSuccessMutation = useMutation({
    mutationFn: () => postPaymentSuccess({ orderId, paymentKey, paymentOrderId: orderIdFromParams, amount }),
    onSuccess: (res) => {
      jsConfetti.addConfetti({ confettiNumber: 500 });

      queryClient.invalidateQueries({ queryKey: ['cartData'] });
      queryClient.invalidateQueries({ queryKey: ['paymentResponse'] });
      queryClient.setQueryData(['paymentSuccessRequest'], res.data);
      localStorage.setItem('paymentSuccessRequest', JSON.stringify(res.data));

      setIsConfirmed(true);
    },
    onError: (error) => {
      router.replace(`${ROUTER.MY_PAGE.CHECKOUT_FAIL}?orderId=${orderId}&message=${error.message}`);
    },
    retry: 0,
  });

  return { paymentSuccessMutation, isConfirmed };
};
