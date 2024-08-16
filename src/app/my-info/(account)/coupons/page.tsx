import classNames from 'classnames/bind';
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { getCoupons } from '@/api/couponAPI';
import { MyInfoEmptyCase } from '@/app/my-info/_components';
import CouponList from './_components/CouponList';

import styles from './page.module.scss';

const cn = classNames.bind(styles);

export default async function CouponsPage() {
  const queryClient = new QueryClient();

  const coupons = await queryClient.fetchQuery({
    queryKey: ['coupons'],
    queryFn: getCoupons,
  });

  return (
    <div className={cn('container')}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <header className={cn('title')}>보유 중인 쿠폰</header>
        {coupons && Array.isArray(coupons) && coupons.length > 0 ? (
          <CouponList />
        ) : (
          <MyInfoEmptyCase message='보유 중인 쿠폰이 없습니다.' />
        )}
      </HydrationBoundary>
    </div>
  );
}
