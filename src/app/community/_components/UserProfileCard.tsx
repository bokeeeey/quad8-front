import classNames from 'classnames/bind';
import { forwardRef, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { getOthersInfo } from '@/api/usersAPI';

import styles from './UserProfileCard.module.scss';

const cn = classNames.bind(styles);

interface UserProfileCardProps {
  triggerAnimate?: boolean;
  isOpenProfileCard: boolean;
  top?: number;
  userId: number;
}

export default forwardRef<HTMLDivElement, UserProfileCardProps>(function UserProfileCard(
  { isOpenProfileCard, top, userId, triggerAnimate },
  ref,
) {
  const [animate, setAnimate] = useState(false);

  const {
    data: userInfo,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ['clickedUserInfo'],
    queryFn: () => getOthersInfo(userId),
    enabled: false,
    gcTime: 0,
  });

  useEffect(() => {
    if (isOpenProfileCard) {
      refetch();
      setAnimate(true);
      const timer = setTimeout(() => {
        setAnimate(false);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      return () => {};
    }
  }, [isOpenProfileCard, refetch, userId, triggerAnimate]);

  return (
    <div
      ref={ref}
      style={{ top: top ? top - 170 : 0 }}
      className={cn(
        'user-detail-profile-card',
        { 'display-none': !isOpenProfileCard },
        { 'entrance-animation': animate },
      )}
      onClick={(e) => e.stopPropagation()}
    >
      {isLoading || !userInfo ? (
        <div>Loading..</div>
      ) : (
        <>
          <div className={cn('profile-image')} />
          <div className={cn('info-wrapper')}>
            <p className={cn('nickname')}>{userInfo?.nickname}</p>
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
