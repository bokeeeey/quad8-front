'use client';

import classNames from 'classnames/bind';
import { MouseEvent, useState, forwardRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import ProfileImage from '@/components/ProfileImage/ProfileImage';
import { calculateTimeDifference } from '@/libs/calculateDate';
import type { Users } from '@/types/userType';
import { PopOver } from '@/components';
import { deleteComment } from '@/api/communityAPI';

import styles from './Comment.module.scss';

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
  commentData: CommentDataType;
}

interface UserDataType {
  data: Users;
  status: string;
  message: string;
}

export default forwardRef<HTMLDivElement, CommentProps>(function Comment({ cardId, commentData }, ref) {
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

  const userData = queryClient.getQueryData<UserDataType>(['userData']);
  const userID = userData?.data?.id;

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

  const handleClickPopOver = (e: MouseEvent<SVGElement>) => {
    setIsOpenPopOver(!isOpenPopOver);
    e.stopPropagation();
  };

  const handleClosePopOver = () => {
    setIsOpenPopOver(false);
  };

  const handleClickDelete = (e: MouseEvent<HTMLDivElement>) => {
    deleteCommentMutation(commentId);
    e.stopPropagation();
  };

  const handleClickReport = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  const MY_POPOVER_OPTION = [
    {
      label: '삭제하기',
      onClick: handleClickDelete,
    },
    {
      label: '신고하기',
      onClick: handleClickReport,
    },
  ];

  const OTHERS_POPOVER_OPTION = [
    {
      label: '신고하기',
      onClick: handleClickReport,
    },
  ];

  const timeAgo = calculateTimeDifference(createdTimeToDate);

  return (
    <div className={cn('container')} ref={ref}>
      <ProfileImage profileImage={profile && profile} />
      <div className={cn('content-wrapper')}>
        <div className={cn('user-info-wrapper')}>
          <div className={cn('user-info')}>
            <p className={cn('nickname')}>{nickname}</p>
            <p className={cn('time-ago')}>{timeAgo}</p>
          </div>
          <PopOver
            optionsData={userID === commentUserId ? MY_POPOVER_OPTION : OTHERS_POPOVER_OPTION}
            onHandleClose={handleClosePopOver}
            isOpenPopOver={isOpenPopOver}
            onHandleOpen={handleClickPopOver}
          />
        </div>
        <div className={cn('content')}>{comment}</div>
      </div>
    </div>
  );
});
