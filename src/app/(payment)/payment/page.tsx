import { getPayment } from '@/api/orderAPI';
import { getAddresses } from '@/api/shippingAPI';
import { getUserData } from '@/api/usersAPI';
import { ROUTER } from '@/constants/route';
import { getCookie } from '@/libs/manageCookie';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { redirect } from 'next/navigation';
import Checkout from './_components/Checkout/Checkout';

export default async function PaymentPage() {
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
      <Checkout orderId={orderId} />
    </HydrationBoundary>
  );
}
