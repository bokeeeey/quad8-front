import classNames from 'classnames/bind';
import { StaticImageData } from 'next/image';

import type { Position } from '@/types/zoomViewType';

import styles from './ZoomView.module.scss';

const cn = classNames.bind(styles);

interface ZoomViewProps {
  image: string | StaticImageData;
  position: Position;
  left: number;
  viewWidth: number;
  viewHeight: number;
  imageDimensions: { width: number; height: number };
}

export default function ZoomView({ image, position, left, viewWidth, viewHeight, imageDimensions }: ZoomViewProps) {
  const { width: imageWidth, height: imageHeight } = imageDimensions;

  const imageAspectRatio = imageWidth / imageHeight;
  const marginTop = viewHeight === 536 ? 250 : 300;

  const calcRatio = (width: number, height: number): { widthRatio: number; heightRatio: number } => {
    if (width > height) {
      const widthRatio = 200;
      const heightRatio = 200 / imageAspectRatio;
      return { widthRatio, heightRatio };
    } else {
      const widthRatio = 200 * imageAspectRatio;
      const heightRatio = 200;
      return { widthRatio, heightRatio };
    }
  };

  const { widthRatio, heightRatio } = calcRatio(imageWidth, imageHeight);

  return (
    <div
      className={cn('container')}
      style={{
        backgroundImage: `url(${image})`,
        left,
        top: 0,
        width: viewWidth,
        height: viewHeight,
        backgroundPosition: `${position.left}px ${position.top + marginTop}px`,
        backgroundSize: `${widthRatio}% ${heightRatio}%`,
      }}
    />
  );
}
