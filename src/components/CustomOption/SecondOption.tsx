'use client';

import { RefObject } from 'react';
import classNames from 'classnames/bind';
import type { CustomKeyboardPointKeyType, CustomKeyboardKeyTypes } from '@/types/CustomKeyboardTypes';
import { POINT_KEY } from '@/constants/keyboardData';
import { getColorUpperCase } from '@/libs/getColorUpperCase';
import TooltipColor from '@/components/CustomOption/TooltipColor';
import OptionWrapper from './OptionWrapper';

import styles from './CustomOption.module.scss';

const cn = classNames.bind(styles);

interface SecondOptionProps {
  wrapperRef?: RefObject<HTMLDivElement>;
  pointKeyType: CustomKeyboardPointKeyType;
  pointSetColor?: string | null /* color */;
  individualColor?: Partial<Record<CustomKeyboardKeyTypes, string>> /* 키: 색상 객체 */;
}

export default function SecondOption({ wrapperRef, pointKeyType, pointSetColor, individualColor }: SecondOptionProps) {
  const getKeyCapOption = () => {
    if (pointKeyType === '내 맘대로 바꾸기' && individualColor) {
      const optionText = Object.entries(individualColor);
      return optionText;
    }
    if (pointKeyType === '세트 구성' && pointSetColor) {
      const optionText = POINT_KEY.map((key) => [key, pointSetColor]);
      return optionText as [string, string][];
    }
    return [];
  };
  const keyCapColor = getKeyCapOption();
  const secondOption = keyCapColor.map(([key, color]) => `${key}: ${getColorUpperCase(color)}`).join(' / ');
  return (
    <OptionWrapper wrapperRef={wrapperRef} optionText={secondOption}>
      <div className={cn('tooltip')}>
        {keyCapColor && keyCapColor.map((el) => <TooltipColor key={el[0]} colorInfo={el} />)}
      </div>
    </OptionWrapper>
  );
}
