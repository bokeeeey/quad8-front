import { getAllCommunityPost } from '@/api/communityAPI';
import Pagination from '@/components/Pagination/Pagination';
import type { CommunityParamsType, CommunityPostListResponse } from '@/types/CommunityTypes';
import { QueryClient, dehydrate, HydrationBoundary } from '@tanstack/react-query';
import CommunityEmptyCase from './_components/CommunityEmptyCase';
import PostCardList from './_components/PostCardList';

interface CommunityPageProps {
  searchParams: { [key: string]: string | undefined };
}

export default async function CommunityPage({ searchParams }: CommunityPageProps) {
  const initialParams: CommunityParamsType = {
    sort: searchParams.sort || 'new',
    page: searchParams.page || '0',
    size: searchParams.size || '16',
  };

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['postCardsList'],
    queryFn: () => getAllCommunityPost(initialParams),
  });

  const data = queryClient.getQueryData<CommunityPostListResponse | null>(['postCardsList']);

  if (!data) {
    return <CommunityEmptyCase />;
  }

  const { content, ...rest } = data;

  return (
    <div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <PostCardList searchParams={searchParams} />
        <Pagination {...rest} searchParams={searchParams} />
      </HydrationBoundary>
    </div>
  );
}
