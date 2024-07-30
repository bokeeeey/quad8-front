'use client';

import { pointImg, rouletteImg } from '@/public/index';
import { useEffect, useState } from 'react';

import { Button, Dialog } from '@/components';
import classNames from 'classnames/bind';
import Image from 'next/image';
import styles from './Wheel.module.scss';

const cn = classNames.bind(styles);

const rewards = ['3000', '1000', '2000', '3000', '1000', '2000'];
const animationDuration = 2500;

const getRandomIndex = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;

const calculateRotation = (index: number, total: number): number => (360 / total) * index + 360 * 2;

function Wheel() {
  const [result, setResult] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (isAnimating) {
      const resultIndex = getRandomIndex(0, rewards.length - 1);
      const newRotation = calculateRotation(resultIndex, rewards.length);
      setRotation(newRotation);

      setTimeout(() => {
        setIsAnimating(false);
        setResult(rewards[resultIndex]);
      }, animationDuration);
    }
  }, [isAnimating]);

  const startRoulette = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setIsModalOpen(true);
    }, 2700);
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
          <Button
            onClick={startRoulette}
            fontSize={24}
            className={cn('start-button')}
            disabled={isAnimating}
            type='button'
          >
            룰렛 돌리고 쿠폰 받기!
          </Button>
        </div>
        <Dialog
          type='alert'
          iconType='accept'
          message={`${result}원 쿠폰에 당첨 됐습니다.`}
          isOpen={isModalOpen}
          buttonText='확인'
          onClick={() => setIsModalOpen(false)}
        />
        {result && <div className={cn('result')}>결과: {result}원 쿠폰</div>}
      </div>
    </div>
  );
}

export default Wheel;
