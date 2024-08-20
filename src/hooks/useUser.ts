import { getUserData } from '@/api/usersAPI';
import type { UserDataResponseType } from '@/types/userType';
import { useQuery } from '@tanstack/react-query';

export const useUser = () => {
  return useQuery<UserDataResponseType | null>({
    queryKey: ['userData'],
    queryFn: getUserData,
  });
};
