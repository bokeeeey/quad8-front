import { ReviewPageProps } from '@/types/ProductReviewType';
import MyReviewList from './_components/MyReviewList';

export default async function ReviewsPage({ searchParams }: ReviewPageProps) {
  return <MyReviewList searchParams={searchParams} />;
}
