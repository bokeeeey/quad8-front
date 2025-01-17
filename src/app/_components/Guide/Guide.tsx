import classNames from 'classnames/bind';
import Image from 'next/image';
import styles from './Guide.module.scss';

const cn = classNames.bind(styles);

interface GuideProp {
  step: number;
  title: string;
  desc: string[];
  src: string;
}

export default function Guide({ step, title, desc, src }: GuideProp) {
  return (
    <li className={cn('card-wrap')} data-aos='fade-up'>
      <div className={cn('text-area')}>
        <em className={cn('badge')}>STEP {step}</em>
        <h3 className={cn('title')}>{title}</h3>
        {desc.map((line) => (
          <p key={line} className={cn('sub-title')}>
            {line}
          </p>
        ))}
      </div>
      <div className={cn('img-area')}>
        <Image
          src={src}
          alt={`STEP ${step}`}
          fill
          sizes='(max-width: 600px) 480px, (max-width: 1200px) 800px, 1200px'
        />
      </div>
    </li>
  );
}
