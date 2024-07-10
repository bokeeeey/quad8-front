import classNames from 'classnames/bind';
import { forwardRef } from 'react';
import styles from './UserProfileCard.module.scss';

const cn = classNames.bind(styles);

interface UserProfileCardProps {
  isOpenProfileCard: boolean;
  top?: number;
}

const UserProfileCard = forwardRef<HTMLDivElement, UserProfileCardProps>(({ isOpenProfileCard, top }, ref) => {
  return (
    <div
      ref={ref}
      style={{ top: top ? top - 170 : 0 }}
      className={cn('user-detail-profile-card', { 'display-none': !isOpenProfileCard })}
      onClick={(e) => e.stopPropagation()}
    >
      다른 유저 프로필 보기
    </div>
  );
});

export default UserProfileCard;

UserProfileCard.displayName = 'UserProfileCard';
