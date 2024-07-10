'use client';

import ReviewItem from '@/components/ReviewItem/ReviewItem';
import { IMAGE_BLUR } from '@/constants/blurImage';
import { ChevronIcon } from '@/public/index';
import { ReviewDto } from '@/types/ProductReviewTypes';
import classNames from 'classnames/bind';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import styles from './ReviewImageModal.module.scss';

const cn = classNames.bind(styles);

interface ReviewImageModalProps {
  data: ReviewDto[];
  id: number;
}

export default function ReviewImageModal({ data, id }: ReviewImageModalProps) {
  const [currentReviewIndex, setCurrentReviewIndex] = useState<number>(() =>
    data.findIndex((review) => review.id === id),
  );
  const [currentImage, setCurrentImage] = useState<string>('');

  useEffect(() => {
    setCurrentImage(data[currentReviewIndex]?.reviewImgs[0]?.imageUrl || '');
  }, [currentReviewIndex, data]);

  const handleClickImage = (value: string) => {
    setCurrentImage(value);
  };

  const handlePreviousReview = () => {
    setCurrentReviewIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : data.length - 1));
  };

  const handleNextReview = () => {
    setCurrentReviewIndex((prevIndex) => (prevIndex < data.length - 1 ? prevIndex + 1 : 0));
  };

  const currentReview = data[currentReviewIndex];

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
