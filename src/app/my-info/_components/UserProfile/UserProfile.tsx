'use client';

import classNames from 'classnames/bind';
import { useState } from 'react';

import { Modal, ProfileImage } from '@/components';
import { useUser } from '@/hooks/useUser';
import EditProfileModal from './EditProfileModal/EditProfileModal';

import styles from './UserProfile.module.scss';

const cn = classNames.bind(styles);

export default function UserProfile() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: userData } = useUser();

  const users = userData?.data;

  const handleEditProfileButton = () => {
    setIsModalOpen(true);
  };

  const handleComplete = () => {
    setIsModalOpen(false);
  };

  return (
    <article className={cn('user')}>
      <div className={cn('user-profile')}>
        <ProfileImage profileImage={users?.imgUrl || null} width={84} height={84} />
        <div className={cn('user-info')}>
          <h1 className={cn('user-name')}>{users?.nickname} 님</h1>
          <p className={cn('user-email')}>{users?.email}</p>
        </div>
      </div>
      {users && (
        <div>
          <button className={cn('user-edit-button')} type='button' onClick={handleEditProfileButton}>
            회원정보 변경
          </button>
          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <EditProfileModal userData={users} onComplete={handleComplete} />
          </Modal>
        </div>
      )}
    </article>
  );
}
