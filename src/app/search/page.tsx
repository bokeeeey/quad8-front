import { redirect } from 'next/navigation';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import classNames from 'classnames/bind';

import Pagination from '@/components/Pagination/Pagination';
import { getSearchResult } from '@/api/searchAPI';
import { SearchResultType } from '@/types/SearchType';
import { ROUTER } from '@/constants/route';
import Title from './_components/Title';
import NoResult from './_components/NoResult';
import CardList from './_components/CardList';

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

  const data = await queryClient.fetchQuery<SearchResultType | null>({
    queryKey: [`search-${keyword}-${page}`],
    queryFn: () => getSearchResult(keyword, page),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className={cn('wrapper')}>
        {data ? (
          <div className={cn('content-wrapper')}>
            <Title keyword={keyword} count={data.totalElements} />
            <CardList cardData={data.content} />
            <Pagination
              totalElements={data.totalElements}
              totalPages={data.totalPages}
              number={data.number}
              first={data.first}
              last={data.last}
              searchParams={{ keyword }}
            />
          </div>
        ) : (
          <NoResult keyword={keyword} />
        )}
      </div>
    </HydrationBoundary>
  );
}
