import { getAddresses } from '@/api/shippingAPI';
import type { UserAddress } from '@/types/shippingType';
import { useQuery } from '@tanstack/react-query';

export const useAddresses = () => {
  return useQuery<{ data: UserAddress[] }>({
    queryKey: ['addressesData'],
    queryFn: getAddresses,
  });
};
