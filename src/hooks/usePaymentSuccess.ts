import { postPaymentSuccess } from '@/api/paymentAPI';
import { ROUTER } from '@/constants/route';
import { useProductAlarmStore } from '@/store/alarmStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import JSConfetti from 'js-confetti';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import type { AlarmDataType } from '@/types/alarmType';

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

  const addAlarm = useProductAlarmStore((state) => state.addAlarm);

  const paymentSuccessMutation = useMutation({
    mutationFn: () => postPaymentSuccess({ orderId, paymentKey, paymentOrderId: orderIdFromParams, amount }),
    onSuccess: (res) => {
      jsConfetti.addConfetti({ confettiNumber: 500 });

      queryClient.invalidateQueries({ queryKey: ['cartData'] });
      queryClient.invalidateQueries({ queryKey: ['paymentResponse'] });
      queryClient.setQueryData(['paymentSuccessResponse'], res.data);
      localStorage.setItem('paymentSuccessResponse', JSON.stringify(res.data));

      const { orderId: relatedId } = res.data.paymentResponse;
      const newAlarm = {
        id: Math.floor(Math.random() * 10 ** 32),
        message: '결제가 완료되었습니다.',
        type: 'PRODUCT_ORDER',
        isRead: false,
        relatedId,
        createdAt: new Date().toString(),
      } as AlarmDataType;
      addAlarm(newAlarm);
      setIsConfirmed(true);
    },
    onError: (error) => {
      router.replace(`${ROUTER.MY_PAGE.CHECKOUT_FAIL}?orderId=${orderId}&message=${error.message}`);
    },
    retry: 0,
  });

  return { paymentSuccessMutation, isConfirmed };
};
