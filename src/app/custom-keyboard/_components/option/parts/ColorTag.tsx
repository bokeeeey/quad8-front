'use client';

import { DeleteIcon } from '@/public/index';
import type { CustomKeyboardKeyTypes } from '@/types/customKeyboardType';
import { Color } from '@react-three/fiber';
import classNames from 'classnames/bind';

import styles from './ColorTag.module.scss';

const cn = classNames.bind(styles);

interface ColorTagProps {
  keyCap: CustomKeyboardKeyTypes;
  color: Color;
  onDelete: () => void;
}

export default function ColorTag({ keyCap, color, onDelete }: ColorTagProps) {
  return (
    <div className={cn('wrapper')}>
      <div className={cn('color-text')}>{`${keyCap} : ${color.toString().toUpperCase()}`}</div>
      <DeleteIcon width={20} height={20} onClick={onDelete} className={cn('delete-icon')} />
    </div>
  );
}
