import { getPayment } from '@/api/orderAPI';
import { getAddresses } from '@/api/shippingAPI';
import { getUserData } from '@/api/usersAPI';
import { ROUTER } from '@/constants/route';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { redirect } from 'next/navigation';
import CheckoutForm from './_components/CheckoutForm/CheckoutForm';

interface PaymentPageProps {
  searchParams: { [key: string]: string };
}

export default async function PaymentPage({ searchParams }: PaymentPageProps) {
  const queryClient = new QueryClient();
  const { orderId } = searchParams;

  await queryClient.prefetchQuery({ queryKey: ['userData'], queryFn: getUserData });
  const userData = queryClient.getQueryData(['userData']);

  if (!userData) {
    redirect(ROUTER.MAIN);
  }

  await queryClient.prefetchQuery({ queryKey: ['paymentResponse'], queryFn: () => getPayment(orderId) });

  await queryClient.prefetchQuery({ queryKey: ['addressesData'], queryFn: getAddresses });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CheckoutForm />
    </HydrationBoundary>
  );
}
