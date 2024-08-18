import { putAddress } from '@/api/shippingAPI';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUpdateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: putAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addressesData'] });
    },
  });
};
