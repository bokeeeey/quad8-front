import classNames from 'classnames/bind';
import LogoLoading from '@/components/LogoLoading/LogoLoading';
import styles from './DetailModalSkeleton.module.scss';

const cn = classNames.bind(styles);

export default function DetailModalSkeleton() {
  return (
    <div className={cn('container')}>
      <LogoLoading />
    </div>
  );
}
