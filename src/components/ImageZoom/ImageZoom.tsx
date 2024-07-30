'use client';

import classNames from 'classnames/bind';
import { useState, MouseEvent, useRef, SyntheticEvent } from 'react';
import Image, { StaticImageData } from 'next/image';

import { IMAGE_BLUR } from '@/constants/blurImage';
import { keydeukProfileImg } from '@/public/index';
import ZoomView from './ZoomView';

import styles from './ImageZoom.module.scss';

const cn = classNames.bind(styles);

interface ImageZoomProps {
  image: string | StaticImageData;
  alt: string;
  width: number;
  height: number;
}

interface Position {
  left: number;
  top: number;
}

interface ScannerProps {
  position: Position;
}

const scannerSize = 250;

function Scanner({ position }: ScannerProps) {
  return (
    <div
      style={{ top: position.top, left: position.left, width: scannerSize, height: scannerSize }}
      className={cn('scanner')}
    />
  );
}

export default function ImageZoom({ image, alt, width, height }: ImageZoomProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [isImageError, setIsImageError] = useState(false);
  const [scannerPosition, setScannerPosition] = useState<Position | null>(null);
  const [viewPosition, setViewPosition] = useState<Position | null>(null);

  const handleImageLoadComplete = (e: SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    setImageDimensions({
      width: target.naturalWidth,
      height: target.naturalHeight,
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    const updatedScannerPosition = { left: 0, top: 0 };
    const imageAspectRatio = imageDimensions.width / imageDimensions.height;
    const containerRect = containerRef.current?.getBoundingClientRect();

    if (!containerRect) return;

    const scannerPosLeft = e.clientX - scannerSize / 2 - containerRect.x;
    const scannerPosTop = e.clientY - scannerSize / 2 - containerRect.y;

    const allowedPosLeft = scannerPosLeft >= 0 && scannerPosLeft <= width - scannerSize;
    const allowedPosTop = scannerPosTop >= 0 && scannerPosTop <= height - scannerSize;

    if (allowedPosLeft) {
      updatedScannerPosition.left = scannerPosLeft;
    } else if (scannerPosLeft < 0) {
      updatedScannerPosition.left = 0;
    } else {
      updatedScannerPosition.left = containerRect.width - scannerSize;
    }

    if (allowedPosTop) {
      updatedScannerPosition.top = scannerPosTop;
    } else if (scannerPosTop < 0) {
      updatedScannerPosition.top = 0;
    } else {
      updatedScannerPosition.top = containerRect.height - scannerSize;
    }

    setScannerPosition(updatedScannerPosition);

    if (imageDimensions.width > imageDimensions.height) {
      setViewPosition({
        left: updatedScannerPosition.left * -2.0,
        top: (updatedScannerPosition.top + scannerSize / 2) * -(2 / imageAspectRatio),
      });
    } else {
      setViewPosition({
        left: updatedScannerPosition.left * -(2 * imageAspectRatio),
        top: (updatedScannerPosition.top + scannerSize / 2) * -2,
      });
    }
  };

  const handleMouseLeave = () => {
    setScannerPosition(null);
    setViewPosition(null);
  };

  return (
    <div style={{ width, height }} className={cn('container')} ref={containerRef}>
      <div className={cn('image-wrapper')} onMouseMove={(e) => handleMouseMove(e)} onMouseLeave={handleMouseLeave}>
        <Image
          src={isImageError ? keydeukProfileImg : image}
          alt={alt}
          className={cn('image')}
          fill
          onLoad={handleImageLoadComplete}
          onError={() => setIsImageError(true)}
          priority
          placeholder={IMAGE_BLUR.placeholder}
          blurDataURL={IMAGE_BLUR.blurDataURL}
        />
      </div>
      {scannerPosition && <Scanner position={scannerPosition} />}
      {viewPosition && containerRef?.current && (
        <ZoomView
          image={image}
          position={viewPosition}
          left={width}
          viewWidth={width}
          viewHeight={height}
          imageDimensions={imageDimensions}
        />
      )}
    </div>
  );
}
