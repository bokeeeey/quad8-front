'use client';

import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames/bind';
import Image from 'next/image';
import { useForm, SubmitHandler, FieldValues } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import type { CommunityPostCardDetailDataType, PostCardDetailModalCustomKeyboardType } from '@/types/CommunityTypes';
import { Button, ImageInput, InputField, Rating, TextField, CustomOption } from '@/components';
import { keydeukImg } from '@/public/index';
import { postCreateCustomReview, putEditCustomReview } from '@/api/communityAPI';
import { REVIEW_KEYWORD } from '@/constants/reviewKeyword';
import { postProductReviews } from '@/api/productReviewAPI';
import { IMAGE_BLUR } from '@/constants/blurImage';

import styles from './WriteEditModal.module.scss';

const cn = classNames.bind(styles);

interface CustomReviewProps {
  reviewType: 'customReview';
  keyboardInfo: PostCardDetailModalCustomKeyboardType;
  onSuccessReview: () => void;
}

interface CustomReviewEditProps {
  reviewType: 'customReviewEdit';
  editCustomData: CommunityPostCardDetailDataType;
  onSuccessReview: () => void;
}

interface OtherReviewProps {
  reviewType: 'otherReview';
  productData: ProductDataType;
  onSuccessReview: () => void;
}

type WriteEditModalProps = CustomReviewProps | CustomReviewEditProps | OtherReviewProps;

interface ProductDataType {
  productId: number;
  productImgUrl: string;
  productName: string;
  orderId: number;
  option?: string;
}

const TITLE_MAX_LENGTH = 16;
const TITLE_PLACEHOLDER = '미 입력 시 키득 커스텀 키보드로 등록됩니다.';
const CONTENT_PLACEHOLDER = '최소 20자 이상 입력해주세요';

export default function WriteEditModal(props: WriteEditModalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const [deletedImageId, setDeleteImageId] = useState<number[]>([]);
  const [clickedFeedback, setClickedFeedback] = useState<Array<number>>([0, 0, 0]);
  const [rating, setRating] = useState<number>(0);
  const [isImageError, setIsImageError] = useState<boolean>(false);

  const { reviewType, onSuccessReview } = props;
  const isCustom = reviewType === 'customReview' || reviewType === 'customReviewEdit';
  const { keyboardInfo } = props as CustomReviewProps;
  const { editCustomData } = props as CustomReviewEditProps;
  const { productData } = props as OtherReviewProps;

  /**
   * 커스텀 리뷰 작성 관련 입니다.
   */

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

  /** 수정 관련 입니다. */

  const handleSaveDeletedImageId = (id: number) => {
    setDeleteImageId((prevIds) => [...prevIds, id]);
  };

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

  /** 상품 리뷰 관련 입니다. */

  const handleClickFeedback = (optionIndex: number, feedbackIndex: number) => {
    setClickedFeedback((prev) => prev.map((feedback, i) => (i === optionIndex ? feedback : feedbackIndex)));
  };

  const { mutate: postProductReviewMutation } = useMutation({
    mutationFn: ({ productId, formData }: { productId: number; formData: FormData }) =>
      postProductReviews({ productId, formData }),
    onSuccess: (res) => {
      if (res.status === 'SUCCESS') {
        onSuccessReview();
        toast.success('리뷰 등록이 완료되었습니다.');
      } else {
        toast.error('데이터를 불러오는 중 오류가 발생하였습니다.');
      }
    },
    onError: () => {
      toast.error('리뷰 등록 중 오류가 발생했습니다.');
    },
  });

  /** react hook form  */
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { isValid },
    reset,
  } = useForm<FieldValues>({
    mode: 'onTouched',
  });

  useEffect(() => {
    if (editCustomData?.title) {
      reset({
        title: editCustomData.title || '',
        content: editCustomData.content || '',
        files: editCustomData.reviewImages || [],
      });
    }
  }, [editCustomData, reset]);

  const registers = {
    title: register('title', {
      required: isCustom && true,
    }),
    content: register('content', {
      required: true,
      minLength: { value: 20, message: '최소 20자 이상 입력해주세요' },
    }),
  };

  const onSubmit: SubmitHandler<FieldValues> = (payload) => {
    // 1. 커스텀 리뷰 작성
    const fetchFormData = new FormData();

    if (reviewType === 'customReview') {
      const postDto = {
        productId: keyboardInfo?.productId,
        title: payload.title || '키득 커스텀 키보드',
        content: payload.content,
      };

      fetchFormData.append('postDto', JSON.stringify(postDto));

      if (payload.files && payload.files.length > 0) {
        payload.files.forEach((file: File) => {
          fetchFormData.append('files', file as File);
        });
      }
      return postCreatePostMutation(fetchFormData);
    }

    // 2. 커스텀 리뷰 수정
    if (reviewType === 'customReviewEdit' && editCustomData) {
      const postDto = {
        title: payload.title || '키득 커스텀 키보드',
        content: payload.content,
        deletedFileList: deletedImageId,
      };
      fetchFormData.append('postDto', JSON.stringify(postDto));

      if (payload.files && payload.files.length > 0) {
        payload.files.forEach((file: File) => {
          fetchFormData.append('files', file as File);
        });
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

      if (payload.files && payload.files.length > 0) {
        payload.files.forEach((file: File) => {
          fetchFormData.append('reviewImgs', file as File);
        });
      }

      if (productData) {
        return postProductReviewMutation({ productId: productData?.productId, formData: fetchFormData });
      }
    }

    return null;
  };

  const PRODUCT_DATA = isCustom
    ? {
        image: keyboardInfo?.imgUrl,
        name: '키득 커스텀 키보드',
      }
    : {
        image: productData?.productImgUrl,
        name: productData?.productName,
      };

  const productType = '키보드';

  const OPTIONS = Object.keys(REVIEW_KEYWORD[productType]);

  return (
    <form className={cn('container')} onSubmit={handleSubmit(onSubmit)}>
      <div ref={containerRef}>
        {isCustom && <p className={cn('info-text')}>해당 후기는 커뮤니티란에 게시됩니다.</p>}
        <div className={cn('product-data-wrapper')}>
          <div className={cn('product-image')}>
            <Image
              src={isImageError || !PRODUCT_DATA.image ? keydeukImg : PRODUCT_DATA.image}
              alt='커스텀 키보드 이미지'
              width={143}
              height={143}
              priority
              placeholder={IMAGE_BLUR.placeholder}
              blurDataURL={IMAGE_BLUR.blurDataURL}
              onError={() => setIsImageError(true)}
            />
          </div>
          <div className={cn('product-info')}>
            <p className={cn('product-info-title')}>{PRODUCT_DATA.name}</p>
            {isCustom && keyboardInfo ? (
              <CustomOption customData={keyboardInfo} wrapperRef={containerRef} />
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
              currentLength={watch('title')?.length}
              {...registers.title}
            />
          </div>
        ) : (
          <div className={cn('product-review-wrapper')}>
            <div className={cn('rating-review-wrapper')}>
              <h1 className={cn('rating-label')}>상품을 사용해 보셨나요?</h1>
              <Rating rating={rating} onRatingChange={setRating} usage='edit' />
            </div>
            <div className={cn('select-option-wrapper')}>
              {OPTIONS.map((option, optionIndex) => (
                <div key={option} className={cn('feedback-container')}>
                  <h1 className={cn('label')}>{option}</h1>
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
          isCustom={isCustom}
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
        {isCustom ? (
          <Button type='submit' backgroundColor={isValid ? 'background-primary' : 'background-gray-40'}>
            등록
          </Button>
        ) : (
          <Button
            type='submit'
            disabled={isCustom ? false : rating === 0}
            backgroundColor={isValid && rating > 0 ? 'background-primary' : 'background-gray-40'}
          >
            등록
          </Button>
        )}
      </div>
    </form>
  );
}
