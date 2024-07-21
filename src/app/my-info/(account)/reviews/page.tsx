import { getUserProductReviews } from '@/api/productReviewAPI';
import Pagination from '@/components/Pagination/Pagination';
import type { ReviewParamsType } from '@/types/ProductReviewTypes';
import { MyInfoEmptyCase } from '../../_components';
import MyReviewList from './_components/MyReviewList';

interface ReviewPageProps {
  searchParams: { [key: string]: string | undefined };
}

export default async function ReviewsPage({ searchParams }: ReviewPageProps) {
  const initialParams: ReviewParamsType = {
    page: searchParams.page || '0',
    size: searchParams.size || '16',
  };

  const userReviewData = await getUserProductReviews(initialParams);

  return (
    <div>
      {Array.isArray(userReviewData.reviewDtoList) ? (
        <div>
          <MyReviewList data={userReviewData} />
          <Pagination
            totalElements={userReviewData.totalElements}
            totalPages={userReviewData.totalPages}
            number={userReviewData.currentPage}
            first={userReviewData.first}
            last={userReviewData.last}
            searchParams={searchParams}
          />
        </div>
      ) : (
        <MyInfoEmptyCase message='구매 후기가 없습니다.' />
      )}
    </div>
  );
}
