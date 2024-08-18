import { deleteAddress } from '@/api/shippingAPI';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useDeleteAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addressesData'] });
    },
  });
};
