'use client';

import { useState } from 'react';
import Image, { ImageProps } from 'next/image';
import type { StaticImageData, StaticRequire } from 'next/dist/shared/lib/get-img-props';
import { errorImg } from '@/public/index';

interface CustomImageProps extends ImageProps {
  errorSrc?: string | StaticRequire | StaticImageData;
}

export default function CustomImage(props: CustomImageProps) {
  const { alt, src, errorSrc, ...imageProps } = props;
  const [imgSrc, setImgSrc] = useState(src);

  const handleImageError = () => {
    setImgSrc(errorSrc ?? errorImg);
  };
  return <Image alt={alt} src={imgSrc} {...imageProps} onError={handleImageError} />;
}
