'use client';

import classNames from 'classnames/bind';
import { VerticalTripleDotIcon, KeydeukBlueIcon } from '@/public/index';
import { useState } from 'react';

import styles from './Coupon.module.scss';

const cn = classNames.bind(styles);

const COUPON_INFO = {
  id: 1,
  name: '깜짝 쿠능폰',
  price: 4000,
  minPrice: 40000,
  expiredAt: '2024-08-01T03:17:12.240Z',
  isExpired: true,
};

export default function Coupon() {
  const [isClickedTripleDot, setIsClickedTripleDot] = useState(false);

  const handleClickTripleDot = () => {
    setIsClickedTripleDot(!isClickedTripleDot);
  };

  return (
    <div className={cn('container')}>
      <div className={cn('info-wrapper')}>
        <h1 className={cn('discount-rate')}>{COUPON_INFO.price}원</h1>
        <h3 className={cn('name')}>{COUPON_INFO.name}</h3>
        <p>최소주문금액: {COUPON_INFO.minPrice}</p>
        <p>사용기간: {COUPON_INFO.expiredAt}</p>
      </div>
      <div className={cn('logo-wrapper')}>
        <VerticalTripleDotIcon className={cn('triple-dot')} />
        <KeydeukBlueIcon width={60} height={70} onClick={handleClickTripleDot} />
      </div>
    </div>
  );
}
