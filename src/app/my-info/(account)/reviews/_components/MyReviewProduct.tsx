'use client';

import { getProductDetail } from '@/api/productAPI';
import { formatDateToString } from '@/libs/formatDateToString';
import { ProductType } from '@/types/ProductTypes';
import { useQuery } from '@tanstack/react-query';
import classNames from 'classnames/bind';
import Image from 'next/image';
import Link from 'next/link';
import styles from './MyReviewProduct.module.scss';

const cn = classNames.bind(styles);

interface MyReviewProductProps {
  productId: number;
  updatedAt: Date;
  switchOption: string;
}

export default function MyReviewProduct({ productId, updatedAt, switchOption }: MyReviewProductProps) {
  const { data: productDetailData } = useQuery<ProductType>({
    queryKey: ['product-detail', productId],
    queryFn: () => getProductDetail(productId.toString()),
  });

  if (!productDetailData) return null;

  const { name, thubmnailList, categoryName } = productDetailData;

  return (
    <div className={cn('container')}>
      <div className={cn('top-section')}>
        <h3 className={cn('write-date')}>작성일 : {formatDateToString(new Date(updatedAt))}</h3>
        <div className={cn('button-section')}>
          <h2>수정</h2>
          <h2>삭제</h2>
        </div>
      </div>
      <Link href={`/shop/${categoryName}/${productId}`}>
        <div className={cn('product-section')}>
          <Image
            className={cn('image')}
            src={thubmnailList[0].imgUrl}
            width={104}
            height={104}
            alt='리뷰 상품 이미지'
          />
          <div className={cn('product-detail')}>
            <h1 className={cn('name')}>{name}</h1>
            <h2 className={cn('option')}>{switchOption}</h2>
          </div>
        </div>
      </Link>
    </div>
  );
}
