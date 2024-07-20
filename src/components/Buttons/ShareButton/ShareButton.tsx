'use client';

import { ShareIcon } from '@/public/index';
import type { ProductType } from '@/types/ProductTypes';
import classNames from 'classnames/bind';
import { useState } from 'react';
import ShareBox from './ShareBox';
import styles from './ShareButton.module.scss';

const cn = classNames.bind(styles);

interface ShareButtonProps {
  data: ProductType;
}

export default function ShareButton({ data }: ShareButtonProps) {
  const [isClicked, setIsClicked] = useState(false);

  const handleClickButton = () => {
    setIsClicked((prev) => !prev);
  };

  return (
    <button type='button' className={cn('circle', { 'blue-circle': isClicked })} onClick={handleClickButton}>
      <ShareIcon />
      {isClicked && <ShareBox onClickClose={handleClickButton} data={data} />}
    </button>
  );
}
