import classNames from 'classnames/bind';
import Link from 'next/link';
import { useState } from 'react';

import { Modal, WriteEditModal } from '@/components';
import { ROUTER } from '@/constants/route';
import { formatDateToString } from '@/libs/formatDateToString';
import { ChevronIcon } from '@/public/index';
import type { Order } from '@/types/orderType';
import OrderItem from './OrderItem/OrderItem';

import styles from './OrderItemList.module.scss';

const cn = classNames.bind(styles);

const PRODUCT_DATA = {
  productId: 125,
  orderId: 188,
  option: '바이올렛축',
  productImgUrl: 'https://cdn.imweb.me/thumbnail/20220404/12007f769b366.jpg',
  productName: '게이트론 무보강 스테빌라이저(스크류/나사 체결)',
};

interface OrderItemListProps {
  order: Order;
}

export default function OrderItemList({ order }: OrderItemListProps) {
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const { confirmationDate, purchaseDate, orderStatus, orderItems, orderId } = order;

  const formmattedPurchaseDate = formatDateToString(new Date(purchaseDate));
  const formmattedConfirmationDate = formatDateToString(new Date(confirmationDate));

  const isPaymented = orderStatus !== 'READY';

  const handleEditReviewClick = () => {
    setIsReviewModalOpen((prevOpen) => !prevOpen);
  };

  const handleSuccessReview = () => {
    setIsReviewModalOpen(false);
  };

  return (
    <>
      <article className={cn('order')}>
        <div className={cn('order-header')}>
          <h2>{formmattedPurchaseDate}</h2>
          {isPaymented && (
            <Link className={cn('header-button')} href={`${ROUTER.MY_PAGE.ORDER_INFO}?orderId=${orderId}`}>
              주문 상세보기
              <ChevronIcon className={cn('header-link-icon')} />
            </Link>
          )}
        </div>
        <div className={cn('order-item-list')}>
          {orderItems.map((orderItem) => (
            <OrderItem
              key={orderItem.productId}
              orderItem={orderItem}
              confirmationDate={formmattedConfirmationDate}
              orderStatus={orderStatus}
              handleEditReviewClick={handleEditReviewClick}
            />
          ))}
        </div>
      </article>

      <Modal isOpen={isReviewModalOpen} onClose={() => setIsReviewModalOpen(false)}>
        <WriteEditModal reviewType='productReview' onSuccessReview={handleSuccessReview} productData={PRODUCT_DATA} />
      </Modal>
    </>
  );
}
