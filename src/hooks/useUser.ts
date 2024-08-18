import { getUserData } from '@/api/usersAPI';
import { useQuery } from '@tanstack/react-query';

export const useUser = () => {
  return useQuery({
    queryKey: ['userData'],
    queryFn: getUserData,
  });
};
