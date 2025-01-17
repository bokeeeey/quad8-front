import { ROUTER } from '@/constants/route';
import { banner1Img, banner2Img } from '@/public/index';
import classNames from 'classnames/bind';
import Image from 'next/image';
import Link from 'next/link';
import styles from './Banner.module.scss';

const cn = classNames.bind(styles);

export default function Banner() {
  return (
    <>
      <h1 className={cn('title')}>키득 MORE</h1>
      <div className={cn('container')}>
        <Link href={ROUTER.CUSTOM_KEYBOARD} className={cn('banner')}>
          <Image
            src={banner1Img}
            fill
            alt='배너1'
            priority
            sizes='(max-width: 600px) 480px, (max-width: 1200px) 800px, 1200px'
          />
        </Link>
        <Link href={ROUTER.EVENT} className={cn('banner')}>
          <Image
            src={banner2Img}
            fill
            alt='배너2'
            priority
            sizes='(max-width: 600px) 480px, (max-width: 1200px) 800px, 1200px'
          />
        </Link>
      </div>
    </>
  );
}
