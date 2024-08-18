'use client';

import { DatePicker, MyInfoEmptyCase } from '@/components';
import { useDebouncedInvalidate } from '@/hooks/useDebouncedInvalidate';
import { useOrdersQuery } from '@/hooks/useOrdersQuery';
import type { Order } from '@/types/orderType';
import { useState } from 'react';
import { OrderHeader, OrderItemList } from './index';

export default function Orders() {
  const [page, setPage] = useState(0);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const { data: ordersResponse } = useOrdersQuery({ page, startDate, endDate });
  const debouncedRefetch = useDebouncedInvalidate({ queryKey: 'ordersResponse', delay: 300 });

  const orders = ordersResponse?.data ?? [];

  const handleDateClick = (date: { startDate: Date; endDate: Date }) => {
    setStartDate(date.startDate);
    setEndDate(date.endDate);
    setPage(0);

    debouncedRefetch();
  };

  return (
    <>
      <DatePicker onDateChange={handleDateClick} />
      {orders.length > 0 ? (
        <>
          <OrderHeader />
          {orders.map((order: Order) => (
            <OrderItemList key={order.orderId} order={order} />
          ))}
        </>
      ) : (
        <MyInfoEmptyCase message='구매내역이 없습니다.' />
      )}
    </>
  );
}
