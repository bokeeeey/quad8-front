'use client';

import { useQuery } from '@tanstack/react-query';
import classNames from 'classnames/bind';

import { getMyPosts } from '@/api/communityAPI';
import PostCard from '@/app/community/_components/PostCard';
import type { CommunityPostCardDataType } from '@/types/communityType';
import SortDropdown from './SortDropdown';

import styles from './MyPostCardList.module.scss';

const cn = classNames.bind(styles);

interface MyPostCardListProps {
  searchParams: Record<'sort' | 'page' | 'size', string>;
  initialData: CommunityPostCardDataType[];
}

export default function MyPostCardList({ searchParams, initialData }: MyPostCardListProps) {
  const { data: myPostData, isLoading } = useQuery({
    queryKey: ['myCustomReview', searchParams],
    queryFn: () => getMyPosts(searchParams),
  });

  const content = isLoading || !myPostData ? initialData : myPostData.content;

  return (
    <div className={cn('container')}>
      <div>
        <div className={cn('filter-write-button-wrapper')}>
          <SortDropdown />
        </div>
        {content && (
          <div className={cn('post-wrapper')}>
            {content.map((cardData: CommunityPostCardDataType) => (
              <PostCard key={cardData.id} cardData={cardData} isMine />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
