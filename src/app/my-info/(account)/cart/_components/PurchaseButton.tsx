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
import type { CartAPIDataType } from '@/types/cartType';
import type { CreateOrderResponseType } from '@/types/orderType';

import styles from './PurchaseButton.module.scss';

const cn = classNames.bind(styles);

export default function PurchaseButton() {
  const router = useRouter();

  const { checkedCustomList, checkedShopList } = useContext(CartDataContext);

  const { data: cartData } = useQuery<CartAPIDataType>({ queryKey: ['cartData'], queryFn: getCartData });

  const customSelectedData =
    cartData?.CUSTOM.filter((custom) => checkedCustomList[custom.id]).map((element) => ({
      productId: element.productId,
      switchOptionId: element.productId,
      quantity: 1,
    })) ?? [];

  const shopSelectedData =
    cartData?.SHOP.filter((shop) => checkedShopList[shop.id]).map((element) => ({
      productId: element.productId,
      switchOptionId: element.optionId,
      quantity: element.count,
    })) ?? [];

  const selectedData = [...customSelectedData, ...shopSelectedData];

  const customData =
    cartData?.CUSTOM.map((element) => ({
      productId: element.productId,
      switchOptionId: element.productId,
      quantity: 1,
    })) ?? [];

  const shopData =
    cartData?.SHOP.map((element) => ({
      productId: element.productId,
      switchOptionId: element.optionId,
      quantity: element.count,
    })) ?? [];

  const allData = [...customData, ...shopData];

  const { mutate: createOrder } = useMutation({
    mutationFn: postCreateOrder,
    onSuccess: (response: CreateOrderResponseType) => {
      router.push(`${ROUTER.MY_PAGE.CHECKOUT}?orderId=${response.data.toString()}`);
    },
    onError: () => {
      toast.error('주문 정보 생성에 실패하였습니다');
    },
  });

  const handleClickSelectedButton = () => {
    createOrder(selectedData, {
      onError: () => {
        toast.error('주문 정보 생성에 실패하였습니다');
      },
    });
  };

  const handleClickAllButton = () => {
    createOrder(allData, {
      onError: () => {
        toast.error('주문 정보 생성에 실패하였습니다');
      },
    });
  };

  return (
    <div className={cn('button-wrapper')}>
      <Button
        backgroundColor={selectedData.length > 0 ? 'outline-primary' : 'outline-gray-40'}
        width={120}
        paddingVertical={8}
        fontSize={14}
        radius={4}
        onClick={handleClickSelectedButton}
        hoverColor={selectedData.length > 0 ? 'outline-primary-60' : 'outline-gray-40'}
        disabled={selectedData.length === 0}
      >
        선택 상품 구매
      </Button>
      <Button
        backgroundColor={allData.length > 0 ? 'outline-primary' : 'outline-gray-40'}
        width={120}
        paddingVertical={8}
        fontSize={14}
        radius={4}
        onClick={handleClickAllButton}
        hoverColor={allData.length > 0 ? 'outline-primary-60' : 'outline-gray-40'}
        disabled={allData.length === 0}
      >
        전체 상품 구매
      </Button>
    </div>
  );
}
