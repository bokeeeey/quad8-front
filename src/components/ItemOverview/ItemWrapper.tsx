import { CategoryNameType } from '@/types/productType';
import classNames from 'classnames/bind';
import Link from 'next/link';
import { ReactNode } from 'react';
import { ROUTER } from '@/constants/route';
import styles from './ItemWrapper.module.scss';

const cn = classNames.bind(styles);

interface ItemWrapperPropse {
  children: ReactNode;
  className?: string;
  productName: string;
  category: CategoryNameType | undefined;
  isRouteDetailPage?: boolean;
  productId: number;
}

type ShopCategory = 'KEYBOARD' | 'KEYCAP' | 'SWITCH' | 'ETC';

export default function ItemWrapper({
  children,
  className,
  productName,
  category,
  isRouteDetailPage,
  productId,
}: ItemWrapperPropse) {
  if (productName === '커스텀 키보드' || !isRouteDetailPage || !category) {
    return <div className={cn('item', className)}>{children}</div>;
  }
  return (
    <Link
      className={cn('item', className)}
      href={`${ROUTER.SHOP[category.toUpperCase() as ShopCategory]}/${productId}`}
    >
      {children}
    </Link>
  );
}
