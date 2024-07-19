import classNames from 'classnames/bind';
import { FallbackProps } from 'react-error-boundary';
import { Button } from '@/components';

import styles from './ErrorFallbackDetailModal.module.scss';

const cn = classNames.bind(styles);

export default function ErrorFallbackDetailModal({ resetErrorBoundary }: FallbackProps) {
  return (
    <div className={cn('container')}>
      <div className={cn('text-wrapper')}>
        <h2 className={cn('main-text')}>죄송합니다! 문제가 발생했습니다.</h2>
        <p className={cn('error-text')}>
          포스트 상세 내용을 불러오는 도중 예상치 못한 오류가 발생했습니다. 다음 단계를 시도해 보세요:
        </p>
        <ul>
          <li className={cn('list')}>1. 페이지를 새로고침하여 다시 시도하세요.</li>
          <li className={cn('list')}>2. 인터넷 연결 상태를 확인하고 안정적인지 확인하세요.</li>
          <li className={cn('list')}>3. 문제가 계속될 경우, 고객 지원팀에 연락해 주세요.</li>
        </ul>
      </div>
      <Button onClick={resetErrorBoundary}>다시 시도</Button>
    </div>
  );
}
