'use client';

import classNames from 'classnames/bind';
import { useRef } from 'react';
import { useOutsideClick } from '@/hooks/useOutsideClick';
import { VerticalTripleDotIcon } from '@/public/index';

import styles from './PopOver.module.scss';

const cn = classNames.bind(styles);

interface OptionType {
  label: string;
  onClick: () => void;
}

interface PopOverProps {
  optionsData: OptionType[];
  onHandleClose: () => void;
  onHandleOpen: () => void;
  isOpenPopOver: boolean;
}

export default function PopOver({ optionsData, onHandleClose, onHandleOpen, isOpenPopOver }: PopOverProps) {
  const ref = useRef(null);

  useOutsideClick(ref, onHandleClose);

  const handleClickDotIcon = () => {
    onHandleOpen();
  };

  return (
    <div className={cn('container')} onClick={(e) => e.stopPropagation()}>
      <VerticalTripleDotIcon onClick={handleClickDotIcon} />
      {isOpenPopOver && (
        <div className={cn('pop-over-container')} ref={ref}>
          {optionsData.map((option) => (
            <div key={option.label} className={cn('option')} onClick={option.onClick}>
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
