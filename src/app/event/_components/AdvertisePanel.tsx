'use client';

import { ROUTER } from '@/constants/route';
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

  const getToday = () => {
    const skipEventBannerForToday = getCookie('skipEventBannerForToday');
    if (skipEventBannerForToday === 'true') {
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
    document.cookie = `skipEventBannerForToday=true; path=/; expires=${date}`;
    setShowPanel(false);
  };

  return (
    showPanel && (
      <div className={cn('container')}>
        <Link href={ROUTER.EVENT} className={cn('image-area')}>
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
