import classNames from 'classnames/bind';
import LogoLoading from '@/components/LogoLoading/LogoLoading';
import styles from './ModalSkeleton.module.scss';

const cn = classNames.bind(styles);

export default function ModalSkeleton() {
  return (
    <div className={cn('container')}>
      <LogoLoading />
    </div>
  );
}
