import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import classNames from 'classnames/bind';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

import { getUserData } from '@/api/usersAPI';
import { ROUTER } from '@/constants/route';

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

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <section className={cn('layout')}>
        <div className={cn('page')}>{children}</div>
      </section>
    </HydrationBoundary>
  );
}
