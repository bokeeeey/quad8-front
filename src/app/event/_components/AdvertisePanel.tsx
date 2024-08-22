'use client';

import { getCookie } from '@/libs/manageCookie';
import { eventTopImg } from '@/public/index';
import classNames from 'classnames/bind';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from './AdvertisePanel.module.scss';

const cn = classNames.bind(styles);

export default function AdvertisePanel() {
  const [showPanel, setShowPanel] = useState(false);

  const getToday = async () => {
    const today = await getCookie('noTouchToday');
    if (!today) {
      setShowPanel(true);
    }
  };

  useEffect(() => {
    getToday();
  }, []);

  const handleClickClose = () => {
    setShowPanel(false);
  };

  const handleClickTodayClose = () => {
    const date = new Date(Date.now() + 86400e3).toUTCString();
    document.cookie = `noTouchToday=true; path=/; expires=${date}`;
    setShowPanel(false);
  };

  return (
    showPanel && (
      <div className={cn('container')}>
        <Link href='/event' className={cn('image-area')}>
          <Image src={eventTopImg} width={180} height={215} alt='event' />
        </Link>
        <div className={cn('button-area')}>
          <button type='button' onClick={handleClickTodayClose}>
            오늘 하루 그만보기
          </button>
          <button type='button' onClick={handleClickClose}>
            닫기
          </button>
        </div>
      </div>
    )
  );
}
