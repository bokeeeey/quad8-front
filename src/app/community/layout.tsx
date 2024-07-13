import classNames from 'classnames/bind';

import { ReactNode } from 'react';
import styles from './layout.module.scss';
import SortDropdown from './_components/SortDropdown';
import WritePostButton from './_components/WritePostButton';

const cn = classNames.bind(styles);

interface CommunityLayoutProps {
  children: ReactNode;
}

export default async function MyInfoLayout({ children }: CommunityLayoutProps) {
  return (
    <div className={cn('container')}>
      <p className={cn('page-name')}>커뮤니티</p>
      <div>
        <div className={cn('filter-write-button-wrapper')}>
          <SortDropdown />
          <WritePostButton />
        </div>
        {children}
      </div>
    </div>
  );
}
