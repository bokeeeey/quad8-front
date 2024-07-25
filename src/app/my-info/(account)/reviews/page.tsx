import { ReviewPageProps } from '@/types/ProductReviewTypes';
import MyReviewList from './_components/MyReviewList';

export default async function ReviewsPage({ searchParams }: ReviewPageProps) {
  return <MyReviewList searchParams={searchParams} />;
}
