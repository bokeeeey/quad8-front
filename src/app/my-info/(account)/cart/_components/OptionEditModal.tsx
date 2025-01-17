'use client';

import { useQuery } from '@tanstack/react-query';
import classNames from 'classnames/bind';
import { useRef, useState } from 'react';

import { getProductDetail } from '@/api/productAPI';
import { Button, CountInput, CustomImage, Dropdown } from '@/components';
import { IMAGE_BLUR } from '@/constants/blurImage';
import type { OptionChageAPIType } from '@/types/cartType';
import type { ProductType } from '@/types/productType';

import styles from './OptionEditModal.module.scss';

const cn = classNames.bind(styles);

interface OptionEditModalProps {
  id: number;
  productId: number;
  currentCount: number;
  currentOptionId: number | null;
  onClickCancel: () => void;
  onClickEdit: (id: number, data: OptionChageAPIType) => void;
}

export default function OptionEditModal({
  id,
  productId,
  currentCount,
  currentOptionId,
  onClickCancel,
  onClickEdit,
}: OptionEditModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [count, setCount] = useState(currentCount);
  const [optionId, setOptionId] = useState(currentOptionId);

  const notChanged = currentCount === count && currentOptionId === optionId;
  const {
    data: productData,
    isSuccess,
    isError,
  } = useQuery<ProductType>({
    queryKey: ['product', productId],
    queryFn: () => getProductDetail(productId),
  });

  if (!isSuccess) {
    return <div />;
  }

  if (isError) {
    onClickCancel();
  }
  const options = productData.optionList ? productData.optionList.map((option) => option.optionName) : [];

  const handleDropdownChange = (value: string) => {
    if (!productData.optionList) {
      return;
    }
    setOptionId(
      productData.optionList.find((option) => option.optionName === value)?.id ?? productData.optionList[0].id,
    );
  };

  const handleClickEditButton = () => {
    onClickEdit(id, { count, switchOptionId: optionId });
  };

  return (
    <div className={cn('wrapper')}>
      <div className={cn('title')}>주문 수정</div>
      <div className={cn('header-wrapper')}>
        <CustomImage
          alt='상품 이미지'
          src={productData.thubmnailList[0].imgUrl}
          width={104}
          height={104}
          className={cn('image')}
          placeholder={IMAGE_BLUR.placeholder}
          blurDataURL={IMAGE_BLUR.blurDataURL}
        />
        <div className={cn('information-wrapper')}>
          <div className={cn('header-name')}>{productData.name}</div>
          <div className={cn('header-price')}>{productData.price.toLocaleString()}원</div>
        </div>
      </div>
      <div className={cn('option-wrapper', { reverse: !productData.optionList })}>
        {productData.optionList && (
          <Dropdown
            options={options}
            value={
              productData.optionList.find((option) => option.id === optionId)?.optionName ??
              productData.optionList[0].optionName
            }
            onChange={handleDropdownChange}
          />
        )}

        <div className={cn('count-wrapper', { 'white-background': !productData.optionList })}>
          {productData.optionList && (
            <div className={cn('count-title')}>
              {productData.optionList.find((option) => option.id === optionId)?.optionName}
            </div>
          )}
          <div className={cn('option-count')}>
            <CountInput value={count} ref={inputRef} onChange={(value) => setCount(Number(value))} />
          </div>
        </div>
        <div className={cn('cart-wrapper')} />
        <div className={cn('price-wrapper')}>
          <div className={cn('price-text')}>총 상품금액</div>
          <div className={cn('price-number')}>{(productData.price * count).toLocaleString()}원</div>
        </div>
      </div>
      <div className={cn('button-wrapper')}>
        <Button onClick={onClickCancel}>취소</Button>
        <Button
          onClick={handleClickEditButton}
          backgroundColor={notChanged ? 'background-gray-40' : 'background-primary'}
          disabled={notChanged}
        >
          수정 완료
        </Button>
      </div>
    </div>
  );
}
