'use client';

import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import { getOrdersData } from '@/api/orderAPI';
import { MyInfoEmptyCase } from '@/app/my-info/_components';
import DatePicker from '@/components/DatePicker/DatePicker';
import { formatStartDate } from '@/libs/formatStartDate';
import type { Order } from '@/types/OrderTypes';
import OrderHeader from './OrderHeader/OrderHeader';
import OrderItemList from './OrderItemList/OrderItemList';

export default function Orders() {
  // const [page, setPage] = useState(0);
  // const [limit, setlimit] = useState(10);
  // const [startDate, setStartDate] = useState('');
  // const [endDate, setEndDate] = useState('');

  const { data: orders } = useQuery<{ data: Order[] }>({
    queryKey: ['ordersData'],
    queryFn: () => getOrdersData({ page: 0, size: 10, startDate: '', endDate: '' }),
  });

  const [searchDate, setSearchDate] = useState('');
  const [ordersData, setOrdersData] = useState(orders?.data ?? []);

  useEffect(() => {
    if (orders && searchDate !== '') {
      const filteredOrders = orders.data.filter((order) => new Date(order.purchaseDate) > new Date(searchDate));
      setOrdersData(filteredOrders);
    }
  }, [searchDate, orders]);

  const handleDateClick = (date: { startDate: Date; endDate: Date }) => {
    const startDate = new Date(date.startDate);
    setSearchDate(formatStartDate(startDate));
  };

  return (
    <>
      <DatePicker onDateChange={handleDateClick} />
      {ordersData?.length > 0 ? (
        <>
          <OrderHeader />
          {ordersData?.map((order: Order) => <OrderItemList key={order.orderId} order={order} />)}
        </>
      ) : (
        <MyInfoEmptyCase message='구매내역이 없습니다.' />
      )}
    </>
  );
}
