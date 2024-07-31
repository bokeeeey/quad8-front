'use client';

import { postPaymentConfirm, postPaymentSuccess } from '@/api/paymentAPI';
import { Button, ItemOverview } from '@/components';
import LogoLoading from '@/components/LogoLoading/LogoLoading';
import { ROUTER } from '@/constants/route';
import { formatPhoneNumber } from '@/libs';
import type { OrderItem } from '@/types/OrderTypes';
import { PaymentSuccessRequest } from '@/types/PaymentTypes';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import classNames from 'classnames/bind';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './CheckoutComplete.module.scss';

const cn = classNames.bind(styles);

interface CheckoutCompletedProps {
  orderId: string;
}

export default function CheckoutCompleted({ orderId }: CheckoutCompletedProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();

  // const paymentType = searchParams.get('paymentType') || '';
  const orderIdFromParams = searchParams.get('orderId') || '';
  const paymentKey = searchParams.get('paymentKey') || '';
  const amount = searchParams.get('amount') || '';
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isFailed, setIsFailed] = useState(false);

  // const { data: paymentDataResponse } = useQuery<{ data: OrderDetailData }>({
  //   queryKey: ['paymentDataResponse'],
  // });

  const { mutate: postPaymentSuccessMutation } = useMutation({
    mutationFn: () => postPaymentSuccess({ orderId, paymentKey, paymentOrderId: orderIdFromParams, amount }),
    onSuccess: (res) => {
      console.log('paymentSuccess 결과', res);

      if (res.status === 'SUCCESS') {
        queryClient.setQueryData(['paymentDataResponse'], res.data);
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
      console.log('paymentConfirm 결과', res);

      if (res.status === 'SUCCESS') {
        postPaymentSuccessMutation();
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

  const paymentDataResponse = queryClient.getQueryData<PaymentSuccessRequest>(['paymentDataResponse']);

  const { paymentResponse, orderDetailResponse } = paymentDataResponse ?? {};

  const { shippingAddress, orderItems } = orderDetailResponse ?? {};

  const { name, phone = '', zoneCode, address, detailAddress } = shippingAddress ?? {};

  return (
    <div className={cn('checkout-completed')}>
      <article className={cn('info-box')}>
        <h1 className={cn('info-title')}>
          주문번호<span>{paymentResponse?.paymentOrderId}</span>
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
