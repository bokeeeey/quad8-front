import classNames from 'classnames/bind';
import { MouseEvent } from 'react';

import ProfileImage from '@/components/ProfileImage/ProfileImage';
import { PopOver } from '@/components';

import styles from './AuthorCard.module.scss';

const cn = classNames.bind(styles);

interface AuthorCardProps {
  nickname: string;
  dateText: string;
  userImage: string | null;
  onClickPopOver: (e: MouseEvent<SVGElement>) => void;
  onClosePopOver: () => void;
  isOpenPopOver: boolean;
  popOverOptions: {
    label: string;
    onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  }[];
}

export default function AuthorCard({
  nickname,
  dateText,
  userImage,
  onClickPopOver,
  onClosePopOver,
  isOpenPopOver,
  popOverOptions,
}: AuthorCardProps) {
  return (
    <div className={cn('container')}>
      <ProfileImage profileImage={userImage} />
      <div className={cn('info-textbox')}>
        <p className={cn('user-name')}>{nickname}</p>
        <p className={cn('sub-info')}>{dateText}</p>
      </div>
      <div className={cn('show-more-icon')}>
        <PopOver
          optionsData={popOverOptions}
          onHandleClose={onClosePopOver}
          isOpenPopOver={isOpenPopOver}
          onHandleOpen={onClickPopOver}
        />
      </div>
    </div>
  );
}
