import type { ReviewPageProps } from '@/types/productReviewType';
import MyReviewList from './_components/MyReviewList';

export default async function ReviewsPage({ searchParams }: ReviewPageProps) {
  return <MyReviewList searchParams={searchParams} />;
}
