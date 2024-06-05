'use client';

import { InputField, TextField } from '@/components';
import Dropdown from '@/components/Dropdown/Dropdown';
import { FormEvent } from 'react';

const OPTIONS = ['인기순', '조회순', '최신순', '가격 낮은순', '가격 높은순', '직접 입력'];

export default function Page() {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // const formData = new FormData(e.currentTarget);
    // const payload = Object.fromEntries(formData.entries());
    // console.log(payload);
  };

  const handleClick = () => {
    // console.log('onClick', true);
  };

  return (
    <form onSubmit={handleSubmit}>
      <InputField
        label='이메일'
        id='이메일'
        name='인풋'
        placeholder='이메일을 입력해 주세요'
        hasSuffixIcon='eye'
        sizeVariant='md'
      />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <div style={{ width: '600px' }}>
        <Dropdown options={OPTIONS} name='드롭다운' sizeVariant='xs' onClick={handleClick} />
      </div>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <TextField label='텍스트필드' id='텍스트' name='텍스트' placeholder='최소 20자 이상 입력해 주세요' />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      {/* <RadioField options={OPTIONS} label='숫자' value='6' /> */}
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <button style={{ border: '1px solid', width: '100%', height: '10vh', textAlign: 'center' }} type='submit'>
        테스트
      </button>
    </form>
  );
}
