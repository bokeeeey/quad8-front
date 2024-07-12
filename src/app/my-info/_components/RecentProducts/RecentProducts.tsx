'use client';

import { getRecentProducts } from '@/api/productAPI';
import ProductItem from '@/components/Products/ProductItem';
import type { ProductType } from '@/types/ProductTypes';
import type { Users } from '@/types/userType';
import { useQuery } from '@tanstack/react-query';
import classNames from 'classnames/bind';
import MyInfoEmptyCase from '../MyInfoEmptyCase/MyInfoEmptyCase';
import styles from './RecentProducts.module.scss';

const cn = classNames.bind(styles);

export default function RecentProducts() {
  // const [recentViewProducts, setRecentViewProducts] = useState([]);
  const { data: userData } = useQuery<{ data: Users }>({
    queryKey: ['userData'],
  });

  const userId = userData?.data.id;

  const { data: recentViewProducts } = useQuery<ProductType[]>({
    queryKey: ['recentProducts', userId],
    queryFn: () => getRecentProducts(userId),
    enabled: !!userId,
  });
  console.log(recentViewProducts);

  // useEffect(() => {
  //   const prevItems = window.localStorage.getItem('recentViews');

  //   if (prevItems) {
  //     setRecentViewProducts(JSON.parse(prevItems));
  //   }
  // }, []);

  return (
    <article className={cn('recent')}>
      <h1 className={cn('recent-title')}>최근 본 상품</h1>
      {!userData && recentViewProducts ? (
        <div className={cn('recent-items')}>
          {recentViewProducts.map(
            ({ id, name, price, thubmnailList, categoryName, isLiked, reviewscount }: ProductType) => (
              <ProductItem
                key={id}
                id={id}
                size='sm'
                name={name}
                price={price}
                thumbnail={thubmnailList[0].imgUrl}
                reviewscount={reviewscount}
                isLiked={isLiked}
                category={categoryName}
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
