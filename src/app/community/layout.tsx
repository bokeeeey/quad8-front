import classNames from 'classnames/bind';

import { ReactNode } from 'react';
import styles from './layout.module.scss';
import SortDropdown from './_components/SortDropdown';
import WritePostButton from './_components/WritePostButton';

const cn = classNames.bind(styles);

interface CommunityLayoutProps {
  children: ReactNode;
}

export default async function CommunityLayout({ children }: CommunityLayoutProps) {
  return (
    <div className={cn('container')}>
      <div className={cn('filter-write-button-wrapper')}>
        <p className={cn('page-name')}>커뮤니티</p>
        <WritePostButton />
      </div>
      <div>
        <SortDropdown />
        {children}
      </div>
    </div>
  );
}
