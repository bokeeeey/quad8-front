'use client';

import { deleteCookie } from '@/libs/manageCookie';
import classNames from 'classnames/bind';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import styles from './AuthButton.module.scss';

const cn = classNames.bind(styles);

export default function LogoutButton() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleClickButton = () => {
    deleteCookie('accessToken');
    queryClient.invalidateQueries({
      queryKey: ['postCardsList'],
    });
    deleteCookie('refreshToken');
    router.refresh();
  };

  return (
    <button className={cn('button')} type='button' onClick={handleClickButton}>
      로그아웃
    </button>
  );
}
