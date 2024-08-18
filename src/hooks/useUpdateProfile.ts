import { putEditProfile } from '@/api/usersAPI';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: putEditProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userData'] });
    },
  });
};
