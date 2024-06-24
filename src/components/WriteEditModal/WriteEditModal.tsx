'use client';

import classNames from 'classnames/bind';
import Image from 'next/image';
import { useForm, SubmitHandler, FieldValues } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { CommunityPostCardDetailDataType, PostCardDetailModalCustomKeyboardType } from '@/types/CommunityTypes';
import { Button, ImageInput, InputField, Rating, TextField } from '@/components';
import { keydeukImg } from '@/public/index';
import { postCreateCustomReview, putEditCustomReview } from '@/api/communityAPI';

import { toast } from 'react-toastify';
import { useState } from 'react';
import { REVIEW_KEYWORD } from '@/constants/reviewKeyword';
import { postProductReviews } from '@/api/productReviewAPI';
import styles from './WriteEditModal.module.scss';
// import FeedbackToggle from './FeedbackToggle';

const cn = classNames.bind(styles);

interface WriteEditModalProps {
  reviewType: 'customReview' | 'customReviewEdit' | 'otherReview';
  keyboardInfo?: PostCardDetailModalCustomKeyboardType;
  editCustomData?: CommunityPostCardDetailDataType;
  productData?: ProductDataType;
  onSuccessReview: () => void;
}

interface ProductDataType {
  productId: number;
  productImgUrl: string;
  productName: string;
  orderId: number;
  option?: string;
}

const TITLE_MAX_LENGTH = 20;
const TITLE_PLACEHOLDER = '미 입력 시 키득 커스텀 키보드로 등록됩니다.';
const CONTENT_PLACEHOLDER = '최소 20자 이상 입력해주세요';

export default function WriteEditModal({
  keyboardInfo,
  reviewType,
  editCustomData,
  productData,
  onSuccessReview,
}: WriteEditModalProps) {
  const queryClient = useQueryClient();

  const [deletedImageId, setDeleteImageId] = useState<number[]>([]);
  const [clickedFeedback, setClickedFeedback] = useState<Array<number>>([0, 0, 0]);
  const [rating, setRating] = useState<number>(0);

  const isCustom = reviewType === 'customReview' || reviewType === 'customReviewEdit';

  const handleClickFeedback = (optionIndex: number, feedbackIndex: number) => {
    const updatedClickedFeedback = [...clickedFeedback];
    updatedClickedFeedback[optionIndex] = feedbackIndex;
    setClickedFeedback(updatedClickedFeedback);
  };

  const handleSaveDeletedImageId = (id: number) => {
    setDeleteImageId((prevIds) => [...prevIds, id]);
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isValid },
  } = useForm<FieldValues>({
    mode: 'onChange',
    defaultValues: {
      title: editCustomData?.title || '',
      content: editCustomData?.content || '',
      files: editCustomData?.reviewImages || [],
    },
  });

  const { mutate: postCreatePostMutation } = useMutation({
    mutationFn: postCreateCustomReview,
    onSuccess: (res) => {
      if (res.status === 'SUCCESS') {
        onSuccessReview();
        queryClient.invalidateQueries({ queryKey: ['postCardsList'] });
        toast.success('리뷰가 달렸습니다.');
      } else {
        toast.error('데이터를 불러오는 중 오류가 발생하였습니다.');
      }
    },
    onError: () => {
      toast.error('리뷰 등록 중 오류가 발생했습니다.');
    },
  });

  const { mutate: putEditPostMutation } = useMutation({
    mutationFn: ({ id, formData }: { id: number; formData: FormData }) => putEditCustomReview({ id, formData }),
    onSuccess: (res) => {
      if (res.status === 'SUCCESS') {
        onSuccessReview();
        queryClient.invalidateQueries({ queryKey: ['postCardsList'] });
        toast.success('리뷰 수정이 완료되었습니다.');
      } else {
        toast.error('데이터를 불러오는 중 오류가 발생하였습니다.');
      }
    },
    onError: () => {
      toast.error('리뷰 수정 중 오류가 발생했습니다.');
    },
  });

  const { mutate: postProductReviewMutation } = useMutation({
    mutationFn: ({ productId, formData }: { productId: number; formData: FormData }) =>
      postProductReviews({ productId, formData }),
    onSuccess: (res) => {
      if (res.status === 'SUCCESS') {
        // onSuccessReview();
        // queryClient.invalidateQueries({ queryKey: ['postCardsList'] });
        toast.success('리뷰 등록이 완료되었습니다.');
      } else {
        toast.error('데이터를 불러오는 중 오류가 발생하였습니다.');
      }
    },
    onError: () => {
      toast.error('리뷰 등록 중 오류가 발생했습니다.');
    },
  });

  const registers = {
    title: register('title', {
      required: isCustom && true,
    }),
    content: register('content', {
      minLength: { value: 20, message: '최소 20자 이상 입력해주세요' },
    }),
  };

  const onSubmit: SubmitHandler<FieldValues> = (payload) => {
    // 1. 커스텀 리뷰 작성
    const fetchFormData = new FormData();

    if (reviewType === 'customReview') {
      const postDto = {
        productId: keyboardInfo?.productId,
        title: payload.title,
        content: payload.content,
      };

      fetchFormData.append('postDto', JSON.stringify(postDto));

      if (payload.files && payload.files.length > 0) {
        for (let i = 0; i < payload.files.length; i += 1) {
          fetchFormData.append('files', payload.files[i] as File);
        }
      }
      return postCreatePostMutation(fetchFormData);
    }

    // 2. 커스텀 리뷰 수정
    if (reviewType === 'customReviewEdit' && editCustomData) {
      const postDto = {
        title: payload.title,
        content: payload.content,
        deletedFileList: deletedImageId,
      };
      fetchFormData.append('postDto', JSON.stringify(postDto));

      if (payload.files && payload.files.length > 0) {
        for (let i = 0; i < payload.files.length; i += 1) {
          fetchFormData.append('files', payload.files[i] as File);
        }
      }
      return putEditPostMutation({ id: editCustomData.id, formData: fetchFormData });
    }

    // 3. 커스텀 외 상품 리뷰 수정
    if (reviewType === 'otherReview') {
      const createReviewRequest = {
        orderId: productData?.orderId,
        content: payload.content,
        option1: clickedFeedback[0] + 1,
        option2: clickedFeedback[1] + 1,
        option3: clickedFeedback[2] + 1,
        score: rating,
      };
      fetchFormData.append('createReviewRequest', JSON.stringify(createReviewRequest));

      console.log(createReviewRequest);

      if (payload.files && payload.files.length > 0) {
        for (let i = 0; i < payload.files.length; i += 1) {
          fetchFormData.append('reviewImgs', payload.files[i] as File);
        }
      }

      if (productData) {
        return postProductReviewMutation({ productId: productData?.productId, formData: fetchFormData });
      }
    }

    return null;
  };

  const PRODUCT_DATA = {
    productImage: isCustom ? keyboardInfo?.imgUrl : productData?.productImgUrl,
    productName: isCustom ? '키득 커스텀 키보드' : productData?.productName,
  };

  const productType = '키보드';

  const OPTIONS = Object.keys(REVIEW_KEYWORD[productType]);

  return (
    <form className={cn('container')} onSubmit={handleSubmit(onSubmit)}>
      <div>
        {isCustom && <p className={cn('info-text')}>해당 후기는 커뮤니티란에 게시됩니다.</p>}
        <div className={cn('product-data-wrapper')}>
          <div className={cn('product-image')}>
            <Image src={PRODUCT_DATA.productImage || keydeukImg} alt='커스텀 키보드 이미지' width={143} height={143} />
          </div>
          <div className={cn('product-info')}>
            <p className={cn('product-info-title')}>{PRODUCT_DATA.productName}</p>
            {isCustom ? (
              <div>{keyboardInfo && keyboardInfo.baseKeyColor + keyboardInfo.baseKeyColor}</div>
            ) : (
              <div className={cn('product-option')}>{productData?.option}</div>
            )}
          </div>
        </div>
      </div>
      <div className={cn('input-wrapper')}>
        {isCustom ? (
          <div className={cn('title-input-wrapper')}>
            <InputField
              label='제목'
              sizeVariant='md'
              className={cn('title-input')}
              placeholder={TITLE_PLACEHOLDER}
              maxLength={TITLE_MAX_LENGTH}
              labelSize='lg'
              {...registers.title}
            />
          </div>
        ) : (
          <div className={cn('product-review-wrapper')}>
            <div className={cn('rating-review-wrapper')}>
              <h1 id={cn('rating-label')}>상품을 사용해 보셨나요?</h1>
              <Rating rating={rating} onRatingChange={setRating} usage='edit' />
            </div>
            <div className={cn('select-option-wrapper')}>
              {OPTIONS.map((option, optionIndex) => (
                <div key={option} className={cn('feedback-container')}>
                  <h1 id={cn('label')}>{option}</h1>
                  <div className={cn('option-wrapper')}>
                    {REVIEW_KEYWORD[productType][option].map((feedback, feedbackIndex) => (
                      <div
                        key={feedback}
                        className={cn(
                          clickedFeedback[optionIndex] === feedbackIndex ? 'option-clicked' : 'option-not-clicked',
                        )}
                        onClick={() => handleClickFeedback(optionIndex, feedbackIndex)}
                      >
                        {feedback}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <ImageInput
          register={register}
          setValue={setValue}
          editCustomImages={editCustomData?.reviewImages}
          onSaveDeletedImageId={handleSaveDeletedImageId}
        />
        <TextField
          label='내용'
          className={cn('text-area-input')}
          placeholder={CONTENT_PLACEHOLDER}
          sizeVariant='md'
          {...registers.content}
        />
      </div>
      <div className={cn('button-wrapper')}>
        <Button type='submit' backgroundColor={isValid ? 'background-primary' : 'background-gray-40'}>
          등록
        </Button>
      </div>
    </form>
  );
}
