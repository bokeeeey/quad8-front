'use client';

import classNames from 'classnames/bind';
import { getCoupons } from '@/api/couponAPI';
import { useSuspenseQuery } from '@tanstack/react-query';
import type { CouponTypes } from '@/types/CouponTypes';
import Coupon from './Coupon';

import styles from './CouponList.module.scss';

const cn = classNames.bind(styles);

export default function CouponList() {
  const { data: myCoupons } = useSuspenseQuery({
    queryKey: ['coupons'],
    queryFn: () => getCoupons(),
  });

  return (
    <div className={cn('container')}>
      {myCoupons.map((coupon: CouponTypes) => (
        <Coupon data={coupon} key={coupon.id} />
      ))}
    </div>
  );
}
