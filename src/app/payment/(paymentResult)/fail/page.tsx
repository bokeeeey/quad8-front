'use client';

import { useQuery } from '@tanstack/react-query';
import classNames from 'classnames/bind';
import { useRouter, useSearchParams } from 'next/navigation';

import { getPayment } from '@/api/orderAPI';
import { Button } from '@/components';
import { ROUTER } from '@/constants/route';
import { AlertIcon, FailIcon } from '@/public/index';
import { OrderDetailData } from '@/types/orderType';
import CheckoutNavigation from '../../_components/CheckoutNavigation/CheckoutNavigation';

import styles from './page.module.scss';

const cn = classNames.bind(styles);

export default function PaymentFailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const orderId = searchParams.get('orderId') || '';
  const errorMessage = searchParams.get('message') || '';

  const { data: paymentResponse } = useQuery<{ data: OrderDetailData }>({
    queryKey: ['paymentDataResponse', orderId],
    queryFn: () => getPayment(orderId),
    enabled: !!orderId,
    retry: 0,
  });

  const handleButtonClick = () => {
    if (paymentResponse) {
      router.replace(`${ROUTER.MY_PAGE.CHECKOUT}?orderId=${orderId}`);
      return;
    }

    router.replace(ROUTER.MY_PAGE.CART);
  };

  return (
    <div className={cn('page')}>
      <CheckoutNavigation isFailed />
      <div className={cn('container')}>
        <AlertIcon />
        <h1>주문이 정상적으로 완료되지 않았습니다.</h1>
        {errorMessage && (
          <div className={cn('error-box')}>
            <p>이유: {errorMessage}</p>
          </div>
        )}
        <div className={cn('text-box')}>
          <p>이미 결제가 됐다면 다음 날 결제취소 돼요.</p>
          <p>단, 카드사 및 은행에 따라 7일까지 걸릴 수 있어요.</p>
        </div>
        <FailIcon className={cn('fail-icon')} />
      </div>
      <Button className={cn('button')} onClick={handleButtonClick}>
        다시 주문하기
      </Button>
    </div>
  );
}
