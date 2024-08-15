import type { WishlistPageProps } from '@/types/likeType';
import WishList from './_components/WishList';

export default function WishlistPage({ searchParams }: WishlistPageProps) {
  return <WishList searchParams={searchParams} />;
}
