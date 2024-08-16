import { postCreateCoupon } from '@/api/couponAPI';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { SetStateAction } from 'react';
import { toast } from 'react-toastify';

export const useCreateCouponMutation = (setIsModalOpen?: (value: SetStateAction<boolean>) => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postCreateCoupon,
    onSuccess: () => {
      if (setIsModalOpen) {
        setIsModalOpen(true);
        return;
      }
      toast.success('쿠폰이 발행됐습니다.');
      queryClient.invalidateQueries({
        queryKey: ['coupons'],
      });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
};
