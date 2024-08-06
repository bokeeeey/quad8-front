'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import classNames from 'classnames/bind';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { postPaymentConfirm, postPaymentSuccess } from '@/api/paymentAPI';
import CheckoutAddress from '@/app/payment/_components/CheckoutForm/parts/CheckoutAddress';
import { Button, ItemOverview } from '@/components';
import LogoLoading from '@/components/LogoLoading/LogoLoading';
import { ROUTER } from '@/constants/route';
import type { OrderItem } from '@/types/OrderTypes';
import type { PaymentSuccessRequest } from '@/types/PaymentsTypes';

import styles from './CheckoutComplete.module.scss';

const cn = classNames.bind(styles);

export default function CheckoutCompleted() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();

  const orderId = searchParams.get('paymentOrderId') || '';
  const orderIdFromParams = searchParams.get('orderId') || '';
  const paymentKey = searchParams.get('paymentKey') || '';
  const amount = searchParams.get('amount') || '';

  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isFailed, setIsFailed] = useState(false);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    const handlePopState = () => {
      router.replace(ROUTER.MY_PAGE.CHECKOUT_FAIL);
    };
    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [router]);

  const { mutate: postPaymentSuccessMutation } = useMutation({
    mutationFn: () => postPaymentSuccess({ orderId, paymentKey, paymentOrderId: orderIdFromParams, amount }),
    onSuccess: (res) => {
      if (res.status === 'SUCCESS') {
        queryClient.invalidateQueries({ queryKey: ['cartData'] });
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
        router.replace(`${ROUTER.MY_PAGE.CHECKOUT_FAIL}?orderId=${orderId}&message=${res.message}`);
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

  const handleButtonClick = () => {
    router.push(ROUTER.MY_PAGE.ORDERS);
  };

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
        <Button className={cn('confirm-button')} type='submit' onClick={handleButtonClick}>
          주문 상세보기
        </Button>
      </div>
    </div>
  );
}
