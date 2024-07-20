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

  const data = await getUserProductReviews(initialParams);

  return (
    <div>
      {Array.isArray(data.reviewDtoList) ? (
        <div>
          <MyReviewList data={data} />
          <Pagination
            totalElements={data.totalElements}
            totalPages={data.totalPages}
            number={data.currentPage}
            first={data.first}
            last={data.last}
            searchParams={searchParams}
          />
        </div>
      ) : (
        <MyInfoEmptyCase message='구매 후기가 없습니다.' />
      )}
    </div>
  );
}
