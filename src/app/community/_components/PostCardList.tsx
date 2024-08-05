'use client';

import classNames from 'classnames/bind';
import { useSuspenseQuery } from '@tanstack/react-query';

import { getAllCommunityPost } from '@/api/communityAPI';
import type { CommunityParamsType, CommunityAllPostCardDataType } from '@/types/CommunityTypes';
import PostCard from './PostCard';

import styles from './PostCardList.module.scss';

const cn = classNames.bind(styles);

interface CommunityPageProps {
  searchParams: { [key: string]: string | undefined };
}

export default function PostCardList({ searchParams }: CommunityPageProps) {
  const getAllCommunityParams: CommunityParamsType = {
    sort: searchParams.sort || 'new',
    page: searchParams.page || '0',
    size: searchParams.size || '16',
  };

  const { data: communityData } = useSuspenseQuery<CommunityAllPostCardDataType>({
    queryKey: ['postCardsList'],
    queryFn: () => getAllCommunityPost(getAllCommunityParams),
  });

  return (
    <div>
      <div className={cn('post-wrapper')}>
        {communityData.content.map((cardData) => (
          <PostCard key={cardData.id} cardData={cardData} />
        ))}
      </div>
    </div>
  );
}
