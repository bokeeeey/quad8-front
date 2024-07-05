'use client';

import { deleteCommunityLikes, deleteProductLikes, postCommunityLikes, postProductLikes } from '@/api/likesAPI';
import SignInModal from '@/components/SignInModal/SignInModal';
import { HeartIcon } from '@/public/index';
import { Users } from '@/types/userType';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import classNames from 'classnames/bind';
import { MouseEvent, useEffect, useState } from 'react';
import styles from './HeartButton.module.scss';

const cn = classNames.bind(styles);

interface HeartButtonProps {
  id: number;
  usage?: 'detail' | 'community';
  isLiked: boolean;
  likeCount?: number;
}

interface LikeMutationProps {
  itemId: number;
  itemIsLiked: boolean;
}

const MAX_COUNT = 99;

export default function HeartButton({ id, usage, isLiked, likeCount }: HeartButtonProps) {
  const queryClient = useQueryClient();

  const [isChecked, setIsChecked] = useState(isLiked);
  const [animate, setAnimate] = useState(false);
  const [newLikeCount, setNewLikeCount] = useState(likeCount || 0);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const { data: userData } = useQuery<{ data: Users }>({
    queryKey: ['userData'],
  });

  const { mutate: likeMutation } = useMutation({
    mutationFn: async ({ itemId, itemIsLiked }: LikeMutationProps) => {
      if (usage === 'community') {
        if (itemIsLiked) {
          await deleteCommunityLikes(itemId);
        } else {
          await postCommunityLikes(itemId);
        }
      } else if (itemIsLiked) {
        await deleteProductLikes(itemId);
      } else {
        await postProductLikes(itemId);
      }
    },
  });

  const handleClickButton = (e: MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setAnimate(true);

    if (!userData?.data) {
      setIsSignInModalOpen(true);
      return;
    }

    likeMutation(
      { itemId: id, itemIsLiked: isChecked },
      {
        onSuccess: () => {
          setIsChecked((prev) => !prev);
          setNewLikeCount((prev) => (isChecked ? prev - 1 : prev + 1));
        },
      },
    );
  };

  const displayLikeCount = () => {
    if (!likeCount) {
      return '0';
    }

    if (likeCount > MAX_COUNT) {
      return '99+';
    }

    return likeCount.toString();
  };

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['postCardsList'] });
    queryClient.invalidateQueries({ queryKey: ['postData', id] });
    queryClient.invalidateQueries({ queryKey: ['MyCustomReview'] });
  }, [newLikeCount, id, queryClient, isChecked]);

  return (
    <>
      <div
        className={cn('count-wrap', {
          circle: usage === 'detail',
          'red-circle': isChecked,
          'jello-animate': animate && isChecked,
        })}
        onClick={handleClickButton}
      >
        {usage === 'community' ? (
          <div className={cn('count-wrap')}>
            <HeartIcon className={cn('heart', isLiked && 'red-heart')} />
            <span className={cn('like-count')}>{displayLikeCount()}</span>
          </div>
        ) : (
          <HeartIcon className={cn('heart', usage === 'detail' && 'white-stroke', isChecked && 'red-heart')} />
        )}
      </div>

      <SignInModal isOpen={isSignInModalOpen} onClose={() => setIsSignInModalOpen(false)} />
    </>
  );
}
