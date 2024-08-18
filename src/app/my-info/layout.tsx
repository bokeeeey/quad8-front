import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import classNames from 'classnames/bind';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

import { getOrdersData } from '@/api/orderAPI';
import { getAddresses } from '@/api/shippingAPI';
import { getUserData } from '@/api/usersAPI';
import { ROUTER } from '@/constants/route';
import { SNB } from './_components';

import styles from './layout.module.scss';

const cn = classNames.bind(styles);

interface MyInfoLayoutProps {
  children: ReactNode;
}

export default async function MyInfoLayout({ children }: MyInfoLayoutProps) {
  const queryClient = new QueryClient();

  const userData = queryClient.fetchQuery({ queryKey: ['userData'], queryFn: getUserData });

  if (!userData) {
    redirect(ROUTER.MAIN);
  }

  await queryClient.prefetchQuery({ queryKey: ['addressesData'], queryFn: getAddresses });
  await queryClient.prefetchQuery({
    queryKey: ['ordersResponse'],
    queryFn: () => getOrdersData({ page: 0, size: 100, startDate: null, endDate: null }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <section className={cn('layout')}>
        <SNB />
        <div className={cn('page')}>{children}</div>
      </section>
    </HydrationBoundary>
  );
}
