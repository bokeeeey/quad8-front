'use client';

import classNames from 'classnames/bind';
import { useState } from 'react';

import { Button } from '@/components';
import { CalendarIcon } from '@/public/index';
import Calendar from './Calendar';

import styles from './DatePicker.module.scss';

const cn = classNames.bind(styles);
const MONTH_OPTIONS = [1, 2, 3];

interface DatePickerProps {
  startDate?: string;
  endDate?: string;
  onDateChange: (startDate: { startDate: Date; endDate: Date }) => void;
}

export default function DatePicker({ startDate, endDate, onDateChange }: DatePickerProps) {
  const currentDate = new Date();
  const initialStartDate = startDate ? new Date(startDate) : new Date();
  initialStartDate.setMonth(initialStartDate.getMonth() - 1);

  const [selectedStartDate, setSelectedStartDate] = useState<Date>(initialStartDate);
  const [selectedEndDate, setSelectedEndDate] = useState<Date>(endDate ? new Date(endDate) : new Date());

  const [openCalendarType, setOpenCalendarType] = useState<'start' | 'end' | null>(null);
  const [selectedMonthOption, setSelectedMonthOption] = useState<number>(1);

  const handleOpenStartCalendar = () => {
    setOpenCalendarType('start');
  };

  const handleOpenEndCalendar = () => {
    setOpenCalendarType('end');
  };

  const handleCloseCalendar = () => {
    setOpenCalendarType(null);
  };

  const handleQueryButtonClick = () => {
    onDateChange({ startDate: selectedStartDate, endDate: selectedEndDate });
  };

  const handleSetSelectedStartDate = (date: Date) => {
    setSelectedStartDate(date);
    setSelectedMonthOption(0);
  };

  const handleSetSelectedEndDate = (date: Date) => {
    setSelectedEndDate(date);
    setSelectedMonthOption(0);
  };

  const formatDateToString = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const dateString = `${year}.${month}.${day}`;
    return dateString;
  };

  const handleClickMonthOption = (month: number) => {
    const selectedStart = new Date(currentDate);
    const selectedEnd = new Date(currentDate);
    setSelectedMonthOption(month);

    selectedStart.setMonth(currentDate.getMonth() - month);
    setSelectedStartDate(selectedStart);
    setSelectedEndDate(selectedEnd);
  };

  return (
    <div className={cn('container')}>
      <div className={cn('month-picker-wrapper')}>
        {MONTH_OPTIONS.map((month) => (
          <Button
            key={month}
            hoverColor='outline-primary'
            paddingVertical={8}
            width={90}
            backgroundColor={selectedMonthOption === month ? 'outline-primary' : 'outline-gray-40'}
            onClick={() => handleClickMonthOption(month)}
          >
            {month}개월
          </Button>
        ))}
      </div>
      <div className={cn('custom-picker-wrapper')}>
        <div
          className={cn('date-picker-input', 'start-date', `${openCalendarType === 'start' && 'is-focus'}`)}
          onClick={handleOpenStartCalendar}
        >
          <span className={cn('date-text')}>{formatDateToString(selectedStartDate)}</span>
          <CalendarIcon stroke={openCalendarType === 'start' ? '#4968F6' : '#787878'} />
          {openCalendarType === 'start' && (
            <Calendar
              selectedDate={selectedStartDate}
              onSetSelectedDate={handleSetSelectedStartDate}
              onCloseCalendar={handleCloseCalendar}
            />
          )}
        </div>

        <p>~</p>

        <div
          className={cn('date-picker-input', 'end-date', `${openCalendarType === 'end' && 'is-focus'}`)}
          onClick={handleOpenEndCalendar}
        >
          <span className={cn('date-text')}>{formatDateToString(selectedEndDate)}</span>
          <CalendarIcon stroke={openCalendarType === 'end' ? '#4968F6' : '#787878'} />
          {openCalendarType === 'end' && (
            <Calendar
              selectedDate={selectedEndDate}
              onSetSelectedDate={handleSetSelectedEndDate}
              onCloseCalendar={handleCloseCalendar}
              startDate={selectedStartDate}
            />
          )}
        </div>
      </div>
      <Button
        className={cn('confirm-button')}
        width={72}
        paddingVertical={8}
        radius={4}
        onClick={handleQueryButtonClick}
      >
        조회
      </Button>
    </div>
  );
}
