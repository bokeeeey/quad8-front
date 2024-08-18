import { getOrdersData } from '@/api/orderAPI';
import type { Order } from '@/types/orderType';
import { useQuery } from '@tanstack/react-query';

interface UseOrdersQueryProps {
  page: number;
  startDate: Date | null;
  endDate: Date | null;
}

export const useOrdersQuery = ({ page, startDate, endDate }: UseOrdersQueryProps) => {
  return useQuery<{ data: Order[] }>({
    queryKey: ['ordersResponse'],
    queryFn: () => getOrdersData({ page, size: 100, startDate, endDate }),
  });
};
