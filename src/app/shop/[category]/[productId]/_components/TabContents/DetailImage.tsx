import { getProductDetail } from '@/api/productAPI';
import { IMAGE_BLUR } from '@/constants/blurImage';
import { keydeukImg } from '@/public/index';
import { useQuery } from '@tanstack/react-query';
import classNames from 'classnames/bind';
import Image from 'next/image';
import styles from './DetailImage.module.scss';

const cn = classNames.bind(styles);

interface DetailImageProps {
  productId: number;
}

export default function DetailImage({ productId }: DetailImageProps) {
  const { data: productData } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => getProductDetail(productId),
  });

  return (
    <div>
      <Image
        className={cn('detail-image')}
        src={productData?.detailsImg || keydeukImg}
        width={600}
        height={500}
        alt='상품 설명 이미지'
        placeholder={IMAGE_BLUR.placeholder}
        blurDataURL={IMAGE_BLUR.blurDataURL}
      />
    </div>
  );
}
