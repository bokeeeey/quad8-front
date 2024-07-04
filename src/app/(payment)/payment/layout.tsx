import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import classNames from 'classnames/bind';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

import { getUserData } from '@/api/usersAPI';
import { ROUTER } from '@/constants/route';
import CheckoutNavigation from './_components/CheckoutNavigation/CheckoutNavigation';

import styles from './layout.module.scss';

const cn = classNames.bind(styles);

interface CheckoutLayoutProps {
  children: ReactNode;
}

export default async function PaymentPageLayout({ children }: CheckoutLayoutProps) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({ queryKey: ['userData'], queryFn: getUserData });
  const userData = queryClient.getQueryData(['userData']);

  if (!userData) {
    redirect(ROUTER.MAIN);
  }

  // const data = await queryClient.prefetchQuery({ queryKey: ['orderId'] });
  // const orderId = await queryClient.getQueryData(['orderId']);

  // console.log(orderId);

  // await queryClient.prefetchQuery({ queryKey: ['paymentItemData'], queryFn: () => getPaymentItemData(orderId) });

  // if (orderId) {
  //   await queryClient.prefetchQuery({ queryKey: ['paymentItemData'], queryFn: () => getPaymentItemData(orderId) });
  //   const data = queryClient.getQueryData(['paymentItemData']);
  //   console.log(data);
  // }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <section className={cn('layout')}>
        <CheckoutNavigation />
        <div className={cn('page')}>{children}</div>
      </section>
    </HydrationBoundary>
  );
}
