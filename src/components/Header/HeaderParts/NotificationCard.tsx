import { MouseEvent } from 'react';
import classNames from 'classnames/bind';

import type { AlarmDataType, AlarmType } from '@/types/alarmType';
import { calculateTimeDifference } from '@/libs/calculateDate';
import { DeleteIcon } from '@/public/index';

import Modal from '@/components/Modal/Modal';
import PostCardDetailModal from '@/app/community/_components/PostCardDetailModal/PostCardDetailModal';
import styles from './NotificationCard.module.scss';
import NotificationCardIcon from './NotificationCardIcon';

const cn = classNames.bind(styles);

interface NotificationCardProps {
  alarmData: AlarmDataType;
  isOpenModal: boolean;
  onChangeOpenModal: (value: boolean) => void;
  onChangeAlarmDataToRead: (id: number, type: AlarmType) => void;
  onChangeAlarmDataToDelete: (id: number, type: AlarmType) => void;
}

const ALARM_TYPE = {
  COMMUNITY: '커뮤니티',
  PRODUCT_ORDER: '상품',
  EVENT: '이벤트',
};

export default function NotificationCard({
  alarmData,
  isOpenModal,
  onChangeOpenModal,
  onChangeAlarmDataToRead,
  onChangeAlarmDataToDelete,
}: NotificationCardProps) {
  const handleClickWrapper = () => {
    if (!alarmData.isRead) {
      onChangeAlarmDataToRead(alarmData.id, alarmData.type);
    }
    onChangeOpenModal(true);
  };

  const handleDeleteButtonClick = (e: MouseEvent<SVGElement>) => {
    e.stopPropagation();
    onChangeAlarmDataToDelete(alarmData.id, alarmData.type);
  };

  return (
    <div className={cn('wrapper')} onClick={handleClickWrapper}>
      <div className={cn('icon-wrapper', { read: alarmData.isRead })}>
        <NotificationCardIcon type={alarmData.type} />
      </div>
      <div className={cn('content-wrapper', { read: alarmData.isRead })}>
        <div className={cn('title')}>{ALARM_TYPE[alarmData.type]}</div>
        <div className={cn('content')}>{alarmData.message}</div>
        <div className={cn('date')}>{calculateTimeDifference(new Date(alarmData.createdAt))}</div>
      </div>
      <DeleteIcon width={23} height={23} className={cn('delete-icon')} onClick={handleDeleteButtonClick} />
      {alarmData.type === 'COMMUNITY' && (
        <Modal isOpen={isOpenModal} onClose={() => onChangeOpenModal(false)}>
          <PostCardDetailModal cardId={alarmData.relatedId} onClose={() => onChangeOpenModal(false)} />
        </Modal>
      )}
    </div>
  );
}