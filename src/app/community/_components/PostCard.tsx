'use client';

import classNames from 'classnames/bind';
import Image from 'next/image';
import { useState, MouseEvent, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { Modal } from '@/components';
import { calculateTimeDifference } from '@/libs/calculateDate';
import type { CommunityPostCardDataType } from '@/types/CommunityTypes';
import { IMAGE_BLUR } from '@/constants/blurImage';
import WriteEditModal from '@/components/WriteEditModal/WriteEditModal';
import { deletePostCard, getPostDetail } from '@/api/communityAPI';
import AuthorCard from './AuthorCard';
import PostCardDetailModal from './PostCardDetailModal';
import { PostInteractions } from './PostInteractions';

import styles from './PostCard.module.scss';

const cn = classNames.bind(styles);

interface PostCardProps {
  cardData: CommunityPostCardDataType;
  isMine?: boolean;
}

export default function PostCard({ cardData, isMine }: PostCardProps) {
  const queryClient = useQueryClient();

  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { id, nickName, updateAt, title, thumbnail, likeCount, commentCount, userImage, isLiked } = cardData;

  const ApdatedDate = new Date(updateAt);
  const timeToString = calculateTimeDifference(ApdatedDate);

  const handleClickPopup = (e: MouseEvent<SVGElement>) => {
    e.stopPropagation();
    setIsPopupOpen(!isPopupOpen);
  };

  const { refetch, data: detailData } = useQuery({
    queryKey: ['editingPostData', id],
    queryFn: () => getPostDetail(id),
    enabled: false, // 비활성화된 상태로 시작
  });

  useEffect(() => {
    if (isEditModalOpen) {
      refetch();
    }
  }, [isEditModalOpen, refetch]);

  const handleClosePopOver = () => {
    setIsPopupOpen(false);
  };

  const handleClickPostModal = () => {
    setIsPostModalOpen(true);
    handleClosePopOver();
  };

  const handleClosePostModal = () => {
    setIsPostModalOpen(false);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

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

  const handleClickEdit = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsEditModalOpen(true);
    handleClosePopOver();
  };

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
      label: '수정하기',
      onClick: handleClickEdit,
    },
  ];

  const OTHERS_POPOVER_OPTION = [
    {
      label: '신고하기',
      onClick: handleClickReport,
    },
  ];

  return (
    <div className={cn('container')} onClick={handleClickPostModal}>
      <AuthorCard
        nickname={nickName}
        dateText={timeToString}
        userImage={userImage}
        onClickPopOver={handleClickPopup}
        onClosePopOver={handleClosePopOver}
        isOpenPopOver={isPopupOpen}
        popOverOptions={isMine ? MY_POPOVER_OPTION : OTHERS_POPOVER_OPTION}
      />
      <div className={cn('keyboard-image-wrapper')}>
        <Image
          src={Array.isArray(thumbnail) ? thumbnail[0] : thumbnail}
          className={cn('keyboard-image')}
          alt='키보드 이미지'
          fill
          sizes='(max-width: 1200px) 100%'
          priority
          placeholder={IMAGE_BLUR.placeholder}
          blurDataURL={IMAGE_BLUR.blurDataURL}
        />
        {Array.isArray(thumbnail) && <p className={cn('image-count')}>{thumbnail.length}</p>}
      </div>
      <p className={cn('title')}>{title}</p>
      <PostInteractions cardId={id} likeCount={likeCount} commentCount={commentCount} isLiked={isLiked} />
      <Modal isOpen={isPostModalOpen} onClose={handleClosePostModal}>
        <PostCardDetailModal cardId={id} onClose={handleClosePostModal} isMine={isMine} commentCount={commentCount} />
      </Modal>
      <Modal isOpen={isEditModalOpen} onClose={handleCloseEditModal}>
        <div onClick={(e) => e.stopPropagation()}>
          <WriteEditModal
            reviewType='customReviewEdit'
            onSuccessReview={handleCloseEditModal}
            editCustomData={detailData?.data}
          />
        </div>
      </Modal>
    </div>
  );
}
