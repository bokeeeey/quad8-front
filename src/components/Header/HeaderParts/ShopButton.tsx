'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import classNames from 'classnames/bind';

import { ROUTER } from '@/constants/route';

import styles from './ShopButton.module.scss';

const cn = classNames.bind(styles);

const MENU_BUTTON = [
  { NAME: '키보드', HREF: ROUTER.SHOP.KEYBOARD },
  { NAME: '키캡', HREF: ROUTER.SHOP.KEYCAP },
  { NAME: '스위치', HREF: ROUTER.SHOP.SWITCH },
  { NAME: '기타 용품', HREF: ROUTER.SHOP.ETC },
];

export default function ShopButton() {
  const [isHover, setIsHover] = useState(false);
  const pathname = usePathname();

  return (
    <div
      className={cn('wrapper', { 'bg-black': pathname === '/' })}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <Link href={ROUTER.SHOP.ALL} className={cn('button', { 'current-page': pathname === '/shop' })}>
        SHOP
      </Link>
      {isHover && (
        <div className={cn('sub-menu-layout')}>
          <div className={cn('sub-menu-wrapper', { black: pathname === '/' })}>
            {MENU_BUTTON.map((element) => (
              <div key={element.NAME} className={cn('menu-button')}>
                <Link href={element.HREF} className={cn('button-text')}>
                  {element.NAME}
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
