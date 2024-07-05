'use client';

import { useQuery } from '@tanstack/react-query';
import classNames from 'classnames/bind';
import { FormEvent } from 'react';

import { Button, Dropdown, ItemOverview } from '@/components';
import { Input, Label } from '@/components/parts';
import { formatNumber } from '@/libs';
import type { OrderItem } from '@/types/OrderTypes';
import type { OrderDetailData } from '@/types/paymentTypes';
import CheckoutAddress from './parts/CheckoutAddress';

import styles from './CheckoutForm.module.scss';

const cn = classNames.bind(styles);

export default function CheckoutForm() {
  // const router = useRouter();

  const { data: paymentItemData } = useQuery<{ data: OrderDetailData }>({
    queryKey: ['paymentItemData'],
  });

  const { totalPrice = 0, orderItemResponses, shippingAddressResponse } = paymentItemData?.data || {};

  const formattedTotalPrice = totalPrice > 0 ? formatNumber(totalPrice) : 0;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const formData = new FormData(e.currentTarget);
    const values = Object.fromEntries(formData.entries());
    console.log(values);

    // router.push(ROUTER.MY_PAGE.CHECKOUT_SUCCESS);
  };

  return (
    <form className={cn('checkout-form')} onSubmit={handleSubmit}>
      <article className={cn('form')}>
        <div className={cn('item-box')}>
          <h1>주문 상품</h1>
          {orderItemResponses &&
            orderItemResponses.map((item: OrderItem) => (
              <ItemOverview key={item.productId} imegeWidth={104} imageHeight={104} item={item} />
            ))}
        </div>

        <div className={cn('price-box')}>
          <p>총 주문금액</p>
          <p className={cn('price')}>{formattedTotalPrice} 원</p>
        </div>

        {shippingAddressResponse && <CheckoutAddress item={shippingAddressResponse} />}

        <div className={cn('discount-box')}>
          <h1>할인 혜택</h1>
          <div className={cn('discount-field-box')}>
            <Label className={cn('discount-field')} sizeVariant='sm'>
              쿠폰
              <div className={cn('discount-input')}>
                <Dropdown
                  className={cn('discount-coupon')}
                  sizeVariant='sm'
                  options={['사용 가능한 쿠폰이 없습니다.']}
                  disabled
                />
                <Button className={cn('discount-button')} type='button'>
                  최대 사용
                </Button>
              </div>
            </Label>
            <Label className={cn('discount-field')} sizeVariant='sm'>
              포인트
              <div className={cn('discount-input')}>
                <Input sizeVariant='sm' readOnly value={0} />
                <Button className={cn('discount-button')} type='button'>
                  최대 사용
                </Button>
              </div>
            </Label>
          </div>
          <p className={cn('discount-point')}>
            <span className={cn('point-title')}>보유 포인트</span>
            0P
          </p>
        </div>

        <div className={cn('method-box')}>
          <h1>결제 수단</h1>
          <h2 className={cn('method-default')}>일반 결제</h2>
          <div className={cn('method-wrap')}>
            <Button type='button'>결제수단들</Button>
          </div>
          <p className={cn('discount-point')}>
            <span className={cn('point-title')}>보유 포인트</span>
            0P
          </p>
        </div>

        <div className={cn('checkout-detail')}>
          <h1>결제 상세</h1>
          <p className={cn('checkout-method')}>
            <span className={cn('method-title')}>신용카드</span>
            {formattedTotalPrice} 원
          </p>
        </div>
      </article>

      <div className={cn('submit-box')}>
        <p>주문 내역을 확인하였으며, 정보 제공등에 동의합니다.</p>
        <Button className={cn('submit-button')} type='submit'>
          결제하기
        </Button>
      </div>
    </form>
  );
}
