import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import classNames from 'classnames/bind';
import { ReactNode } from 'react';

import { getPayment } from '@/api/orderAPI';
import { getAddresses } from '@/api/shippingAPI';
import { getUserData } from '@/api/usersAPI';
import { ROUTER } from '@/constants/route';
import { getCookie } from '@/libs/manageCookie';
import { redirect } from 'next/navigation';
import CheckoutNavigation from './_components/CheckoutNavigation/CheckoutNavigation';

import styles from './layout.module.scss';

const cn = classNames.bind(styles);

interface CheckoutLayoutProps {
  children: ReactNode;
}

export default async function PaymentPageLayout({ children }: CheckoutLayoutProps) {
  const queryClient = new QueryClient();
  const orderId = await getCookie('orderId');

  await queryClient.prefetchQuery({ queryKey: ['userData'], queryFn: getUserData });
  const userData = queryClient.getQueryData(['userData']);

  if (!userData || !orderId) {
    redirect(ROUTER.MAIN);
  }

  await queryClient.prefetchQuery({ queryKey: ['paymentResponse'], queryFn: () => getPayment(orderId) });

  await queryClient.prefetchQuery({ queryKey: ['addressesData'], queryFn: getAddresses });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <section className={cn('layout')}>
        <CheckoutNavigation />
        <div className={cn('page')}>{children}</div>
      </section>
    </HydrationBoundary>
  );
}
