'use client';

import classNames from 'classnames/bind';

import { getMyPosts } from '@/api/communityAPI';
import { MyInfoEmptyCase, Pagination } from '@/components';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import MyPostCardList from './_components/MyPostCardList';
import MyPostsEmptyCase from './_components/MyPostsEmptyCase';

import styles from './page.module.scss';

const cn = classNames.bind(styles);

export default function MyPostsPage() {
  const params = useSearchParams();
  const initialParams = {
    sort: params.get('sort') || 'new',
    page: params.get('page') || '0',
    size: params.get('size') || '12',
  };

  const { data: myPosts } = useQuery({
    queryKey: ['myCustomReview', initialParams],
    queryFn: () => getMyPosts(initialParams),
  });

  if (!myPosts) {
    return <MyPostsEmptyCase />;
  }

  const { content, ...rest } = myPosts;

  return (
    <div className={cn('container')}>
      {content.length > 0 ? (
        <div>
          <header className={cn('title')}>내 게시글</header>
          <MyPostCardList searchParams={initialParams} initialData={content} />
          <Pagination {...rest} searchParams={initialParams} />
        </div>
      ) : (
        <MyInfoEmptyCase message='내 게시글이 없습니다.' />
      )}
    </div>
  );
}
