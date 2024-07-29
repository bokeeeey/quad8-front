'use client';

import classNames from 'classnames/bind';
import { useState, MouseEvent, useRef } from 'react';
import Image, { StaticImageData } from 'next/image';
import styles from './ImageZoom.module.scss';
import ZoomView from './ZoomView';

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

function Scanner({ position }: ScannerProps) {
  return <div style={{ top: position.top, left: position.left }} className={cn('scanner')} />;
}

export default function ImageZoom({ image, alt, width, height }: ImageZoomProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });

  const handleLoadingComplete = (result: { naturalHeight: number; naturalWidth: number }) => {
    setImageDimensions({
      width: result.naturalWidth,
      height: result.naturalHeight,
    });
  };

  const [scannerPosition, setScannerPosition] = useState<Position | null>(null);
  const [viewPosition, setViewPosition] = useState<Position | null>(null);

  const handleMouseMove = (e: MouseEvent) => {
    const scannerSize = 200;
    const updatedScannerPosition = { left: 0, top: 0 };

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

    const imageAspectRatio = imageDimensions.width / imageDimensions.height;

    setScannerPosition(updatedScannerPosition);
    setViewPosition({
      left: (updatedScannerPosition.left + scannerSize / 2) * -2,
      top: (updatedScannerPosition.top + scannerSize / 2) * -(2 / imageAspectRatio),
    });
  };

  const handleMouseLeave = () => {
    setScannerPosition(null);
    setViewPosition(null);
  };

  return (
    <div
      style={{ width, height }}
      className={cn('container')}
      onMouseMove={(e) => handleMouseMove(e)}
      onMouseLeave={handleMouseLeave}
      ref={containerRef}
    >
      <div className={cn('image-wrapper')}>
        <Image src={image} alt={alt} className={cn('image')} fill onLoadingComplete={handleLoadingComplete} />
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
