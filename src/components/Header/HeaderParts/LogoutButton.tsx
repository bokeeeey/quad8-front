'use client';

import { usePathname } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import classNames from 'classnames/bind';

import { deleteCookie } from '@/libs/manageCookie';

import styles from './AuthButton.module.scss';

const cn = classNames.bind(styles);

export default function LogoutButton() {
  const queryClient = useQueryClient();
  const pathname = usePathname();

  const handleClickButton = () => {
    deleteCookie('accessToken');
    deleteCookie('refreshToken');
    queryClient.removeQueries();
  };

  return (
    <button className={cn('button', { black: pathname === '/' })} type='button' onClick={handleClickButton}>
      로그아웃
    </button>
  );
}
