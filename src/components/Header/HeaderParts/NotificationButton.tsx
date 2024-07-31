'use client';

import { useRef, useState, useEffect, MouseEvent, MutableRefObject } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { EventSourcePolyfill, Event } from 'event-source-polyfill';
import { toast, ToastContainer } from 'react-toastify';
import classNames from 'classnames/bind';

import { useOutsideClick } from '@/hooks/useOutsideClick';
import { NotificationIcon } from '@/public/index';
import { getAlarm, postAlarmRead, deleteAlarm } from '@/api/alarmAPI';
import { getCookie } from '@/libs/manageCookie';
import type { AlarmAPIDataType, AlarmDataType, AlarmType } from '@/types/alarmTypes';
import NotificationCard from './NotificationCard';

import styles from './NotificationButton.module.scss';

const cn = classNames.bind(styles);

interface NotificationButtonProps {
  isBlack: boolean;
  eventSource: MutableRefObject<EventSource | null>;
}

const CATEGORY_LIST = ['전체', '상품', '이벤트', '커뮤니티'] as const;
type CategoryType = (typeof CATEGORY_LIST)[number];

export default function NotificationButton({ isBlack, eventSource }: NotificationButtonProps) {
  const queryClient = useQueryClient();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<null | NodeJS.Timeout>(null);
  const isOpenAlarm = useRef<boolean>(false);

  const [isOpenModal, setIsOpenModal] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [isRender, setIsRender] = useState(false);

  const { data: communityAlarm } = useQuery<AlarmAPIDataType>({ queryKey: ['communityAlarm'], queryFn: getAlarm });
  const [productAlarm, setProductAlarm] = useState<AlarmDataType[]>([]);
  const [eventAlarm, setEventAlarm] = useState<AlarmDataType[]>([]);

  const [currentCategory, setCurrentCategory] = useState<CategoryType>('전체');

  const communityUnreadCount = communityAlarm?.alarmDtoList
    ? communityAlarm.alarmDtoList.filter((alarm) => !alarm.isRead).length
    : 0;
  const productUnreadCount = productAlarm.filter((alarm) => !alarm.isRead).length;
  const eventUnreadCount = eventAlarm.filter((alarm) => !alarm.isRead).length;

  const totalUnreadCount = communityUnreadCount + productUnreadCount + eventUnreadCount;

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
        isOpenAlarm.current = true;
      }
      return !prev;
    });
  };

  useOutsideClick(wrapperRef, handleClickButton);

  const handleAnimationEnd = () => {
    if (!isOpen) {
      setIsRender(false);
      isOpenAlarm.current = false;
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

  useEffect(() => {
    const eventRef = eventSource.current;
    if (eventRef === null) {
      const addServerSentEvent = async () => {
        const accessToken = await getCookie('accessToken');
        if (!accessToken) {
          return;
        }
        const newEventSource = new EventSourcePolyfill(
          `${process.env.NEXT_PUBLIC_KEYDEUK_API_BASE_URL}/api/v1/alarm/subscribe`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'text/event-stream',
            },
            heartbeatTimeout: 3600000,
          },
        );

        Object.assign(eventSource, { current: newEventSource });

        /* eslint-disable-next-line */
        newEventSource.addEventListener('error', async (error: any) => {
          if (error.status === 401) {
            newEventSource.close();
          }
          newEventSource.close();
          Object.assign(eventSource, { current: null });
        });

        newEventSource.addEventListener('COMMUNITY', (e: Event) => {
          const event = e as MessageEvent;
          const newData = JSON.parse(event.data) as AlarmDataType;
          if (timerRef.current) {
            return;
          }
          const timerId = setTimeout(() => {
            queryClient.invalidateQueries({ queryKey: ['communityAlarm'] });
            if (!isOpenAlarm.current) {
              toast.info(newData.message, {
                containerId: 'alarm',
              });
            }
            Object.assign(timerRef, { current: null });
          }, 500);
          Object.assign(timerRef, { current: timerId });
        });
      };
      addServerSentEvent();
    }
    return () => {
      if (eventRef) {
        eventRef.close();
        Object.assign(eventSource, { current: null });
      }
    };
  }, [eventSource, queryClient]);

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  return (
    <>
      <div className={cn('button-wrapper')}>
        <NotificationIcon
          width={24}
          height={24}
          className={cn('icon', { 'bg-black': isBlack })}
          onClick={handleClickButton}
        />
        {totalUnreadCount > 0 && (
          <div className={cn('alarm-count', totalUnreadCount > 9 && 'count-more-digit')} onClick={handleClickButton}>
            {totalUnreadCount > 9 ? '9+' : totalUnreadCount}
          </div>
        )}
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
                    <NotificationIcon width={36} height={36} className={cn('hollow-card-icon')} />
                    <p className={cn('hollow-card-text')}>새로운 알림이 없습니다</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <div onClick={handleClick}>
        <ToastContainer
          bodyClassName={cn('toast-body')}
          autoClose={3000}
          containerId='alarm'
          position='bottom-right'
          pauseOnHover={false}
          pauseOnFocusLoss={false}
          closeOnClick
        />
      </div>
    </>
  );
}
