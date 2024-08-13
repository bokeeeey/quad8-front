'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import classNames from 'classnames/bind';
import JSConfetti from 'js-confetti';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { postPaymentConfirm, postPaymentSuccess } from '@/api/paymentAPI';
import CheckoutAddress from '@/app/payment/_components/CheckoutForm/parts/CheckoutAddress';
import { Button, ItemOverview, LogoLoading } from '@/components';
import { ROUTER } from '@/constants/route';
import type { OrderItem } from '@/types/orderType';
import type { PaymentSuccessRequest } from '@/types/paymentsType';

import styles from './CheckoutComplete.module.scss';

const cn = classNames.bind(styles);

export default function CheckoutCompleted() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const jsConfetti = new JSConfetti();

  const orderId = searchParams.get('paymentOrderId') || '';
  const orderIdFromParams = searchParams.get('orderId') || '';
  const paymentKey = searchParams.get('paymentKey') || '';
  const amount = searchParams.get('amount') || '';

  const [isConfirmed, setIsConfirmed] = useState(false);

  const { mutate: postPaymentSuccessMutation } = useMutation({
    mutationFn: () => postPaymentSuccess({ orderId, paymentKey, paymentOrderId: orderIdFromParams, amount }),
    onSuccess: (res) => {
      jsConfetti.addConfetti({ confettiNumber: 500 });

      queryClient.invalidateQueries({ queryKey: ['cartData'] });
      queryClient.invalidateQueries({ queryKey: ['paymentResponse'] });
      queryClient.setQueryData(['paymentSuccessRequest'], res.data);
      localStorage.setItem('paymentSuccessRequest', JSON.stringify(res.data));

      setIsConfirmed(true);
    },
    onError: (error) => {
      router.replace(`${ROUTER.MY_PAGE.CHECKOUT_FAIL}?orderId=${orderId}&message=${error.message}`);
    },
    retry: 0,
  });

  const { mutate: postPaymentConfirmMutation } = useMutation({
    mutationFn: () => postPaymentConfirm({ orderId, paymentKey, paymentOrderId: orderIdFromParams, amount }),
    onSuccess: () => {
      postPaymentSuccessMutation();
    },
    onError: (error) => {
      router.replace(`${ROUTER.MY_PAGE.CHECKOUT_FAIL}?orderId=${orderId}&message=${error.message}`);
    },
    retry: 0,
  });

  useEffect(() => {
    if (orderId && paymentKey && orderIdFromParams && amount) {
      postPaymentConfirmMutation();
    }
  }, [amount, orderId, orderIdFromParams, paymentKey, postPaymentConfirmMutation]);

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

  const paymentSuccessRequest = queryClient.getQueryData<PaymentSuccessRequest>(['paymentSuccessRequest']);

  const { paymentResponse, orderDetailResponse } = paymentSuccessRequest ?? {};

  const { shippingAddress, orderItems } = orderDetailResponse ?? {};

  const handleButtonClick = () => {
    router.replace(ROUTER.MY_PAGE.ORDERS);
  };

  if (!isConfirmed) {
    return <LogoLoading />;
  }

  return (
    <div className={cn('checkout-completed')}>
      <article className={cn('info-box')}>
        <h1 className={cn('success-message')}>주문 / 결제가 정상적으로 완료되었습니다.</h1>
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
        <Button className={cn('confirm-button')} type='button' onClick={handleButtonClick}>
          주문 상세보기
        </Button>
      </div>
    </div>
  );
}
