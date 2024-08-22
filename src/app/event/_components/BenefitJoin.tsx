'use client';

import { Button } from '@/components';
import SignInModal from '@/components/SignInModal/SignInModal';
import { COUPON_LIST } from '@/constants/event';
import { ROUTER } from '@/constants/route';
import { useCreateCouponMutation } from '@/hooks/useCreateCouponMutation';
import { couponDownImg } from '@/public/index';
import type { CouponDataType } from '@/types/couponType';
import { useQueryClient } from '@tanstack/react-query';
import classNames from 'classnames/bind';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from './BenefitJoin.module.scss';
import EventTitle from './EventTitle';

const cn = classNames.bind(styles);

export default function BenefitJoin() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate: createCoupon } = useCreateCouponMutation();
  const couponData = queryClient.getQueryData<CouponDataType>(['userData']);

  const handleClick = async (price: number, minPrice: string) => {
    if (!couponData?.data) {
      setIsLoginOpen(true);
      return;
    }

    const expiredDate = new Date();
    expiredDate.setDate(expiredDate.getDate() + 7);

    createCoupon({
      name: '웰컴 쿠폰',
      price,
      minPrice: +minPrice.slice(0, 1) * 10000,
      expiredDate,
      isWelcome: true,
    });
  };

  const handleClickCouponListButton = () => {
    if (!couponData?.data) {
      setIsLoginOpen(true);
      return;
    }

    router.push(ROUTER.MY_PAGE.COUPONS);
  };

  return (
    <section id='join' className={cn('container')}>
      <EventTitle title='WELCOME 쿠폰' color='black'>
        즉시 사용가능한 <br /> 신규 가입 쿠폰 증정
      </EventTitle>
      <div className={cn('inner')}>
        <div className={cn('coupon-area')}>
          {COUPON_LIST.map(({ price, minPrice }) => (
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
        <Button className={cn('button')} onClick={handleClickCouponListButton}>
          쿠폰함 가기
        </Button>
        <span className={cn('center')}> 📌 룰렛 쿠폰은 발급일 기준 일주일 사용가능합니다.</span>
      </div>
      <SignInModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </section>
  );
}
