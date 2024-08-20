import { postAddress } from '@/api/shippingAPI';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useCreateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addressesData'] });
    },
  });
};
