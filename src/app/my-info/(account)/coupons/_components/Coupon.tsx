'use client';

import classNames from 'classnames/bind';
import { VerticalTripleDotIcon, KeydeukBlueIcon, ChevronIcon } from '@/public/index';
import { useState } from 'react';
import { formatDateToString } from '@/libs/formatDateToString';

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
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClickIcon = () => {
    setIsAnimating(true);
    setIsClickedTripleDot(!isClickedTripleDot);

    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };

  const expiredAt = formatDateToString(new Date(COUPON_INFO.expiredAt));

  return (
    <div className={cn('container', { 'slit-in-vertical': isAnimating })}>
      {!isClickedTripleDot ? (
        <>
          <div className={cn('info-wrapper')}>
            <h1 className={cn('discount-rate')}>{COUPON_INFO.price}원</h1>
            <h3 className={cn('name')}>{COUPON_INFO.name}</h3>
            <p className={cn('coupon-info')}>최소주문금액: {COUPON_INFO.minPrice}</p>
            <p className={cn('coupon-info')}>사용기간: {expiredAt}</p>
          </div>
          <VerticalTripleDotIcon className={cn('icon', 'triple-dot')} fill='#c6c6c6' onClick={handleClickIcon} />
          <div className={cn('logo-wrapper')}>
            <KeydeukBlueIcon width={80} height={90} />
          </div>
        </>
      ) : (
        <>
          <ChevronIcon
            width={20}
            height={10}
            className={cn('icon', 'chevron')}
            onClick={handleClickIcon}
            fill='#a5a5a5'
          />
          <ul className={cn('explanation-list')}>
            <li>최소 {COUPON_INFO.minPrice} 원 이상 주문 시 쿠폰 적용이 가능합니다.</li>
            <li>쿠폰은 다른 계정으로 양도하실 수 없습니다. </li>
            <li>이 쿠폰은 2024년 8월 1일까지 유효합니다. </li>
            <li>이 쿠폰은 한 계정당 1회만 사용할 수 있습니다.</li>
          </ul>
        </>
      )}
    </div>
  );
}
