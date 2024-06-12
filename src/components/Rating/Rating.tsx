'use client';

import StarIcon from '@/public/svgs/star.svg';
import classNames from 'classnames/bind';
import { useState } from 'react';
import styles from './Rating.module.scss';

interface StarProps {
  checked: boolean;
  onClick: () => void;
  onMouseOver: () => void;
  onMouseOut: () => void;
  isEditable?: boolean;
}

interface RatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  isEditable?: boolean;
}

const cn = classNames.bind(styles);

function Star({ checked, onClick, onMouseOver, onMouseOut, isEditable }: StarProps) {
  return (
    <StarIcon
      className={cn(checked ? 'checked' : 'not-checked', isEditable && 'edit')}
      onClick={() => isEditable && onClick()}
      onMouseOver={() => isEditable && onMouseOver()}
      onMouseOut={() => isEditable && onMouseOut()}
    />
  );
}

export default function Rating({ rating, onRatingChange, isEditable }: RatingProps) {
  const STARS = [1, 2, 3, 4, 5];
  const [hoverRating, setHoverRating] = useState<number>(0);

  const handleRating = (rate: number) => {
    if (onRatingChange) {
      onRatingChange(rate);
    }
  };

  return (
    <div>
      {STARS.map((star) => (
        <Star
          key={star}
          checked={star <= (hoverRating || rating)}
          onClick={() => handleRating(star)}
          onMouseOver={() => star > rating && setHoverRating(star)}
          onMouseOut={() => setHoverRating(0)}
          isEditable={isEditable}
        />
      ))}
    </div>
  );
}
