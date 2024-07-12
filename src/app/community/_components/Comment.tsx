'use client';

import classNames from 'classnames/bind';
import { forwardRef, useState, MouseEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import ProfileImage from '@/components/ProfileImage/ProfileImage';
import { calculateTimeDifference } from '@/libs/calculateDate';
import type { Users } from '@/types/userType';
import { PopOver } from '@/components';
import { deleteComment } from '@/api/communityAPI';
import { communityPopOverOption } from '@/libs/communityPopOverOption';

import styles from './Comment.module.scss';
import UserProfileCard from './UserProfileCard';

const cn = classNames.bind(styles);

interface CommentDataType {
  id: number;
  userId: number;
  nickName: string;
  imgUrl: string | null;
  content: string;
  createdAt: string;
}

interface CommentProps {
  cardId: number;
  onOpenPopOver: (commentId: number) => void;
  onClosePopOver: () => void;
  commentData: CommentDataType;
  isOpenedPopOver: boolean;
  onOpenProfileCard: () => void;
}

interface UserDataType {
  data: Users;
  status: string;
  message: string;
}

export default forwardRef<HTMLDivElement, CommentProps>(function Comment(
  { cardId, commentData, onOpenPopOver, onClosePopOver, isOpenedPopOver, onOpenProfileCard },
  ref,
) {
  const queryClient = useQueryClient();

  const {
    id: commentId,
    userId: commentUserId,
    nickName: nickname,
    imgUrl: profile,
    content: comment,
    createdAt: createdTime,
  } = commentData;

  const createdTimeToDate = new Date(createdTime);
  const [isOpenPopOver, setIsOpenPopOver] = useState(false);
  const [isOpenProfileCard, setIsOpenProfileCard] = useState(false);
  const [userCardDirection, setUserCardDirection] = useState<'top' | 'bottom'>('bottom');

  const userData = queryClient.getQueryData<UserDataType>(['userData']);
  const userID = userData?.data?.id;
  const timeAgo = calculateTimeDifference(createdTimeToDate);

  const { mutate: deleteCommentMutation } = useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      toast.success('댓글이 삭제되었습니다.');
      queryClient.invalidateQueries({
        queryKey: ['postData', cardId],
      });
      queryClient.invalidateQueries({ queryKey: ['postCardsList'] });
    },
    onError: () => {
      toast.error('댓글 삭제 중 오류가 발생하였습니다.');
    },
  });

  const handleOpenProfile = (e: MouseEvent<HTMLDivElement>) => {
    onOpenProfileCard();
    const { top } = e.currentTarget.getBoundingClientRect();
    const viewPortHeight = window.innerHeight;
    if (top > viewPortHeight / 2) {
      setUserCardDirection('top');
    }

    setIsOpenProfileCard(true);
  };

  const handleCloseProfile = () => {
    setIsOpenProfileCard(false);
  };

  const handleClickPopOver = () => {
    onOpenPopOver(commentId);
    setIsOpenPopOver(true);
  };

  const handleClickDelete = () => {
    deleteCommentMutation(commentId);
  };

  const handleClickEdit = () => {};

  const handleClickReport = () => {};

  return (
    <div className={cn('container')} ref={ref}>
      <div onMouseEnter={handleOpenProfile} onMouseLeave={handleCloseProfile}>
        <ProfileImage profileImage={profile && profile} />
        <UserProfileCard
          isOpenProfileCard={isOpenProfileCard}
          userId={commentUserId}
          isAboveCursor={userCardDirection === 'top'}
        />
      </div>
      <div className={cn('content-wrapper')}>
        <div className={cn('user-info-wrapper')}>
          <div className={cn('user-info')}>
            <p className={cn('nickname')}>{nickname}</p>
            <p className={cn('time-ago')}>{timeAgo}</p>
          </div>
          <PopOver
            optionsData={communityPopOverOption({
              isMine: userID === commentUserId,
              onClickDelete: handleClickDelete,
              onClickEdit: handleClickEdit,
              onClickReport: handleClickReport,
            })}
            isOpenPopOver={isOpenPopOver && isOpenedPopOver}
            onHandleOpen={handleClickPopOver}
            onHandleClose={onClosePopOver}
          />
        </div>
        <div className={cn('content')}>{comment}</div>
      </div>
    </div>
  );
});
