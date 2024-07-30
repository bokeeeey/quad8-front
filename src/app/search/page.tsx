import { redirect } from 'next/navigation';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import classNames from 'classnames/bind';

import { getSearchResult } from '@/api/searchAPI';
import type { SearchResultType } from '@/types/SearchType';
import { ROUTER } from '@/constants/route';
import { Pagination, SearchBox } from '@/components';
import { NoResult, CardList } from './_components';

import styles from './page.module.scss';

const cn = classNames.bind(styles);

interface SearchPageProps {
  searchParams: Record<string, string>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const queryClient = new QueryClient();

  const { keyword = '', page = 0 } = searchParams;

  if (!keyword) {
    redirect(ROUTER.MAIN);
  }

  const searchResult = await queryClient.fetchQuery<SearchResultType | null>({
    queryKey: [`search-${keyword}-${page}`],
    queryFn: () => getSearchResult(keyword, Number(page)),
  });

  const count = searchResult?.totalElements ?? 0;

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className={cn('wrapper')}>
        <div className={cn('search-wrapper')}>
          <SearchBox isBlack={false} initialValue={keyword} />
        </div>
        {searchResult ? (
          <div className={cn('content-wrapper')}>
            <div className={cn('title')}>
              <div className={cn('keyword')}>
                {`'${keyword}'`} <span className={cn('text')}>{`검색 결과(${count <= 99 ? count : '99+'})`}</span>
              </div>
            </div>
            <CardList cardData={searchResult.content} />
            <Pagination {...searchResult} searchParams={{ keyword }} />
          </div>
        ) : (
          <NoResult keyword={keyword} />
        )}
      </div>
    </HydrationBoundary>
  );
}
