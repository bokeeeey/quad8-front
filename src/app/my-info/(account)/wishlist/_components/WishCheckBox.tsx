'use client';

import classNames from 'classnames/bind';
import { ReactNode } from 'react';
import styles from './WishCheckBox.module.scss';

const cn = classNames.bind(styles);

interface WishCheckBoxProps {
  children?: ReactNode;
  productId: number;
  onChange: (id: number) => void;
  isChecked: boolean;
}

export default function WishCheckBox({ children, productId, onChange, isChecked }: WishCheckBoxProps) {
  const handleChange = () => {
    onChange(productId);
  };

  return (
    <>
      <input
        type='checkbox'
        id={`select-item-${productId}`}
        className={cn('select-item-input')}
        checked={isChecked}
        onChange={handleChange}
      />
      <label htmlFor={`select-item-${productId}`} className={cn('select-item-label')}>
        {children}
      </label>
    </>
  );
}
