import { ReactNode } from 'react';
import classNames from 'classnames/bind';
import { BUTTON_COLOR } from '@/constants/buttonColors';
import styles from './Button.module.scss';

type ButtonColorType = (typeof BUTTON_COLOR)[keyof typeof BUTTON_COLOR];

const cn = classNames.bind(styles);

interface ButtonProps {
  backgroundColor?: ButtonColorType;
  hoverColor?: ButtonColorType;
  radius?: 4 | 8;
  width?: 'parent-full' | 72 | 90 | 120 | 154 | 320;
  fontSize?: 14 | 18 | 20 | 24;
  paddingVertical?: 8 | 20;
  onClick?: () => void;
  children: ReactNode;
}

/**
 * button component documentation
 * @param {ButtonColorType} [props.backgroundColor] - 버튼에 적용할 디자인
 * @param {ButtonColorType} [props.hoverColor] - 버튼에 hover 시 적용할 디자인
 * @param {number} [props.redius] - 버튼의 border-radius 크기 / 4px or 8px
 * @param {number} [props.width] - 너비의 크기 px 단위 / 'parent-full'은 100%
 * @param {number} [props.fontSize] - 폰트 크기 px 단위
 * @param {number} [props.paddingVertical] - 수직 방향 패딩 값
 * @param {funtion} [props.onClick] - 버튼 클릭 시 실행할 함수
 * @param {JSX.Element} [props.children] - 버튼 안에 들어갈 내용
 * @returns {JSX.Element}
 */

export default function Button({
  backgroundColor = BUTTON_COLOR.BACKGROUND_PRIMARY,
  hoverColor,
  radius = 8,
  width = 'parent-full',
  fontSize = 18,
  paddingVertical = 20,
  onClick,
  children,
}: ButtonProps) {
  const widthClassName = width === 'parent-full' ? 'parent-full' : `width-${width}`;
  const className = cn(
    widthClassName,
    backgroundColor,
    'common-style',
    `radius-${radius}`,
    `hover-${hoverColor}`,
    `font-${fontSize}`,
    `padding-${paddingVertical}`,
  );
  return (
    <button className={className} type='button' onClick={onClick}>
      {children}
    </button>
  );
}
