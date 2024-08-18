import { OrderStatus } from '@/types/orderType';
import { useEffect, useMemo, useState } from 'react';
import { useOrdersQuery } from './useOrdersQuery';

const DELIVERY_STATUS_LIST = [
  { label: '결제 완료', status: OrderStatus.PAYMENT_COMPLETED, count: 0 },
  { label: '배송 준비중', status: OrderStatus.PREPARING, count: 0 },
  { label: '배송 중', status: OrderStatus.SHIPPING, count: 0 },
  { label: '배송 완료', status: OrderStatus.DELIVERED, count: 0 },
  { label: '구매 확정', status: OrderStatus.CONFIRMED, count: 0 },
];

export const useDeliveryStatus = () => {
  const [deliveryStatusList, setDeliveryStatusList] = useState(DELIVERY_STATUS_LIST);

  const { data: ordersResponse } = useOrdersQuery({ page: 0, startDate: null, endDate: null });

  const orders = useMemo(() => ordersResponse?.data ?? [], [ordersResponse]);

  useEffect(() => {
    const updatedStatusList = DELIVERY_STATUS_LIST.map((statusItem) => ({
      ...statusItem,
      count: orders.filter((order) => order.orderStatus === statusItem.status).length,
    }));
    setDeliveryStatusList(updatedStatusList);
  }, [orders]);

  return deliveryStatusList;
};
