'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { debounce } from 'lodash';
import { useMemo, useState } from 'react';

import { getOrdersData } from '@/api/orderAPI';
import { MyInfoEmptyCase } from '@/app/my-info/_components';
import DatePicker from '@/components/DatePicker/DatePicker';
import type { Order } from '@/types/orderType';
import OrderHeader from './OrderHeader/OrderHeader';
import OrderItemList from './OrderItemList/OrderItemList';

export default function Orders() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  // const [limit, setlimit] = useState(10);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const { data: ordersResponse } = useQuery<{ data: Order[] }>({
    queryKey: ['ordersResponse', page, startDate, endDate],
    queryFn: () => getOrdersData({ page, size: 100, startDate, endDate }),
    placeholderData: (prevData) => prevData,
  });

  const orders = ordersResponse?.data ?? [];

  const debouncedRefetch = useMemo(
    () =>
      debounce(() => {
        queryClient.invalidateQueries({ queryKey: ['ordersResponse'] });
      }, 300),
    [queryClient],
  );

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
