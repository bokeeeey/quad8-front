import { getUserData } from '@/api/usersAPI';
import type { Users } from '@/types/userType';
import { useQuery } from '@tanstack/react-query';

export const useUser = () => {
  return useQuery<{ data: Users }>({
    queryKey: ['userData'],
    queryFn: getUserData,
  });
};
