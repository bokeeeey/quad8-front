'use client';

import classNames from 'classnames/bind';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { postSignin } from '@/api/authAPI';
import { Button, InputField } from '@/components';
import { ROUTER } from '@/constants/route';
import { GitHubIcon, GoogleIcon, KakaoIcon } from '@/public/index';
import type { FetchSignInInfoTypes } from '@/types/authTypes';

import styles from './page.module.scss';

const AUTH_SECTION = ['아이디 찾기', '비밀번호 찾기', '회원가입'];
const BASE_URL = process.env.NEXT_PUBLIC_KEYDEUK_API_BASE_URL;

const cn = classNames.bind(styles);

export default function Page() {
  const router = useRouter();
  const {
    register,
    formState: { errors },
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

  const onSubmit = async (formData: FetchSignInInfoTypes) => {
    try {
      const responseData = await postSignin(formData);

      if (responseData.status === 'SUCCESS') {
        toast.success('로그인이 성공적으로 완료되었습니다.', {
          autoClose: 2000,
        });
      } else if (responseData.status === 'FAIL') {
        toast.error(responseData.message);
      }
    } catch (error) {
      toast.error('로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    }
  };

  const handleKakaoOauth = async (provider: string) => {
    window.location.href = `${BASE_URL}/oauth2/authorization/${provider}`;
  };

  const handleClickLink = (url: string) => {
    router.push(url);
  };

  return (
    <form className={cn('container')} onSubmit={handleSubmit(onSubmit)}>
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
      <div className={cn('auth-section-wrapper')}>
        {AUTH_SECTION.map((text, i) => (
          <div key={text} className={cn('auth-section')}>
            <div className={cn('auth-section-text')} onClick={() => handleClickLink(ROUTER.AUTH.SIGN_UP)}>
              {text}
            </div>
            {i === 2 || <div className={cn('bar')}>|</div>}
          </div>
        ))}
      </div>
      <Button className={cn('button')} fontSize={24} type='submit'>
        로그인
      </Button>

      <div className={cn('o-auth-wrapper')}>
        <p>간편 로그인 하기</p>
        <div className={cn('icons')}>
          <GitHubIcon onClick={() => handleKakaoOauth('github')} />
          <GoogleIcon onClick={() => handleKakaoOauth('google')} />
          <KakaoIcon onClick={() => handleKakaoOauth('kakao')} />
        </div>
      </div>
    </form>
  );
}
