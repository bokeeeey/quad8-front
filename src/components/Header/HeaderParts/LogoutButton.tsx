'use client';

import { MutableRefObject } from 'react';
import { usePathname } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import classNames from 'classnames/bind';

import { deleteCookie } from '@/libs/manageCookie';

import styles from './AuthButton.module.scss';

const cn = classNames.bind(styles);

interface LogoutButtonProps {
  eventSource: MutableRefObject<EventSource | null>;
}

export default function LogoutButton({ eventSource }: LogoutButtonProps) {
  const queryClient = useQueryClient();
  const pathname = usePathname();

  const handleClickButton = () => {
    deleteCookie('accessToken');
    deleteCookie('refreshToken');
    deleteCookie('orderId');
    queryClient.removeQueries();

    if (eventSource.current) {
      eventSource.current.close();
      Object.assign(eventSource, { current: null });
    }
  };

  return (
    <button className={cn('button', { black: pathname === '/' })} type='button' onClick={handleClickButton}>
      로그아웃
    </button>
  );
}
