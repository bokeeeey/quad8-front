'use client';

import { getProductDetail } from '@/api/productAPI';
import { getUserProductReviews } from '@/api/productReviewAPI';

import DatePicker from '@/components/DatePicker/DatePicker';
import ReviewItem from '@/components/ReviewItem/ReviewItem';

import { formatDateToQueryString } from '@/libs/formatDateToQueryString';
import { SpinLoading } from '@/public/index';
import type { ReviewResponse } from '@/types/ProductReviewTypes';

import { useQueries, useQuery } from '@tanstack/react-query';
import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import MyReviewProduct from './MyReviewProduct';

import styles from './MyReviewProduct.module.scss';

const cn = classNames.bind(styles);

interface MyReviewListProps {
  data: ReviewResponse;
}

export default function MyReviewList({ data }: MyReviewListProps) {
  const [searchDate, setSearchDate] = useState<{ startDate: string; endDate: string }>({
    startDate: '2024-01-01T00:00:00',
    endDate: formatDateToQueryString('end', new Date()),
  });

  const {
    data: reviewsData,
    isLoading: isReviewsLoading,
    refetch,
  } = useQuery({
    queryKey: ['userProductReviews', searchDate],
    queryFn: () => getUserProductReviews({ startDate: searchDate.startDate, endDate: searchDate.endDate }),
    initialData: data,
  });

  const productQueries = useQueries({
    queries: (reviewsData?.reviewDtoList || []).map((review) => ({
      queryKey: ['product', review.productId],
      queryFn: () => getProductDetail(review.productId),
    })),
  });

  const isLoading = isReviewsLoading || productQueries.some((query) => query.isLoading);

  useEffect(() => {
    refetch();
  }, [searchDate, refetch]);

  const handleDateChange = (date: { startDate: Date; endDate: Date }) => {
    setSearchDate({
      startDate: formatDateToQueryString('start', date.startDate),
      endDate: formatDateToQueryString('end', date.endDate),
    });
  };

  if (isLoading) {
    return (
      <div className={cn('loading')}>
        <SpinLoading />
      </div>
    );
  }

  return (
    <div>
      <DatePicker onDateChange={handleDateChange} />
      {reviewsData?.reviewDtoList.length > 0 ? (
        <div className={cn('total-review-container')}>
          {reviewsData.reviewDtoList.map((reviewData, index) => (
            <div key={reviewData.id}>
              <MyReviewProduct
                productId={reviewData.productId}
                updatedAt={reviewData.updatedAt}
                switchOption={reviewData.switchOption}
                productData={productQueries[index].data}
              />
              <ReviewItem reviewData={reviewData} usage='mypage' />
            </div>
          ))}
        </div>
      ) : (
        <div className={cn('no-review')}>등록된 구매 후기가 없습니다.</div>
      )}
    </div>
  );
}
