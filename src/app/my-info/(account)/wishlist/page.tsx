import { WishlistPageProps } from '@/types/LikeTypes';
import WishList from './_components/WishList';

export default function WishlistPage({ searchParams }: WishlistPageProps) {
  // return <MyInfoEmptyCase message='찜한 상품이 없습니다.' />;
  return <WishList searchParams={searchParams} />;
}
