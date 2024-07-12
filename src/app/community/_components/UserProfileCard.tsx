'use client';

import classNames from 'classnames/bind';
import { forwardRef, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';

import { getOthersInfo } from '@/api/usersAPI';
import { SpinLoading, keydeukProfileImg } from '@/public/index';

import styles from './UserProfileCard.module.scss';

const cn = classNames.bind(styles);

interface UserProfileCardProps {
  isOpenProfileCard: boolean;
  userId: number;
  positionTop?: number;
}
export default forwardRef<HTMLDivElement, UserProfileCardProps>(function UserProfileCard(
  { isOpenProfileCard, userId, positionTop },
  ref,
) {
  const {
    data: userInfo,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['clickedUserInfo'],
    queryFn: () => getOthersInfo(userId),
    enabled: false,
  });
  const [isAboveProfile, setIsAboveProfile] = useState(false);

  useEffect(() => {
    const VIEWPORT_HEIGHT = window.innerHeight;

    if (isOpenProfileCard) {
      refetch();
      if (positionTop && positionTop > VIEWPORT_HEIGHT / 2) {
        setIsAboveProfile(true);
      }
    }
  }, [isOpenProfileCard, userId, refetch, positionTop, isAboveProfile]);

  return positionTop && positionTop === 0 ? null : (
    <div
      ref={ref}
      className={cn(
        'user-detail-profile-card',
        { 'display-none': !isOpenProfileCard },
        { 'loading-div': isFetching },
        { 'above-profile': isAboveProfile },
      )}
      onClick={(e) => e.stopPropagation()}
    >
      {isFetching ? (
        <div>
          <SpinLoading />
        </div>
      ) : (
        <>
          <div className={cn('profile-image')}>
            <Image src={userInfo?.imgUrl || keydeukProfileImg} alt='프로필 이미지' fill sizes='12rem' />
          </div>
          <div className={cn('info-wrapper')}>
            <p className={cn('nickname')}>{userInfo?.nickname || '사용자를 찾을 수 없습니다.'}</p>
            <p>
              <strong>email:</strong> {userInfo?.email}
            </p>
            <p>
              <strong>birthday:</strong> {userInfo?.birth}
            </p>
            <p>
              <strong>phone:</strong> {userInfo?.phone}
            </p>
            <p>
              <strong>gender:</strong> {userInfo?.gender}
            </p>
          </div>
        </>
      )}
    </div>
  );
});
