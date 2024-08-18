import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import classNames from 'classnames/bind';

import { getCartData } from '@/api/cartAPI';
import CustomCardList from './_components/CustomCardList';
import DeleteButton from './_components/DeleteButton';
import PurchaseButton from './_components/PurchaseButton';
import ShopCardList from './_components/ShopCardList';
import TotalCheckBox from './_components/TotalCheckBox';
import TotalPrice from './_components/TotalPrice';

import styles from './page.module.scss';

const cn = classNames.bind(styles);

export default async function CartPage() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({ queryKey: ['cartData'], queryFn: getCartData });
  const dehydratedState = dehydrate(queryClient);
  return (
    <HydrationBoundary state={dehydratedState}>
      <div className={cn('wrapper')}>
        <div className={cn('title')}>장바구니</div>
        <div className={cn('sub-title-wrapper')}>
          <TotalCheckBox type='total' />
          <DeleteButton>선택 삭제</DeleteButton>
        </div>
        <div className={cn('content-wrapper')}>
          <div className={cn('product-wrapper')}>
            <div className={cn('product-category-wrapper')}>
              <div className={cn('content-title-wrapper')}>
                <TotalCheckBox type='custom' />
              </div>
              <CustomCardList />
            </div>
            <div className={cn('product-category-wrapper')}>
              <div className={cn('content-title-wrapper')}>
                <TotalCheckBox type='shop' />
              </div>
              <ShopCardList />
            </div>
          </div>
          <div className={cn('price-button-wrapper')}>
            <TotalPrice />
            <PurchaseButton />
          </div>
        </div>
      </div>
    </HydrationBoundary>
  );
}
