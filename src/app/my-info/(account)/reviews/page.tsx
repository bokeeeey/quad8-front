import { getUserProductReviews } from '@/api/productReviewAPI';
import { MyInfoEmptyCase } from '../../_components';
import MyReviewList from './_components/MyReviewList';

export default async function ReviewsPage() {
  const data = await getUserProductReviews({});

  return (
    <div>
      {Array.isArray(data.reviewDtoList) ? (
        <MyReviewList data={data} />
      ) : (
        <MyInfoEmptyCase message='구매 후기가 없습니다.' />
      )}
    </div>
  );
}
