'use client';

import { deleteCommunityLikes, deleteProductLikes, postCommunityLikes, postProductLikes } from '@/api/likesAPI';
import SignInModal from '@/components/SignInModal/SignInModal';
import { QUERY_KEYS } from '@/constants/queryKey';
import { HeartIcon } from '@/public/index';
import type { CommunityPostCardDataType } from '@/types/communityType';
import type { Users } from '@/types/userType';
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
  const [isChecked, setIsChecked] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);

  const queryClient = useQueryClient();
  const { data: userData } = useQuery<{ data: Users }>({
    queryKey: ['userData'],
  });

  const { mutate: likeProductMutation } = useMutation({
    mutationFn: async ({ itemId, itemIsLiked }: LikeMutationProps) => {
      if (usage === 'community') {
        if (itemIsLiked) {
          await deleteCommunityLikes(itemId);
        } else {
          await postCommunityLikes(itemId);
        }
      } else if (itemIsLiked) {
        await deleteProductLikes([itemId]);
      } else {
        await postProductLikes(itemId);
      }
    },
  });

  const { mutate: likeCommunityMutation } = useMutation({
    mutationFn: async ({ itemId, itemIsLiked }: LikeMutationProps) => {
      if (itemIsLiked) {
        await deleteCommunityLikes(itemId);
      } else {
        await postCommunityLikes(itemId);
      }
    },
    onMutate: async ({ itemId, itemIsLiked }) => {
      await queryClient.cancelQueries({ queryKey: ['postData', itemId] });
      await queryClient.cancelQueries({ queryKey: ['postCardsList'] });

      const previousPostData = queryClient.getQueryData<{ data: { isLiked: boolean; likeCount: number } }>([
        'postData',
        itemId,
      ]);
      const previousPostCardsList = queryClient.getQueryData<{ content: CommunityPostCardDataType[] }>([
        'postCardsList',
      ]);

      if (previousPostData) {
        queryClient.setQueryData(['postData', itemId], {
          ...previousPostData,
          data: {
            ...previousPostData.data,
            isLiked: !itemIsLiked,
            likeCount: itemIsLiked ? previousPostData.data.likeCount - 1 : previousPostData.data.likeCount + 1,
          },
        });
      }

      if (previousPostCardsList) {
        const updatedPostCardsList = previousPostCardsList.content.map((post) =>
          post.id === itemId
            ? {
                ...post,
                isLiked: !itemIsLiked,
                likeCount: itemIsLiked ? post.likeCount - 1 : post.likeCount + 1,
              }
            : post,
        );
        queryClient.setQueryData(['postCardsList'], {
          ...previousPostCardsList,
          content: updatedPostCardsList,
        });
      }

      return { previousPostData, previousPostCardsList };
    },

    onError: (err, variables, context) => {
      queryClient.setQueryData(['postData', variables.itemId], context?.previousPostData);
      queryClient.setQueryData(['postCardsList'], context?.previousPostCardsList);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['postCardsList'] });
      queryClient.invalidateQueries({ queryKey: ['postData', id] });
    },
  });

  const handleClickButton = (e: MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (!userData?.data) {
      setIsSignInModalOpen(true);
      return;
    }

    setAnimate(true);

    if (usage === 'community') {
      setIsChecked((prev) => !prev);
      likeCommunityMutation({ itemId: id, itemIsLiked: isChecked });
    } else {
      likeProductMutation(
        { itemId: id, itemIsLiked: isChecked },
        {
          onSuccess: () => {
            setIsChecked((prev) => !prev);
            queryClient.invalidateQueries({ queryKey: [...QUERY_KEYS.LIKE.LISTS()] });
          },
        },
      );
    }
  };

  const displayLikeCount = () => {
    if (!likeCount || likeCount < 0) {
      return '0';
    }

    if (likeCount > MAX_COUNT) {
      return '99+';
    }

    return likeCount.toString();
  };

  useEffect(() => {
    setIsChecked(isLiked);
  }, [isLiked, userData]);

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
            <HeartIcon className={cn('heart', isChecked && 'red-heart')} />
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
