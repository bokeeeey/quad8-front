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

  return (
    <div>
      <ProductDetail productId={localProductId} />
      <DetailTab productId={localProductId} />
    </div>
  );
}
