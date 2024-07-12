'use client';

import { getProductReviews } from '@/api/productReviewAPI';
import ReviewItem from '@/components/ReviewItem/ReviewItem';
import { IMAGE_BLUR } from '@/constants/blurImage';
import { ChevronIcon } from '@/public/index';
import { ProductReviewType, ReviewDto } from '@/types/ProductReviewTypes';
import { useQuery } from '@tanstack/react-query';
import classNames from 'classnames/bind';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import styles from './ReviewImageModal.module.scss';

const cn = classNames.bind(styles);

interface ReviewImageModalProps {
  productId: number;
  reviewId: number;
}

export default function ReviewImageModal({ productId, reviewId }: ReviewImageModalProps) {
  const [currentReviewIndex, setCurrentReviewIndex] = useState<number>(0);
  const [currentImage, setCurrentImage] = useState<string>('');
  const [currentReviewId, setCurrentReviewId] = useState<number>(reviewId);
  const [currentReview, setCurrentReview] = useState<ReviewDto>();

  const { data } = useQuery<ProductReviewType>({
    queryKey: ['review', productId, currentReviewId],
    queryFn: () => getProductReviews({ productId }),
  });

  useEffect(() => {
    if (data) {
      const index = data.reviewDtoList.findIndex((review) => review.id === currentReviewId);
      if (index !== -1) {
        setCurrentReviewIndex(index);
        setCurrentImage(data.reviewDtoList[index]?.reviewImgs[0]?.imageUrl || '');
        setCurrentReview(data.reviewDtoList[currentReviewIndex]);
      }
    }
  }, [data, currentReviewId, currentReviewIndex]);

  const handleClickImage = (value: string) => {
    setCurrentImage(value);
  };

  const handlePreviousReview = () => {
    setCurrentReviewIndex((prevIndex) => {
      const newIndex = prevIndex > 0 ? prevIndex - 1 : (data?.reviewDtoList.length ?? 1) - 1;
      setCurrentReviewId(data?.reviewDtoList[newIndex]?.id ?? reviewId);
      return newIndex;
    });
  };

  const handleNextReview = () => {
    setCurrentReviewIndex((prevIndex) => {
      const newIndex = prevIndex < (data?.reviewDtoList.length ?? 1) - 1 ? prevIndex + 1 : 0;
      setCurrentReviewId(data?.reviewDtoList[newIndex]?.id ?? reviewId);
      return newIndex;
    });
  };

  return (
    <div>
      {currentReview ? (
        <div className={cn('total-modal')}>
          <ChevronIcon className={cn('chevron')} onClick={handlePreviousReview} />
          <div className={cn('review-modal')}>
            <div className={cn('left-section')}>
              <Image
                className={cn('big-image')}
                src={currentImage}
                alt='썸네일'
                width={300}
                height={300}
                priority
                placeholder={IMAGE_BLUR.placeholder}
                blurDataURL={IMAGE_BLUR.blurDataURL}
              />
            </div>
            <div className={cn('right-section')}>
              <ReviewItem data={currentReview} usage='modal' />
              <div className={cn('image-section')}>
                {currentReview.reviewImgs.map((item) => (
                  <div key={item.id} className={cn('small-image-wrap')}>
                    <Image
                      className={cn('small-image')}
                      src={item.imageUrl}
                      alt='썸네일'
                      width={100}
                      height={100}
                      onClick={() => handleClickImage(item.imageUrl)}
                      priority
                      placeholder={IMAGE_BLUR.placeholder}
                      blurDataURL={IMAGE_BLUR.blurDataURL}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <ChevronIcon className={cn('chevron', 'right')} onClick={handleNextReview} />
        </div>
      ) : (
        <div />
      )}
    </div>
  );
}
