'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import classNames from 'classnames/bind';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'react-toastify';

import { deleteProductLikes } from '@/api/likesAPI';
import { Dialog, Modal } from '@/components';
import { IMAGE_BLUR } from '@/constants/blurImage';
import { QUERY_KEYS } from '@/constants/queryKey';
import { ROUTER } from '@/constants/route';
import { CartIcon, DeleteIcon } from '@/public/index';
import { ProductLike } from '@/types/likeType';
import AddCartModal from './AddCartModal';
import WishCheckBox from './WishCheckBox';

import styles from './WishItem.module.scss';

const cn = classNames.bind(styles);

interface WishItemProps extends ProductLike {
  checked: boolean;
  onChange: (id: number) => void;
}

export default function WishItem({ productId, productImg, productName, price, checked, onChange }: WishItemProps) {
  const queryClient = useQueryClient();
  const [isOpenAddCartModal, setIsOpenAddCartModal] = useState(false);
  const [isOpenConfirm, setIsOpenConfirm] = useState(false);

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

  const handleDeleteClick = () => {
    deleteWishItem([productId]);
  };

  const handleCartClick = () => {
    setIsOpenAddCartModal(true);
  };

  const handleCloseCartModal = () => {
    setIsOpenAddCartModal(false);
  };

  return (
    <li className={cn('item-container')}>
      <div className={cn('info-area')}>
        <WishCheckBox productId={productId} onChange={onChange} isChecked={checked} />
        <Link href={`${ROUTER.SHOP.ALL}/detail/${productId}`}>
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
        </Link>
      </div>
      <div className={cn('cart-delete')}>
        <button className={cn('cart')} type='button' onClick={handleCartClick}>
          <CartIcon fill='#4968F6' />
        </button>
        <button className={cn('delete')} type='button' onClick={() => setIsOpenConfirm(true)}>
          <DeleteIcon fill='#4968f6' width={30} height={30} />
        </button>
      </div>
      <Modal isOpen={isOpenAddCartModal} onClose={handleCloseCartModal}>
        <AddCartModal productId={productId} closeModal={handleCloseCartModal} />
      </Modal>
      <Dialog
        type='confirm'
        iconType='warn'
        message='찜목록에서 삭제 하시겠습니까?'
        isOpen={isOpenConfirm}
        onClick={{ left: () => setIsOpenConfirm(false), right: handleDeleteClick }}
        buttonText={{ left: '취소', right: '확인' }}
      />
    </li>
  );
}
