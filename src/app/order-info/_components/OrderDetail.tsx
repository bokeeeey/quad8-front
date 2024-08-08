'use client';

import { getOrder } from '@/api/orderAPI';
import CheckoutAddress from '@/app/payment/_components/CheckoutForm/parts/CheckoutAddress';
import { Button, ItemOverview } from '@/components';
import { formatNumber } from '@/libs';
import type { OrderResponse } from '@/types/orderType';
import { useQuery } from '@tanstack/react-query';
import classNames from 'classnames/bind';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './OrderDetail.module.scss';

const cn = classNames.bind(styles);

export default function OrderDetail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') || '';

  const { data: orderResponse } = useQuery<{ data: OrderResponse }>({
    queryKey: ['orderResponse'],
    queryFn: () => getOrder(orderId),
  });

  const { orderItems, shippingAddress, totalAmount = '' } = orderResponse?.data ?? {};

  const handleButtonClick = () => {
    router.back();
  };

  return (
    <article className={cn('container')}>
      <div className={cn('content')}>
        <h1 className={cn('order-info')}>
          주문번호<span className={cn('order-number')}>이거 백엔드에 요청해야 할듯?</span>
        </h1>
        <div className={cn('item-box')}>
          <h2>주문 상품</h2>
          {orderItems && orderItems.map((item) => <ItemOverview key={item.productId} item={item} />)}
        </div>
        <h2 className={cn('amount')}>
          총 주문금액 <span className={cn('amount-number')}>{formatNumber(totalAmount)} 원</span>
        </h2>
        {shippingAddress && <CheckoutAddress item={shippingAddress} />}
        <div className={cn('payment-box')}>
          <h2>결제 상세</h2>
          <p className={cn('payment-method')}>
            신용카드 <span className={cn('payment-price')}>{formatNumber(totalAmount)} 원</span>
          </p>
        </div>
      </div>
      <Button className={cn('button')} type='button' onClick={handleButtonClick}>
        목록
      </Button>
    </article>
  );
}
