'use client';

import { useQueryClient } from '@tanstack/react-query';
import classNames from 'classnames/bind';
import { useRouter } from 'next/navigation';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { postSignin } from '@/api/authAPI';
import { ROUTER } from '@/constants/route';
import { setCookie } from '@/libs/manageCookie';
import type { FetchSignInInfoTypes } from '@/types/authType';
import { SpinLoading } from '@/public/index';
import Button from '../Buttons/Button/Button';
import InputField from '../InputField/InputField';
import Modal from '../Modal/Modal';

import styles from './SigninModal.module.scss';

const cn = classNames.bind(styles);

interface SigninModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SignInModal({ isOpen, onClose }: SigninModalProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const registers = {
    email: register('email', {
      required: '이메일을 입력해주세요.',
    }),
    password: register('password', {
      required: '비밀번호를 입력해주세요.',
    }),
  };

  const onSubmit: SubmitHandler<FieldValues> = async (formData) => {
    try {
      const responseData = await postSignin(formData as FetchSignInInfoTypes);

      if (responseData.status === 'SUCCESS') {
        setCookie('accessToken', responseData.data.accessToken);
        setCookie('refreshToken', responseData.data.refreshToken);
        onClose();
        toast.success('로그인이 성공적으로 완료되었습니다.', {
          autoClose: 2000,
        });
        Promise.all([
          queryClient.invalidateQueries({ queryKey: ['postCardsList'] }),
          queryClient.invalidateQueries({ queryKey: ['userData'] }),
        ]);
      } else if (responseData.status === 'FAIL') {
        toast.error(responseData.message);
      }
    } catch (error) {
      toast.error('로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    }
  };

  const handleClickLink = (url: string) => {
    router.push(url);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form className={cn('container')} onSubmit={handleSubmit(onSubmit)} onClick={(e) => e.stopPropagation()}>
        {/* <KeydeukBlueIcon width={50} height={50} className={cn('icon')} /> */}
        {/* <Image src={keydeukImg} className={cn('icon')} alt='이미지' /> */}
        <h1 className={cn('title')}>로그인</h1>
        <div className={cn('input-wrapper')}>
          <InputField
            label='이메일'
            placeholder='이메일을 입력해주세요'
            sizeVariant='md'
            labelSize='sm'
            errorMessage={errors.email?.message}
            {...registers.email}
          />
          <InputField
            label='비밀번호'
            placeholder='비밀번호를 입력해주세요'
            sizeVariant='md'
            labelSize='sm'
            type='password'
            suffixIcon='eye'
            errorMessage={errors.password?.message}
            {...registers.password}
          />
        </div>
        <div className={cn('signup-text')}>
          <span>회원이 아니신가요? </span>
          <strong onClick={() => handleClickLink(ROUTER.AUTH.SIGN_UP)}>회원가입하기</strong>
        </div>
        {isSubmitting ? (
          <SpinLoading className={cn('spin-icon')} />
        ) : (
          <Button className={cn('button', { loading: isSubmitting })} fontSize={20} type='submit'>
            로그인
          </Button>
        )}
      </form>
    </Modal>
  );
}
