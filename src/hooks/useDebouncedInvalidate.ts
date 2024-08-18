import { useQueryClient } from '@tanstack/react-query';
import { debounce } from 'lodash';
import { useMemo } from 'react';

interface UseDebouncedInvalidateProps {
  queryKey: string;
  delay: number;
}

export const useDebouncedInvalidate = ({ queryKey, delay }: UseDebouncedInvalidateProps) => {
  const queryClient = useQueryClient();

  return useMemo(
    () =>
      debounce(() => {
        queryClient.invalidateQueries({ queryKey: [queryKey] });
      }, delay),
    [delay, queryClient, queryKey],
  );
};
