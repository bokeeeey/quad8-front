'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { getOrdersData } from '@/api/orderAPI';
import { MyInfoEmptyCase } from '@/app/my-info/_components';
import DatePicker from '@/components/DatePicker/DatePicker';
import type { Order } from '@/types/OrderTypes';
import OrderHeader from './OrderHeader/OrderHeader';
import OrderItemList from './OrderItemList/OrderItemList';

export default function Orders() {
  // const [page, setPage] = useState(0);
  // const [limit, setlimit] = useState(10);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const { data: ordersResponse } = useQuery<{ data: Order[] }>({
    queryKey: ['ordersResponse'],
    queryFn: () => getOrdersData({ page: 0, size: 10, startDate, endDate }),
  });

  const orders = ordersResponse?.data ?? [];

  const handleDateClick = (date: { startDate: Date; endDate: Date }) => {
    setStartDate(date.startDate.toISOString());
    setEndDate(date.endDate.toISOString());
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
