import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { ReactNode } from 'react';

import { getCoupon } from '@/api/couponAPI';

interface EventLayoutProps {
  children: ReactNode;
}

export default async function EventPageLayout({ children }: EventLayoutProps) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({ queryKey: ['coupons'], queryFn: getCoupon });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div>{children}</div>
    </HydrationBoundary>
  );
}
