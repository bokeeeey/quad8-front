import { ChevronIcon, EyeOffIcon, EyeOnIcon, SearchIcon } from '@/public/index';
import classNames from 'classnames/bind';
import { InputHTMLAttributes, MouseEvent } from 'react';
import styles from './SuffixIcon.module.scss';

const cn = classNames.bind(styles);

interface SuffixIconProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onClick'> {
  icon: 'search' | 'eye' | 'arrow';
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  isOpen?: boolean;
}

export default function SuffixIcon({ type, icon, isOpen, onClick }: SuffixIconProps) {
  const renderIcon = () => {
    switch (icon) {
      case 'search':
        return <SearchIcon className={cn('search-icon')} />;
      case 'arrow':
        return <ChevronIcon className={cn('chevron-icon')} />;
      default:
        if (type === 'password') {
          return <EyeOffIcon />;
        }

        return <EyeOnIcon />;
    }
  };

  const isArrow = icon === 'arrow';

  return (
    <button
      type={icon === 'search' ? 'submit' : 'button'}
      className={cn('suffix-icon', { rotate: isOpen, 'arrow-icon': isArrow })}
      onClick={onClick}
    >
      {renderIcon()}
    </button>
  );
}
