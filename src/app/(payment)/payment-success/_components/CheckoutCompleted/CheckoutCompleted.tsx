'use client';

import { postPaymentConfirm, postPaymentSuccess } from '@/api/paymentAPI';
import { Button, ItemOverview } from '@/components';
import LogoLoading from '@/components/LogoLoading/LogoLoading';
import { formatPhoneNumber } from '@/libs';
import { OrderItem } from '@/types/OrderTypes';
import { OrderDetailData } from '@/types/paymentTypes';
import { useMutation, useQuery } from '@tanstack/react-query';
import classNames from 'classnames/bind';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './CheckoutComplete.module.scss';

const cn = classNames.bind(styles);

interface CheckoutCompletedProps {
  orderId: string;
}

export default function CheckoutCompleted({ orderId }: CheckoutCompletedProps) {
  const [isConfirmed, setIsConfirmed] = useState(false);

  const searchParams = useSearchParams();
  // const paymentType = searchParams.get('paymentType') || '';
  const orderIdFromParams = searchParams.get('orderId') || '';
  const paymentKey = searchParams.get('paymentKey') || '';
  const amount = searchParams.get('amount') || '';

  const { data: paymentDataResponse } = useQuery<{ data: OrderDetailData }>({
    queryKey: ['paymentDataResponse'],
  });

  console.log(amount);

  const { mutate: postPaymentSuccessMutation } = useMutation({
    mutationFn: () => postPaymentSuccess({ orderId, paymentKey, paymentOrderId: orderIdFromParams, amount }),
    onSuccess: (res) => {
      console.log('paymentSuccess 결과', res);
    },
  });

  const { mutate: postPaymentConfirmMutation } = useMutation({
    mutationFn: () => postPaymentConfirm({ orderId, paymentKey, paymentOrderId: orderIdFromParams, amount }),
    onSuccess: (res) => {
      console.log('paymentConfirm 결과', res);
      if (res.status === 'SUCCESS') {
        setIsConfirmed(true);
        postPaymentSuccessMutation();
      }
    },
  });

  useEffect(() => {
    if (orderId && paymentKey && orderIdFromParams && amount) {
      postPaymentConfirmMutation();
    }
  }, [amount, orderId, orderIdFromParams, paymentKey, postPaymentConfirmMutation]);

  if (!isConfirmed) {
    return <LogoLoading />;
  }

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
