'use client';

import { deleteReviewLikes, postReviewLikes } from '@/api/likesAPI';
import SignInModal from '@/components/SignInModal/SignInModal';
import { ThumbIcon } from '@/public/index';
import type { ProductReviewType } from '@/types/productReviewType';
import type { Users } from '@/types/userType';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import classNames from 'classnames/bind';
import { useState } from 'react';
import styles from './ReviewLikeButton.module.scss';

const cn = classNames.bind(styles);

interface ReviewLikeButtonProps {
  productId: number;
  reviewId: number;
  isLiked: boolean;
  likeCount: number;
}

export default function ReviewLikeButton({ productId, reviewId, isLiked, likeCount }: ReviewLikeButtonProps) {
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const { data: userData } = useQuery<{ data: Users }>({
    queryKey: ['userData'],
  });

  const { mutate: reviewLikeMutation } = useMutation({
    mutationFn: async () => {
      if (isLiked) {
        await deleteReviewLikes(reviewId);
      } else {
        await postReviewLikes(reviewId);
      }
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['review', productId] });

      const previousData = queryClient.getQueryData<ProductReviewType>(['review', productId]);

      if (previousData) {
        const newData = {
          ...previousData,
          reviewDtoList: previousData.reviewDtoList.map((review) => {
            if (review.id === reviewId) {
              return {
                ...review,
                likedByUser: !isLiked,
                likeCount: isLiked ? review.likeCount - 1 : review.likeCount + 1,
              };
            }
            return review;
          }),
        };

        queryClient.setQueryData(['review', productId], newData);
      }

      return { previousData };
    },
    onError: (err, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['review', productId], context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['review', productId] });
    },
  });

  const handleClickButton = () => {
    if (!userData?.data) {
      setIsSignInModalOpen(true);
      return;
    }

    reviewLikeMutation();
  };

  const handleCloseModal = () => {
    setIsSignInModalOpen(false);
  };

  return (
    <>
      <button type='button' className={cn('like-circle', { 'red-circle': isLiked })} onClick={handleClickButton}>
        <ThumbIcon className={cn('thumb', isLiked && 'white-thumb')} />
        <span>{likeCount}</span>
      </button>

      <SignInModal isOpen={isSignInModalOpen} onClose={handleCloseModal} />
    </>
  );
}
