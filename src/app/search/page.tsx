import { redirect } from 'next/navigation';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import classNames from 'classnames/bind';

import Pagination from '@/components/Pagination/Pagination';
import { getSearchResult } from '@/api/searchAPI';
import { SearchResultType } from '@/types/SearchType';
import { ROUTER } from '@/constants/route';
import SearchBox from '@/components/SearchBox/SearchBox';
import { Title, NoResult, CardList } from './_components';

import styles from './page.module.scss';

const cn = classNames.bind(styles);

interface SearchPageProps {
  searchParams: Record<string, string>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const keyword = searchParams.keyword ?? '';
  const page = Number(searchParams.page ?? 0);

  if (!keyword) {
    redirect(ROUTER.MAIN);
  }

  const queryClient = new QueryClient();

  const searchResult = await queryClient.fetchQuery<SearchResultType | null>({
    queryKey: [`search-${keyword}-${page}`],
    queryFn: () => getSearchResult(keyword, page),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className={cn('wrapper')}>
        <div className={cn('search-wrapper')}>
          <SearchBox isBlack={false} initialValue={keyword} />
        </div>
        {searchResult ? (
          <div className={cn('content-wrapper')}>
            <Title keyword={keyword} count={searchResult.totalElements} />
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
