import { checkNickname } from '@/api/usersAPI';
import { useMutation } from '@tanstack/react-query';

export const useCheckNickname = () => {
  return useMutation({
    mutationFn: checkNickname,
  });
};
