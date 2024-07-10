'use client';

import Image from 'next/image';
import { useState } from 'react';

import { Rating } from '@/components';
import { REVIEW_KEYWORD } from '@/constants/reviewKeyword';
import type { ReviewDto } from '@/types/ProductReviewTypes';

import { CATEGORY_MAP } from '@/constants/product';
import { formatDateToString } from '@/libs/formatDateToString';
import classNames from 'classnames/bind';
import ReviewLikeButton from '../Buttons/ReviewLikeButton/ReviewLikeButton';
import ProfileImage from '../ProfileImage/ProfileImage';
import RenderImages from './RenderImages';
import RenderKeywords from './RenderKeywords';
import styles from './ReviewItem.module.scss';

const cn = classNames.bind(styles);

interface ReviewItemProps {
  usage?: 'mypage' | 'modal';
  data: ReviewDto;
}

const PRODUCT_LIST = Object.values(CATEGORY_MAP);

export default function ReviewItem({ usage, data }: ReviewItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const {
    id,
    score,
    content,
    reviewImgs,
    option1,
    option2,
    option3,
    switchOption,
    productCategoryId,
    writer,
    likeCount,
    likedByUser,
    updatedAt,
  } = data;
  const { nickname, imgUrl } = writer;
  const optionsValues = [option1, option2, option3];

  const optionKeywords = Object.entries(REVIEW_KEYWORD[PRODUCT_LIST[productCategoryId - 1]]);

  const handleToggleExpanded = () => {
    if (!usage && reviewImgs?.length > 0) {
      setIsExpanded((prev) => !prev);
    }
  };

  return (
    <div
      className={cn('review-item', {
        expand: isExpanded,
        'mypage-review': usage === 'mypage',
        'modal-review': usage === 'modal',
      })}
    >
      {usage === 'modal' ? (
        <>
          <div className={cn('modal-top-section')}>
            <div className={cn('modal-top-left-section')}>
              <ProfileImage profileImage={imgUrl} />
              <div className={cn('modal-info-section')}>
                <Rating rating={score} />
                <h2 className={cn('name')}>
                  {nickname} · {formatDateToString(new Date(updatedAt))}
                </h2>
              </div>
            </div>
            <ReviewLikeButton id={id} isLiked={likedByUser} likeCount={likeCount} />
          </div>
          <div className={cn('modal-option-section')}>
            {switchOption.length ? <h2 className={cn('option')}>스위치: {switchOption}</h2> : ''}

            <RenderKeywords optionKeywords={optionKeywords} optionsValues={optionsValues} />
          </div>
          <div className={cn('modal-content')}>
            <p>{content}</p>
          </div>
        </>
      ) : (
        <>
          {usage !== 'mypage' && <ProfileImage profileImage={imgUrl} />}
          <div className={cn('review-box')}>
            <div className={cn('info-section')}>
              <div className={cn('rating-date')}>
                <Rating rating={score} />
                {usage === 'mypage' ? (
                  <h2 className={cn('star')}>{score}</h2>
                ) : (
                  <h2 className={cn('date')}>{formatDateToString(new Date(updatedAt))}</h2>
                )}
              </div>
              {usage !== 'mypage' && (
                <>
                  <h2 className={cn('name')}>{nickname}</h2>
                  {switchOption.length ? <h2 className={cn('option')}>스위치: {switchOption}</h2> : ''}
                </>
              )}
            </div>
            <RenderKeywords optionKeywords={optionKeywords} optionsValues={optionsValues} />
            <div
              className={cn({ 'content-image-section': !usage, 'my-page-section': usage })}
              onClick={handleToggleExpanded}
            >
              <p className={cn('content')}>{content}</p>
              {usage !== 'mypage' && !isExpanded && reviewImgs?.length > 0 && (
                <div className={cn('image-section')}>
                  <Image
                    src={reviewImgs[0].imageUrl}
                    className={cn('small-image')}
                    width={123}
                    height={123}
                    alt='리뷰 이미지'
                  />
                  {data.reviewImgs.length > 1 && <div className={cn('image-count')}>{data.reviewImgs.length}</div>}
                </div>
              )}
              {usage !== 'mypage' && isExpanded && (
                <div className={cn('expand-image-section')}>
                  <RenderImages reviewImgs={reviewImgs} width={600} height={600} altPrefix='펼친 리뷰 이미지' />
                </div>
              )}
              {usage === 'mypage' && (
                <RenderImages
                  className={cn('mypage-review-image')}
                  reviewImgs={reviewImgs}
                  width={80}
                  height={80}
                  altPrefix='마이페이지 리뷰 이미지'
                />
              )}
            </div>
          </div>
          {usage !== 'mypage' && (
            <div className={cn('button-section')}>
              <ReviewLikeButton id={id} isLiked={likedByUser} likeCount={likeCount} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
