import { Button } from '@/components';
import { ROUTER } from '@/constants/route';
import { AlertIcon } from '@/public/index';
import classNames from 'classnames/bind';
import Link from 'next/link';

import styles from './EmptyCase.module.scss';

const cn = classNames.bind(styles);

interface MyInfoEmptyCaseProps {
  message: string;
  isBackgroundColor?: boolean;
}

export default function EmptyCase({ message, isBackgroundColor }: MyInfoEmptyCaseProps) {
  return (
    <div className={cn('empty-case', { 'background-color': isBackgroundColor })}>
      <AlertIcon className={cn('alert-icon')} />
      <p className={cn('empty-case-text')}>{message}</p>
      <Button
        as={Link}
        href={ROUTER.EVEMT}
        backgroundColor='background-gray-40'
        className={cn('empty-case-button')}
        paddingVertical={8}
        radius={4}
      >
        이벤트 둘러보기
      </Button>
    </div>
  );
}
