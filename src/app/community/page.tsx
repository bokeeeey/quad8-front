import { getAllCommunityPost } from '@/api/communityAPI';
import Pagination from '@/components/Pagination/Pagination';
import type { CommunityParamsType } from '@/types/communityType';
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

  const data = await getAllCommunityPost(initialParams);

  if (!data) {
    return <CommunityEmptyCase />;
  }

  const { content, ...rest } = data;

  return (
    <div>
      <PostCardList searchParams={searchParams} initialData={content} />
      <Pagination {...rest} searchParams={searchParams} />
    </div>
  );
}
