'use client';

import { formatDateWithDot } from '@/libs/formatDateToString';
import { ProductType } from '@/types/ProductTypes';
import classNames from 'classnames/bind';
import Image from 'next/image';
import Link from 'next/link';
import styles from './MyReviewProduct.module.scss';

const cn = classNames.bind(styles);

interface MyReviewProductProps {
  productId: number;
  updatedAt: Date;
  switchOption: string;
  productData?: ProductType;
}

export default function MyReviewProduct({ productId, updatedAt, switchOption, productData }: MyReviewProductProps) {
  if (!productData) {
    return <div className={cn('no-product-data')}>상품 정보를 불러올 수 없습니다.</div>;
  }

  const { name, thubmnailList, categoryName } = productData;

  return (
    <div className={cn('container')}>
      <div className={cn('top-section')}>
        <h3 className={cn('write-date')}>작성일 : {formatDateWithDot(new Date(updatedAt))}</h3>
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
