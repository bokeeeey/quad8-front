'use client';

import { Modal } from '@/components';
import RenderImages from '@/components/ReviewItem/RenderImages';
import { ChevronIcon } from '@/public/index';
import type { ReviewImage } from '@/types/ProductReviewTypes';
import classNames from 'classnames/bind';
import { useState } from 'react';
import styles from './ReviewImageList.module.scss';
import ReviewImageModal from './ReviewImageModal';

const cn = classNames.bind(styles);
interface ReviewImageListProps {
  productId: number;
  reviewImgs: ReviewImage[];
}

const SECTION_SIZE = 7;

export default function ReviewImageList({ productId, reviewImgs }: ReviewImageListProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [reviewId, setReviewId] = useState<number>(0);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

  const isPrevDisabled = currentSectionIndex === 0;
  const isNextDisabled = currentSectionIndex === Math.floor(reviewImgs.length / SECTION_SIZE) - 1;

  const handleModalOpen = (id: number) => {
    setIsOpen(true);
    setReviewId(id);
  };

  const handleModalClose = () => {
    setIsOpen(false);
  };

  const handleMovePrevSection = () => {
    if (currentSectionIndex > 0) setCurrentSectionIndex((prev) => prev - 1);
  };
  const handleMoveNextSection = () => {
    if (currentSectionIndex < Math.floor(reviewImgs.length / SECTION_SIZE)) setCurrentSectionIndex((prev) => prev + 1);
  };

  return (
    <div className={cn('all-review-image-lists')}>
      <div className={cn('arrow-buttons')}>
        <div
          className={cn('arrow-box', { disabled: isPrevDisabled })}
          onClick={!isPrevDisabled ? handleMovePrevSection : undefined}
        >
          <ChevronIcon className={cn('arrow', { disabled: isPrevDisabled })}>{'<'}</ChevronIcon>
        </div>
        <div
          className={cn('arrow-box', {
            disabled: isNextDisabled,
          })}
          onClick={!isNextDisabled ? handleMoveNextSection : undefined}
        >
          <ChevronIcon
            className={cn('arrow', 'right', {
              disabled: isNextDisabled,
            })}
          >
            {'>'}
          </ChevronIcon>
        </div>
      </div>
      <div className={cn('all-review-images')}>
        <RenderImages
          className={cn('all-review-image')}
          reviewImgs={reviewImgs.slice(currentSectionIndex * SECTION_SIZE, (currentSectionIndex + 1) * SECTION_SIZE)}
          width={200}
          height={200}
          altPrefix='전체 리뷰 이미지'
          onClick={handleModalOpen}
        />
      </div>
      <Modal isOpen={isOpen} onClose={handleModalClose}>
        <ReviewImageModal productId={productId} reviewId={reviewId} />
      </Modal>
    </div>
  );
}
