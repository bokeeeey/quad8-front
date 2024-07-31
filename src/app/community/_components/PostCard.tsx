'use client';

import classNames from 'classnames/bind';
import Image from 'next/image';
import { useState, useEffect, Suspense } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { Modal } from '@/components';
import { calculateTimeDifference } from '@/libs/calculateDate';
import type { CommunityPostCardDataType } from '@/types/CommunityTypes';
import { IMAGE_BLUR } from '@/constants/blurImage';
import WriteEditModal from '@/components/WriteEditModal/WriteEditModal';
import { deletePostCard, getPostDetail } from '@/api/communityAPI';
import { ErrorBoundary } from 'react-error-boundary';
import { communityPopOverOption } from '@/libs/communityPopOverOption';
import AuthorCard from './AuthorCard';
import PostCardDetailModal from './PostCardDetailModal/PostCardDetailModal';
import { PostInteractions } from './PostInteractions';
import DetailModalSkeleton from './PostCardDetailModal/ModalSkeleton';
import ErrorFallbackDetailModal from './PostCardDetailModal/ErrorFallbackDetailModal';

import styles from './PostCard.module.scss';

const cn = classNames.bind(styles);

interface PostCardProps {
  cardData: CommunityPostCardDataType;
  isMine?: boolean;
}

export default function PostCard({ cardData, isMine }: PostCardProps) {
  const queryClient = useQueryClient();

  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isPopOverOpen, setIsPopOverOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { id, nickName, updateAt, title, thumbnail, likeCount, commentCount, userImage, isLiked } = cardData;

  const ApdatedDate = new Date(updateAt);
  const timeToString = calculateTimeDifference(ApdatedDate);

  const handleClickPopOver = () => {
    setIsPopOverOpen((prevIsOpen) => !prevIsOpen);
  };

  const { refetch, data: detailData } = useQuery({
    queryKey: ['editingPostData', id],
    queryFn: () => getPostDetail(id),
    enabled: false,
  });

  useEffect(() => {
    if (isEditModalOpen) {
      refetch();
    }
  }, [isEditModalOpen, refetch]);

  const handleClosePopOver = () => {
    setIsPopOverOpen(false);
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
        queryKey: ['myCustomReview'],
      });
    },
    onError: () => {
      toast.error('리뷰 삭제 중 오류가 발생하였습니다.');
    },
  });

  const handleClickEdit = () => {
    setIsEditModalOpen(true);
    handleClosePopOver();
  };

  const handleClickDelete = () => {
    if (id) {
      deletePostCardMutation(id);
    } else {
      toast.error('해당 게시글이 존재하지 않습니다. 다시 확인해주세요.');
    }
  };

  const handleClickReport = () => {};

  return (
    <div className={cn('container')}>
      <div className={cn('container')} onClick={handleClickPostModal}>
        <AuthorCard
          nickname={nickName}
          dateText={timeToString}
          userImage={userImage}
          onClickPopOver={handleClickPopOver}
          onClosePopOver={handleClosePopOver}
          isOpenPopOver={isPopOverOpen}
          popOverOptions={communityPopOverOption({
            isMine,
            onClickDelete: handleClickDelete,
            onClickReport: handleClickReport,
            onClickEdit: handleClickEdit,
          })}
        />
        <div className={cn('keyboard-image-wrapper')}>
          <Image
            fill
            src={Array.isArray(thumbnail) ? thumbnail[0] : thumbnail}
            className={cn('keyboard-image')}
            alt='키보드 이미지'
            sizes='(max-width: 1200px) 100%'
            priority
            placeholder={IMAGE_BLUR.placeholder}
            blurDataURL={IMAGE_BLUR.blurDataURL}
          />
          {Array.isArray(thumbnail) && <p className={cn('image-count')}>{thumbnail.length}</p>}
        </div>
        <p className={cn('title')}>{title}</p>
      </div>
      <PostInteractions cardId={id} likeCount={likeCount} commentCount={commentCount} isLiked={isLiked} />
      <Modal isOpen={isPostModalOpen} onClose={handleClosePostModal}>
        <ErrorBoundary FallbackComponent={ErrorFallbackDetailModal}>
          <Suspense fallback={<DetailModalSkeleton />}>
            <PostCardDetailModal cardId={id} onClose={handleClosePostModal} isMine={isMine} />
          </Suspense>
        </ErrorBoundary>
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
