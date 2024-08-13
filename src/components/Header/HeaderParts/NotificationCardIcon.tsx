import classNames from 'classnames/bind';

import { CouponAlarmIcon, CommentAlarmIcon, OrderAlarmIcon } from '@/public/index';
import type { AlarmType } from '@/types/alarmType';

import styles from './NotificationCardIcon.module.scss';

const cn = classNames.bind(styles);

interface NotificationCardIconProps {
  type: AlarmType;
}

export default function NotificationCardIcon({ type }: NotificationCardIconProps) {
  if (type === 'EVENT') {
    return <CouponAlarmIcon width={24} height={24} className={cn('icon')} />;
  }
  if (type === 'PRODUCT_ORDER') {
    return <OrderAlarmIcon width={24} height={24} className={cn('icon')} />;
  }
  return <CommentAlarmIcon width={24} height={24} className={cn('icon')} />;
}
