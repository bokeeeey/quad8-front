import { postCreateCoupon } from '@/api/couponAPI';
import { useEventAlarmStore } from '@/store/alarmStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { SetStateAction } from 'react';
import { toast } from 'react-toastify';

export const useCreateCouponMutation = (setIsModalOpen?: (value: SetStateAction<boolean>) => void) => {
  const queryClient = useQueryClient();
  const addAlarm = useEventAlarmStore((state) => state.addAlarm);

  return useMutation({
    mutationFn: postCreateCoupon,
    onSuccess: (res) => {
      if (setIsModalOpen) {
        setIsModalOpen(true);
        return;
      }
      toast.success('쿠폰이 발행됐습니다.');
      queryClient.invalidateQueries({
        queryKey: ['coupons'],
      });
      addAlarm({
        id: Math.random() * 10 ** 16,
        message: `'${res.name}'이 쿠폰함에 들어갔습니다`,
        type: 'EVENT',
        isRead: false,
        relatedId: res.id,
        createdAt: new Date().toString(),
      });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
};
