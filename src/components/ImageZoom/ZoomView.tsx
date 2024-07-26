import classNames from 'classnames/bind';
import { StaticImageData } from 'next/image';
import styles from './ZoomView.module.scss';

const cn = classNames.bind(styles);

interface Position {
  left: number;
  top: number;
}

interface Props {
  image: string | StaticImageData;
  position: Position;
  left: number;
  viewWidth: number;
  viewHeight: number;
  imageDimensions: { width: number; height: number };
}

export default function ZoomView({ image, position, left, viewWidth, viewHeight, imageDimensions }: Props) {
  const { width: imageWidth, height: imageHeight } = imageDimensions;

  const imageAspectRatio = imageWidth / imageHeight;

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
        backgroundPosition: `${position.left + 175}px ${position.top + 500}px`,
        backgroundSize: `${widthRatio}% ${heightRatio}%`,
      }}
    />
  );
}
