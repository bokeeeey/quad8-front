'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import classNames from 'classnames/bind';
import { useRouter } from 'next/navigation';
import { useContext } from 'react';
import { toast } from 'react-toastify';

import { getCartData } from '@/api/cartAPI';
import { postCreateOrder } from '@/api/orderAPI';
import { Button } from '@/components';
import { ROUTER } from '@/constants/route';
import { CartDataContext } from '@/context/CartDataContext';
import type { CartAPIDataType } from '@/types/CartTypes';
import type { CreateOrderResponseType } from '@/types/OrderTypes';

import { setCookie } from '@/libs/manageCookie';
import styles from './PurchaseButton.module.scss';

const cn = classNames.bind(styles);

export default function PurchaseButton() {
  const router = useRouter();

  const { checkedCustomList, checkedShopList } = useContext(CartDataContext);

  const { data: cartData } = useQuery<CartAPIDataType>({ queryKey: ['cartData'], queryFn: getCartData });

  const { mutate: createOrder } = useMutation({
    mutationFn: postCreateOrder,
    onSuccess: (response: CreateOrderResponseType) => {
      setCookie('orderId', response.data.toString());

      router.push(ROUTER.MY_PAGE.CHECKOUT);
    },
    onError: () => {
      toast.error('주문 정보 생성에 실패하였습니다');
    },
  });

  const handleClickSelectedButton = () => {
    const customSelectedData =
      cartData?.CUSTOM.filter((custom) => checkedCustomList[custom.id]).map((element) => ({
        productId: element.productId,
        switchOptionId: element.productId,
        quantity: 1,
      })) ?? [];

    const shopSelectedData =
      cartData?.SHOP.filter((shop) => checkedShopList[shop.id]).map((element) => ({
        productId: element.prductId,
        switchOptionId: element.optionId,
        quantity: element.count,
      })) ?? [];

    const orderData = [...customSelectedData, ...shopSelectedData];
    createOrder(orderData, {
      onSuccess: () => {
        router.push(ROUTER.MY_PAGE.CHECKOUT);
      },
      onError: () => {
        toast.error('주문 정보 생성에 실패하였습니다');
      },
    });
  };

  const handleClickAllButton = () => {
    const customData =
      cartData?.CUSTOM.map((element) => ({
        productId: element.productId,
        switchOptionId: element.productId,
        quantity: 1,
      })) ?? [];

    const shopData =
      cartData?.SHOP.map((element) => ({
        productId: element.prductId,
        switchOptionId: element.optionId,
        quantity: element.count,
      })) ?? [];

    const orderData = [...customData, ...shopData];
    createOrder(orderData, {
      onSuccess: () => {
        router.push(ROUTER.MY_PAGE.CHECKOUT);
      },
      onError: () => {
        toast.error('주문 정보 생성에 실패하였습니다');
      },
    });
  };

  return (
    <div className={cn('button-wrapper')}>
      <Button
        backgroundColor='outline-primary'
        width={120}
        paddingVertical={8}
        fontSize={14}
        radius={4}
        onClick={handleClickSelectedButton}
      >
        선택 상품 구매
      </Button>
      <Button
        backgroundColor='outline-primary'
        width={120}
        paddingVertical={8}
        fontSize={14}
        radius={4}
        onClick={handleClickAllButton}
      >
        전체 상품 구매
      </Button>
    </div>
  );
}
