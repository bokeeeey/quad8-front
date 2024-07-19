import type { WishlistPageProps } from '@/types/LikeTypes';
import WishList from './_components/WishList';

export default function WishlistPage({ searchParams }: WishlistPageProps) {
  return <WishList searchParams={searchParams} />;
}
