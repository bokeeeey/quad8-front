import { putPayment } from '@/api/orderAPI';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { FieldValues } from 'react-hook-form';

export const useUpdatePaymentInfo = () => {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') || '';

  return useMutation({
    mutationFn: (payload: FieldValues) => putPayment(orderId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['paymentDataResponse', orderId] });
    },
    retry: 0,
  });
};
