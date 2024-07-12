import { getProductReviews } from '@/api/productReviewAPI';
import { Dropdown } from '@/components';
import Pagination from '@/components/Pagination/Pagination';
import ReviewItem from '@/components/ReviewItem/ReviewItem';
import { PRODUCT_REVIEW_SORT_OPTIONS } from '@/constants/dropdownOptions';
import { searchParamsToObject } from '@/libs/searchParamsToObject';
import { NoReviewIcon } from '@/public/index';
import type { ProductReviewType, ReviewParamsType } from '@/types/ProductReviewTypes';
import { useQuery } from '@tanstack/react-query';
import classNames from 'classnames/bind';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './ProductReviewList.module.scss';
import ReviewImageList from './ReviewImageList';
import ReviewPreview from './ReviewPreview';

const cn = classNames.bind(styles);

interface ProductReviewListProps {
  data: ProductReviewType;
  productId: number;
}

export default function ProductReviewList({ data, productId }: ProductReviewListProps) {
  const { reviewDtoList, ...previewData } = data;
  const allReviewImgs = reviewDtoList.flatMap((review) =>
    review.reviewImgs.map((img) => ({
      reviewId: review.id,
      id: img.id,
      imageUrl: img.imageUrl,
    })),
  );

  const [dropdownValue, setDropdownValue] = useState(PRODUCT_REVIEW_SORT_OPTIONS[1].label);
  const [sortQuery, setSortQuery] = useState<string | undefined>(PRODUCT_REVIEW_SORT_OPTIONS[1].value);
  const searchParams = useSearchParams();

  const initialParams: ReviewParamsType = {
    page: searchParams.get('page') || '0',
    size: searchParams.get('size') || '16',
  };
  const searchParamsObj = searchParamsToObject(searchParams);

  const {
    data: sortedData,
    refetch,
    isPending,
  } = useQuery<ProductReviewType>({
    queryKey: ['review', productId, dropdownValue],
    queryFn: () =>
      getProductReviews({ productId, sort: sortQuery, page: initialParams.page, size: initialParams.size }),
    initialData: data,
  });

  const { reviewDtoList: sortedReviewDtoList, currentPage, ...rest } = sortedData;

  useEffect(() => {
    refetch();
  }, [dropdownValue, refetch]);

  const handleChangeSortReview = (selectedValue: string) => {
    const sortOption = PRODUCT_REVIEW_SORT_OPTIONS.find((option) => option.label === selectedValue);
    setDropdownValue(selectedValue);
    setSortQuery(sortOption?.value);
  };

  return (
    <div>
      <h3 className={cn('main-title')}>상품 리뷰</h3>
      {reviewDtoList.length > 0 && !isPending ? (
        <div className={cn('review-container')}>
          <ReviewPreview previewData={previewData} />
          <ReviewImageList productId={productId} reviewImgs={allReviewImgs} />
          <Dropdown
            options={PRODUCT_REVIEW_SORT_OPTIONS.map((option) => option.label)}
            sizeVariant='xs'
            value={dropdownValue}
            onChange={handleChangeSortReview}
          />
          <div className={cn('review-items')}>
            {sortedReviewDtoList.map((reviewData) => (
              <ReviewItem key={reviewData.id} data={reviewData} />
            ))}
          </div>
          <Pagination {...rest} number={currentPage} searchParams={searchParamsObj} />
        </div>
      ) : (
        <div className={cn('no-review-container')}>
          <NoReviewIcon />
          <h4 className={cn('no-review-text')}>등록된 리뷰가 없습니다</h4>
        </div>
      )}
    </div>
  );
}
