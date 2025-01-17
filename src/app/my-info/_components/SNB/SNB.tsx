'use client';

import { ROUTER } from '@/constants/route';
import classNames from 'classnames/bind';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import styles from './SNB.module.scss';

const cn = classNames.bind(styles);

const SECTIONS = [
  {
    category: '나의 쇼핑 활동',
    items: [
      { name: '주문 / 배송 조회', route: ROUTER.MY_PAGE.ORDERS },
      { name: '배송지 관리', route: ROUTER.MY_PAGE.ADDRESSES },
      { name: '구매 후기', route: ROUTER.MY_PAGE.REVIEWS },
      { name: '찜 목록', route: ROUTER.MY_PAGE.WISHLIST },
      { name: '장바구니', route: ROUTER.MY_PAGE.CART },
    ],
  },
  {
    category: '커뮤니티',
    items: [{ name: '내 게시글', route: ROUTER.MY_PAGE.MY_POSTS }],
  },
  {
    category: '쿠폰',
    items: [{ name: '보유 중인 쿠폰', route: ROUTER.MY_PAGE.COUPONS }],
  },
];

export default function SNB() {
  const currentPathname = usePathname();

  return (
    <nav className={cn('snb')}>
      <Link className={cn('snb-main')} href={ROUTER.MY_PAGE.MY_INFO}>
        마이 페이지
      </Link>
      {SECTIONS.map((section, i) => (
        <div className={cn('snb-sections')} key={section.category}>
          <div className={cn('snb-category', `snb-category-${i + 1}`)}>{section.category}</div>
          <div className={cn('snb-items')}>
            {section.items?.map((item) => (
              <Link key={item.name} href={item.route}>
                <div className={cn('snb-item', { selected: currentPathname === item.route })}>{item.name}</div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </nav>
  );
}
