import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import classNames from 'classnames/bind';
import { redirect } from 'next/navigation';

import { getOrder } from '@/api/orderAPI';
import { getUserData } from '@/api/usersAPI';
import { ROUTER } from '@/constants/route';
import OrderDetail from './_components/OrderDetail';

import styles from './page.module.scss';

const cn = classNames.bind(styles);

interface OrderInfoPageProps {
  searchParams: { [key: string]: string };
}

export default async function OrderInfoPage({ searchParams }: OrderInfoPageProps) {
  const { orderId } = searchParams;
  const queryClient = new QueryClient();

  const userData = queryClient.fetchQuery({ queryKey: ['userData'], queryFn: getUserData });

  if (!userData) {
    redirect(ROUTER.MAIN);
  }

  await queryClient.prefetchQuery({ queryKey: ['orderResponse', orderId], queryFn: () => getOrder(orderId) });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <section className={cn('page')}>
        <OrderDetail />
      </section>
    </HydrationBoundary>
  );
}
