'use client';

import { useQueryClient } from '@tanstack/react-query';
import classNames from 'classnames/bind';
import { useRouter } from 'next/navigation';

import CheckoutAddress from '@/app/payment/_components/CheckoutForm/parts/CheckoutAddress';
import { Button, ItemOverview, LogoLoading } from '@/components';
import { ROUTER } from '@/constants/route';
import { usePaymentProcess } from '@/hooks/usePaymentProcess';
import { usePreventNavigation } from '@/hooks/usePreventNavigation';
import type { OrderItem } from '@/types/orderType';
import type { PaymentSuccessRequest } from '@/types/paymentsType';

import styles from './CheckoutComplete.module.scss';

const cn = classNames.bind(styles);

export default function CheckoutCompleted() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isConfirmed } = usePaymentProcess();

  // 새로고침 및 뒤로가기 관련 로직
  usePreventNavigation();

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
              <ItemOverview key={item.productId} imageWidth={104} imageHeight={104} item={item} />
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
