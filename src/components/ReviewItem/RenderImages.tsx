import { IMAGE_BLUR } from '@/constants/blurImage';
import type { ReviewImage } from '@/types/productReviewType';
import classNames from 'classnames/bind';
import Image from 'next/image';
import styles from './ReviewItem.module.scss';

const cn = classNames.bind(styles);

interface RenderImagesProps {
  reviewImgs: ReviewImage[];
  className?: string;
  width: number;
  height: number;
  altPrefix: string;
  onClick?: (id: number) => void;
}

export default function RenderImages({ reviewImgs, className, width, height, altPrefix, onClick }: RenderImagesProps) {
  return (
    <>
      {reviewImgs.map((item, idx) => (
        <div key={item.id}>
          <Image
            className={cn('render-image', className)}
            src={item.imageUrl}
            width={width}
            height={height}
            sizes='(max-width: 1200px) 100%'
            alt={`${altPrefix} ${idx + 1}`}
            placeholder={IMAGE_BLUR.placeholder}
            blurDataURL={IMAGE_BLUR.blurDataURL}
            onClick={() => onClick?.(item.reviewId)}
          />
        </div>
      ))}
    </>
  );
}
