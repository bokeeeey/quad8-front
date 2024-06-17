'use client';

import { ROUTER } from '@/constants/route';
import { useQuery } from '@tanstack/react-query';
import classNames from 'classnames/bind';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { LogoIcon, UserIcon } from '@/public/index';

import { getUserData } from '@/api/profileAPI';
import { getCookie } from '@/libs/manageCookie';
import { Users } from '@/types/profileType';
import { useEffect, useState } from 'react';
import { CartButton, LoginButton, LogoutButton, SearchBox, ShopButton } from './HeaderParts';

import styles from './Header.module.scss';

const cn = classNames.bind(styles);

export default function Header() {
  const [token, setToken] = useState<string | null>(null);
  const pathname = usePathname();
  const isBlack = pathname === '/' || pathname === 'sign-up';

  useEffect(() => {
    const getToken = async () => {
      const accessToken = await getCookie('accessToken');
      setToken(accessToken);
    };

    getToken();
  });

  const { data: userData } = useQuery<{ data: Users }>({
    queryKey: ['userData', token],
    queryFn: () => getUserData(token),
    enabled: !!token,
  });

  const cartCount = 0;

  const users = userData?.data ?? null;

  return (
    <header className={cn('wrapper', { black: isBlack })}>
      <div className={cn('right-wrapper')}>
        <Link href={ROUTER.MAIN}>
          <LogoIcon width={131} height={24} />
        </Link>
        <div className={cn('button-wrapper')}>
          <Link href={ROUTER.CUSTOM_KEYBOARD} className={cn({ 'current-page': pathname === ROUTER.CUSTOM_KEYBOARD })}>
            커스텀 키보드 만들기
          </Link>
          <ShopButton pathname={pathname} />
          <Link href={ROUTER.COMMUNITY} className={cn({ 'current-page': pathname === ROUTER.COMMUNITY })}>
            커뮤니티
          </Link>
        </div>
      </div>
      <div className={cn('left-wrapper')}>
        <SearchBox isBlack={isBlack} />
        <div className={cn('status-wrapper')}>
          {!users ? <LoginButton /> : <LogoutButton />}
          <Link href={ROUTER.MY_PAGE.MY_INFO} className={cn('user-icon')}>
            <UserIcon width={31} height={31} className={cn(isBlack ? 'user-black' : 'user-white')} />
          </Link>
          <CartButton cartCount={cartCount} isBlack={isBlack} />
        </div>
      </div>
    </header>
  );
}
