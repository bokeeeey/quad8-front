'use client';

import { getCoupon } from '@/api/couponAPI';
import type { CouponTypes } from '@/types/couponType';
import { useSuspenseQuery } from '@tanstack/react-query';
import classNames from 'classnames/bind';
import Coupon from './Coupon';

import styles from './CouponList.module.scss';

const cn = classNames.bind(styles);

export default function CouponList() {
  const { data: myCoupons } = useSuspenseQuery({
    queryKey: ['coupons'],
    queryFn: () => getCoupon(),
  });

  return (
    <div className={cn('container')}>
      {myCoupons?.map((coupon: CouponTypes) => <Coupon data={coupon} key={coupon.id} />)}
    </div>
  );
}
