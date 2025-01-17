import classNames from 'classnames/bind';
import Link from 'next/link';

import { ROUTER } from '@/constants/route';
import { formatDateWithDot } from '@/utils/formatDateToString';
import { ChevronIcon } from '@/public/index';
import type { Order } from '@/types/orderType';
import OrderItem from './OrderItem/OrderItem';

import styles from './OrderItemList.module.scss';

const cn = classNames.bind(styles);

interface OrderItemListProps {
  order: Order;
}

export default function OrderItemList({ order }: OrderItemListProps) {
  const { confirmationDate, purchaseDate, orderStatus, orderItems, orderId } = order;

  const formmattedPurchaseDate = formatDateWithDot(new Date(purchaseDate));
  const formmattedConfirmationDate = formatDateWithDot(new Date(confirmationDate));

  const isPaymented = orderStatus !== 'READY';

  return (
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
            orderId={orderId}
            key={orderItem.productId}
            orderItem={orderItem}
            confirmationDate={formmattedConfirmationDate}
            orderStatus={orderStatus}
          />
        ))}
      </div>
    </article>
  );
}
