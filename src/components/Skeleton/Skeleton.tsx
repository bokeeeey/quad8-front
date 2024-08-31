'use client';

import { ReactNode, useEffect, useState } from 'react';
import classNames from 'classnames/bind';

import styles from './Skeleton.module.scss';

const cn = classNames.bind(styles);
interface SkeletonProps {
  isPending: boolean;
  interval?: number;
  children: ReactNode;
  width: number | string;
  height: number | string;
  radius?: number;
  condition?: boolean;
  isImage?: boolean;
}

export default function Skeleton({
  isPending,
  interval = 1000,
  children,
  width,
  height,
  radius,
  condition,
  isImage,
}: SkeletonProps) {
  const [isFetch, setIsFetch] = useState(false);
  useEffect(() => {
    if (isPending) {
      setIsFetch(true);
      setTimeout(() => {
        setIsFetch(false);
      }, interval);
    }
  }, [interval, isPending]);
  if (!isFetch || condition === false) {
    return children;
  }
  return (
    <div
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        margin: !isImage ? '0.2rem 0' : 0,
        borderRadius: `${radius ?? 0}px`,
      }}
      className={cn('wrapper')}
    />
  );
}
