'use client';

import classNames from 'classnames/bind';
import { VerticalTripleDotIcon, ChevronIcon } from '@/public/index';
import { useState, forwardRef } from 'react';

import { formatDateFromYMD } from '@/libs/formatDateToString';
import { formatNumberToPrice } from '@/libs/formatNumberToPrice';
import type { CouponTypes } from '@/types/CouponTypes';

import styles from './Coupon.module.scss';

const cn = classNames.bind(styles);

interface CouponProps {
  data: CouponTypes;
}

export default forwardRef<HTMLDivElement, CouponProps>(function Coupon({ data }, ref) {
  const [isClickedTripleDot, setIsClickedTripleDot] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClickIcon = () => {
    setIsAnimating(true);
    setIsClickedTripleDot(!isClickedTripleDot);

    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };

  const expiredAt = formatDateFromYMD(new Date(data.expiredAt));
  const price = formatNumberToPrice(data.price);
  const minPrice = formatNumberToPrice(data.minPrice);
  const { name, isExpired } = data;

  return (
    <div className={cn('container', { 'slit-in-vertical': isAnimating }, { 'expired-overlay': isExpired })} ref={ref}>
      {!isClickedTripleDot ? (
        <>
          <div className={cn('info-wrapper')}>
            <h1 className={cn('discount-rate', { 'expired-price': isExpired })}>
              {price}원 {isExpired && <span className={cn('expired-text')}>사용 완료</span>}
            </h1>
            <h3 className={cn('name')}>{name}</h3>
            <p className={cn('coupon-info')}>최소주문금액: {minPrice}원</p>
            <p className={cn('coupon-info')}>사용기간: {expiredAt}까지</p>
          </div>
          <VerticalTripleDotIcon className={cn('icon', 'triple-dot')} fill='#c6c6c6' onClick={handleClickIcon} />
        </>
      ) : (
        <>
          <ChevronIcon
            width={5}
            height={5}
            className={cn('icon', 'chevron')}
            onClick={handleClickIcon}
            fill='#a5a5a5'
          />
          <ul className={cn('explanation-list')}>
            <li>최소 {minPrice}원 이상 주문 시 쿠폰 적용이 가능합니다.</li>
            <li>쿠폰은 다른 계정으로 양도하실 수 없습니다. </li>
            <li>이 쿠폰은 {formatDateFromYMD(new Date(data.expiredAt))}까지 유효합니다. </li>
            <li>이 쿠폰은 한 계정당 1회만 사용할 수 있습니다.</li>
          </ul>
        </>
      )}
    </div>
  );
});
