import { getPayment } from '@/api/orderAPI';
import { OrderDetailData } from '@/types/orderType';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';

export const usePaymentQuery = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') || '';

  return useQuery<{ data: OrderDetailData }>({
    queryKey: ['paymentDataResponse', orderId],
    queryFn: () => getPayment(orderId),
    enabled: !!orderId,
    retry: 0,
  });
};
