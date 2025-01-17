'use client';

import { useQuery } from '@tanstack/react-query';
import { createContext, PropsWithChildren, useCallback, useEffect, useMemo, useState } from 'react';

import { getCartData } from '@/api/cartAPI';
import type { CartAPIDataType } from '@/types/cartType';

interface CartDataContextType {
  checkedCustomList: Record<string, boolean>;
  checkedShopList: Record<string, boolean>;
  updateCheckedAllCustom: (value: boolean) => void;
  updateCheckedAllShop: (value: boolean) => void;
  updateCheckedCustom: (id: number) => void;
  updateCheckedShop: (id: number) => void;
}

export const CartDataContext = createContext<CartDataContextType>({
  checkedCustomList: {},
  checkedShopList: {},
  updateCheckedAllCustom: () => {},
  updateCheckedAllShop: () => {},
  updateCheckedCustom: () => {},
  updateCheckedShop: () => {},
});

export function CartDataContextProvider({ children }: PropsWithChildren) {
  const { data: cartData } = useQuery<CartAPIDataType>({ queryKey: ['cartData'], queryFn: getCartData });

  const [checkedCustomList, setCheckedCustomList] = useState<Record<string, boolean>>(
    cartData?.CUSTOM ? Object.fromEntries(cartData.CUSTOM.map((element) => [element.id, false])) : {},
  );
  const [checkedShopList, setCheckedShopList] = useState<Record<string, boolean>>(
    cartData?.SHOP ? Object.fromEntries(cartData.SHOP.map((element) => [element.id, false])) : {},
  );

  useEffect(() => {
    const customData = cartData?.CUSTOM ?? [];
    const shopData = cartData?.SHOP ?? [];

    setCheckedCustomList(Object.fromEntries(customData.map((element) => [element.id, false])));
    setCheckedShopList(Object.fromEntries(shopData.map((element) => [element.id, false])));
  }, [cartData]);

  const updateCheckedAllCustom = useCallback((value: boolean) => {
    setCheckedCustomList((prev) => Object.fromEntries(Object.entries(prev).map((element) => [element[0], value])));
  }, []);

  const updateCheckedAllShop = useCallback((value: boolean) => {
    setCheckedShopList((prev) => Object.fromEntries(Object.entries(prev).map((element) => [element[0], value])));
  }, []);

  const updateCheckedCustom = useCallback((id: number) => {
    setCheckedCustomList((prev) => ({ ...prev, [id]: !prev[String(id)] }));
  }, []);

  const updateCheckedShop = useCallback((id: number) => {
    setCheckedShopList((prev) => ({ ...prev, [id]: !prev[String(id)] }));
  }, []);

  const value = useMemo(
    () => ({
      checkedCustomList,
      checkedShopList,
      updateCheckedAllCustom,
      updateCheckedAllShop,
      updateCheckedCustom,
      updateCheckedShop,
    }),
    [
      checkedCustomList,
      checkedShopList,
      updateCheckedAllCustom,
      updateCheckedAllShop,
      updateCheckedCustom,
      updateCheckedShop,
    ],
  );

  return <CartDataContext.Provider value={value}>{children}</CartDataContext.Provider>;
}
