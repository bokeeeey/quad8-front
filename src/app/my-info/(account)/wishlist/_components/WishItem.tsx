'use client';

import { postCart } from '@/api/cartAPI';
import { deleteProductLikes } from '@/api/likesAPI';
import { Dialog } from '@/components';
import { IMAGE_BLUR } from '@/constants/blurImage';
import { QUERY_KEYS } from '@/constants/queryKey';
import { CartIcon, DeleteIcon } from '@/public/index';
import { ProductLike } from '@/types/LikeTypes';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import classNames from 'classnames/bind';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'react-toastify';
import WishCheckBox from './WishCheckBox';
import styles from './WishItem.module.scss';

const cn = classNames.bind(styles);

interface WishItemProps extends ProductLike {
  checked: boolean;
  onChange: (id: number) => void;
}

export default function WishItem({ productId, productImg, productName, price, checked, onChange }: WishItemProps) {
  const queryClient = useQueryClient();

  const [isOpenConfirm, setIsOpenConfirm] = useState(false);
  const [isOpenCartAlert, setIsOpenCartAlert] = useState(false);

  const { mutate: deleteWishItem } = useMutation({
    mutationFn: deleteProductLikes,
    onSuccess: () => {
      toast.success('찜을 삭제했습니다.');
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.LIKE.LISTS(),
      });

      setIsOpenConfirm(false);
    },
  });

  const { mutate: postCartItem } = useMutation({
    mutationFn: postCart,
    onSuccess: () => {
      setIsOpenCartAlert(true);
    },
  });

  const handleDeleteClick = () => {
    deleteWishItem(productId);
  };

  const handleCartClick = () => {
    postCartItem({
      productId,
      count: 1,
      switchOptionId: undefined,
    });
  };

  return (
    <li className={cn('item-container')}>
      <div className={cn('info-area')}>
        <WishCheckBox productId={productId} onChange={onChange} isChecked={checked} />
        <div className={cn('info-wrap')}>
          <div className={cn('img')}>
            <Image
              src={productImg}
              alt={productName}
              placeholder={IMAGE_BLUR.placeholder}
              blurDataURL={IMAGE_BLUR.blurDataURL}
              fill
            />
          </div>
          <div>
            <h3 className={cn('name')}>{productName}</h3>
            <span className={cn('price')}>{price.toLocaleString()}원</span>
          </div>
        </div>
      </div>
      <div className={cn('cart-delete')}>
        <button className={cn('cart')} type='button' onClick={handleCartClick}>
          <CartIcon fill='#4968F6' />
        </button>
        <button className={cn('delete')} type='button' onClick={() => setIsOpenConfirm(true)}>
          <DeleteIcon fill='#4968f6' width={30} height={30} />
        </button>
      </div>
      <Dialog
        type='confirm'
        iconType='warn'
        message='상품 찜목록에서 삭제 하시겠습니까?'
        isOpen={isOpenConfirm}
        onClick={{ left: () => setIsOpenConfirm(false), right: handleDeleteClick }}
        buttonText={{ left: '취소', right: '확인' }}
      />
      <Dialog
        type='alert'
        iconType='accept'
        message='장바구니에 담겼습니다.'
        isOpen={isOpenCartAlert}
        onClick={() => setIsOpenCartAlert(false)}
        buttonText='확인'
      />
    </li>
  );
}
