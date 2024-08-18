'use client';

import { ROUTER } from '@/constants/route';
import { useDeliveryStatus } from '@/hooks/useDeliveryStatus';
import { ChevronIcon } from '@/public/index';
import classNames from 'classnames/bind';
import Link from 'next/link';
import { Fragment } from 'react';
import styles from './DeliveryStatus.module.scss';

const cn = classNames.bind(styles);

export default function DeliveryStatus() {
  const deliveryStatusList = useDeliveryStatus();

  return (
    <article className={cn('delivery-status')}>
      <div className={cn('status-header')}>
        <h1 className={cn('status-title')}>주문 / 배송 조회</h1>
        <Link className={cn('status-button')} href={ROUTER.MY_PAGE.ORDERS}>
          더보기 <ChevronIcon className={cn('button-icon')} />
        </Link>
      </div>
      <ul className={cn('status-list')}>
        {deliveryStatusList.map((status, i) => (
          <Fragment key={status.label}>
            <li className={cn('status-item')}>
              <span className={cn('status-count', { active: status.count > 0 })}>{status.count}</span>
              <span className={cn('status-label', { active: status.count > 0 })}>{status.label}</span>
            </li>
            {i < deliveryStatusList.length - 1 && (
              <ChevronIcon className={cn('status-icon', { 'active-icon': status.count > 0 })} />
            )}
          </Fragment>
        ))}
      </ul>
    </article>
  );
}
