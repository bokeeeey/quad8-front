'use client';

import { useQuery } from '@tanstack/react-query';
import classNames from 'classnames/bind';

import { getRecentProducts } from '@/api/productAPI';
import { getUserData } from '@/api/usersAPI';
import ProductItem from '@/components/Products/ProductItem';
import type { RecentProductType } from '@/types/ProductType';
import type { Users } from '@/types/userType';
import MyInfoEmptyCase from '../MyInfoEmptyCase/MyInfoEmptyCase';

import styles from './RecentProducts.module.scss';

const cn = classNames.bind(styles);

export default function RecentProducts() {
  const { data: userData } = useQuery<{ data: Users }>({
    queryKey: ['userData'],
    queryFn: getUserData,
  });

  const userId = userData?.data.id;

  const { data: recentViewProducts } = useQuery<RecentProductType[]>({
    queryKey: ['recent-products', userId],
    queryFn: () => getRecentProducts(),
    enabled: !!userId,
  });

  return (
    <article className={cn('recent')}>
      <h1 className={cn('recent-title')}>최근 본 상품</h1>
      {userData && recentViewProducts ? (
        <div className={cn('recent-items')}>
          {recentViewProducts.map(
            ({ productId, name, price, thumbnail, category, liked, reviewCount }: RecentProductType) => (
              <ProductItem
                key={productId}
                id={productId}
                size='sm'
                name={name}
                price={price}
                thumbnail={thumbnail}
                reviewscount={reviewCount}
                isLiked={liked}
                category={category}
                hasShop={false}
              />
            ),
          )}
        </div>
      ) : (
        <MyInfoEmptyCase message='최근 본 상품이 없습니다' isBackgroundColor />
      )}
    </article>
  );
}
