import classNames from 'classnames/bind';
import { useRef, useState } from 'react';

import ProfileImage from '@/components/ProfileImage/ProfileImage';
import { PopOver } from '@/components';
import UserProfileCard from './UserProfileCard';

import styles from './AuthorCard.module.scss';

const cn = classNames.bind(styles);

interface AuthorCardProps {
  nickname: string;
  dateText: string;
  userImage: string | null;
  userId: number;
  onClickPopOver: () => void;
  onClosePopOver: () => void;
  isOpenPopOver: boolean;
  popOverOptions: {
    label: string;
    onClick?: () => void;
  }[];
}

export default function AuthorCard({
  nickname,
  dateText,
  userImage,
  userId,
  onClickPopOver,
  onClosePopOver,
  isOpenPopOver,
  popOverOptions,
}: AuthorCardProps) {
  const userProfileCardRef = useRef<HTMLDivElement>(null);
  const [isOpenUserCard, setIsOpenUserCard] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const handleOpenProfile = () => {
    setIsOpenUserCard(true);
  };

  const handleCloseProfile = () => {
    setIsOpenUserCard(false);
  };

  const profileHandlers = {
    onMouseEnter: handleOpenProfile,
    onMouseLeave: handleCloseProfile,
  };

  const containerHandlers = {
    onMouseEnter: () => setIsHovering(true),
    onMouseLeave: () => setIsHovering(false),
  };

  return (
    <div className={cn('container')} onClick={(e) => e.stopPropagation()} {...containerHandlers}>
      <div className={cn('user-profile')} ref={userProfileCardRef} {...profileHandlers}>
        <ProfileImage profileImage={userImage} />
        <UserProfileCard isOpenProfileCard={isOpenUserCard} userId={userId} />
      </div>
      <div className={cn('info-textbox')}>
        <p className={cn('user-name')} {...profileHandlers}>
          {nickname}
        </p>
        <p className={cn('sub-info')}>{dateText}</p>
      </div>
      {isHovering && (
        <div className={cn('show-more-icon')}>
          <PopOver
            optionsData={popOverOptions}
            onHandleClose={onClosePopOver}
            isOpenPopOver={isOpenPopOver}
            onHandleOpen={onClickPopOver}
            position={{ left: -30, top: -20 }}
          />
        </div>
      )}
    </div>
  );
}
