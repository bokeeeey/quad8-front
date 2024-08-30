import { Button } from '@/components';
import { ROUTER } from '@/constants/route';
import { AlertIcon } from '@/public/index';
import classNames from 'classnames/bind';
import Link from 'next/link';

import styles from './CouponEmptyCase.module.scss';

const cn = classNames.bind(styles);

interface CouponEmptyCaseProps {
  message: string;
  isBackgroundColor?: boolean;
}

export default function CouponEmptyCase({ message, isBackgroundColor }: CouponEmptyCaseProps) {
  return (
    <div className={cn('empty-case', { 'background-color': isBackgroundColor })}>
      <AlertIcon className={cn('alert-icon')} />
      <p className={cn('empty-case-text')}>{message}</p>
      <Button
        as={Link}
        href={ROUTER.EVENT}
        backgroundColor='background-gray-40'
        className={cn('empty-case-button')}
        paddingVertical={8}
        radius={4}
      >
        쿠폰 받으러 가기
      </Button>
    </div>
  );
}
