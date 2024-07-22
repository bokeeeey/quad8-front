'use client';

import classNames from 'classnames/bind';
import { useState } from 'react';
import styles from './Wheel.module.scss';

const cn = classNames.bind(styles);
const coupons = ['10% 할인 쿠폰', '무료 배송 쿠폰', '5% 할인 쿠폰', '1+1 쿠폰'];

function Wheel() {
  const [selectedCoupon, setSelectedCoupon] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  // const [confetti, setConfetti] = useState(false);

  const spinWheel = () => {
    setIsSpinning(true);
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * coupons.length);
      setSelectedCoupon(coupons[randomIndex]);
      // setIsSpinning(false);
      // setConfetti(true);
      // setTimeout(() => setConfetti(false), 3000);
    }, 2000); // 2초 동안 회전 애니메이션
  };
  console.log(selectedCoupon);

  return (
    <div className={cn('container')}>
      <h1 className={cn('head')}>돌림판 이벤트</h1>
      <div className={cn('wheel', { spinning: isSpinning })}>
        <div className={cn('text')}>{isSpinning ? '돌리는 중...' : '돌림판 돌리기'}</div>
      </div>
      {selectedCoupon && isSpinning && (
        <div className={cn('message')}>
          <h2 className={cn('tail')}>축하합니다! 당신은 {selectedCoupon}을 받았습니다!</h2>
        </div>
      )}
      <button type='button' onClick={spinWheel}>
        룰렛 돌리기
      </button>
      {/* {confetti && <Confetti />} */}
    </div>
  );
}

export default Wheel;
