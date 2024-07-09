import classNames from 'classnames/bind';
import styles from './UserProfileCard.module.scss';

const cn = classNames.bind(styles);

interface UserProfileCardProps {
  isOpenProfileCard: boolean;
}

export default function UserProfileCard({ isOpenProfileCard }: UserProfileCardProps) {
  return (
    <div className={cn('user-detail-profile-card', { 'display-none': !isOpenProfileCard })}>다른 유저 프로필 보기</div>
  );
}
