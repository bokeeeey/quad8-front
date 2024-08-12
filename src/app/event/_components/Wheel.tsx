'use client';

import { pointImg, rouletteImg } from '@/public/index';
import { useEffect, useState } from 'react';

import { Dialog } from '@/components';
import SignInModal from '@/components/SignInModal/SignInModal';
import useCreateCouponMutation from '@/hooks/useCreateCouponMutation';
import { getCookie } from '@/libs/manageCookie';
import { CouponResponse } from '@/types/couponTypes';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import classNames from 'classnames/bind';
import JSConfetti from 'js-confetti';
import Image from 'next/image';
import styles from './Wheel.module.scss';

const cn = classNames.bind(styles);

const rewards = [3000, 1000, 2000, 3000, 1000, 2000];
const animationDuration = 2500;
const getRandomIndex = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;
const calculateRotation = (index: number, total: number): number => (360 / total) * index + 360 * 2;

export default function Wheel() {
  const [result, setResult] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isParticipated, setIsParticipated] = useState(false);
  const [isTodayParticipated, setIsTodayParticipated] = useState(false);

  const { data: couponList } = useQuery<CouponResponse[]>({
    queryKey: ['coupons'],
  });

  const queryClient = useQueryClient();

  const { mutate: createCoupon } = useCreateCouponMutation(queryClient, setIsModalOpen);

  useEffect(() => {
    const jsConfetti = new JSConfetti();
    if (isAnimating) {
      const resultIndex = getRandomIndex(0, rewards.length - 1);
      const newRotation = calculateRotation(resultIndex, rewards.length);
      setRotation(newRotation);

      setTimeout(() => {
        setIsAnimating(false);
        const finalResult = rewards[resultIndex];
        setResult(finalResult);
        jsConfetti.addConfetti({
          emojis: ['💳', '💵', '💶', '💰', '🤑', '💸'],
          emojiSize: 50,
          confettiNumber: 70,
        });
        createCoupon({
          name: '룰렛 쿠폰',
          price: finalResult,
          minPrice: finalResult * 10,
          expiredDate: new Date(),
          isWelcome: false,
        });
      }, animationDuration);
    }
  }, [isAnimating, createCoupon]);

  const startRoulette = async () => {
    const accessToken = await getCookie('accessToken');

    if (!accessToken) {
      setIsLoginOpen(true);
      return;
    }

    const today = new Date().toISOString().slice(0, 10);
    const filterList = couponList?.filter((coupon) => coupon.expiredAt.slice(0, 10) === today);
    const hasRouletteCoupon = filterList?.some((coupon) => coupon.name === '룰렛 쿠폰');

    if (hasRouletteCoupon) {
      setIsParticipated(true);
      return;
    }

    if (isAnimating) return;
    setIsAnimating(true);
    setIsTodayParticipated(true);
  };

  return (
    <div className={cn('tag')}>
      <div className={cn('event-area')}>
        <div className={cn('roulette-area')}>
          <Image src={pointImg} alt='point' className={cn('point-img')} width={78} />
          <Image
            src={rouletteImg}
            alt='룰렛'
            className={cn('roulette')}
            width={650}
            height={650}
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: isAnimating ? `transform ${animationDuration / 1000}s ease-out` : 'none',
            }}
          />
        </div>
        <div className={cn('button-area')}>
          <button
            type='button'
            onClick={startRoulette}
            className={cn('start-button')}
            disabled={isAnimating || isTodayParticipated}
          >
            {isTodayParticipated ? '참여완료' : '룰렛 돌리고 쿠폰 받기!'}
          </button>
        </div>
        <Dialog
          type='alert'
          iconType='accept'
          message={`${result}원 쿠폰에 당첨 됐습니다.`}
          isOpen={isModalOpen}
          buttonText='확인'
          onClick={() => setIsModalOpen(false)}
        />
        <SignInModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
        <Dialog
          type='alert'
          iconType='warn'
          message='오늘은 더 이상 참여 할 수 없습니다.\n내일 다시 참여해주세요.'
          isOpen={isParticipated}
          buttonText='확인'
          onClick={() => setIsParticipated(false)}
        />
      </div>
    </div>
  );
}
