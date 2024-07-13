import classNames from 'classnames/bind';
import { ReactNode } from 'react';

import CheckoutNavigation from '../payment/_components/CheckoutNavigation/CheckoutNavigation';

import styles from './layout.module.scss';

const cn = classNames.bind(styles);

interface CheckoutLayoutProps {
  children: ReactNode;
}

export default async function PaymentSuccessPageLayout({ children }: CheckoutLayoutProps) {
  return (
    <section className={cn('layout')}>
      <CheckoutNavigation isSucceed />
      <div className={cn('page')}>{children}</div>
    </section>
  );
}
