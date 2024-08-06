import { CreditCardIcon, CrossIcon, CubeIcon } from '@/public/index';
import classNames from 'classnames/bind';

import styles from './CheckoutNavigation.module.scss';

const cn = classNames.bind(styles);

interface CheckoutNavigationProps {
  isSucceed?: boolean;
  isFailed?: boolean;
}

export default function CheckoutNavigation({ isSucceed, isFailed }: CheckoutNavigationProps) {
  return (
    <article className={cn('nav')}>
      <div className={cn('status-box')}>
        <CreditCardIcon className={cn('card-icon')} />
        <h2>결제하기</h2>
        <div className={cn('chain', { success: isSucceed, fail: isFailed })} />
        {isFailed && <CrossIcon className={cn('cross-icon')} />}
      </div>
      <div className={cn('status-box')}>
        <CubeIcon className={cn('cube-icon', { success: isSucceed })} />
        <h2>결제완료</h2>
      </div>
    </article>
  );
}
