'use client';

import { useRef, useState } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import classNames from 'classnames/bind';

import { useOutsideClick } from '@/hooks/useOutsideClick';
import { NotificationIcon } from '@/public/index';
import { getAlarm, postAlarmRead, deleteAlarm } from '@/api/alarmAPI';
import type { AlarmAPIDataType, AlarmDataType, AlarmType } from '@/types/alarmTypes';
import NotificationCard from './NotificationCard';

import styles from './NotificationButton.module.scss';

const cn = classNames.bind(styles);

interface NotificationButtonProps {
  isBlack: boolean;
}

const CATEGORY_LIST = ['전체', '상품', '이벤트', '커뮤니티'] as const;
type CategoryType = (typeof CATEGORY_LIST)[number];

export default function NotificationButton({ isBlack }: NotificationButtonProps) {
  const queryClient = useQueryClient();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [isOpenModal, setIsOpenModal] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [isRender, setIsRender] = useState(false);

  const { data: communityAlarm } = useQuery<AlarmAPIDataType>({ queryKey: ['communityAlarm'], queryFn: getAlarm });
  const [productAlarm, setProductAlarm] = useState<AlarmDataType[]>([]);
  const [eventAlarm, setEventAlarm] = useState<AlarmDataType[]>([]);

  const [currentCategory, setCurrentCategory] = useState<CategoryType>('전체');

  const communityUnreadCount = communityAlarm ? communityAlarm.alarmDtoList.filter((alarm) => !alarm.isRead).length : 0;
  const productUnreadCount = productAlarm.filter((alarm) => !alarm.isRead).length;
  const eventUnreadCount = eventAlarm.filter((alarm) => !alarm.isRead).length;

  const { mutate: postAlarmReadMutate } = useMutation({
    mutationFn: (id: number) => postAlarmRead(id),
  });

  const { mutate: deleteAlarmMutate } = useMutation({
    mutationFn: (id: number) => deleteAlarm(id),
  });

  const getCurrentAlarm = (category: CategoryType) => {
    /* 저장된 데이터 가져오기 */
    if (category === '전체') {
      const alarmData = [...productAlarm, ...eventAlarm, ...(communityAlarm?.alarmDtoList ?? [])].sort(
        (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt),
      );
      return { alarmList: alarmData, count: communityUnreadCount + productUnreadCount + eventUnreadCount };
    }

    if (category === '상품') {
      return {
        alarmList: productAlarm.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)),
        count: productUnreadCount,
      };
    }

    if (category === '이벤트') {
      return {
        alarmList: eventAlarm.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)),
        count: eventUnreadCount,
      };
    }
    return {
      alarmList: communityAlarm?.alarmDtoList.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)) ?? [],
      count: communityUnreadCount,
    };
  };

  const currentAlarm = getCurrentAlarm(currentCategory);

  const handleClickButton = () => {
    if (isOpenModal) {
      return;
    }

    setIsOpen((prev) => {
      if (!prev) {
        setIsRender(true);
      }
      return !prev;
    });
  };

  useOutsideClick(wrapperRef, handleClickButton);

  const handleAnimationEnd = () => {
    if (!isOpen) {
      setIsRender(false);
    }
  };

  const handleCategoryButtonClick = (value: CategoryType) => {
    setCurrentCategory(value);
  };

  const handleDeleteButtonClick = () => {
    if (currentCategory === '전체' || currentCategory === '커뮤니티') {
      queryClient.setQueryData(['communityAlarm'], (prev: AlarmAPIDataType) => {
        prev.alarmDtoList.forEach((alarm) => {
          deleteAlarmMutate(alarm.id);
        });
        return { count: 0, alarmDtoList: [] };
      });
    }

    if (currentCategory === '전체' || currentCategory === '상품') {
      setProductAlarm([]);
      /* 상품 알림 전체 삭제 */
    }
    if (currentCategory === '전체' || currentCategory === '이벤트') {
      setEventAlarm([]);
      /* 이벤트 알림 전체 삭제 */
    }
  };

  const handleAlarmDataToRead = (id: number, type: AlarmType) => {
    if (type === 'COMMUNITY') {
      queryClient.setQueryData(['communityAlarm'], (prev: AlarmAPIDataType) => ({
        ...prev,
        alarmDtoList: prev.alarmDtoList.map((alarm) => (alarm.id === id ? { ...alarm, isRead: true } : alarm)),
      }));
      postAlarmReadMutate(id);
      return;
    }
    if (type === 'PRODUCT_ORDER') {
      setProductAlarm((prev) => prev.map((alarm) => (alarm.id === id ? { ...alarm, isRead: true } : alarm)));
      return;
    }
    setEventAlarm((prev) => prev.map((alarm) => (alarm.id === id ? { ...alarm, isRead: true } : alarm)));
  };

  const handleAlarmDataToDelete = (id: number, type: AlarmType) => {
    if (type === 'COMMUNITY') {
      queryClient.setQueryData(['communityAlarm'], (prev: AlarmAPIDataType) => ({
        count: prev.count - 1 ?? 0,
        alarmDtoList: prev.alarmDtoList.filter((alarm) => alarm.id !== id),
      }));
      deleteAlarmMutate(id);
      return;
    }

    if (type === 'PRODUCT_ORDER') {
      setProductAlarm((prev) => prev.filter((alarm) => alarm.id !== id));
      /* 상품 알림 삭제 */
      return;
    }
    setEventAlarm((prev) => prev.filter((alarm) => alarm.id !== id));
    /* 이벤트 알림 삭제 */
  };

  const handleOpenModal = (value: boolean) => {
    setIsOpenModal(value);
  };

  return (
    <div className={cn('button-wrapper')}>
      <NotificationIcon
        width={24}
        height={24}
        className={cn('icon', { 'bg-black': isBlack })}
        onClick={handleClickButton}
      />
      {isRender && (
        <div className={cn('wrapper', { 'fade-out': !isOpen })} onAnimationEnd={handleAnimationEnd}>
          <div ref={wrapperRef} className={cn('notification-wrapper', { 'slide-out': !isOpen })}>
            <div className={cn('title-wrapper')}>
              <div className={cn('title')}>알림</div>
              <div className={cn('category-wrapper')}>
                {CATEGORY_LIST.map((category) => (
                  <button
                    type='button'
                    key={category}
                    className={cn('category', { 'is-selected-category': currentCategory === category })}
                    onClick={() => handleCategoryButtonClick(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className={cn('content-wrapper')}>
              {currentAlarm.alarmList.length ? (
                <>
                  <div className={cn('content-title-wrapper')}>
                    <div
                      className={cn('content-title')}
                    >{`지난 알림(${currentAlarm.count <= 99 ? currentAlarm.count : '99+'})`}</div>
                    <button type='button' className={cn('content-delete-all')} onClick={handleDeleteButtonClick}>
                      전체 삭제
                    </button>
                  </div>
                  <div className={cn('content-card-wrapper')}>
                    {currentAlarm.alarmList.map((alarmData) => (
                      <NotificationCard
                        key={alarmData.id}
                        isOpenModal={isOpenModal}
                        alarmData={alarmData}
                        onChangeOpenModal={handleOpenModal}
                        onChangeAlarmDataToRead={handleAlarmDataToRead}
                        onChangeAlarmDataToDelete={handleAlarmDataToDelete}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <div className={cn('hollow-card-wrapper')}>
                  <NotificationIcon width={42} height={42} className={cn('hollow-card-icon')} />
                  <p className={cn('hollow-card-text')}>새로운 알림이 없습니다</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
