import { getPayment } from '@/api/orderAPI';
import { getAddresses } from '@/api/shippingAPI';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { redirect } from 'next/navigation';
import CheckoutForm from './_components/CheckoutForm/CheckoutForm';
import CheckoutNavigation from './_components/CheckoutNavigation/CheckoutNavigation';

interface PaymentPageProps {
  searchParams: { [key: string]: string };
}

export default async function PaymentPage({ searchParams }: PaymentPageProps) {
  const queryClient = new QueryClient();
  const { orderId } = searchParams;

  if (!orderId) {
    redirect('/not-found');
  }

  await queryClient.prefetchQuery({ queryKey: ['paymentResponse', orderId], queryFn: () => getPayment(orderId) });
  await queryClient.prefetchQuery({ queryKey: ['addressesData'], queryFn: getAddresses });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CheckoutNavigation />
      <CheckoutForm />
    </HydrationBoundary>
  );
}
