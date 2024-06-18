import { ROUTER } from '@/constants/route';
import classNames from 'classnames/bind';
import { ReactNode } from 'react';

import { getCookie } from '@/libs/manageCookie';
import { redirect } from 'next/navigation';
import { SNB } from './_components';

import styles from './layout.module.scss';

const cn = classNames.bind(styles);

interface MyInfoLayoutProps {
  children: ReactNode;
}

export default async function MyInfoLayout({ children }: MyInfoLayoutProps) {
  const token = await getCookie('accessToken');

  if (!token) {
    redirect(ROUTER.MAIN);
  }

  return (
    <section className={cn('layout')}>
      <SNB />
      <div className={cn('page')}>{children}</div>
    </section>
  );
}
