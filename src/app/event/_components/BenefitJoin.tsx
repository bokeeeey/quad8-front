'use client';

import { Button } from '@/components';
import SignInModal from '@/components/SignInModal/SignInModal';
import useCreateCouponMutation from '@/hooks/useCreateCouponMutation';
import { getCookie } from '@/libs/manageCookie';
import { couponDownImg } from '@/public/index';
import { useQueryClient } from '@tanstack/react-query';
import classNames from 'classnames/bind';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import styles from './BenefitJoin.module.scss';
import EventTitle from './EventTitle';

const cn = classNames.bind(styles);

const couponList = [
  { price: 5000, minPrice: '3만원 이상 구매 시' },
  // { price: 3000, minPrice: '2만원 이상 구매 시' },
  // { price: 2000, minPrice: '1만원 이상 구매 시' },
];
export default function BenefitJoin() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const queryClient = useQueryClient();

  const { mutate: createCoupon } = useCreateCouponMutation(queryClient);

  const handleClick = async (price: number, minPrice: string) => {
    const accessToken = await getCookie('accessToken');

    if (!accessToken) {
      setIsLoginOpen(true);
      return;
    }
    createCoupon({
      name: '웰컴 쿠폰',
      price,
      minPrice: +minPrice.slice(0, 1) * 10000,
      expiredDate: new Date(),
      isWelcome: true,
    });
  };
  return (
    <div id='join' className={cn('container')}>
      <EventTitle title='WELCOME 쿠폰' color='black'>
        즉시 사용가능한 <br /> 신규 가입 쿠폰 증정
      </EventTitle>
      <div className={cn('inner')}>
        <div className={cn('coupon-area')}>
          {couponList.map(({ price, minPrice }) => (
            <button
              className={cn('coupon-down')}
              key={minPrice}
              type='button'
              onClick={() => handleClick(price, minPrice)}
            >
              <Image className={cn('coupon')} src={couponDownImg} alt='쿠폰이미지' fill />
              <h3 className={cn('discount')}>{price.toLocaleString()}</h3>
              <span className={cn('min-price')}>{minPrice}</span>
            </button>
          ))}
        </div>
        <Button className={cn('button')} as={Link} href='/'>
          쿠폰함 가기
        </Button>
      </div>
      <SignInModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </div>
  );
}
