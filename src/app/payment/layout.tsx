import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import classNames from 'classnames/bind';
import { ReactNode } from 'react';

import { getUserData } from '@/api/usersAPI';
import { UserRouteProvider } from '@/components';

import styles from './layout.module.scss';

const cn = classNames.bind(styles);

interface CheckoutLayoutProps {
  children: ReactNode;
}

export default async function PaymentPageLayout({ children }: CheckoutLayoutProps) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({ queryKey: ['userData'], queryFn: getUserData });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UserRouteProvider>
        <section className={cn('layout')}>
          <div className={cn('page')}>{children}</div>
        </section>
      </UserRouteProvider>
    </HydrationBoundary>
  );
}
