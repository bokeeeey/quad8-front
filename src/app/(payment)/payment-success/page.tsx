import { getPayment } from '@/api/orderAPI';
import { getUserData } from '@/api/usersAPI';
import { ROUTER } from '@/constants/route';
import { getCookie } from '@/libs/manageCookie';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { redirect } from 'next/navigation';
import CheckoutCompleted from './_components/CheckoutCompleted/CheckoutCompleted';

export default async function PaymentSuccessPage() {
  const queryClient = new QueryClient();
  const orderId = await getCookie('orderId');

  await queryClient.prefetchQuery({ queryKey: ['userData'], queryFn: getUserData });
  const userData = queryClient.getQueryData(['userData']);

  if (!userData || !orderId) {
    redirect(ROUTER.MAIN);
  }

  await queryClient.prefetchQuery({ queryKey: ['paymentResponse'], queryFn: () => getPayment(orderId) });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CheckoutCompleted orderId={orderId} />;
    </HydrationBoundary>
  );
}
