import classNames from 'classnames/bind';
import { MouseEvent, useRef } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { VerticalTripleDotIcon } from '@/public/index';
import ProfileImage from '@/components/ProfileImage/ProfileImage';
import { deletePostCard } from '@/api/communityAPI';
import { useOutsideClick } from '@/hooks/useOutsideClick';
import { PopOver } from '@/components';
import UserProfileCard from './UserProfileCard';

import styles from './AuthorCard.module.scss';

const cn = classNames.bind(styles);

interface AuthorCardProps {
  id?: number;
  isMine?: boolean;
  nickname: string;
  dateText: string;
  userImage: string | null;
  onClickPopOver: (e: MouseEvent<SVGElement>) => void;
  onClosePopOver: () => void;
  isOpenPopOver: boolean;
  onClickProfile: (e: MouseEvent<HTMLDivElement>) => void;
  onCloseProfileCard: () => void;
  isOpenProfileCard: boolean;
}

export default function AuthorCard({
  id,
  isMine,
  nickname,
  dateText,
  userImage,
  onClickPopOver,
  onClosePopOver,
  isOpenPopOver,
  onClickProfile,
  onCloseProfileCard,
  isOpenProfileCard,
}: AuthorCardProps) {
  const queryClient = useQueryClient();

  const userProfileCardRef = useRef<HTMLDivElement>(null);

  useOutsideClick(userProfileCardRef, onCloseProfileCard);

  const { mutate: deletePostCardMutation } = useMutation({
    mutationFn: deletePostCard,
    onSuccess: () => {
      toast.success('게시글을 삭제하였습니다.');
      queryClient.invalidateQueries({
        queryKey: ['MyCustomReview'],
      });
    },
    onError: () => {
      toast.error('리뷰 삭제 중 오류가 발생하였습니다.');
    },
  });

  const handleClickDelete = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (id) {
      deletePostCardMutation(id);
    } else {
      toast.error('해당 게시글이 존재하지 않습니다. 다시 확인해주세요.');
    }
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

  return (
    <div className={cn('container')}>
      <div onClick={onClickProfile} className={cn('user-profile')} ref={userProfileCardRef}>
        <ProfileImage profileImage={userImage} />
        <UserProfileCard isOpenProfileCard={isOpenProfileCard} />
      </div>
      <div className={cn('info-textbox')}>
        <p className={cn('user-name')}>{nickname}</p>
        <p className={cn('sub-info')}>{dateText}</p>
      </div>
      <div className={cn('show-more-icon')}>
        <VerticalTripleDotIcon onClick={onClickPopOver} />
        {isOpenPopOver && (
          <PopOver optionsData={isMine ? MY_POPOVER_OPTION : OTHERS_POPOVER_OPTION} onHandleClose={onClosePopOver} />
        )}
      </div>
    </div>
  );
}
