import { getOrder } from '@/api/orderAPI';
import type { OrderResponse } from '@/types/orderType';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';

export const useOrderQuery = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') || '';

  return useQuery<{ data: OrderResponse }>({
    queryKey: ['orderResponse', orderId],
    queryFn: () => getOrder(orderId),
  });
};
