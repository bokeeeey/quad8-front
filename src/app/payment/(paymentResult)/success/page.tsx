import { getUserData } from '@/api/usersAPI';
import { ROUTER } from '@/constants/route';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { redirect } from 'next/navigation';
import CheckoutNavigation from '../../_components/CheckoutNavigation/CheckoutNavigation';
import CheckoutCompleted from './_components/CheckoutCompleted/CheckoutCompleted';

interface SuccessPageProps {
  searchParams: { [key: string]: string };
}

export default async function PaymentSuccessPage({ searchParams }: SuccessPageProps) {
  const queryClient = new QueryClient();
  const { orderId } = searchParams;

  await queryClient.prefetchQuery({ queryKey: ['userData'], queryFn: getUserData });
  const userData = queryClient.getQueryData(['userData']);

  if (!userData) {
    redirect(ROUTER.MAIN);
  }

  if (!orderId) {
    redirect('/not-found');
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CheckoutNavigation isSucceed />
      <CheckoutCompleted />
    </HydrationBoundary>
  );
}
