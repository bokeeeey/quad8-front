import { getProductDetail } from '@/api/productAPI';
import { getProductReviews } from '@/api/productReviewAPI';
import { ROUTER } from '@/constants/route';
import { ProductType } from '@/types/ProductTypes';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { redirect } from 'next/navigation';
import ProductDetail from './_components/Product/ProductDetail';
import DetailTab from './_components/TabContents/DetailTab';

interface ProductDetailParams {
  params: {
    [param: string]: string;
  };
}

export default async function ProductDetailPage({ params }: ProductDetailParams) {
  const { productId } = params;
  const localProductId = Number(productId);
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['product', productId],
    queryFn: () => getProductDetail(localProductId),
  });

  await queryClient.prefetchQuery({
    queryKey: ['review', productId],
    queryFn: () => getProductReviews({ productId: localProductId }),
  });
  const productDetailData = queryClient.getQueryData(['product', productId]);

  if (!productDetailData) {
    redirect(ROUTER.MAIN);
  }
  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <div>
        <ProductDetail productData={productDetailData as ProductType} />
        <DetailTab productId={localProductId} />
      </div>
    </HydrationBoundary>
  );
}
