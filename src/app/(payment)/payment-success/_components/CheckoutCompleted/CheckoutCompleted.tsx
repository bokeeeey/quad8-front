'use client';

import { getPayment } from '@/api/orderAPI';
import { Button, ItemOverview } from '@/components';
import { formatPhoneNumber } from '@/libs';
import { OrderItem } from '@/types/OrderTypes';
import { OrderDetailData } from '@/types/paymentTypes';
import { useQuery } from '@tanstack/react-query';
import classNames from 'classnames/bind';
import styles from './CheckoutComplete.module.scss';

const cn = classNames.bind(styles);

interface CheckoutCompletedProps {
  orderId: string;
}

export default function CheckoutCompleted({ orderId }: CheckoutCompletedProps) {
  const { data: paymentDataResponse } = useQuery<{ data: OrderDetailData }>({
    queryKey: ['paymentDataResponse'],
    queryFn: () => getPayment(orderId),
  });

  const { paymentOrderId, shippingAddressResponse, orderItemResponses } = paymentDataResponse?.data ?? {};

  const { name, phone = '', zoneCode, address, detailAddress } = shippingAddressResponse ?? {};

  return (
    <div className={cn('checkout-completed')}>
      <article className={cn('info-box')}>
        <h1 className={cn('info-title')}>
          주문번호<span>{paymentOrderId}</span>
        </h1>
        <div className={cn('info-address')}>
          <div className={cn('address')}>
            <p>{name}</p>
            <p>010-{formatPhoneNumber(phone)}</p>
            <p>
              ({zoneCode}){address} {detailAddress}
            </p>
          </div>
          {/* <Button
            className={cn('address-modification-button')}
            type='button'
            radioGroup='4'
            paddingVertical={8}
            width={72}
          >
            변경
          </Button> */}
        </div>
        <div className={cn('item-box')}>
          <h1>주문 상품</h1>
          {orderItemResponses &&
            orderItemResponses.map((item: OrderItem) => (
              <ItemOverview key={item.productId} imegeWidth={104} imageHeight={104} item={item} />
            ))}
        </div>
      </article>

      <div className={cn('confirm-box')}>
        <p>주문 내역을 확인하였으며, 정보 제공등에 동의합니다.</p>
        <Button className={cn('confirm-button')} type='submit'>
          주문 상세보기
        </Button>
      </div>
    </div>
  );
}
