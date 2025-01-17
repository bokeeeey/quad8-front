'use client';

import { ROUTER } from '@/constants/route';
import { ChevronIcon } from '@/public/index';
import type { CategoryKey } from '@/types/categoryType';
import classNames from 'classnames/bind';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import styles from './Breadcrumb.module.scss';

const cn = classNames.bind(styles);

const CATEGORY_MAP = {
  keyboard: '키보드',
  keycap: '키캡',
  switch: '스위치',
  etc: '기타용품',
} as const;

export default function Breadcrumb() {
  const { category }: { category: CategoryKey } = useParams();

  return (
    <ul className={cn('breadcrumb-list')}>
      <li className={cn('breadcrumb-item')}>
        <Link href={ROUTER.MAIN}>HOME</Link>
      </li>
      <ChevronIcon className={cn('arrow-icon')} />
      <li className={cn('breadcrumb-item', { 'current-category': !category })}>
        <Link href={ROUTER.SHOP.ALL}>SHOP</Link>
      </li>
      {category && (
        <>
          <ChevronIcon className={cn('arrow-icon')} />
          <li className={cn('current-category')}>
            <Link href={`${ROUTER.SHOP.ALL}/${category}`}>{CATEGORY_MAP[category]}</Link>
          </li>
        </>
      )}
    </ul>
  );
}
