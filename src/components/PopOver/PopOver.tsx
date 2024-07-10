'use client';

import classNames from 'classnames/bind';
import { useRef, MouseEvent } from 'react';
import { useOutsideClick } from '@/hooks/useOutsideClick';
import { VerticalTripleDotIcon } from '@/public/index';

import styles from './PopOver.module.scss';

const cn = classNames.bind(styles);

interface OptionType {
  label: string;
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}

interface PopOverProps {
  optionsData: OptionType[];
  onHandleClose: () => void;
  onHandleOpen: (e: MouseEvent<SVGElement>) => void;
  isOpenPopOver: boolean;
}

export default function PopOver({ optionsData, onHandleClose, onHandleOpen, isOpenPopOver }: PopOverProps) {
  const ref = useRef(null);

  useOutsideClick(ref, onHandleClose);

  return (
    <div className={cn('container')}>
      <VerticalTripleDotIcon onClick={(e) => onHandleOpen(e)} />
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
