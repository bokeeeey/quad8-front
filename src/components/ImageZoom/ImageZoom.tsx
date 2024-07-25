'use client';

import classNames from 'classnames/bind';
import { useState, MouseEvent } from 'react';
import Image from 'next/image';
import styles from './ImageZoom.module.scss';

const cn = classNames.bind(styles);

interface ImageZoomProps {
  image: string;
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
  const [scannerPosition, setScannerPosition] = useState<Position | null>(null);

  const handleMouseMove = (e: MouseEvent) => {
    const scannerSize = 150;
    const updatedScannerPosition = { left: 0, top: 0 };

    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;

    if (x > 0 && x <= width && y > 0 && y <= height) {
      const left = x - scannerSize / 2;
      const top = y - scannerSize / 2;

      if (left < 0) {
        updatedScannerPosition.left = 0;
      } else if (left > width - scannerSize) {
        updatedScannerPosition.left = width - scannerSize;
      } else {
        updatedScannerPosition.left = left;
      }

      if (top < 0) {
        updatedScannerPosition.top = 0;
      } else if (top > height - scannerSize) {
        updatedScannerPosition.top = height - scannerSize;
      } else {
        updatedScannerPosition.top = top;
      }

      setScannerPosition(updatedScannerPosition);
    }
  };

  return (
    <div style={{ width, height }} className={cn('container')} onMouseMove={(e) => handleMouseMove(e)}>
      <Image src={image} alt={alt} className={cn('image')} fill />
      {scannerPosition && <Scanner position={scannerPosition} />}
    </div>
  );
}
