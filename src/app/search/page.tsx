import { getSearchResult } from '@/api/searchAPI';
import { SearchResultType } from '@/types/SearchType';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

interface SearchPageProps {
  searchParams: Record<string, string>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const keyword = searchParams.keyword ?? '';
  const page = Number(searchParams.page ?? 0);

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery<SearchResultType>({
    queryKey: [`search-${keyword}-${page}`],
    queryFn: () => getSearchResult(keyword, page),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div>test</div>
    </HydrationBoundary>
  );
}
