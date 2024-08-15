'use client';

import classNames from 'classnames/bind';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { Dropdown } from '@/components';
import { COMMUNITY_REVIEW_SORT_OPTIONS } from '@/constants/dropdownOptions';

import styles from './SortDropdown.module.scss';

const cn = classNames.bind(styles);

export default function SortDropdown() {
  const [selectedOption, setSelectedOption] = useState(COMMUNITY_REVIEW_SORT_OPTIONS[0].label);
  const router = useRouter();
  const queryClient = useQueryClient();

  const updateQuery = (queryValue: string) => {
    const query = new URLSearchParams(window.location.search);
    query.set('sort', queryValue);
    router.push(`${window.location.pathname}?${query.toString()}`);
  };

  const handleDropdownChange = (option: string) => {
    setSelectedOption(option);
    const queryValue = COMMUNITY_REVIEW_SORT_OPTIONS.find((opt) => opt.label === option)?.value;
    if (!queryValue) {
      return;
    }
    updateQuery(queryValue);
    queryClient.invalidateQueries({
      queryKey: ['postCardsList'],
    });
  };

  return (
    <div className={cn('container')}>
      <Dropdown
        options={COMMUNITY_REVIEW_SORT_OPTIONS.map((option) => option.label)}
        sizeVariant='xs'
        onChange={handleDropdownChange}
        value={selectedOption}
      />
    </div>
  );
}
