import { eventTopImg } from '@/public/index';
import classNames from 'classnames/bind';
import Image from 'next/image';
import styles from './EventTop.module.scss';

const cn = classNames.bind(styles);

export default function EventTop() {
  return (
    <div className={cn('container')}>
      <div className={cn('inner')}>
        <Image src={eventTopImg} width={615} height={704} />
      </div>
    </div>
  );
}
