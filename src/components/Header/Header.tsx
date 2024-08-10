'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import classNames from 'classnames/bind';

import type { CartAPIDataType } from '@/types/CartTypes';
import type { Users } from '@/types/userType';
import { ROUTER } from '@/constants/route';
import { LogoIcon, UserIcon } from '@/public/index';
import { CustomImage, SignInModal } from '@/components';
import { CartButton, LoginButton, LogoutButton, SearchButton, ShopButton, NotificationButton } from './HeaderParts';

import styles from './Header.module.scss';

const cn = classNames.bind(styles);

export default function Header() {
  const eventSource = useRef<null | EventSource>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const isBlack = pathname === '/' || pathname === 'sign-up';

  const { data: userData } = useQuery<{ data: Users }>({
    queryKey: ['userData'],
  });

  const { data: cartData } = useQuery<CartAPIDataType>({
    queryKey: ['cartData'],
  });

  const cartCount = cartData?.totalCount ?? 0;

  const users = userData?.data ?? null;
  const profileImage = userData?.data?.imgUrl ?? null;

  const handleLoginButtonClick = () => {
    setIsModalOpen((prevIsOpen) => !prevIsOpen);
  };

  const handleUserIconClick = () => {
    if (users) {
      router.push(ROUTER.MY_PAGE.MY_INFO);
      return;
    }

    setIsModalOpen((prevIsOpen) => !prevIsOpen);
  };

  const handleCartIconClick = () => {
    if (users) {
      router.push(ROUTER.MY_PAGE.CART);
      return;
    }

    setIsModalOpen((prevIsOpen) => !prevIsOpen);
  };

  return (
    <>
      <header className={cn('header', { 'bg-black': isBlack })}>
        <div className={cn('wrapper', { black: isBlack })}>
          <div className={cn('right-wrapper')}>
            <Link className={cn('logo')} href={ROUTER.MAIN}>
              <LogoIcon width={131} height={24} className={cn('logo-icon')} />
            </Link>
            <div className={cn('button-wrapper')}>
              <Link
                href={ROUTER.CUSTOM_KEYBOARD}
                className={cn('button', { 'current-page': pathname === ROUTER.CUSTOM_KEYBOARD })}
              >
                커스텀 키보드 만들기
              </Link>
              <ShopButton />
              <Link href={ROUTER.COMMUNITY} className={cn('button', { 'current-page': pathname === ROUTER.COMMUNITY })}>
                커뮤니티
              </Link>
            </div>
          </div>
          <div className={cn('left-wrapper')}>
            <SearchButton isBlack={isBlack} />
            {!users ? <LoginButton onClick={handleLoginButtonClick} /> : <LogoutButton eventSource={eventSource} />}
            <button className={cn('user-icon', 'button')} type='button' onClick={handleUserIconClick}>
              {profileImage ? (
                <CustomImage src={profileImage} alt='profile' width={28} height={28} className={cn('profile-image')} />
              ) : (
                <UserIcon className={cn(isBlack ? 'user-black' : 'user-white')} width={28} height={28} />
              )}
            </button>
            <CartButton cartCount={cartCount} isBlack={isBlack} onClick={handleCartIconClick} />
            {users && <NotificationButton isBlack={isBlack} eventSource={eventSource} />}
          </div>
        </div>
      </header>
      <SignInModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
