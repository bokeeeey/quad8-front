import { getUserData } from '@/api/usersAPI';
import { ROUTER } from '@/constants/route';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { redirect } from 'next/navigation';
import CheckoutNavigation from '../../_components/CheckoutNavigation/CheckoutNavigation';
import CheckoutCompleted from './_components/CheckoutCompleted/CheckoutCompleted';

export default async function SuccessPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({ queryKey: ['userData'], queryFn: getUserData });
  const userData = queryClient.getQueryData(['userData']);

  if (!userData) {
    redirect(ROUTER.MAIN);
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CheckoutNavigation isSucceed />
      <CheckoutCompleted />
    </HydrationBoundary>
  );
}
