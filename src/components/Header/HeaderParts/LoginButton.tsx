'use client';

import { usePathname } from 'next/navigation';
import classNames from 'classnames/bind';

import styles from './AuthButton.module.scss';

const cn = classNames.bind(styles);

interface LoginButtonProps {
  onClick: () => void;
}

export default function LoginButton({ onClick }: LoginButtonProps) {
  const pathname = usePathname();
  return (
    <button className={cn('button', { black: pathname === '/' })} type='button' onClick={onClick}>
      로그인
    </button>
  );
}
