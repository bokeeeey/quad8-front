import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import classNames from 'classnames/bind';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'react-toastify';

import { postCart } from '@/api/cartAPI';
import { getProductDetail } from '@/api/productAPI';
import { Button, CountInput, Dropdown } from '@/components';
import { IMAGE_BLUR } from '@/constants/blurImage';
import type { ProductType } from '@/types/ProductTypes';

import styles from './AddCartModal.module.scss';

const cn = classNames.bind(styles);

interface AddCartModalProps {
  productId: number;
  closeModal: () => void;
}

export default function AddCartModal({ productId, closeModal }: AddCartModalProps) {
  const queryClient = useQueryClient();

  const [optionId, setOptionId] = useState<number>(-1);
  const [count, setCount] = useState(1);

  const { data: productData, isPending: isPendingProductData } = useQuery<ProductType>({
    queryKey: ['product', productId],
    queryFn: () => getProductDetail(productId),
  });

  const { mutate: postCartItem, isPending: isPendingPostCartItem } = useMutation({
    mutationFn: postCart,
    onSuccess: () => {
      toast.success('장바구니에 담겼습니다');
      closeModal();
    },
    onError: () => {
      toast.error('장바구니 담기에 실패하였습니다');
    },
  });

  if (!productData) {
    if (!isPendingProductData) {
      toast.error('해당 상품을 불러올 수 없습니다');
      closeModal();
    }
    return <div />;
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

  const handleClickCancelButton = () => {
    closeModal();
  };

  const handleClickEditButton = () => {
    postCartItem({ productId, count, switchOptionId: optionId });
    queryClient.invalidateQueries({ queryKey: ['cartData'] });
  };

  return (
    <div className={cn('wrapper')}>
      <div className={cn('title')}>장바구니에 담기</div>
      <div className={cn('header-wrapper')}>
        <Image
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
              {productData.optionList.find((option) => option.id === optionId)?.optionName ??
                productData.optionList[0].optionName}
            </div>
          )}
          <div className={cn('option-count')}>
            <CountInput value={count} onChange={(value) => setCount(Number(value))} />
          </div>
        </div>
        <div className={cn('cart-wrapper')} />
        <div className={cn('price-wrapper')}>
          <div className={cn('price-text')}>총 상품금액</div>
          <div className={cn('price-number')}>{(productData.price * count).toLocaleString()}원</div>
        </div>
      </div>
      <div className={cn('button-wrapper')}>
        <Button onClick={handleClickCancelButton}>취소</Button>
        <Button
          onClick={handleClickEditButton}
          disabled={isPendingPostCartItem}
          backgroundColor={isPendingPostCartItem ? 'background-gray-40' : 'background-primary'}
        >
          장바구니 담기
        </Button>
      </div>
    </div>
  );
}
