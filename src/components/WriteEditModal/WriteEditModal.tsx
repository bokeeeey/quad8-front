'use client';

import classNames from 'classnames/bind';
import Image from 'next/image';
import { useForm, SubmitHandler, FieldValues } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { PostCardDetailModalCustomKeyboardType } from '@/types/CommunityTypes';
import { Button, ImageInput, InputField, TextField } from '@/components';
import { keydeukImg } from '@/public/index';
import { postCreateCustomReview } from '@/api/communityAPI';

import { toast } from 'react-toastify';
import styles from './WriteEditModal.module.scss';

const cn = classNames.bind(styles);

interface WriteEditModalProps {
  keyboardInfo: PostCardDetailModalCustomKeyboardType;
  isCustomReview?: boolean;
  onSuccessReview: () => void;
}

const TITLE_MAX_LENGTH = 20;
const TITLE_PLACEHOLDER = '미 입력 시 키득 커스텀 키보드로 등록됩니다.';
const CONTENT_PLACEHOLDER = '최소 20자 이상 입력해주세요';

export default function WriteEditModal({ keyboardInfo, isCustomReview, onSuccessReview }: WriteEditModalProps) {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { isValid },
  } = useForm({
    mode: 'onChange',
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

  const registers = {
    title: register('title', {
      required: true,
    }),
    content: register('content', {
      minLength: { value: 20, message: '최소 20자 이상 입력해주세요' },
    }),
  };

  const onSubmit: SubmitHandler<FieldValues> = (payload) => {
    const fetchFormData = new FormData();

    const postDto = {
      productId: keyboardInfo.productId,
      title: payload.title,
      content: payload.content,
    };

    fetchFormData.append('postDto', JSON.stringify(postDto));

    if (payload.files && payload.files.length > 0) {
      for (let i = 0; i < payload.files.length; i += 1) {
        fetchFormData.append('files', payload.files[i] as File);
      }
    }

    postCreatePostMutation(fetchFormData);
  };

  return (
    <form className={cn('container')} onSubmit={handleSubmit(onSubmit)}>
      <div>
        {isCustomReview && <p className={cn('info-text')}>해당 후기는 커뮤니티란에 게시됩니다.</p>}
        <div className={cn('keyboard-info-wrapper')}>
          <div className={cn('keyboard-image')}>
            <Image src={keydeukImg} alt='커스텀 키보드 이미지' width={143} height={143} />
          </div>
          <div className={cn('keyboard-info')}>
            <p className={cn('keyboard-info-title')}>키득 커스텀 키보드</p>
            <div>{keyboardInfo.baseKeyColor + keyboardInfo.baseKeyColor}</div>
          </div>
        </div>
      </div>
      <div className={cn('input-wrapper')}>
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
        <ImageInput register={register} setValue={setValue} />
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
