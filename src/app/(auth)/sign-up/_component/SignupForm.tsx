'use client';

import classNames from 'classnames/bind';
import { useForm, FieldValues, SubmitHandler } from 'react-hook-form';
import { ChangeEvent } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

import { getCheckEmailDuplication, getCheckNicknameDuplication, postSignup } from '@/api/authAPI';
import { changePhoneNumber, unFormatPhoneNumber } from '@/libs';
import { Button, RadioField, InputField } from '@/components';
import { REGEX, ERROR_MESSAGE, PLACEHOLDER } from '@/constants/signUpConstants';
import { CaretRightIcon, CheckboxCircleIcon } from '@/public/index';

import styles from './SignupForm.module.scss';

const cn = classNames.bind(styles);

const defaultInputValues = {
  email: '',
  password: '',
  passwordConfirm: '',
  birth: '',
  phone: '',
  gender: '',
  nickname: '',
  imgUrl: '',
  checkAll: false,
  check1: false,
  check2: false,
};

const NOT_CHECKED = '#A5A5A5';
const CHECKED = '#4968f6';

export default function SignupForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    getValues,
    setError,
    trigger,
    setValue,
    watch,
  } = useForm({
    mode: 'onBlur',
    defaultValues: defaultInputValues,
  });

  const handleCheckDuplicatedEmail = async () => {
    const emailValue = getValues('email');
    const isDuplicated = await getCheckEmailDuplication(emailValue);

    if (isDuplicated.data === true) {
      setError('email', {
        message: '중복된 이메일입니다.',
      });
    }
  };

  const handleCheckDuplicatedNickname = async () => {
    const nicknameValue = getValues('nickname');
    const isDuplicated = await getCheckNicknameDuplication(nicknameValue);

    if (isDuplicated.data === true) {
      setError('nickname', {
        message: '중복된 닉네임입니다.',
      });
    }
  };

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    const phoneValue = e.target.value;
    const formattedValue = changePhoneNumber(phoneValue);
    setValue('phone', formattedValue, { shouldValidate: true });
  };

  const registers = {
    email: register('email', {
      required: ERROR_MESSAGE.EMAIL.required,
      pattern: {
        value: REGEX.EMAIL,
        message: ERROR_MESSAGE.EMAIL.invalid,
      },
      onBlur: () => handleCheckDuplicatedEmail(),
    }),

    password: register('password', {
      required: ERROR_MESSAGE.PASSWORD.required,
      pattern: {
        value: REGEX.PASSWORD,
        message: ERROR_MESSAGE.PASSWORD.invalid,
      },
      onBlur: () => {
        trigger('passwordConfirm');
      },
    }),

    passwordConfirm: register('passwordConfirm', {
      required: ERROR_MESSAGE.PASSWORD_CONFIRM.required,
      validate: (value) => value === getValues('password') || ERROR_MESSAGE.PASSWORD_CONFIRM.invalid,
    }),

    nickname: register('nickname', {
      required: ERROR_MESSAGE.NICKNAME.required,
      minLength: { value: 2, message: ERROR_MESSAGE.NICKNAME.invalid },
      maxLength: { value: 16, message: ERROR_MESSAGE.NICKNAME.invalid },
      onBlur: () => handleCheckDuplicatedNickname(),
    }),

    phone: register('phone', {
      required: ERROR_MESSAGE.PHONE.required,
      setValueAs: (value) => unFormatPhoneNumber(value),
      onChange: (e) => handlePhoneChange(e),
    }),

    birth: register('birth', {
      required: ERROR_MESSAGE.BIRTH.required,
      pattern: {
        value: REGEX.BIRTH,
        message: ERROR_MESSAGE.BIRTH.invalid,
      },
    }),
    gender: register('gender', {
      required: ERROR_MESSAGE.GENDER.required,
      setValueAs: (value) => (value === '여자' ? 'FEMALE' : 'MALE'),
    }),
    checkAll: register('checkAll', {
      required: true,
      onChange: () => {
        setValue('check1', watch('checkAll'));
        setValue('check2', watch('checkAll'));
      },
    }),
    check1: register('check1', {
      required: true,
      onChange: () => {
        setValue('checkAll', watch('check1') && watch('check2'));
      },
    }),
    check2: register('check2', {
      required: true,
      onChange: () => {
        setValue('checkAll', watch('check1') && watch('check2'));
      },
    }),
  };

  const onSubmit: SubmitHandler<FieldValues> = async (payload) => {
    const { email, password, nickname, phone, birth, gender } = payload;

    const joinRequest = {
      email,
      password,
      nickname,
      phone,
      birth,
      gender,
    };

    try {
      const fetchFormData = new FormData();
      fetchFormData.append('joinRequest', JSON.stringify(joinRequest));
      const response = await postSignup(fetchFormData);
      if (response.status === 'SUCCESS') {
        toast.success('회원가입이 성공적으로 완료되었습니다.');
        setTimeout(() => {
          router.back();
        }, 2000);
      } else if (response.status === 'FAIL') {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error('회원가입 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={cn('container')}>
        <h1 className={cn('title')}>회원가입</h1>
        <div className={cn('content-wrapper')}>
          <div className={cn('input-wrapper')}>
            <InputField
              label='이메일'
              placeholder={PLACEHOLDER.EMAIL}
              sizeVariant='md'
              labelSize='sm'
              errorMessage={errors.email?.message}
              {...registers.email}
            />
            <InputField
              label='비밀번호'
              placeholder={PLACEHOLDER.PASSWORD}
              sizeVariant='md'
              labelSize='sm'
              type='password'
              suffixIcon='eye'
              errorMessage={errors.password?.message}
              {...registers.password}
            />
            <InputField
              label='비밀번호 확인'
              placeholder={PLACEHOLDER.CONFIRM_PASSWORD}
              sizeVariant='md'
              labelSize='sm'
              type='password'
              suffixIcon='eye'
              errorMessage={errors?.passwordConfirm?.message}
              {...registers.passwordConfirm}
            />
            <InputField
              label='닉네임'
              placeholder={PLACEHOLDER.NICKNAME}
              sizeVariant='md'
              labelSize='sm'
              errorMessage={errors.nickname?.message}
              {...registers.nickname}
            />
            <div className={cn('phone-number-wrapper')}>
              <InputField
                placeholder={PLACEHOLDER.PHONE_NUMBER}
                label='휴대폰 번호'
                sizeVariant='md'
                labelSize='sm'
                errorMessage={errors.phone?.message}
                className={cn('phone-number-input')}
                {...registers.phone}
              />
            </div>
            <InputField
              label='생년월일'
              placeholder={PLACEHOLDER.BIRTHDAY}
              sizeVariant='md'
              labelSize='sm'
              errorMessage={errors.birth?.message}
              {...registers.birth}
            />
            <RadioField
              label='성별'
              options={['남자', '여자']}
              errorMessage={errors.gender?.message}
              {...registers.gender}
            />
          </div>
          <div className={cn('agreement-checkbox')}>
            <div className={cn('agreement-title')}>
              <input {...registers.checkAll} type='checkbox' className={cn('checkbox-input')} id='checkAll' />
              <label htmlFor='checkAll' className={cn('checkbox-label')}>
                <CheckboxCircleIcon fill={watch('checkAll') ? CHECKED : NOT_CHECKED} width={15} height={15} />
              </label>
              <h2>아래 약관에 모두 동의합니다.</h2>
            </div>
            <div className={cn('content-wrapper')}>
              <div className={cn('content')}>
                <input {...registers.check1} type='checkbox' className={cn('checkbox-input')} id='check1' />
                <label htmlFor='check1' className={cn('checkbox-label')}>
                  <CheckboxCircleIcon fill={watch('check1') ? CHECKED : NOT_CHECKED} width={15} height={15} />
                </label>
                <h3>서비스 이용 약관 동의</h3>
                <CaretRightIcon className={cn('right-arrow')} stroke='black' />
              </div>
              <div className={cn('content')}>
                <input {...registers.check2} type='checkbox' className={cn('checkbox-input')} id='check2' />
                <label htmlFor='check2' className={cn('checkbox-label')}>
                  <CheckboxCircleIcon fill={watch('check2') ? CHECKED : NOT_CHECKED} width={15} height={15} />
                </label>
                <h3>개인정보 처리 방침 동의</h3>
                <CaretRightIcon className={cn('right-arrow')} stroke='black' />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Button
        type='submit'
        disabled={!isValid}
        className={cn('button')}
        fontSize={24}
        backgroundColor={isValid ? 'background-primary' : 'background-gray-40'}
      >
        회원가입
      </Button>
    </form>
  );
}
