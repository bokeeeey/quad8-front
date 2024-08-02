'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import classNames from 'classnames/bind';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { postPaymentConfirm, postPaymentSuccess } from '@/api/paymentAPI';
import CheckoutAddress from '@/app/(payment)/payment/_components/CheckoutForm/parts/CheckoutAddress';
import { Button, ItemOverview } from '@/components';
import LogoLoading from '@/components/LogoLoading/LogoLoading';
import { ROUTER } from '@/constants/route';
import type { OrderItem } from '@/types/OrderTypes';
import type { PaymentSuccessRequest } from '@/types/PaymentsTypes';

import styles from './CheckoutComplete.module.scss';

const cn = classNames.bind(styles);

interface CheckoutCompletedProps {
  orderId: string;
}

export default function CheckoutCompleted({ orderId }: CheckoutCompletedProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();

  const orderIdFromParams = searchParams.get('orderId') || '';
  const paymentKey = searchParams.get('paymentKey') || '';
  const amount = searchParams.get('amount') || '';
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isFailed, setIsFailed] = useState(false);

  const { mutate: postPaymentSuccessMutation } = useMutation({
    mutationFn: () => postPaymentSuccess({ orderId, paymentKey, paymentOrderId: orderIdFromParams, amount }),
    onSuccess: (res) => {
      if (res.status === 'SUCCESS') {
        queryClient.setQueryData(['paymentSuccessRequest'], res.data);
        setIsConfirmed(true);
      } else {
        setIsFailed(true);
      }
    },
    retry: 0,
  });

  const { mutate: postPaymentConfirmMutation } = useMutation({
    mutationFn: () => postPaymentConfirm({ orderId, paymentKey, paymentOrderId: orderIdFromParams, amount }),
    onSuccess: (res) => {
      if (res.status === 'SUCCESS') {
        postPaymentSuccessMutation();
      } else {
        setIsFailed(true);
      }
    },
    retry: 0,
  });

  useEffect(() => {
    if (orderId && paymentKey && orderIdFromParams && amount) {
      postPaymentConfirmMutation();
    }
  }, [amount, orderId, orderIdFromParams, paymentKey, postPaymentConfirmMutation]);

  if (!isConfirmed) {
    return <LogoLoading />;
  }

  if (isFailed) {
    router.replace(ROUTER.MY_PAGE.CHECKOUT_FAIL);
  }

  const paymentSuccessRequest = queryClient.getQueryData<PaymentSuccessRequest>(['paymentSuccessRequest']);

  const { paymentResponse, orderDetailResponse } = paymentSuccessRequest ?? {};

  const { shippingAddress, orderItems } = orderDetailResponse ?? {};

  return (
    <div className={cn('checkout-completed')}>
      <article className={cn('info-box')}>
        <h1 className={cn('info-title')}>
          주문번호<span>{paymentResponse?.paymentOrderId.toUpperCase()}</span>
        </h1>

        {shippingAddress && <CheckoutAddress item={shippingAddress} />}

        <div className={cn('item-box')}>
          <h1>주문 상품</h1>
          {orderItems &&
            orderItems.map((item: OrderItem) => (
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
